import { PrismaClient } from '@prisma/client';
import { agentEngine, AgentType } from '../agents/engine';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

const instanceId = crypto.randomUUID();
const LOCK_FILE = path.join(process.cwd(), '.scheduler.lock');
const LOCK_TTL_MS = 10000; // 10 seconds - if leader dies, lock expires

let isLeader = false;
let schedulerInterval: NodeJS.Timeout | null = null;
let heartbeatInterval: NodeJS.Timeout | null = null;

function acquireFileLock(): boolean {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      const lockData = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf-8'));
      const age = Date.now() - lockData.timestamp;
      if (age < LOCK_TTL_MS) {
        return false; // Another instance is leader
      }
      // Stale lock, take over
    }
    fs.writeFileSync(LOCK_FILE, JSON.stringify({ instanceId, timestamp: Date.now() }));
    return true;
  } catch {
    return false;
  }
}

function releaseFileLock(): void {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      const lockData = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf-8'));
      if (lockData.instanceId === instanceId) {
        fs.unlinkSync(LOCK_FILE);
      }
    }
  } catch {
    // ignore
  }
}

function heartbeat(): void {
  if (isLeader) {
    try {
      fs.writeFileSync(LOCK_FILE, JSON.stringify({ instanceId, timestamp: Date.now() }));
    } catch {
      isLeader = false;
    }
  }
}

export function initScheduler() {
  const checkIntervalMs = parseInt(process.env.SCHEDULER_INTERVAL_MS || '300000');
  console.log(`[Scheduler] Initializing (instance: ${instanceId.slice(0, 8)})`);

  // Try to become leader immediately
  tryToBecomeLeader();

  // Heartbeat every 3 seconds if leader
  heartbeatInterval = setInterval(() => {
    if (isLeader) {
      heartbeat();
    } else {
      tryToBecomeLeader();
    }
  }, 3000);

  // Run scheduler check
  schedulerInterval = setInterval(async () => {
    if (isLeader) {
      await runScheduledJobs();
    }
  }, checkIntervalMs);

  // Run immediately on startup if leader
  setTimeout(async () => {
    if (isLeader) {
      await runScheduledJobs();
    }
  }, 1000);
}

function tryToBecomeLeader(): void {
  if (!isLeader) {
    if (acquireFileLock()) {
      isLeader = true;
      console.log(`[Scheduler] Instance ${instanceId.slice(0, 8)} became LEADER`);
    }
  }
}

export function stopScheduler(): void {
  if (schedulerInterval) clearInterval(schedulerInterval);
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  if (isLeader) releaseFileLock();
  isLeader = false;
  console.log('[Scheduler] Stopped');
}

async function runScheduledJobs() {
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
