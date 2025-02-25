# 🛠️ Comandos e Scripts de Desenvolvimento

## 📋 Índice
1. [Backend (Django)](#backend-django)
2. [Frontend (React/Vite)](#frontend-reactvite)
3. [Scripts de Automação](#scripts-de-automação)
4. [Docker](#docker)
5. [Git](#git)
6. [Utilitários](#utilitários)

## Backend (Django)

### Execução da aplicação
#### Frontend
```bash
# Execução Normal
python manage.py makemigrations 
python manage.py migrate
python manage.py runserver

# Execução com Log
python manage.py makemigrations 2>&1 | tee error_migrations.log
python manage.py migrate 2>&1 | tee error_migrate.log
python manage.py runserver 2>&1 | tee error_runserver.log
```

#### Frontend
```bash
# Execução Normal
npm run dev
npm run build
npm run test


# Execução com Log
npm run dev 2>&1 | tee error_frontend.log

```

### 🔄 Gerenciamento de Migrações
```bash
# Resetar migrações
rm -rf api/migrations/*
touch api/migrations/__init__.py
rm db.sqlite3

# Criar e aplicar migrações
python manage.py makemigrations
python manage.py migrate

# Mostrar migrações pendentes
python manage.py showmigrations

# Reverter última migração
python manage.py migrate api zero
```

### 👤 Gerenciamento de Usuários
```bash
# Criar superusuário
python manage.py createsuperuser

# Scripts de usuários de teste
python manage.py create_test_user
python manage.py setup_api_user_co001
python manage.py setup_api_user_co002

# Testar login
python manage.py test_login
```

### 🐍 Ambiente Python
```bash
# Instalar dependências
pip install -r base.txt
pip install -r requirements/local.txt  # Para ambiente de desenvolvimento
pip install -r requirements/production.txt  # Para produção

# Ativar ambiente virtual
source venv/bin/activate  # Linux/Mac
.\venv\Scripts\activate   # Windows

# Shell Django
python manage.py shell

# Consultas comuns
python manage.py shell
>>> from api.models.user import User
>>> User.objects.all()
>>> User.objects.filter(is_active=True)
```

### 🧪 Testes
```bash
# Rodar todos os testes
python manage.py test

# Rodar testes específicos
python manage.py test api.tests.test_users
python manage.py test api.tests.test_users.TestUserAPI.test_create_user

# Testes com coverage
coverage run manage.py test
coverage report
coverage html
```

## Frontend (React/Vite)

### 📦 Gerenciamento de Pacotes
```bash
# Instalar dependências
npm install
yarn install

# Adicionar nova dependência
npm install package-name
yarn add package-name

# Dependência de desenvolvimento
npm install -D package-name
yarn add -D package-name
```

### 🏃‍♂️ Scripts de Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
npm run dev
yarn dev

# Build para produção
npm run build
yarn build

# Preview do build
npm run preview
yarn preview

# Lint
npm run lint
yarn lint

# Testes
npm run test
yarn test
```

## Scripts de Automação

### 🔍 Busca em Arquivos
```bash
# Tornar script executável
chmod +x find_in_files.sh

# Buscar em todos os arquivos
./find_in_files.sh "APIError"

# Buscar em arquivos específicos
./find-in-files.sh "texto_procurado" "tsx"

# Buscar em diretório específico
./find-in-files.sh "texto_procurado" "tsx" "src"
```

### 📄 Script de Busca (find_in_files.sh)
```bash
#!/bin/bash

# Uso: ./find_in_files.sh "texto" "extensão" "diretório"
SEARCH_TEXT="$1"
FILE_EXT="${2:-*}"
SEARCH_DIR="${3:-.}"

if [ -z "$SEARCH_TEXT" ]; then
    echo "Uso: $0 'texto_para_buscar' [extensão] [diretório]"
    exit 1
fi

find "$SEARCH_DIR" -type f -name "*.$FILE_EXT" -exec grep -l "$SEARCH_TEXT" {} \;
```

## Docker

```bash
# Build e execução
docker-compose build
docker-compose up -d

# Logs
docker-compose logs -f

# Parar containers
docker-compose down

# Limpar volumes
docker-compose down -v
```

## Git

```bash
# Configuração inicial
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Branches
git checkout -b feature/nova-funcionalidade
git branch -D branch-para-deletar

# Stash
git stash
git stash pop
git stash list

# Reset
git reset --hard HEAD~1  # Último commit
git reset --soft HEAD~1  # Mantém alterações
```

## Utilitários

### 🔒 Permissões
```bash
# Dar permissão de execução
chmod +x script.sh

# Permissões recursivas
chmod -R 755 diretorio/
```

### 📊 Monitoramento
```bash
# Uso de disco
du -sh *

# Processos
ps aux | grep python
```

## 💡 Sugestões de Melhorias

1. **Scripts de Automação**
```bash
# Script para setup completo do ambiente
./setup_environment.sh

# Script para backup do banco
./backup_database.sh
```

2. **Aliases Úteis** (adicionar ao .bashrc ou .zshrc)
```bash
alias drun="python manage.py runserver"
alias dmake="python manage.py makemigrations && python manage.py migrate"
alias dshell="python manage.py shell"
alias venv="source venv/bin/activate"
```

3. **Make File**
```makefile
setup:
      python -m venv venv
      source venv/bin/activate
      pip install -r requirements.txt

migrate:
      python manage.py makemigrations
      python manage.py migrate

test:
      python manage.py test
```

4. **Docker Scripts**
```bash
# Script para limpar volumes e containers antigos
./docker_cleanup.sh

# Script para backup de volumes
./backup_volumes.sh
```

5. **VS Code Snippets**
```bash
   - Criar snippets personalizados para componentes React
   - Snippets para testes Django
   - Snippets para models e serializers
---

> 📝 **Nota**: Mantenha este documento atualizado conforme novos comandos e scripts forem adicionados ao projeto.