import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';

// Validate JWT secret at startup (fails fast on bad config)
import { validateJwtSecret } from './middleware/jwt-validation';
validateJwtSecret(); // Exits if production has weak secret

// Initialize email service
import { initMailer } from './services/email';
initMailer();

// Initialize scheduler
import { initScheduler, triggerAllAgents } from './services/scheduler';
initScheduler();

import authRoutes from './routes/auth';
import agentsRoutes from './routes/agents';
import deploymentsRoutes from './routes/deployments';
import auditRoutes from './routes/audit';
import leadsRoutes from './routes/leads';
import paymentsRoutes from './routes/payments';
import agentTasksRoutes from './routes/agentTasks';
import adminRoutes from './routes/admin';
import sseRoutes from './routes/sse';
import ticketRoutes from './routes/tickets';
import analyticsRoutes from './routes/analytics';
import { checkRateLimit } from './middleware/auth-production';

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for req.ip (needed for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// CORS: restrict to known origins only
const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((o: string) => o.trim())
  .filter(Boolean);

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`[CORS] Blocked request from unknown origin: ${origin}`);
    callback(new Error(`Origin ${origin} not allowed by CORS policy`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());
app.use(morgan('combined'));
app.use(compression());
app.use(express.json({ limit: '1mb' }));

app.get('/health', async (req: Request, res: Response) => {
  const checks: Record<string, { ok: boolean; message: string }> = {};
  
  // Database check
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$queryRaw`SELECT 1`;
    await prisma.$disconnect();
    checks.database = { ok: true, message: 'Connected' };
  } catch (err: any) {
    checks.database = { ok: false, message: err.message };
  }

  // LLM check
  try {
    const { llm } = await import('./agents/llm');
    const health = await llm.checkHealth();
    checks.llm = { ok: health.ok, message: `${health.provider} (${health.model})` };
  } catch (err: any) {
    checks.llm = { ok: false, message: err.message };
  }

  // Redis check
  try {
    const { tokenRedis } = await import('./middleware/auth-production');
    if (tokenRedis) {
      await tokenRedis.ping();
      checks.redis = { ok: true, message: 'Connected' };
    } else {
      checks.redis = { ok: false, message: 'Not configured (using in-memory fallback)' };
    }
  } catch (err: any) {
    checks.redis = { ok: false, message: err.message };
  }

  // Email check
  const { transporter } = await import('./services/email');
  checks.email = {
    ok: !!transporter,
    message: transporter ? 'SMTP configured' : 'Not configured (console logging only)'
  };

  const allOk = Object.values(checks).every(c => c.ok || c.message.includes('fallback') || c.message.includes('console'));
  
  res.status(allOk ? 200 : 503).json({
    status: allOk ? 'live' : 'degraded',
    timestamp: new Date().toISOString(),
    checks
  });
});

// Global rate limiting for login endpoint
app.use('/api/auth/login', async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || 'unknown';
  const result = await checkRateLimit(ip, 'login');
  if (!result.allowed) {
    return res.status(429).json({ error: 'Too many requests', retry_after: result.retryAfter });
  }
  next();
});

// Rate limiting for audit submissions
app.use('/api/audit', async (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'POST') {
    const ip = req.ip || 'unknown';
    const result = await checkRateLimit(ip, 'audit');
    if (!result.allowed) {
      return res.status(429).json({ error: 'Too many audit requests. Please try again later.', retry_after: result.retryAfter });
    }
  }
  next();
});

// Rate limiting for payment orders
app.use('/api/payments/order', async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || 'unknown';
  const result = await checkRateLimit(ip, 'payment');
  if (!result.allowed) {
    return res.status(429).json({ error: 'Too many payment requests. Please try again later.', retry_after: result.retryAfter });
  }
  next();
});

// Rate limiting for webhooks
app.use('/api/agent-tasks/webhook', async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || 'unknown';
  const result = await checkRateLimit(ip, 'webhook');
  if (!result.allowed) {
    return res.status(429).json({ error: 'Too many webhook requests. Please try again later.', retry_after: result.retryAfter });
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/agents', agentsRoutes);
app.use('/api/deployments', deploymentsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/agent-tasks', agentTasksRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sse', sseRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/analytics', analyticsRoutes);

app.listen(PORT, () => console.log(`NeuronFlow Server running on port ${PORT}`));