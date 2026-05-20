#!/bin/bash
# NeuronFlow Database Backup Script
# Usage: ./scripts/backup.sh [output_dir]

set -e

BACKUP_DIR="${1:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_PATH="./prisma/dev.db"
BACKUP_FILE="${BACKUP_DIR}/neuronflow_backup_${TIMESTAMP}.db"
GZ_FILE="${BACKUP_FILE}.gz"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
  echo "[Backup] Database not found at $DB_PATH"
  exit 1
fi

# Copy database
cp "$DB_PATH" "$BACKUP_FILE"
echo "[Backup] Database copied to $BACKUP_FILE"

# Compress
gzip "$BACKUP_FILE"
echo "[Backup] Compressed to $GZ_FILE"

# Keep only last 30 backups
ls -t "${BACKUP_DIR}"/neuronflow_backup_*.db.gz 2>/dev/null | tail -n +31 | xargs -r rm
echo "[Backup] Cleaned old backups (kept last 30)"

# If PostgreSQL is configured, use pg_dump instead
if [ -n "$DATABASE_URL" ] && echo "$DATABASE_URL" | grep -q "postgresql"; then
  echo "[Backup] PostgreSQL detected, creating pg_dump..."
  PG_BACKUP="${BACKUP_DIR}/neuronflow_backup_${TIMESTAMP}.sql.gz"
  pg_dump "$DATABASE_URL" | gzip > "$PG_BACKUP"
  echo "[Backup] PostgreSQL dump: $PG_BACKUP"
fi

echo "[Backup] Complete: $GZ_FILE"
