import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { JWT_SECRET } from './jwt-validation';

const prisma = new PrismaClient();

// Server-side token blacklist for logout invalidation (in-memory fallback)
export const tokenBlacklist = new Set<string>();

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// Re-read user role from DB on each request to prevent stale permissions
export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = header.slice(7);

  // Check if token is blacklisted (logged out)
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ error: 'Token has been invalidated' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };

    // FIX: Re-read role from DB to prevent stale admin access
    const dbUser = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true }
    });

    if (!dbUser) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = { id: dbUser.id, role: dbUser.role };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      const token = header.slice(7);
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
      req.user = decoded;
    } catch {
      // ignore invalid token for optional auth
    }
  }
  next();
}