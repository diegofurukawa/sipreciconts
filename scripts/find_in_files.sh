# scripts/find_in_files.sh
#!/bin/bash

# find-in-files.sh
# Uso: ./find-in-files.sh "texto_procurado" ["extensão"] ["diretório"]
# Exemplo: ./find-in-files.sh "useState" "tsx" "src"

# Ajustar para trabalhar a partir da raiz do projeto
cd $(dirname "$0")/..

SEARCH_TEXT="$1"
FILE_EXT="${2:-*}"  # Se não especificado, procura em todos os arquivos
SEARCH_DIR="${3:-.}" # Se não especificado, procura no diretório atual

# Cores para melhor visualização
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Procurando por '${SEARCH_TEXT}' em arquivos *.$FILE_EXT no diretório $SEARCH_DIR${NC}"
echo "----------------------------------------"

if [ "$FILE_EXT" = "*" ]; then
    # Procura em todos os arquivos, excluindo node_modules, .git, e build/dist
    find "$SEARCH_DIR" -type f \
        ! -path "*/node_modules/*" \
        ! -path "*/.git/*" \
        ! -path "*/build/*" \
        ! -path "*/dist/*" \
        -exec grep -l "$SEARCH_TEXT" {} \; | \
    while read -r file; do
        echo -e "${GREEN}Arquivo:${NC} $file"
        grep -n --color=always "$SEARCH_TEXT" "$file"
        echo "----------------------------------------"
    done
else
    # Procura apenas em arquivos com a extensão especificada
    find "$SEARCH_DIR" -type f -name "*.$FILE_EXT" \
        ! -path "*/node_modules/*" \
        ! -path "*/.git/*" \
        ! -path "*/build/*" \
        ! -path "*/dist/*" \
        -exec grep -l "$SEARCH_TEXT" {} \; | \
    while read -r file; do
        echo -e "${GREEN}Arquivo:${NC} $file"
        grep -n --color=always "$SEARCH_TEXT" "$file"
        echo "----------------------------------------"
    done
fi
