import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all agents (public)
router.get('/', async (req, res) => {
  try {
    const agents = await prisma.agents.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { sort_order: 'asc' }
    });
    const parsed = agents.map(a => ({
      ...a,
      industries: JSON.parse(a.industries as string || '[]'),
      features: JSON.parse(a.features as string || '[]')
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single agent by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const agent = await prisma.agents.findUnique({ where: { slug: req.params.slug } });
    if (!agent) return res.status(404).json({ error: 'Not found' });
    res.json({
      ...agent,
      industries: JSON.parse(agent.industries as string || '[]'),
      features: JSON.parse(agent.features as string || '[]')
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Create agent (protected)
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
    const data = req.body;
    const agent = await prisma.agents.create({
      data: {
        ...data,
        industries: JSON.stringify(data.industries || []),
        features: JSON.stringify(data.features || [])
      }
    });
    res.status(201).json(agent);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Update agent (protected)
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
    const data = req.body;
    const agent = await prisma.agents.update({
      where: { id: String(req.params.id) },
      data: {
        ...data,
        industries: data.industries ? JSON.stringify(data.industries) : undefined,
        features: data.features ? JSON.stringify(data.features) : undefined
      }
    });
    res.json(agent);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;