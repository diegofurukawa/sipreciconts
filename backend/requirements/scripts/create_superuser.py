# requirements/scripts/create_superuser.py
import os
import django
import sys
from pathlib import Path

# Adiciona o diretório do projeto ao PYTHONPATH
project_root = str(Path(__file__).resolve().parent.parent.parent)
sys.path.append(project_root)

# Configura as settings do Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')  # Ajuste aqui o nome do seu módulo
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

var_username = 'user_co001'
var_password = 'dgo@2337'

def create_superuser():
    try:
        if not User.objects.filter(username=var_username).exists():
            User.objects.create_superuser(
                username=var_username,
                password=var_password,
                email='admin@example.com'
            )
            print(f'Superuser criado com sucesso!')
            print(f'Username: {var_username}')
            print(f'Password: {var_password}')
        else:
            print('Superuser já existe!')
    except Exception as e:
        print(f'Erro ao criar superuser: {str(e)}')

if __name__ == '__main__':
    create_superuser()