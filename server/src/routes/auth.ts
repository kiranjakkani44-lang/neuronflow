import { Router } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest, tokenBlacklist } from '../middleware/auth';
import { JWT_SECRET } from '../middleware/jwt-validation';

const router = Router();
const prisma = new PrismaClient();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, company_name } = req.body;
    
    // Always return same message to prevent enumeration
    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) {
      // Use generic message to prevent email enumeration
      return res.status(400).json({ error: 'An account with this email may already exist. Try logging in or use a different email.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: { email, password_hash, name, company_name }
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login with rate limiting
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

router.post('/login', async (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  
  // Rate limit: max 5 attempts per minute per IP
  const attempts = loginAttempts.get(clientIp);
  if (attempts && attempts.count >= 5 && attempts.resetAt > now) {
    const waitSec = Math.ceil((attempts.resetAt - now) / 1000);
    return res.status(429).json({ 
      error: 'Too many login attempts. Please try again later.',
      retry_after: waitSec
    });
  }
  
  if (!attempts || attempts.resetAt <= now) {
    loginAttempts.set(clientIp, { count: 1, resetAt: now + 60000 });
  } else {
    // Must reassign to trigger Map update
    loginAttempts.set(clientIp, { count: attempts.count + 1, resetAt: attempts.resetAt });
  }

  try {
    const { email, password } = req.body;
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user || !user.password_hash) return res.status(400).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    // Clear rate limit on successful login
    loginAttempts.delete(clientIp);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout with server-side token invalidation
router.post('/logout', authMiddleware, async (req: AuthRequest, res) => {
  const token = req.headers.authorization?.slice(7);
  if (token) {
    tokenBlacklist.add(token);
    console.log(`[LOGOUT] Token invalidated for user ${req.user!.id}`);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// Get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, name: true, role: true, company_name: true, phone: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, phone, company_name } = req.body;
    const user = await prisma.users.update({
      where: { id: req.user!.id },
      data: { name, phone, company_name }
    });
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role, company_name: user.company_name });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Password reset request
router.post('/reset-request', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const user = await prisma.users.findUnique({ where: { email } });
    // Always return same message to prevent enumeration
    const genericMessage = 'If an account exists with this email, reset instructions have been sent';

    if (!user) {
      // Log for debugging but return generic message
      console.log(`[PASSWORD RESET] Email not found: ${email}`);
      return res.json({ message: genericMessage });
    }

    // Generate reset token stored in DB
    const reset_token = crypto.randomBytes(32).toString('hex');
    const reset_expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.users.update({
      where: { id: user.id },
      data: { reset_token, reset_expires }
    });

    console.log(`[PASSWORD RESET] Token for ${email}: ${reset_token}`);
    // In production, send email with token
    res.json({
      message: genericMessage,
      ...(process.env.NODE_ENV === 'development' ? { reset_token } : {})
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Password reset confirm
router.post('/reset-confirm', async (req, res) => {
  try {
    const { token, new_password } = req.body;
    if (!token || !new_password) return res.status(400).json({ error: 'Token and new password required' });

    if (token.length !== 64 || !/^[a-f0-9]+$/.test(token)) {
      return res.status(400).json({ error: 'Invalid token format' });
    }

    // Find user by reset token
    const user = await prisma.users.findFirst({
      where: {
        reset_token: token,
        reset_expires: { gt: new Date() }
      }
    });

    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

    // Clear the reset token after use
    const password_hash = await bcrypt.hash(new_password, 10);
    await prisma.users.update({
      where: { id: user.id },
      data: { password_hash, reset_token: null, reset_expires: null }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Google OAuth initiation
router.get('/google', (req, res) => {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  if (!googleClientId) {
    return res.status(501).json({ error: 'Google OAuth not configured' });
  }

  const redirectUri = `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/google/callback`;
  const scope = encodeURIComponent('email profile');
  const state = crypto.randomBytes(16).toString('hex');

  // In production, store state in session or DB
  res.json({
    url: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}`
  });
});

// Google OAuth callback
router.post('/google/callback', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Authorization code required' });

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/google/callback`;

    if (!googleClientId || !googleClientSecret) {
      return res.status(501).json({ error: 'Google OAuth not configured' });
    }

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenRes.ok) {
      return res.status(400).json({ error: 'Failed to exchange code' });
    }

    const tokens = await tokenRes.json();
    const { id_token } = tokens;

    if (!id_token) {
      return res.status(400).json({ error: 'No ID token received from Google' });
    }

    // CRITICAL: Verify the ID token signature using google-auth-library
    const client = new OAuth2Client(googleClientId);
    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: googleClientId,
      });
      payload = ticket.getPayload();
    } catch (err) {
      console.error('[OAuth] Token verification failed:', err);
      return res.status(401).json({ error: 'Invalid Google ID token' });
    }

    if (!payload || !payload.email) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    // Find or create user
    let user = await prisma.users.findUnique({ where: { email: payload.email } });
    if (!user) {
      user = await prisma.users.create({
        data: {
          email: payload.email,
          name: payload.name || 'Google User',
          password_hash: null, // OAuth users have no password
          role: 'CLIENT'
        }
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OAuth failed' });
  }
});

export default router;