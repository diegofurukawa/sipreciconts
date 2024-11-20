#!/bin/bash
# flat_backup_frontend.sh

# Create backup directory with timestamp
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "Creating flat backup for frontend in $BACKUP_DIR..."

# Frontend files
find . \
    -type f \
    ! -path "*/\.*" \
    ! -path "*/node_modules/*" \
    ! -path "*/dist/*" \
    ! -path "*/build/*" \
    ! -path "*/.cache/*" \
    ! -path "*/coverage/*" \
    ! -name "*.log" \
    ! -name "*.md" \
    ! -name ".DS_Store" \
    -exec cp {} "$BACKUP_DIR" \;

echo "Frontend backup completed! All files are in $BACKUP_DIR"