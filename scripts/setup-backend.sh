#!/bin/bash

echo "===== Configurando ambiente para o backend do SiPreciConts ====="

# Obter o caminho absoluto da raiz do projeto
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Criar diretório de logs se não existir
mkdir -p "$PROJECT_ROOT/Logs"

# Verificar se o ambiente virtual existe, criar se não existir
if [ ! -d "$PROJECT_ROOT/venv" ]; then
    echo "Criando ambiente virtual..."
    cd "$PROJECT_ROOT"
    python3 -m venv venv
fi

# Ativar o ambiente virtual
echo "Ativando ambiente virtual..."
source "$PROJECT_ROOT/venv/bin/activate"

# Verificar se o ambiente foi ativado corretamente
echo "Usando: $(which python3)"
echo "Versão Python: $(python3 --version)"

# Atualizar pip para a versão mais recente
echo "Atualizando pip..."
pip install --upgrade pip

# Instalar pandas e suas dependências
echo "Instalando pandas e dependências relacionadas..."
pip install pandas numpy openpyxl xlrd

# Instalar dependências do Django e REST framework
echo "Instalando Django e dependências de REST framework..."
pip install django djangorestframework django-cors-headers drf-yasg djangorestframework-simplejwt

# Instalar mais dependências que podem ser necessárias
echo "Instalando dependências adicionais..."
pip install django-filter Pillow psycopg2-binary python-dotenv requests django-extensions

# Instalar dependências do arquivo requirements se existir
if [ -d "$PROJECT_ROOT/requirements" ]; then
  for req_file in "$PROJECT_ROOT/requirements"/*.txt; do
    if [ -f "$req_file" ]; then
      echo "Instalando dependências do arquivo $req_file..."
      pip install -r "$req_file"
    fi
  done
fi

echo "Configuração concluída! Agora você pode iniciar o backend com ./start-backend.sh"
