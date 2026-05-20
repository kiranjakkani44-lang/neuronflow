import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get analytics data for dashboard charts
router.get('/overview', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Leads over time (last 30 days, grouped by day)
    const leadsOverTime = await prisma.leads.groupBy({
      by: ['created_at'],
      where: {
        user_id: userId,
        created_at: { gte: thirtyDaysAgo }
      },
      _count: true
    });

    // Deployments by status
    const deploymentsByStatus = await prisma.deployments.groupBy({
      by: ['status'],
      where: { user_id: userId },
      _count: true
    });

    // Agent execution metrics
    const agentLogs = await prisma.agent_logs.groupBy({
      by: ['level'],
      where: {
        deployment: { user_id: userId },
        created_at: { gte: sevenDaysAgo }
      },
      _count: true
    });

    // Revenue over time
    const payments = await prisma.paymentOrders.findMany({
      where: {
        user_id: userId,
        status: 'PAID',
        created_at: { gte: thirtyDaysAgo }
      },
      orderBy: { created_at: 'asc' },
      select: { created_at: true, amount: true, plan: true }
    });

    // Lead conversion funnel
    const [newLeads, contactedLeads, qualifiedLeads] = await Promise.all([
      prisma.leads.count({ where: { user_id: userId, status: 'NEW' } }),
      prisma.leads.count({ where: { user_id: userId, status: 'CONTACTED' } }),
      prisma.leads.count({ where: { user_id: userId, status: 'QUALIFIED' } }),
    ]);

    res.json({
      leadsOverTime: leadsOverTime.map(l => ({
        date: l.created_at.toISOString().split('T')[0],
        count: l._count
      })),
      deploymentsByStatus: deploymentsByStatus.map(d => ({
        status: d.status,
        count: d._count
      })),
      agentLogs: agentLogs.map(l => ({
        level: l.level,
        count: l._count
      })),
      revenue: payments.map(p => ({
        date: p.created_at.toISOString().split('T')[0],
        amount: p.amount,
        plan: p.plan
      })),
      funnel: {
        new: newLeads,
        contacted: contactedLeads,
        qualified: qualifiedLeads
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get platform-wide analytics (admin only)
router.get('/platform', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [userGrowth, revenueByPlan, topAgents] = await Promise.all([
      prisma.users.groupBy({
        by: ['created_at'],
        where: { created_at: { gte: thirtyDaysAgo } },
        _count: true
      }),
      prisma.subscriptions.groupBy({
        by: ['plan'],
        _count: true
      }),
      prisma.deployments.groupBy({
        by: ['agent_id'],
        _count: true,
        orderBy: { _count: { agent_id: 'desc' } },
        take: 10
      })
    ]);

    res.json({
      userGrowth: userGrowth.map(u => ({
        date: u.created_at.toISOString().split('T')[0],
        count: u._count
      })),
      revenueByPlan: revenueByPlan.map(r => ({
        plan: r.plan,
        count: r._count
      })),
      topAgents: topAgents.map(a => ({
        agentId: a.agent_id,
        deployments: a._count
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
