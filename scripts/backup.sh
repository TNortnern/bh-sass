#!/bin/bash
set -e

# BouncePro Database Backup Script
# Backs up PostgreSQL database and optionally uploads to S3

# Configuration
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=${BACKUP_DIR:-/backups}
FILENAME="bouncepro_${DATE}.sql.gz"
RETENTION_DAYS=${RETENTION_DAYS:-7}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting BouncePro database backup...${NC}"

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
  echo -e "${YELLOW}Creating backup directory: $BACKUP_DIR${NC}"
  mkdir -p "$BACKUP_DIR"
fi

# Check if required environment variables are set
if [ -z "$DATABASE_NAME" ] || [ -z "$DATABASE_USER" ]; then
  echo -e "${RED}ERROR: DATABASE_NAME and DATABASE_USER must be set${NC}"
  exit 1
fi

# Create backup
echo "Creating backup: $FILENAME"
docker compose exec -T postgres pg_dump -U "$DATABASE_USER" "$DATABASE_NAME" | gzip > "$BACKUP_DIR/$FILENAME"

# Check if backup was successful
if [ $? -eq 0 ]; then
  BACKUP_SIZE=$(du -h "$BACKUP_DIR/$FILENAME" | cut -f1)
  echo -e "${GREEN}Backup created successfully: $FILENAME ($BACKUP_SIZE)${NC}"
else
  echo -e "${RED}ERROR: Backup failed${NC}"
  exit 1
fi

# Upload to S3 if configured
if [ -n "$AWS_S3_BUCKET" ]; then
  echo "Uploading backup to S3: s3://$AWS_S3_BUCKET/backups/$FILENAME"

  if command -v aws &> /dev/null; then
    aws s3 cp "$BACKUP_DIR/$FILENAME" "s3://$AWS_S3_BUCKET/backups/$FILENAME"

    if [ $? -eq 0 ]; then
      echo -e "${GREEN}Backup uploaded to S3 successfully${NC}"
    else
      echo -e "${YELLOW}WARNING: S3 upload failed, but local backup exists${NC}"
    fi
  else
    echo -e "${YELLOW}WARNING: AWS CLI not installed, skipping S3 upload${NC}"
  fi
fi

# Clean up old backups (keep last N days)
echo "Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -type f -name "bouncepro_*.sql.gz" -mtime "+$RETENTION_DAYS" -delete

# Count remaining backups
BACKUP_COUNT=$(find "$BACKUP_DIR" -type f -name "bouncepro_*.sql.gz" | wc -l)
echo -e "${GREEN}Backup complete! Total backups: $BACKUP_COUNT${NC}"

# Optional: Send notification (uncomment if you have a notification system)
# curl -X POST "$WEBHOOK_URL" -H 'Content-Type: application/json' -d "{\"text\":\"Database backup completed: $FILENAME\"}"
