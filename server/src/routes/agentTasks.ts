import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { agentEngine, AgentType } from '../agents/engine';
import { prisma } from '../agents/llm';

const router = Router();

router.post('/execute/:deploymentId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const deploymentId = String(req.params.deploymentId);
    const { agent_type, input } = req.body;

    const deployment = await prisma.deployments.findFirst({
      where: { id: deploymentId, user_id: req.user!.id },
      include: { agent: true }
    });

    if (!deployment) return res.status(404).json({ error: 'Deployment not found' });

    const slug = deployment.agent.slug;
    let mappedType: AgentType = (agent_type as AgentType) || 'support_bot';

    if (slug.includes('lead') || slug.includes('qualif')) mappedType = 'lead_qualification';
    else if (slug.includes('whatsapp') || slug.includes('cart')) mappedType = 'whatsapp_bot';
    else if (slug.includes('voice')) mappedType = 'voice_agent';
    else if (slug.includes('support') || slug.includes('chat')) mappedType = 'support_bot';
    else if (slug.includes('content') || slug.includes('seo') || slug.includes('social')) mappedType = 'content_generator';
    else if (slug.includes('appointment') || slug.includes('booking')) mappedType = 'appointment_booking';

    const task = await agentEngine.execute(deploymentId, mappedType, input || {});

    res.json({ task_id: task.id, status: task.status, message: `Agent execution started: ${mappedType}` });
  } catch (err) {
    console.error('Agent execution error:', err);
    res.status(500).json({ error: 'Agent execution failed' });
  }
});

router.post('/run', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { deployment_id, agent_type, input } = req.body;
    if (!agent_type) return res.status(400).json({ error: 'agent_type is required' });
    if (!deployment_id) return res.status(400).json({ error: 'deployment_id is required' });

    // Verify deployment ownership before executing
    const deployment = await prisma.deployments.findFirst({
      where: { id: deployment_id, user_id: req.user!.id }
    });

    if (!deployment) {
      return res.status(403).json({ error: 'Deployment not found or access denied' });
    }

    const task = await agentEngine.execute(deployment_id, agent_type as AgentType, input || {});

    res.json({ task_id: task.id, deployment_id, agent_type, status: 'queued' });
  } catch (err) {
    console.error('Agent run error:', err);
    res.status(500).json({ error: 'Agent run failed' });
  }
});

router.get('/status/:deploymentId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const deploymentId = String(req.params.deploymentId);

    const deployment = await prisma.deployments.findFirst({
      where: { id: deploymentId, user_id: req.user!.id },
      include: { 
        agent: true,
        agent_logs: { 
          take: 20, 
          orderBy: { created_at: 'desc' } 
        } 
      }
    });

    if (!deployment) return res.status(404).json({ error: 'Deployment not found' });

    const metrics = JSON.parse(deployment.metrics || '{}');

    res.json({
      deployment_id: deploymentId,
      agent_name: deployment.agent.name,
      status: deployment.status,
      metrics: {
        runs: metrics.runs || 0,
        last_run: metrics.last_run,
        score: metrics.score,
        tier: metrics.tier,
        messages_sent: metrics.messages_sent,
        call_duration: metrics.call_duration
      },
      recent_logs: deployment.agent_logs.map((log: any) => ({
        level: log.level,
        message: log.message,
        time: log.created_at
      }))
    });
  } catch (err) {
    console.error('Status error:', err);
    res.status(500).json({ error: 'Failed to get agent status' });
  }
});

router.post('/trigger-all', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const deployments = await prisma.deployments.findMany({
      where: { user_id: req.user!.id, status: 'LIVE' },
      include: { agent: true }
    });

    const results = [];
    for (const dep of deployments) {
      const slug = dep.agent.slug;
      let agentType: AgentType = 'support_bot';

      if (slug.includes('lead')) agentType = 'lead_qualification';
      else if (slug.includes('whatsapp') || slug.includes('cart')) agentType = 'whatsapp_bot';
      else if (slug.includes('voice')) agentType = 'voice_agent';
      else if (slug.includes('support')) agentType = 'support_bot';
      else if (slug.includes('content') || slug.includes('seo')) agentType = 'content_generator';
      else if (slug.includes('appointment')) agentType = 'appointment_booking';

      const task = await agentEngine.execute(dep.id, agentType, {
        source: 'scheduled', timestamp: new Date().toISOString(), deployment_name: dep.agent.name
      });

      results.push({ deployment_id: dep.id, agent: dep.agent.name, task_id: task.id });
    }

    res.json({ triggered: results.length, results });
  } catch (err) {
    console.error('Trigger error:', err);
    res.status(500).json({ error: 'Failed to trigger agents' });
  }
});

router.post('/qualify-lead', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { lead_id } = req.body;
    if (!lead_id) return res.status(400).json({ error: 'lead_id is required' });

    const leadId = String(lead_id);
    
    // Check lead ownership - only allow qualifying own leads
    const lead = await prisma.leads.findFirst({
      where: req.user!.role === 'ADMIN'
        ? { id: leadId }
        : { id: leadId, user_id: req.user!.id }
    });
    
    if (!lead) return res.status(404).json({ error: 'Lead not found or access denied' });

    // Find lead qualification deployment owned by user
    const deployments = await prisma.deployments.findMany({
      where: { user_id: req.user!.id, status: 'LIVE' },
      include: { agent: true }
    });
    const leadDep = deployments.find(d => d.agent.slug.includes('lead') || d.agent.slug.includes('qualif'));

    const task = await agentEngine.execute(leadDep?.id || 'no-log', 'lead_qualification', {
      lead_data: {
        name: lead.name, email: lead.email, phone: lead.phone,
        company: lead.company || '', industry: lead.industry || '',
        source: lead.source || '', message: lead.notes || '',
        id: lead.id.toString()
      },
      questions: []
    });

    res.json({ task_id: task.id, status: task.status, message: 'Lead qualification started' });
  } catch (err) {
    console.error('Lead qualification error:', err);
    res.status(500).json({ error: 'Lead qualification failed' });
  }
});

export default router;