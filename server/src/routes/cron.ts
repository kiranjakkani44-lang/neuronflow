import { Router, Request, Response } from 'express';
import { runScheduledJobs, triggerAllAgents } from '../services/scheduler';

const router = Router();

// Middleware to verify Vercel Cron Secret
function verifyCron(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

router.get('/trigger', verifyCron, async (req: Request, res: Response) => {
  try {
    await runScheduledJobs();
    res.status(200).json({ success: true, message: 'Scheduled jobs triggered' });
  } catch (error: any) {
    console.error('[Cron] Error running scheduled jobs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/trigger-all', verifyCron, async (req: Request, res: Response) => {
  try {
    const results = await triggerAllAgents();
    res.status(200).json({ success: true, results });
  } catch (error: any) {
    console.error('[Cron] Error triggering all agents:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
