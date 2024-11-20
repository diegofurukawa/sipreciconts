#!/bin/bash
# flat_backup_backend.sh

# Create backup directory with timestamp
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "Creating flat backup for backend in $BACKUP_DIR..."

# Backend files
find . \
    -type f \
    ! -path "*/\.*" \
    ! -path "*/__pycache__/*" \
    ! -path "*/staticfiles/*" \
    ! -path "*/venv/*" \
    ! -path "*backup*" \
    ! -path "*data*" \
    ! -path "*migrations*" \
    ! -name "*.pyc" \
    ! -name "*.log" \
    ! -name "*.md" \
    ! -name "*.sqlite3" \
    -exec cp {} "$BACKUP_DIR" \;

echo "Backend backup completed! All files are in $BACKUP_DIR"