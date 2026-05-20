import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { broadcastToUser } from './sse';
import { llm } from '../agents/llm';

const router = Router();
const prisma = new PrismaClient();

// Create ticket
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }

    const ticket = await prisma.support_tickets.create({
      data: {
        user_id: req.user!.id,
        subject,
        message,
        status: 'OPEN'
      }
    });

    // Auto-generate initial response using LLM
    try {
      const response = await llm.generate(
        `Customer ticket: "${subject}"\nDetails: "${message}"\n\nProvide a helpful, professional initial response.`,
        'You are a support agent for NeuronFlow, an AI automation platform. Be helpful and professional.'
      );
      
      await prisma.support_tickets.update({
        where: { id: ticket.id },
        data: { response, status: 'IN_PROGRESS' }
      });

      broadcastToUser(req.user!.id, 'ticket_update', {
        ticketId: ticket.id,
        status: 'IN_PROGRESS',
        response: response.substring(0, 200)
      });
    } catch {
      // LLM failed, ticket stays OPEN
    }

    res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's tickets
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const tickets = await prisma.support_tickets.findMany({
      where: { user_id: req.user!.id },
      orderBy: { created_at: 'desc' }
    });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single ticket
router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const ticketId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const ticket = await prisma.support_tickets.findFirst({
      where: { id: ticketId, user_id: req.user!.id }
    });
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Reply to ticket (user adds follow-up)
router.post('/:id/reply', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const ticketId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const ticket = await prisma.support_tickets.findFirst({
      where: { id: ticketId, user_id: req.user!.id }
    });
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    const updatedMessage = `${ticket.message}\n\n--- Customer Follow-up ---\n${message}`;
    
    // Generate response
    const response = await llm.generate(
      `Previous conversation:\n${ticket.message}\n\nCustomer follow-up: "${message}"\n\nProvide a helpful response.`,
      'You are a support agent for NeuronFlow. Be helpful and professional.'
    );

    const updated = await prisma.support_tickets.update({
      where: { id: ticket.id },
      data: {
        message: updatedMessage,
        response: `${ticket.response || ''}\n\n--- Latest Response ---\n${response}`,
        status: 'IN_PROGRESS',
        updated_at: new Date()
      }
    });

    broadcastToUser(req.user!.id, 'ticket_update', {
      ticketId: ticket.id,
      response: response.substring(0, 200)
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Get all tickets
router.get('/admin/all', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
    const tickets = await prisma.support_tickets.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Update ticket status
router.put('/admin/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
    const { status, response } = req.body;
    const ticketId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const ticket = await prisma.support_tickets.update({
      where: { id: ticketId },
      data: { status, response: response || undefined }
    });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
