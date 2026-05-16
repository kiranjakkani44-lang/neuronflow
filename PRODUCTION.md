# ===========================================
# NeuronFlow Production Deployment Guide
# ===========================================

## Prerequisites

- Ubuntu 20.04+ server
- Domain name pointed to server IP
- Minimum 2GB RAM, 20GB disk
- Docker & Docker Compose OR standalone services

---

## Quick Start (Docker)

```bash
# 1. Clone and setup
git clone https://github.com/kiranjakkani44-lang/neuronflow.git
cd neuronflow

# 2. Create environment file
cp server/.env.production server/.env
nano server/.env  # Fill in your values

# 3. SSL Certificates
mkdir -p nginx/ssl
# Place your SSL certs here:
#   nginx/ssl/fullchain.pem
#   nginx/ssl/privkey.pem

# 4. Deploy
docker-compose -f docker-compose.production.yml up -d

# 5. Check status
docker-compose -f docker-compose.production.yml ps
docker-compose -f docker-compose.production.yml logs -f
```

---

## Manual Deployment (Systemd)

```bash
# Run as root
sudo bash deploy.sh
```

### Services Running:
- **API**: http://localhost:5000 (internal) / https://your-domain.com (external)
- **Nginx**: Ports 80, 443
- **Redis**: Port 6379
- **PostgreSQL**: Port 5432

---

## Environment Variables

Copy `server/.env.production` to `server/.env` and configure:

| Variable | Required | Description |
|----------|-----------|-------------|
| `JWT_SECRET` | Yes | 64+ char random string |
| `RAZORPAY_KEY_ID` | Yes | Razorpay key for payments |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay secret |
| `GOOGLE_CLIENT_ID` | No | Google OAuth (optional) |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth (optional) |
| `REDIS_URL` | Yes | Redis connection string |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ALLOWED_ORIGINS` | Yes | Comma-separated domains |

### Generate JWT Secret:
```bash
openssl rand -hex 64
```

---

## SSL Setup (Let's Encrypt)

```bash
# Stop nginx temporarily
systemctl stop nginx

# Obtain certificate
certbot certonly --standalone -d your-domain.com --non-interactive \
  --agree-tos -m admin@your-domain.com --http-01-port 80

# Copy to nginx/ssl/
cp /etc/letsencrypt/live/your-domain.com/*.pem nginx/ssl/

# Auto-renewal (already configured in deploy.sh)
certbot renew --quiet --deploy-hook 'systemctl reload nginx'
```

---

## Monitoring

### Health Check
```bash
# Manual check
bash scripts/health-check.sh

# Or via curl
curl http://localhost:5000/health
```

### Logs
```bash
# Systemd journal
journalctl -u neuronflow -f

# Docker
docker-compose logs -f server

# Nginx
tail -f /var/log/nginx/access.log
```

### Cron Jobs (already configured)
- SSL renewal: Daily at midnight
- Health checks: Every 5 minutes

---

## Security Checklist

- [x] Rate limiting (30 req/min API, 5 req/min login)
- [x] Token blacklist (Redis-backed)
- [x] Password reset token validation
- [x] User enumeration prevention
- [x] Lead ownership checks
- [x] Deployment ownership checks
- [x] Payment signature verification
- [x] Prompt injection sanitization
- [x] HTTPS with HSTS headers
- [x] Content-Security-Policy headers
- [x] Non-root container execution

---

## Troubleshooting

### API not responding
```bash
systemctl status neuronflow
journalctl -u neuronflow -n 50
```

### Database connection failed
```bash
sudo -u postgres psql -c "SELECT 1"
```

### Redis connection failed
```bash
redis-cli ping
```

### SSL certificate expired
```bash
certbot renew --force-renewal
systemctl reload nginx
```

---

## Scale

### Horizontal Scaling (Docker)
```yaml
# Add to docker-compose.production.yml
server:
  # ... existing config
  deploy:
    replicas: 3
```

### Vertical Scaling (Systemd)
Edit `/etc/systemd/system/neuronflow.service`:
```ini
MemoryMax=2G
CPUQuota=200%
```

---

## Backup

### Database
```bash
pg_dump -U neuronflow neuronflow > backup_$(date +%Y%m%d).sql
```

### Redis (optional)
```bash
redis-cli SAVE
```

---

## Support

- Email: support@neuronflow.com
- Docs: https://docs.neuronflow.com
- Status: https://status.neuronflow.com