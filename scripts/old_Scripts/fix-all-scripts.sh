#!/bin/bash

# Criar diretório scripts se não existir
mkdir -p scripts

# Corrigir start-frontend.sh
cat > scripts/start-frontend.sh << 'EOF'
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
npm run dev 2>&1 | tee "$PROJECT_ROOT/Logs/frontend.log"
EOF
chmod +x scripts/start-frontend.sh

# Corrigir start-backend.sh
cat > scripts/start-backend.sh << 'EOF'
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
python3 manage.py runserver 0.0.0.0:8000 2>&1 | tee "$PROJECT_ROOT/Logs/backend.log"
EOF
chmod +x scripts/start-backend.sh

# Corrigir setup-backend.sh
cat > scripts/setup-backend.sh << 'EOF'
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
EOF
chmod +x scripts/setup-backend.sh

echo "Scripts corrigidos! Agora eles usam caminhos absolutos e fazem verificações robustas."