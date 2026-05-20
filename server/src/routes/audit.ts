import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, optionalAuth, AuthRequest } from '../middleware/auth';
import { agentEngine } from '../agents/engine';
import { llm } from '../agents/llm';

const router = Router();
const prisma = new PrismaClient();

// Submit audit request (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, industry, message } = req.body;
    if (!name || !email || !phone || !company) {
      return res.status(400).json({ error: 'Name, email, phone, and company are required' });
    }

    const audit = await prisma.audit_requests.create({
      data: { name, email, phone, company, industry, message }
    });

    // Also create a lead entry
    const lead = await prisma.leads.create({
      data: {
        name,
        email,
        phone,
        company,
        industry,
        source: 'AUDIT_REQUEST',
        status: 'NEW'
      }
    });

    // AUTO-TRIGGER: Qualify the new lead immediately
    try {
      await agentEngine.execute('no-log', 'lead_qualification', {
        lead_data: {
          name: lead.name, email: lead.email, phone: lead.phone || '',
          company: lead.company || '', industry: lead.industry || '',
          source: 'AUDIT_REQUEST', message: message || '',
          id: String(lead.id)
        },
        questions: []
      });
      console.log(`[AUTO] Audit lead qualified: ${lead.id} (${name})`);
    } catch (autoErr) {
      console.warn(`[AUTO] Audit lead qualification skipped:`, autoErr);
    }

    res.status(201).json(audit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all audit requests (admin only)
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
    const audits = await prisma.audit_requests.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(audits);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update audit status (admin only)
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
    const { status } = req.body;
    const audit = await prisma.audit_requests.update({
      where: { id: String(req.params.id) },
      data: { status }
    });
    res.json(audit);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;