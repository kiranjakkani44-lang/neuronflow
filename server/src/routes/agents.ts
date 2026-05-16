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
    // FIX: Explicit allowlist — never spread req.body into Prisma
    const { name, slug, short_description, description, category, icon_name, price_one_time, price_monthly, industries, features, roi_promise, setup_time_days, is_featured, sort_order } = req.body;

    if (!name || !slug || !short_description || !description || !category || !icon_name || price_one_time === undefined) {
      return res.status(400).json({ error: 'Missing required fields: name, slug, short_description, description, category, icon_name, price_one_time' });
    }

    const agent = await prisma.agents.create({
      data: {
        name, slug, short_description, description, category, icon_name,
        price_one_time,
        price_monthly: price_monthly ?? null,
        industries: JSON.stringify(industries || []),
        features: JSON.stringify(features || []),
        roi_promise: roi_promise || '',
        setup_time_days: setup_time_days ?? 7,
        status: 'ACTIVE',
        is_featured: is_featured ?? false,
        sort_order: sort_order ?? 0
      }
    });
    res.status(201).json(agent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Update agent (protected)
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
    // FIX: Explicit allowlist for updates
    const allowedFields = ['name', 'slug', 'short_description', 'description', 'category', 'icon_name', 'price_one_time', 'price_monthly', 'industries', 'features', 'roi_promise', 'setup_time_days', 'status', 'is_featured', 'sort_order'];
    const updates: Record<string, any> = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === 'industries' || field === 'features') {
          updates[field] = JSON.stringify(req.body[field]);
        } else {
          updates[field] = req.body[field];
        }
      }
    }

    const agent = await prisma.agents.update({
      where: { id: String(req.params.id) },
      data: updates
    });
    res.json(agent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;