import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// SSE clients map: userId -> Response[]
const sseClients = new Map<string, Response[]>();

// Send event to all clients for a user
export function broadcastToUser(userId: string, event: string, data: any) {
  const clients = sseClients.get(userId) || [];
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  
  clients.forEach(res => {
    try {
      res.write(payload);
    } catch {
      // Client disconnected, will be cleaned up on next heartbeat
    }
  });
}

// SSE endpoint - clients connect here to receive real-time updates
router.get('/stream', authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Add client to map
  const clients = sseClients.get(userId) || [];
  clients.push(res);
  sseClients.set(userId, clients);

  // Send initial connection event
  res.write(`event: connected\ndata: ${JSON.stringify({ instance: userId.slice(0, 8) })}\n\n`);

  // Send current stats
  try {
    const [agentCount, leadCount] = await Promise.all([
      prisma.deployments.count({ where: { user_id: userId, status: 'ACTIVE' } }),
      prisma.leads.count({ where: { user_id: userId } }),
    ]);
    res.write(`event: stats\ndata: ${JSON.stringify({ agents: agentCount, leads: leadCount })}\n\n`);
  } catch {
    // ignore
  }

  // Heartbeat every 30 seconds to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30000);

  // Clean up on disconnect
  req.on('close', () => {
    clearInterval(heartbeat);
    const remaining = (sseClients.get(userId) || []).filter(r => r !== res);
    if (remaining.length === 0) {
      sseClients.delete(userId);
    } else {
      sseClients.set(userId, remaining);
    }
    console.log(`[SSE] Client disconnected for user ${userId.slice(0, 8)}`);
  });

  console.log(`[SSE] Client connected for user ${userId.slice(0, 8)} (total: ${clients.length})`);
});

// Get dashboard stats (for initial load)
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
