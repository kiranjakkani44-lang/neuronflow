import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';

// Validate JWT secret at startup (fails fast on bad config)
import { validateJwtSecret } from './middleware/jwt-validation';
validateJwtSecret();

// Initialize email service
import { initMailer } from './services/email';
initMailer();

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
import cronRoutes from './routes/cron';
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
app.use(morgan(process.env.LOG_LEVEL === 'debug' ? 'combined' : 'short'));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting (production check only, applied per-route as needed)

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
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
app.use('/api/cron', cronRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Only listen when run directly (not as serverless function)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`[NeuronFlow] Server running on port ${PORT}`);
    console.log(`[NeuronFlow] Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export for Vercel serverless
export default app;
