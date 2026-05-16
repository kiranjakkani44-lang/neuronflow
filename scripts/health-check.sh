#!/bin/bash
# ===========================================
# NeuronFlow Health Check & Monitoring Script
# ===========================================

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

API_URL="${API_URL:-http://localhost:5000}"
SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"

log_status() {
  local status=$1
  local message=$2
  if [ "$status" = "OK" ]; then
    echo -e "${GREEN}[✓]${NC} $message"
  elif [ "$status" = "WARN" ]; then
    echo -e "${YELLOW}[!]${NC} $message"
  else
    echo -e "${RED}[✗]${NC} $message"
  fi
}

send_alert() {
  local message="$1"
  echo "[ALERT] $message"
  
  # Send to Slack if configured
  if [ -n "$SLACK_WEBHOOK" ]; then
    curl -s -X POST "$SLACK_WEBHOOK" \
      -H 'Content-Type: application/json' \
      -d "{\"text\":\"[NeuronFlow Alert] $message\"}" > /dev/null
  fi
}

# ===========================================
# Check API Health
# ===========================================
echo "======================================"
echo "NeuronFlow Health Check"
echo "======================================"
echo ""

# 1. API Health Endpoint
echo -n "API Health Check: "
response=$(curl -sf "$API_URL/health" 2>/dev/null || echo "failed")
if [ "$response" = '{"status":"live"}' ]; then
  log_status "OK" "API is healthy"
else
  log_status "FAIL" "API is not responding"
  send_alert "API health check failed"
fi

# 2. Database Connection
echo -n "Database: "
if timeout 5s nc -z localhost 5432 2>/dev/null; then
  log_status "OK" "PostgreSQL is running"
else
  log_status "FAIL" "PostgreSQL is not accessible"
  send_alert "Database connection failed"
fi

# 3. Redis Connection
echo -n "Redis: "
if timeout 5s nc -z localhost 6379 2>/dev/null; then
  log_status "OK" "Redis is running"
else
  log_status "FAIL" "Redis is not accessible"
  send_alert "Redis connection failed"
fi

# 4. Nginx Status
echo -n "Nginx: "
if pgrep -x nginx > /dev/null; then
  log_status "OK" "Nginx is running"
else
  log_status "FAIL" "Nginx is not running"
  send_alert "Nginx is down"
fi

# 5. Memory Usage
echo ""
echo "Resource Usage:"
mem_usage=$(ps aux | grep "node.*index.js" | grep -v grep | awk '{print $4}')
if [ -n "$mem_usage" ]; then
  echo "  Node.js Memory: ${mem_usage}%"
  if (( $(echo "$mem_usage > 80" | bc -l 2>/dev/null || echo 0) )); then
    log_status "WARN" "High memory usage detected"
    send_alert "High memory usage: ${mem_usage}%"
  fi
fi

# 6. Disk Space
disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
echo "  Disk Usage: ${disk_usage}%"
if [ "$disk_usage" -gt 85 ]; then
  log_status "WARN" "Disk space is running low"
  send_alert "Disk usage is at ${disk_usage}%"
fi

# 7. Recent Errors Check
echo ""
echo -n "Recent Errors (last 5min): "
errors=$(journalctl -u neuronflow --since "5 minutes ago" --no-pager -l error 2>/dev/null | wc -l)
if [ "$errors" -gt 0 ]; then
  log_status "WARN" "$errors errors found in last 5 minutes"
  send_alert "$errors errors in recent logs"
else
  log_status "OK" "No recent errors"
fi

# 8. Response Time
echo -n "Response Time: "
response_time=$(curl -o /dev/null -s -w '%{time_total}' "$API_URL/health")
response_ms=$(echo "$response_time * 1000" | bc 2>/dev/null | cut -d'.' -f1)
echo "${response_ms}ms"
if [ "$response_ms" -gt 1000 ]; then
  log_status "WARN" "Slow response time"
fi

echo ""
echo "======================================"
echo "Health check complete: $(date)"
echo "======================================"

# Exit with status based on checks
if [ "$errors" -gt 5 ]; then
  exit 2  # Multiple errors
elif ! curl -sf "$API_URL/health" > /dev/null 2>&1; then
  exit 1  # API down
fi
exit 0  # All good