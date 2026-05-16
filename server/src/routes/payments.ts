import { Router } from 'express';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Create payment order
router.post('/order', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { plan } = req.body;
    const planPrices: Record<string, number> = {
      'starter': 4999,
      'growth': 14999,
      'enterprise': 49999
    };
    const amount = planPrices[plan || 'growth'] || 14999;
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    res.json({ order_id: orderId, amount: amount * 100, currency: 'INR', plan: plan || 'growth' });
  } catch (err) {
    res.status(500).json({ error: 'Payment error' });
  }
});

// Verify payment
router.post('/verify', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    // MUST have real Razorpay secret configured for production
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!razorpaySecret || razorpaySecret === 'placeholder') {
      return res.status(503).json({ 
        error: 'Payment verification not configured. Contact support to activate payments.' 
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification parameters' });
    }

    // Verify signature using actual Razorpay secret
    const generatedSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.log(`[PAYMENT] Signature mismatch for order ${razorpay_order_id}`);
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    await prisma.subscriptions.create({
      data: {
        user_id: req.user!.id,
        plan: plan || 'growth',
        status: 'ACTIVE',
        razorpay_subscription_id: razorpay_payment_id,
        current_period_start: new Date(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });

    res.json({ success: true, plan: plan || 'growth' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Get subscription
router.get('/subscription', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const sub = await prisma.subscriptions.findFirst({
      where: { user_id: req.user!.id, status: 'ACTIVE' },
      orderBy: { created_at: 'desc' }
    });
    res.json(sub || null);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;