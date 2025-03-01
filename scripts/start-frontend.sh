#!/bin/bash

# Obter o caminho absoluto da raiz do projeto
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "===== Iniciando o frontend do SiPreciConts ====="

# Criar diretório de logs se não existir
mkdir -p "$PROJECT_ROOT/Logs"

# Verificar se o diretório frontend existe
if [ ! -d "$PROJECT_ROOT/frontend" ]; then
    echo "ERRO: Diretório frontend não encontrado em $PROJECT_ROOT/frontend"
    exit 1
fi

# Navegar para o diretório do frontend
echo "Navegando para o diretório do frontend..."
cd "$PROJECT_ROOT/frontend"

# Verificar se package.json existe
if [ ! -f "package.json" ]; then
    echo "ERRO: package.json não encontrado em $(pwd)"
    exit 1
fi

# Verificar se o script dev está definido no package.json
if ! grep -q "\"dev\":" "package.json"; then
    echo "ERRO: Script 'dev' não encontrado no package.json"
    echo "Scripts disponíveis:"
    grep "\"scripts\":" -A 20 "package.json"
    exit 1
fi

# Executar o servidor de desenvolvimento
echo "Iniciando o servidor de desenvolvimento..."
npm run dev --force 2>&1 | tee "$PROJECT_ROOT/Logs/frontend_$(date +%Y%m%d_%H%M%S).log"
