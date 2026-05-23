import { PrismaClient } from '@prisma/client';
import { agentEngine, AgentType } from '../agents/engine';

const prisma = new PrismaClient();

export async function runScheduledJobs() {
  try {
    const now = Date.now();
    const deployments = await prisma.deployments.findMany({
      where: { status: 'ACTIVE' },
      include: { agent: true }
    });

    console.log(`[Scheduler] Checking ${deployments.length} active deployments`);

    for (const dep of deployments) {
      const metrics = JSON.parse(dep.metrics || '{}');
      const lastRun = metrics.last_run ? new Date(metrics.last_run).getTime() : 0;
      const config = dep.config ? JSON.parse(dep.config) : {};
      const interval = config.schedule_interval_ms || 300000;

      if (now - lastRun >= interval) {
        console.log(`[Scheduler] Triggering agent ${dep.agent.slug} for deployment ${dep.id}`);
        try {
          const agentType = dep.agent.slug.replace(/-/g, '_') as AgentType;
          await agentEngine.execute(dep.id, agentType, {
            scheduled: true,
            timestamp: new Date().toISOString()
          });
          console.log(`[Scheduler] Completed ${dep.id}`);
        } catch (err) {
          console.error(`[Scheduler] Failed ${dep.id}:`, err);
        }
      }
    }
  } catch (err) {
    console.error('[Scheduler] Error running scheduled jobs:', err);
  }
}

export async function triggerAllAgents() {
  const deployments = await prisma.deployments.findMany({
    where: { status: 'ACTIVE' },
    include: { agent: true }
  });

  const results = [];
  for (const dep of deployments) {
    try {
      const agentType = dep.agent.slug.replace(/-/g, '_') as AgentType;
      const task = await agentEngine.execute(dep.id, agentType, {
        manual_trigger: true,
        timestamp: new Date().toISOString()
      });
      results.push({ deploymentId: dep.id, status: 'success', taskId: task.id });
    } catch (err: any) {
      results.push({ deploymentId: dep.id, status: 'failed', error: err.message });
    }
  }

  return results;
}
