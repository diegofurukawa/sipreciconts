# requirements/scripts/create_superuser.py
import os
import django
import sys
from pathlib import Path

# Adiciona o diretório do projeto ao PYTHONPATH
project_root = str(Path(__file__).resolve().parent.parent.parent)
sys.path.append(project_root)

# Configura as settings do Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from backend.api.models.company_model import Company  # Importando o modelo de Company

User = get_user_model()

var_login = 'admin'
var_user_name = 'Administrador'
var_password = 'dgo@2337'

def create_superuser():
    try:
        # Primeiro, verificamos se já existe uma companhia ou criamos uma nova
        company, created = Company.objects.get_or_create(
            name='Empresa Admin',
            defaults={
                'company_id': 'ADMIN',
                'document': '00.000.000/0001-00',
                'email': 'admin@empresa.com',
                'enabled': True
            }
        )
        
        if created:
            print(f'Empresa criada: {company.name}')
        else:
            print(f'Usando empresa existente: {company.name}')
        
        # Agora criamos o usuário, associando-o à companhia
        if not User.objects.filter(login=var_login).exists():
            User.objects.create_superuser(
                user_name=var_user_name,
                login=var_login,
                password=var_password,
                email='admin@example.com',
                company=company,  # Associando à companhia
                type='Admin'  # Provavelmente necessário pelo modelo
            )
            print(f'Superuser criado com sucesso!')
            print(f'Login: {var_login}')
            print(f'Nome: {var_user_name}')
            print(f'Empresa: {company.name}')
            print(f'Password: {var_password}')
        else:
            print('Superuser já existe!')
    except Exception as e:
        print(f'Erro ao criar superuser: {str(e)}')

if __name__ == '__main__':
    create_superuser()