#!/bin/bash

# Definir a pasta de destino do backup com timestamp
BACKUP_DIR="$HOME/GitHub/sipreciconts/backup/frontend/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Padrões de exclusão (diretórios e arquivos)
EXCLUDE_DIRS=( "backup/frontend" "backend" "backup" "migrations" "Feature_Requests" "Diversos" "diagrams" "Dev_Diary" ".pytest_cache" "__pycache__" "logs" "Logs" "old" "import" ".venv" "venv" "backup" "export" "documentation" "node_modules" )
EXCLUDE_FILES=( "*.log" "*.sh" "__init__.py" "*.sqlite3" "*.ico" "*.png" "*.svg" "*.sample" "*.idx" "*." "FETCH_HEAD" "HEAD" "ORIG_HEAD" "COMMIT_EDITMSG" "packed-refs" "*.rev" "*.pack" "3f4300ba61354baef9f5b9ada4ad9c9ce749a9" "7714bd891f28b8c5a3e6875ee8eb1b7aca532d" "97638cb81c74bfb1315972b60380cc6dde7681" ".gitignore" ".gitattributes" ".env.example")

# Construir o parâmetro `-not -path` para `find` ignorar os diretórios
EXCLUDE_PATHS=()
for dir in "${EXCLUDE_DIRS[@]}"; do
    EXCLUDE_PATHS+=("-not -path \"*/$dir/*\"")
done

# Construir o parâmetro `-not -name` para `find` ignorar arquivos específicos
EXCLUDE_NAMES=()
for file in "${EXCLUDE_FILES[@]}"; do
    EXCLUDE_NAMES+=("-not -name \"$file\"")
done

# Comando `find` ajustado para excluir as pastas e arquivos direto
CMD="find . -type f ${EXCLUDE_PATHS[*]} ${EXCLUDE_NAMES[*]}"
echo "Executando: $CMD"

# Executar o comando `find`, ignorando arquivos com nomes aleatórios
eval $CMD | while read -r file; do
    filename=$(basename "$file")

    # Ignorar arquivos que sejam apenas letras e números (exemplo: "ce0998ca9ff5448be8a402a67ae250d7bd6f44")
    if [[ ! "$filename" =~ ^[a-fA-F0-9]{32,40}$ ]]; then
        cp "$file" "$BACKUP_DIR"
    fi
done

echo "Backup concluído em $BACKUP_DIR"
