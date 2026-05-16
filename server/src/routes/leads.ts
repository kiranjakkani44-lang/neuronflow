import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all leads for current user (or admin sees all)
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    // Filter leads by user ownership (admin sees all, users see only their leads)
    const where = req.user!.role === 'ADMIN' 
      ? {} 
      : { user_id: req.user!.id };
    const leads = await prisma.leads.findMany({
      where,
      orderBy: { created_at: 'desc' }
    });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update lead status - must own the lead
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status, notes } = req.body;
    
    // Check lead ownership (admins can update any lead)
    const lead = await prisma.leads.findFirst({
      where: req.user!.role === 'ADMIN' 
        ? { id: String(req.params.id) }
        : { id: String(req.params.id), user_id: req.user!.id }
    });
    
    if (!lead) return res.status(404).json({ error: 'Lead not found or access denied' });
    
    const updated = await prisma.leads.update({
      where: { id: String(req.params.id) },
      data: { status, notes }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new lead for the current user
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, email, phone, company, industry, source, status, notes } = req.body;
    
    const lead = await prisma.leads.create({
      data: {
        name,
        email,
        phone,
        company,
        industry,
        source,
        status: status || 'NEW',
        notes,
        user_id: req.user!.id
      }
    });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a lead - must own it
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const lead = await prisma.leads.findFirst({
      where: req.user!.role === 'ADMIN'
        ? { id: String(req.params.id) }
        : { id: String(req.params.id), user_id: req.user!.id }
    });
    
    if (!lead) return res.status(404).json({ error: 'Lead not found or access denied' });
    
    await prisma.leads.delete({ where: { id: String(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;