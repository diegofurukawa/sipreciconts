#!/bin/bash

echo "===== Configurando ambiente para o backend do SiPreciConts ====="

# Criar diretório de logs se não existir
mkdir -p Logs

# Ativar o ambiente virtual corretamente
echo "Ativando ambiente virtual..."
source ./venv/bin/activate

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
if [ -d "requirements" ]; then
  for req_file in requirements/*.txt; do
    if [ -f "$req_file" ]; then
      echo "Instalando dependências do arquivo $req_file..."
      pip install -r "$req_file"
    fi
  done
fi

echo "Configuração concluída! Agora você pode iniciar o backend com ./start-backend.sh"