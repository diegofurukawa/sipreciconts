# Project Name

## Setup

1. Clone o repositório
```bash
git clone [repository-url]
cd [project-name]
```

2. Criar e ativar ambiente virtual
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
.\venv\Scripts\activate  # Windows
```

3. Instalar dependências
```bash
# Para desenvolvimento
pip install -r requirements/local.txt

# Para testes
pip install -r requirements/test.txt

# Para produção
pip install -r requirements/prod.txt
```

4. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Editar .env com suas configurações
```

5. Aplicar migrações
```bash
python manage.py migrate
```

6. Criar superusuário
```bash
python manage.py createsuperuser
```

7. Rodar servidor de desenvolvimento
```bash
python manage.py runserver
```

## Ambientes

- **Local**: Desenvolvimento local com ferramentas de debug
- **Test**: Ambiente de testes com dependências específicas
- **Prod**: Ambiente de produção com otimizações

## Dependências

Cada ambiente tem seu próprio arquivo de requirements:

- `requirements/base.txt`: Dependências básicas
- `requirements/local.txt`: Ferramentas de desenvolvimento
- `requirements/test.txt`: Ferramentas de teste
- `requirements/prod.txt`: Dependências de produção

## Testes

```bash
pytest
```

## Lint e Formatação

```bash
# Formatar código
black .

# Verificar estilo
flake8

# Ordenar imports
isort .
```