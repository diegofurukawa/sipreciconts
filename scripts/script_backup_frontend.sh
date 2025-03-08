#!/bin/bash

# Check if source directory is provided
if [ "$#" -eq 0 ]; then
    # echo "Usage: $0 <source_directory> [destination_directory]"
    echo "Usage: $0 $HOME/GitHub/sipreciconts/frontend"
    echo "Example: $0 $HOME/GitHub/sipreciconts/frontend"
    exit 1
fi

# Source directory from command line argument
SOURCE_DIR="$1"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: Source directory '$SOURCE_DIR' does not exist."
    exit 1
fi

# Define destination directory with timestamp
# If a second parameter is provided, use it as the base destination directory
if [ "$#" -ge 2 ]; then
    BASE_DEST_DIR="$2"
else
    BASE_DEST_DIR="$HOME/GitHub/sipreciconts/backup/frontend"
fi

# Create the full destination path with timestamp
# BACKUP_DIR="${BASE_DEST_DIR}/$(basename "$SOURCE_DIR")_$(date +%Y%m%d_%H%M%S)"
BACKUP_DIR="$HOME/GitHub/sipreciconts/backup/frontend/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "Source directory: $SOURCE_DIR"
echo "Backup directory: $BACKUP_DIR"

# Patterns to exclude (directories and files)
EXCLUDE_DIRS=( "backup/frontend" "backend" "backup" "migrations" "Feature_Requests" "Diversos" "diagrams" "Dev_Diary" ".pytest_cache" "__pycache__" "logs" "Logs" "old" "import" ".venv" "venv" "backup" "export" "documentation" "node_modules" )
EXCLUDE_FILES=( "*.config.ts" "README.md" "*.json" "*.config.js" "*.log" "*.sh" "__init__.py" "*.sqlite3" "*.ico" "*.png" "*.svg" "*.sample" "*.idx" "*." "FETCH_HEAD" "HEAD" "ORIG_HEAD" "COMMIT_EDITMSG" "packed-refs" "*.rev" "*.pack" "3f4300ba61354baef9f5b9ada4ad9c9ce749a9" "7714bd891f28b8c5a3e6875ee8eb1b7aca532d" "97638cb81c74bfb1315972b60380cc6dde7681" ".gitignore" ".gitattributes" ".env.example")

# Build the `-not -path` parameter for `find` to ignore directories
EXCLUDE_PATHS=()
for dir in "${EXCLUDE_DIRS[@]}"; do
    EXCLUDE_PATHS+=("-not -path \"*/$dir/*\"")
done

# Build the `-not -name` parameter for `find` to ignore specific files
EXCLUDE_NAMES=()
for file in "${EXCLUDE_FILES[@]}"; do
    EXCLUDE_NAMES+=("-not -name \"$file\"")
done

# Adjusted `find` command to exclude folders and files directly
CMD="find \"$SOURCE_DIR\" -type f ${EXCLUDE_PATHS[*]} ${EXCLUDE_NAMES[*]}"
echo "Executing: $CMD"

# Execute the `find` command, ignoring files with random names
eval $CMD | while read -r file; do
    # Preserve the directory structure relative to SOURCE_DIR
    rel_path="${file#$SOURCE_DIR/}"
    # target_path="$BACKUP_DIR/$rel_path"
    target_path="$BACKUP_DIR"

    # Create the target directory if it doesn't exist
    target_dir=$(dirname "$target_path")
    mkdir -p "$target_dir"
    
    # Copy the file
    cp "$file" "$target_path"    
    
    echo "Copied: $rel_path"
done

echo "Backup completed in $BACKUP_DIR"