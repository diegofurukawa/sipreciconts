#!/bin/bash

echo "===== Iniciando o backend do SiPreciConts ====="

# Obter o caminho absoluto da raiz do projeto
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Criar diretório de logs se não existir
mkdir -p "$PROJECT_ROOT/Logs"

# Ativar o ambiente virtual
echo "Ativando ambiente virtual..."
if [ -f "$PROJECT_ROOT/venv/bin/activate" ]; then
    source "$PROJECT_ROOT/venv/bin/activate"
else
    echo "ERRO: Ambiente virtual não encontrado em $PROJECT_ROOT/venv"
    echo "Verificando outras possíveis localizações..."
    
    # Tentar outras possíveis localizações do venv
    if [ -f "$PROJECT_ROOT/.venv/bin/activate" ]; then
        source "$PROJECT_ROOT/.venv/bin/activate"
        echo "Ambiente virtual encontrado em $PROJECT_ROOT/.venv"
    else
        echo "ERRO: Não foi possível encontrar o ambiente virtual."
        exit 1
    fi
fi

# Verificar se Django está instalado
if ! python3 -c "import django" &> /dev/null; then
    echo "ERRO: Django não está instalado. Execute ./setup-backend.sh primeiro."
    exit 1
fi

# Navegar para o diretório do backend
echo "Navegando para o diretório do backend..."
if [ -d "$PROJECT_ROOT/backend" ]; then
    cd "$PROJECT_ROOT/backend"
else
    echo "ERRO: Diretório backend não encontrado em $PROJECT_ROOT/backend"
    exit 1
fi

# Verificar se manage.py existe
if [ ! -f "manage.py" ]; then
    echo "ERRO: manage.py não encontrado em $(pwd)"
    exit 1
fi

# Aplicar migrações ao banco de dados
echo "Aplicando migrações ao banco de dados..."
python3 manage.py migrate

# Iniciando o servidor Django
echo "Iniciando o servidor Django..."
python3 manage.py runserver 0.0.0.0:8000 2>&1 | tee "$PROJECT_ROOT/Logs/backend_$(date +%Y%m%d_%H%M%S).log"
