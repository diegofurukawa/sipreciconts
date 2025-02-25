#!/bin/bash

echo "===== Iniciando o backend do SiPreciConts ====="

# Criar diretório de logs se não existir
mkdir -p Logs

# Ativar o ambiente virtual
echo "Ativando ambiente virtual..."
source ./venv/bin/activate

# Verificar se Django está instalado
if ! python3 -c "import django" &> /dev/null; then
    echo "ERRO: Django não está instalado. Execute ./setup-backend.sh primeiro."
    exit 1
fi

# Navegar para o diretório do backend
echo "Navegando para o diretório do backend..."
cd backend

# Aplicar migrações ao banco de dados
echo "Aplicando migrações ao banco de dados..."
python3 manage.py migrate

# Iniciando o servidor Django
echo "Iniciando o servidor Django..."
python3 manage.py runserver 0.0.0.0:8000 2>&1 | tee ../Logs/backend.log