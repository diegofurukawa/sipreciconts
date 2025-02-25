#!/bin/bash

# Criar estrutura de diretórios principal
# mkdir sipreciconts
# cd sipreciconts

# Criar arquivo README.md com informações do projeto
echo "# SiPreciConts

Sistema de Precificação e Contratos de Recursos e Serviços

## Sobre o Projeto

SiPreciConts é uma plataforma integrada para gerenciamento de precificação e contratos, 
focada em recursos e serviços.

## Tecnologias

- Backend: Django + Django REST Framework
- Frontend: React + TypeScript
- Testes: Jest, React Testing Library, Cypress
" > README.md

# Criar e ativar ambiente virtual Python
python -m venv venv
source venv/bin/activate  # No Windows: .\venv\Scripts\activate

# Instalar dependências do Django
pip install django djangorestframework django-cors-headers pytest pytest-django
django-admin startproject backend
cd backend
python manage.py startapp api

# Configurar frontend com React + TypeScript
cd ..
npx create-react-app frontend --template typescript
cd frontend

# Instalar dependências do frontend
npm install @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install cypress --save-dev
npm install axios @types/axios

# Atualizar package.json com informações do projeto
node -e "
const pkg = require('./package.json');
pkg.name = 'sipreciconts-frontend';
pkg.description = 'Sistema de Precificação e Contratos de Recursos e Serviços - Frontend';
pkg.jest = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts'
  ],
  testEnvironment: 'jsdom'
};
require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# Voltar para o diretório raiz
cd ..

# Criar arquivo DEV_DIARY.md
echo "# Diário de Desenvolvimento - SiPreciConts

## Inicialização do Projeto - $(date)
### Sistema de Precificação e Contratos de Recursos e Serviços

#### Atividades Realizadas:
- Criação da estrutura inicial do projeto
- Configuração do ambiente Django
- Configuração do ambiente React + TypeScript
- Instalação e configuração das ferramentas de teste
- Definição da estrutura base do projeto

#### Próximos Passos:
- Implementar modelos de dados para recursos e serviços
- Criar interfaces de usuário para gestão de contratos
- Desenvolver módulo de precificação
" > DEV_DIARY.md

# Criar estrutura de diretórios adicional para o projeto
mkdir -p documentation
mkdir -p backend/templates
mkdir -p frontend/src/components
mkdir -p frontend/src/pages
mkdir -p frontend/src/services
mkdir -p frontend/src/types