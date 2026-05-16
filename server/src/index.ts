import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';

// Suppress punycode deprecation warning (Node.js built-in, harmless)
process.on('warning', (warning: any) => {
  if (warning.code === 'DEP0040') return;
  console.warn(warning.name, warning.message);
});

// Validate JWT secret at startup (fails fast on bad config)
import { validateJwtSecret } from './middleware/jwt-validation';
validateJwtSecret(); // Exits if production has weak secret

import authRoutes from './routes/auth';
import agentsRoutes from './routes/agents';
import deploymentsRoutes from './routes/deployments';
import auditRoutes from './routes/audit';
import leadsRoutes from './routes/leads';
import paymentsRoutes from './routes/payments';
import agentTasksRoutes from './routes/agentTasks';
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

app.get('/health', (req: Request, res: Response) => res.status(200).json({ status: 'live' }));

// Global rate limiting for login endpoint
app.use('/api/auth/login', async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || 'unknown';
  const result = await checkRateLimit(ip, 'login');
  if (!result.allowed) {
    return res.status(429).json({ error: 'Too many requests', retry_after: result.retryAfter });
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

app.listen(PORT, () => console.log(`NeuronFlow Server running on port ${PORT}`));