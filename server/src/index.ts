import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

import authRoutes from './routes/auth';
import agentsRoutes from './routes/agents';
import deploymentsRoutes from './routes/deployments';
import auditRoutes from './routes/audit';
import leadsRoutes from './routes/leads';
import paymentsRoutes from './routes/payments';
import agentTasksRoutes from './routes/agentTasks';

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for req.ip (needed for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());

app.get('/health', (req, res) => res.status(200).json({ status: 'live' }));

app.use('/api/auth', authRoutes);
app.use('/api/agents', agentsRoutes);
app.use('/api/deployments', deploymentsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/agent-tasks', agentTasksRoutes);

app.listen(PORT, () => console.log(`NeuronFlow Server running on port ${PORT}`));