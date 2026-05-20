import { Router } from 'express';
import * as crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const PLAN_PRICES: Record<string, number> = {
  'starter': 4999,
  'growth': 14999,
  'enterprise': 49999
};

// Create payment order — now creates via Razorpay API and stores server-side
router.post('/order', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { plan } = req.body;
    const validPlan = PLAN_PRICES[plan] ? plan : 'growth';
    const amount = PLAN_PRICES[validPlan];

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpayKeySecret || razorpayKeySecret === 'placeholder') {
      // Development mode: create a local order for testing
      const orderId = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
      const localReceipt = `rcpt_${Date.now()}`;

      // Store local order in DB so verify can validate
      await prisma.paymentOrders.create({
        data: {
          razorpay_order_id: orderId,
          user_id: req.user!.id,
          plan: validPlan,
          amount: amount * 100,
          currency: 'INR',
          status: 'CREATED',
          local_receipt: localReceipt
        }
      });

      return res.json({
        order_id: orderId,
        amount: amount * 100,
        currency: 'INR',
        plan: validPlan,
        key: razorpayKeyId || 'rzp_test_placeholder',
        development: true
      });
    }

    // Production: create actual Razorpay order
    const receipt = `rcpt_${Date.now()}_${req.user!.id}`;
    const orderPayload = {
      amount: amount * 100, // paise
      currency: 'INR',
      receipt,
      notes: { plan: validPlan, user_id: req.user!.id }
    };

    const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
    const razorpayRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify(orderPayload)
    });

    if (!razorpayRes.ok) {
      const err = await razorpayRes.text();
      console.error('[Payment] Razorpay order creation failed:', err);
      return res.status(502).json({ error: 'Failed to create payment order' });
    }

    const razorpayOrder = await razorpayRes.json();

    // Store order in DB with plan + amount (source of truth)
    await prisma.paymentOrders.create({
      data: {
        razorpay_order_id: razorpayOrder.id,
        user_id: req.user!.id,
        plan: validPlan,
        amount: amount * 100,
        currency: 'INR',
        status: 'CREATED',
        local_receipt: receipt
      }
    });

    res.json({
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      plan: validPlan,
      key: razorpayKeyId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment error' });
  }
});

// Verify payment — now validates plan against server-stored order
router.post('/verify', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpaySecret || razorpaySecret === 'placeholder') {
      // Development mode: skip signature, validate against DB order only
      const order = await prisma.paymentOrders.findFirst({
        where: {
          razorpay_order_id,
          user_id: req.user!.id,
          status: 'CREATED'
        }
      });

      if (!order) {
        return res.status(400).json({ error: 'Order not found or already processed' });
      }

      // Validate plan against server-stored plan (prevents plan upgrade attack)
      if (order.plan !== plan) {
        console.log(`[PAYMENT] Plan mismatch: requested=${plan}, ordered=${order.plan} for order ${razorpay_order_id}`);
        return res.status(400).json({ error: 'Invalid plan — does not match original order' });
      }

      // Mark order as paid
      await prisma.paymentOrders.update({
        where: { id: order.id },
        data: { status: 'PAID', razorpay_payment_id }
      });

      // Grant subscription using the server-authoritative plan
      await prisma.subscriptions.create({
        data: {
          user_id: req.user!.id,
          plan: order.plan, // Use server-stored plan, NOT client-supplied plan
          status: 'ACTIVE',
          razorpay_subscription_id: razorpay_payment_id,
          current_period_start: new Date(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });

      return res.json({ success: true, plan: order.plan });
    }

    // Production: full signature verification + DB validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification parameters' });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.log(`[PAYMENT] Signature mismatch for order ${razorpay_order_id}`);
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Validate plan against server-stored order (prevents plan upgrade attack)
    const order = await prisma.paymentOrders.findFirst({
      where: {
        razorpay_order_id,
        user_id: req.user!.id,
        status: 'CREATED'
      }
    });

    if (!order) {
      return res.status(400).json({ error: 'Order not found or already processed' });
    }

    if (order.plan !== plan) {
      console.log(`[PAYMENT] Plan mismatch: requested=${plan}, ordered=${order.plan} for order ${razorpay_order_id}`);
      return res.status(400).json({ error: 'Invalid plan — does not match original order' });
    }

    // Mark order as paid
    await prisma.paymentOrders.update({
      where: { id: order.id },
      data: { status: 'PAID', razorpay_payment_id }
    });

    // Grant subscription using server-authoritative plan
    await prisma.subscriptions.create({
      data: {
        user_id: req.user!.id,
        plan: order.plan,
        status: 'ACTIVE',
        razorpay_subscription_id: razorpay_payment_id,
        current_period_start: new Date(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });

    res.json({ success: true, plan: order.plan });
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

// Get payment history
router.get('/history', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.paymentOrders.findMany({
      where: { user_id: req.user!.id },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        plan: true,
        amount: true,
        currency: true,
        status: true,
        created_at: true,
        razorpay_payment_id: true,
      }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;