#!/bin/bash
set -e

# BouncePro Database Restore Script
# Restores PostgreSQL database from backup file

# Configuration
BACKUP_DIR=${BACKUP_DIR:-/backups}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backup file is provided
if [ -z "$1" ]; then
  echo -e "${RED}ERROR: Please provide backup file name${NC}"
  echo "Usage: $0 <backup_filename>"
  echo ""
  echo "Available backups:"
  ls -lh "$BACKUP_DIR"/bouncepro_*.sql.gz
  exit 1
fi

BACKUP_FILE="$BACKUP_DIR/$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
  echo -e "${RED}ERROR: Backup file not found: $BACKUP_FILE${NC}"
  exit 1
fi

# Check if required environment variables are set
if [ -z "$DATABASE_NAME" ] || [ -z "$DATABASE_USER" ]; then
  echo -e "${RED}ERROR: DATABASE_NAME and DATABASE_USER must be set${NC}"
  exit 1
fi

# Warning
echo -e "${YELLOW}WARNING: This will replace the current database with the backup!${NC}"
echo "Database: $DATABASE_NAME"
echo "Backup file: $BACKUP_FILE"
echo ""
read -p "Are you sure you want to continue? (yes/no): " -r
echo ""

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
  echo "Restore cancelled"
  exit 0
fi

# Create a backup of current database before restoring
echo "Creating safety backup of current database..."
SAFETY_BACKUP="$BACKUP_DIR/safety_backup_$(date +%Y%m%d_%H%M%S).sql.gz"
docker compose exec -T postgres pg_dump -U "$DATABASE_USER" "$DATABASE_NAME" | gzip > "$SAFETY_BACKUP"
echo -e "${GREEN}Safety backup created: $SAFETY_BACKUP${NC}"

# Drop and recreate database
echo "Dropping existing database..."
docker compose exec -T postgres psql -U "$DATABASE_USER" -c "DROP DATABASE IF EXISTS $DATABASE_NAME;"
docker compose exec -T postgres psql -U "$DATABASE_USER" -c "CREATE DATABASE $DATABASE_NAME OWNER $DATABASE_USER;"

# Restore from backup
echo "Restoring from backup..."
gunzip -c "$BACKUP_FILE" | docker compose exec -T postgres psql -U "$DATABASE_USER" "$DATABASE_NAME"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}Database restored successfully!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Restart services: docker compose restart"
  echo "2. Verify the restoration worked correctly"
  echo "3. If something went wrong, restore from safety backup: $SAFETY_BACKUP"
else
  echo -e "${RED}ERROR: Restore failed${NC}"
  echo "Restoring from safety backup..."
  gunzip -c "$SAFETY_BACKUP" | docker compose exec -T postgres psql -U "$DATABASE_USER" "$DATABASE_NAME"
  exit 1
fi
