# requirements/scripts/reset_db.py
import os
import sys
import django
from pathlib import Path

def setup_django_environment():
    """Configura o ambiente Django para o script"""
    try:
        # Obtém o caminho absoluto do diretório raiz do projeto
        project_root = Path(__file__).resolve().parent.parent.parent
        
        # Adiciona o diretório do projeto ao PYTHONPATH
        sys.path.insert(0, str(project_root))
        
        # Verifica se o arquivo settings.py existe no diretório esperado
        settings_path = project_root / 'backend' / 'settings.py'
        if not settings_path.exists():
            raise FileNotFoundError(
                f"Arquivo settings.py não encontrado em {settings_path}. "
                "Verifique a estrutura do seu projeto."
            )
        
        # Configura a variável de ambiente para o Django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')  # Removido 'config'
        
        # Inicializa o Django
        django.setup()
        
        print("Ambiente Django configurado com sucesso!")
        return True
    
    except Exception as e:
        print(f"Erro ao configurar ambiente Django: {e}")
        return False

def reset_db():
    """Reseta o banco de dados e as migrations"""
    try:
        # Primeiro tenta configurar o ambiente Django
        if not setup_django_environment():
            return
        
        print("Iniciando reset do banco de dados...")
        
        # Obtém o caminho para o diretório de migrations
        migrations_path = Path(__file__).resolve().parent.parent.parent / 'api' / 'migrations'
        
        # Remove arquivos de migration
        print("Removendo arquivos de migration...")
        if migrations_path.exists():
            for migration_file in migrations_path.glob('0*.py'):
                migration_file.unlink()
                print(f"Arquivo removido: {migration_file.name}")
            
            # Remove __pycache__ se existir
            cache_path = migrations_path / '__pycache__'
            if cache_path.exists():
                for cache_file in cache_path.glob('*'):
                    cache_file.unlink()
                cache_path.rmdir()
                print("Cache de migrations removido")
        
        # Recria as migrations
        print("\nRecriando migrations...")
        manage_py_path = project_root / 'manage.py'
        os.system(f'python {manage_py_path} makemigrations')
        
        # Aplica as migrations
        print("\nAplicando migrations...")
        os.system(f'python {manage_py_path} migrate')
        
        print('\nBanco de dados resetado com sucesso!')
        
    except Exception as e:
        print(f'Erro ao resetar banco de dados: {str(e)}')

if __name__ == '__main__':
    # Define project_root como variável global para uso em todo o script
    project_root = Path(__file__).resolve().parent.parent.parent
    reset_db()