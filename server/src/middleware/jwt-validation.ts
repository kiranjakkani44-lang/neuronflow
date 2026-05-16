// JWT Secret validation — MUST be called at server startup
export function validateJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  const WEAK_SECRETS = [
    'dev-secret', 'your-secret-key', 'secret', 'password', 'changeme',
    'neuronflow-dev-jwt-secret-change-in-production'
  ];

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('FATAL: JWT_SECRET is not set in production!');
      process.exit(1);
    }
    console.warn('[AUTH] JWT_SECRET not set — using temporary dev secret (UNSAFE for production)');
    return 'dev-temp-secret-do-not-use-in-prod';
  }

  if (WEAK_SECRETS.includes(secret)) {
    if (process.env.NODE_ENV === 'production') {
      console.error(`FATAL: JWT_SECRET is a known weak value "${secret}" in production!`);
      process.exit(1);
    }
    console.warn(`[AUTH] JWT_SECRET is a weak/default value — regenerate for production`);
    return secret;
  }

  if (secret.length < 32) {
    if (process.env.NODE_ENV === 'production') {
      console.error('FATAL: JWT_SECRET must be at least 32 characters long in production!');
      process.exit(1);
    }
    console.warn(`[AUTH] JWT_SECRET is only ${secret.length} chars — recommend 32+ for production`);
  }

  return secret;
}

// Validate once at module load
export const JWT_SECRET = validateJwtSecret();