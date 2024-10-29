
# requirements/scripts/reset_db.py
import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import connection

def reset_db():
    try:
        # Remove todas as migrations
        os.system('rm -f api/migrations/0*.py')
        
        # Recria as migrations
        os.system('python manage.py makemigrations')
        
        # Aplica as migrations
        os.system('python manage.py migrate')
        
        print('Banco de dados resetado com sucesso!')
    except Exception as e:
        print(f'Erro ao resetar banco de dados: {str(e)}')

if __name__ == '__main__':
    reset_db()