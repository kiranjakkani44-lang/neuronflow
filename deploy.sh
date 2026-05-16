#!/bin/bash
# ===========================================
# NeuronFlow Production Deployment Script
# ===========================================

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  log_warn "Please run as root: sudo ./deploy.sh"
  exit 1
fi

# ===========================================
# 1. Create NeuronFlow User
# ===========================================
log_info "Creating neuronflow user..."
if id neuronflow &>/dev/null; then
  log_info "User neuronflow already exists"
else
  useradd -r -s /bin/false -d /opt/neuronflow -c "NeuronFlow Service Account" neuronflow
  log_info "User neuronflow created"
fi

# ===========================================
# 2. Setup Directory Structure
# ===========================================
log_info "Setting up directories..."
mkdir -p /opt/neuronflow/server
mkdir -p /opt/neuronflow/client
mkdir -p /opt/neuronflow/nginx/ssl
mkdir -p /var/log/neuronflow
chown -R neuronflow:neuronflow /opt/neuronflow

# ===========================================
# 3. Install Dependencies
# ===========================================
log_info "Installing system dependencies..."
apt-get update
apt-get install -y curl nginx certbot python3-certbot-nginx redis-server postgresql

# ===========================================
# 4. Generate SSL Certificate (Let's Encrypt)
# ===========================================
read -p "Enter your domain name (e.g., app.neuronflow.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
  log_error "Domain name is required"
  exit 1
fi

log_info "Generating SSL certificate for $DOMAIN..."

# Stop nginx temporarily for certbot
systemctl stop nginx

# Obtain certificate
certbot certonly --standalone -d "$DOMAIN" --non-interactive --agree-tos -m "admin@$DOMAIN" --http-01-port 80

# Copy certificates
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem /opt/neuronflow/nginx/ssl/
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem /opt/neuronflow/nginx/ssl/
cp /etc/letsencrypt/live/$DOMAIN/chain.pem /opt/neuronflow/nginx/ssl/

log_info "SSL certificates installed"

# ===========================================
# 5. Setup Environment Variables
# ===========================================
log_info "Setting up environment variables..."

if [ ! -f /opt/neuronflow/server/.env ]; then
  cat > /opt/neuronflow/server/.env << 'EOF'
NODE_ENV=production
PORT=5000
JWT_SECRET=$(openssl rand -hex 64)
DATABASE_URL=postgresql://neuronflow:YOUR_PASSWORD@localhost:5432/neuronflow
REDIS_URL=redis://localhost:6379
ALLOWED_ORIGINS=https://YOUR_DOMAIN
EOF
  log_warn "Please edit /opt/neuronflow/server/.env with your real values"
fi

# ===========================================
# 6. Setup PostgreSQL
# ===========================================
log_info "Setting up PostgreSQL..."
systemctl enable postgresql
systemctl start postgresql

sudo -u postgres psql << 'EOF'
CREATE USER neuronflow WITH PASSWORD 'CHANGE_THIS_PASSWORD';
CREATE DATABASE neuronflow OWNER neuronflow;
ALTER USER neuronflow CREATEDB;
\q
EOF

# ===========================================
# 7. Enable and Start Redis
# ===========================================
log_info "Starting Redis..."
systemctl enable redis
systemctl start redis

# ===========================================
# 8. Copy Application Files
# ===========================================
log_info "Copying application files..."
# Note: In real deployment, you'd pull from git or use a deployment tool
cp -r /home/stb/neuronflow/server/* /opt/neuronflow/server/
cp -r /home/stb/neuronflow/client/* /opt/neuronflow/client/

chown -R neuronflow:neuronflow /opt/neuronflow

# ===========================================
# 9. Build Client
# ===========================================
log_info "Building client application..."
cd /opt/neuronflow/client
sudo -u neuronflow npm ci
sudo -u neuronflow npm run build

# ===========================================
# 10. Install Server Dependencies
# ===========================================
log_info "Installing server dependencies..."
cd /opt/neuronflow/server
sudo -u neuronflow npm ci

# Run database migrations
sudo -u neuronflow npx prisma migrate deploy

# ===========================================
# 11. Setup Nginx
# ===========================================
log_info "Configuring Nginx..."
cp /home/stb/neuronflow/nginx/production.conf /etc/nginx/sites-available/neuronflow

# Update domain in nginx config
sed -i "s/server_name _;/server_name $DOMAIN;/" /etc/nginx/sites-available/neuronflow

# Enable site
ln -sf /etc/nginx/sites-available/neuronflow /etc/nginx/sites-enabled/neuronflow

# Test and start nginx
nginx -t && systemctl enable nginx && systemctl start nginx

# ===========================================
# 12. Setup systemd service
# ===========================================
log_info "Setting up systemd service..."
cp /opt/neuronflow/server/neuronflow.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable neuronflow
systemctl start neuronflow

# ===========================================
# 13. Setup SSL Auto-Renewal
# ===========================================
log_info "Setting up SSL auto-renewal..."
(crontab -l 2>/dev/null; echo "0 0 * * * certbot renew --quiet --deploy-hook 'systemctl reload nginx'") | crontab -

# ===========================================
# 14. Final Status Check
# ===========================================
log_info "Checking services..."
sleep 5

for service in nginx postgresql redis neuronflow; do
  if systemctl is-active --quiet $service; then
    log_info "$service: ${GREEN}running${NC}"
  else
    log_error "$service: ${RED}failed${NC}"
  fi
done

# Check health endpoint
if curl -sf http://localhost:5000/health > /dev/null; then
  log_info "API Health: ${GREEN}OK${NC}"
else
  log_error "API Health: ${RED}FAILED${NC}"
fi

log_info "======================================="
log_info "Deployment complete!"
log_info "======================================="
log_info "Check status: systemctl status neuronflow"
log_info "View logs: journalctl -u neuronflow -f"
log_info "======================================="