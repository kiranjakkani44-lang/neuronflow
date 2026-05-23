import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// No-op for serverless compatibility (requires external PubSub like Upstash/Pusher for real real-time)
export function broadcastToUser(userId: string, event: string, data: any) {
  console.log(`[SSE Mock] Would broadcast to ${userId}: ${event}`, data);
}

// Get dashboard stats (used for polling by the client)
router.get('/stats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const [agentCount, leadCount, todayLeads, activeDeployments] = await Promise.all([
      prisma.deployments.count({ where: { user_id: userId } }),
      prisma.leads.count({ where: { user_id: userId } }),
      prisma.leads.count({
        where: {
          user_id: userId,
          created_at: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }
      }),
      prisma.deployments.count({ where: { user_id: userId, status: 'ACTIVE' } }),
    ]);

    res.json({
      agents: agentCount,
      leads: leadCount,
      todayLeads,
      activeAgents: activeDeployments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
