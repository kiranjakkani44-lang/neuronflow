import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Redis from 'ioredis';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Initialize Redis client
const redisUrl = process.env.REDIS_URL;
let redis: Redis | null = null;

if (redisUrl) {
  try {
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      enableReadyCheck: true,
    });

    redis.on('error', (err) => {
      console.error('[Redis] Connection error:', err.message);
    });

    redis.on('connect', () => {
      console.log('[Redis] Connected successfully');
    });

    // Connect immediately
    redis.connect().catch((err) => {
      console.error('[Redis] Failed to connect:', err.message);
      redis = null;
    });
  } catch (err) {
    console.warn('[Redis] Failed to initialize, using in-memory fallback');
    redis = null;
  }
} else {
  console.warn('[Redis] REDIS_URL not set - using in-memory fallback (not recommended for production)');
}

// Token blacklist expiry (7 days - matches JWT expiry)
const TOKEN_BLACKLIST_TTL = 7 * 24 * 60 * 60;

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// ===========================================
// RATE LIMITING
// ===========================================

export async function checkRateLimit(ip: string, endpoint: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  // In-memory fallback if Redis unavailable
  if (!redis) {
    return { allowed: true };
  }

  const key = `ratelimit:${endpoint}:${ip}`;
  
  try {
    const current = await redis.incr(key);
    
    if (current === 1) {
      // Set expiry based on endpoint
      const ttl = endpoint.includes('login') ? 60 : 60; // 60 seconds for all
      await redis.expire(key, ttl);
    }

    // 30 requests per minute for API, 5 per minute for login
    const limit = endpoint.includes('login') ? 5 : 30;
    
    if (current > limit) {
      const ttl = await redis.ttl(key);
      return { allowed: false, retryAfter: ttl > 0 ? ttl : 60 };
    }

    return { allowed: true };
  } catch (err) {
    console.error('[RateLimit] Error:', err);
    return { allowed: true }; // Allow on error to prevent blocking
  }
}

// ===========================================
// TOKEN BLACKLIST (Server-side Logout)
// ===========================================

export async function blacklistToken(token: string): Promise<void> {
  if (!redis) {
    console.warn('[TokenBlacklist] Redis not available, using in-memory (sessions lost on restart)');
    return;
  }

  try {
    // Store token with expiry matching JWT expiry
    await redis.setex(`blacklist:${token}`, TOKEN_BLACKLIST_TTL, '1');
  } catch (err) {
    console.error('[TokenBlacklist] Error:', err);
  }
}

export async function isTokenBlacklisted(token: string): Promise<boolean> {
  if (!redis) {
    return false; // In-memory fallback
  }

  try {
    const result = await redis.get(`blacklist:${token}`);
    return result === '1';
  } catch (err) {
    console.error('[TokenBlacklist] Check error:', err);
    return false;
  }
}

// ===========================================
// AUTH MIDDLEWARE
// ===========================================

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = header.slice(7);

  // Check if token is blacklisted (logged out)
  if (redis) {
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      return res.status(401).json({ error: 'Token has been invalidated' });
    }
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  
  if (header?.startsWith('Bearer ')) {
    const token = header.slice(7);
    
    // Check blacklist if Redis available
    if (redis && token) {
      isTokenBlacklisted(token).then(isBlacklisted => {
        if (!isBlacklisted) {
          try {
            req.user = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
          } catch {
            // ignore invalid token
          }
        }
      }).catch(() => {});
    } else {
      try {
        req.user = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
      } catch {
        // ignore invalid token
      }
    }
  }
  
  next();
}

// Export for use in routes
export { redis as tokenRedis };

// Graceful shutdown
process.on('SIGTERM', async () => {
  if (redis) {
    await redis.quit();
    console.log('[Redis] Disconnected');
  }
});