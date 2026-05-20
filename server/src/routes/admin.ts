import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// All routes require admin
router.use(authMiddleware);
router.use((req: AuthRequest, res, next) => {
  if (req.user!.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
  next();
});

// Get all users
router.get('/users', async (_req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        company_name: true,
        industry: true,
        created_at: true,
        _count: {
          select: {
            deployments: true,
            subscriptions: true,
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user role
router.put('/users/:id/role', async (req: AuthRequest, res) => {
  try {
    const { role } = req.body;
    if (!['CLIENT', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const user = await prisma.users.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, name: true, role: true }
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await prisma.agent_logs.deleteMany({
      where: { deployment: { user_id: userId } }
    });
    await prisma.deployments.deleteMany({ where: { user_id: userId } });
    await prisma.subscriptions.deleteMany({ where: { user_id: userId } });
    await prisma.paymentOrders.deleteMany({ where: { user_id: userId } });
    await prisma.users.delete({ where: { id: userId } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get platform stats
router.get('/stats', async (_req, res) => {
  try {
    const [userCount, agentCount, deploymentCount, leadCount, auditCount, revenue] = await Promise.all([
      prisma.users.count(),
      prisma.agents.count(),
      prisma.deployments.count(),
      prisma.leads.count(),
      prisma.audit_requests.count(),
      prisma.paymentOrders.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true }
      })
    ]);
    res.json({
      users: userCount,
      agents: agentCount,
      deployments: deploymentCount,
      leads: leadCount,
      audits: auditCount,
      revenue: revenue._sum.amount || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all leads with user info (admin only)
router.get('/leads', async (req, res) => {
  try {
    const { userId, status, page = '1', limit = '20' } = req.query;
    const where: any = {};
    
    if (userId) where.user_id = userId;
    if (status) where.status = status;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      prisma.leads.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.leads.count({ where })
    ]);

    res.json({ leads, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reassign lead ownership (admin only)
router.put('/leads/:id/owner', async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: 'user_id required' });

    const user = await prisma.users.findUnique({ where: { id: user_id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const lead = await prisma.leads.update({
      where: { id: req.params.id },
      data: { user_id }
    });
    res.json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
