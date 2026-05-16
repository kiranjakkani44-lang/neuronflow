import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const deps = await prisma.deployments.findMany({
      where: { user_id: req.user!.id },
      include: { agent: { select: { name: true, icon_name: true, category: true, slug: true } } },
      orderBy: { created_at: 'desc' }
    });
    res.json(deps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = String(req.params.id);
    const dep = await prisma.deployments.findFirst({
      where: { id, user_id: req.user!.id },
      include: { agent: true }
    });
    if (!dep) return res.status(404).json({ error: 'Not found' });
    res.json(dep);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/logs', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = String(req.params.id);
    const dep = await prisma.deployments.findFirst({ where: { id, user_id: req.user!.id } });
    if (!dep) return res.status(404).json({ error: 'Not found' });
    const logs = await prisma.agent_logs.findMany({
      where: { deployment_id: id },
      orderBy: { created_at: 'asc' },
      take: 100
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { agent_id, config } = req.body;
    const agent = await prisma.agents.findUnique({ where: { id: agent_id } });
    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    const existing = await prisma.deployments.findFirst({
      where: { user_id: req.user!.id, agent_id, status: { in: ['LIVE', 'PENDING'] } }
    });
    if (existing) return res.status(400).json({ error: 'Agent already deployed' });

    const dep = await prisma.deployments.create({
      data: {
        user_id: req.user!.id,
        agent_id,
        status: 'PENDING',
        config: JSON.stringify(config || {}),
        metrics: JSON.stringify({})
      },
      include: { agent: true }
    });

    await prisma.agent_logs.create({
      data: { deployment_id: dep.id, level: 'INFO', message: `Deployment created for ${agent.name}` }
    });

    res.status(201).json(dep);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = String(req.params.id);
    const { status, config } = req.body;
    const dep = await prisma.deployments.findFirst({ where: { id, user_id: req.user!.id } });
    if (!dep) return res.status(404).json({ error: 'Not found' });

    const updateData: any = {};
    if (status) {
      updateData.status = status;
      await prisma.agent_logs.create({
        data: {
          deployment_id: id,
          level: status === 'LIVE' ? 'INFO' : 'WARN',
          message: status === 'LIVE' ? 'Agent resumed' : 'Agent paused by user'
        }
      });
    }
    if (config) updateData.config = JSON.stringify(config);

    const updated = await prisma.deployments.update({
      where: { id },
      data: updateData,
      include: { agent: true }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = String(req.params.id);
    const dep = await prisma.deployments.findFirst({ where: { id, user_id: req.user!.id } });
    if (!dep) return res.status(404).json({ error: 'Not found' });

    await prisma.agent_logs.deleteMany({ where: { deployment_id: id } });
    await prisma.deployments.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;