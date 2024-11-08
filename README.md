# SiPreciConts

Sistema de Precificação e Contratos

## 🚀 Configuração do Ambiente

### Backend (Django)

1. Clone o repositório
```bash
git clone [repository-url]
cd sipreciconts
```

2. Criar e ativar ambiente virtual
```bash
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# ou
.\.venv\Scripts\activate  # Windows
```

3. Configurar permissões (Linux/Mac)
```bash
# Tornar o manage.py executável
chmod +x backend/manage.py

# Tornar os scripts executáveis
chmod +x backend/requirements/scripts/*.py

# Configurar permissões do ambiente virtual
chmod +x .venv/bin/activate
```

4. Instalar dependências
```bash
# Instalar dependências base
pip install -r requirements/base.txt

# Para ambiente de desenvolvimento também instale
pip install -r requirements/local.txt
```

5. Configurar o banco de dados
```bash
# Executar script de reset do banco
python backend/requirements/scripts/reset_db.py

# Criar superusuário padrão
python backend/requirements/scripts/create_superuser.py

# Configurar usuários das empresas
python manage.py setup_api_user_co001  # LOJAS G MOVEIS LTDA
python manage.py setup_api_user_co002  # MAGALU LTDA
```

#### Usuários Configurados
Após executar os scripts, os seguintes usuários estarão disponíveis:

#### Empresa 1: LOJAS G MOVEIS LTDA
- Login: user_co001
- Senha: dgo@2337
- CNPJ: 31.642.458/0001-78

#### Empresa 2: MAGALU LTDA
- Login: user_co002
- Senha: dgo@2337
- CNPJ: 03.250.731/0001-83

6. Rodar servidor de desenvolvimento
```bash
cd backend
python manage.py runserver
```

O admin estará disponível em: http://127.0.0.1:8000/

#### Scripts de Ambientes

Cada ambiente tem seu próprio arquivo de requirements:

- `requirements/base.txt`: Dependências básicas
- `requirements/local.txt`: Ferramentas de desenvolvimento
- `requirements/test.txt`: Ferramentas de teste
- `requirements/prod.txt`: Dependências de produção



### Frontend (React)

1. Instale as dependências:
```bash
npm install
```

2. Configure o arquivo .env:
```bash
VITE_API_URL=http://localhost:8000/api
```

3. Talvez seja necessário:
```bash
npm install clsx tailwind-merge
```

4. Talvez seja necessário:
```bash
npm install -D @types/node
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```


## Estrutura do Projeto

```
sipreciconts/
├── backend/           # Projeto Django
│   ├── manage.py
│   ├── backend/      # Configurações principais
│   └── api/         # App da API
├── requirements/     # Arquivos de dependências
│   ├── base.txt
│   ├── local.txt
│   ├── prod.txt
│   ├── test.txt
│   └── scripts/     # Scripts úteis
└── frontend/        # Projeto React (em desenvolvimento)
```


## 📚 Documentação

### Scripts Disponíveis

#### Backend

- `python manage.py migrate`: Executa as migrações do banco de dados
- `python manage.py setup_api_user_co001`: Configura usuário inicial para empresa 1
- `python manage.py setup_api_user_co002`: Configura usuário inicial para empresa 2
- `python manage.py runserver`: Inicia o servidor de desenvolvimento
- `python manage.py test`: Executa os testes
- `python manage.py createsuperuser`: Cria um superusuário

#### Frontend

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera build de produção
- `npm run lint`: Executa verificação de código
- `npm run test`: Executa os testes
- `npm run preview`: Visualiza a build de produção localmente

## 🛠️ Tecnologias Utilizadas

### Backend
- Django 5.0.0
- Django REST Framework 3.14.0
- Python 3.12

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Radix UI

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.