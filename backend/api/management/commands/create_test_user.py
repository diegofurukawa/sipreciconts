# api/management/commands/create_test_user.py
from django.core.management.base import BaseCommand
from django.db import transaction
from backend.api.models.user_model import User
from backend.api.models.company_model import Company

class Command(BaseCommand):
    help = 'Cria uma empresa e um usuário de teste para o sistema'

    def handle(self, *args, **kwargs):
        try:
            with transaction.atomic():
                # Criar ou recuperar empresa de teste
                company, created = Company.objects.get_or_create(
                    name='Empresa Teste',
                    defaults={
                        'document': '00.000.000/0001-00',
                        'email': 'empresa@teste.com',
                        'phone': '(11) 99999-9999',
                        'enabled': True
                    }
                )

                if created:
                    self.stdout.write(self.style.SUCCESS(f'Empresa de teste criada: {company.name}'))
                else:
                    self.stdout.write(self.style.WARNING('Empresa de teste já existe'))

                # Verificar se o usuário já existe
                if User.objects.filter(login='admin').exists():
                    self.stdout.write(self.style.WARNING('Usuário de teste já existe'))
                    return

                # Criar usuário administrativo
                user = User(
                    login='admin',
                    user_name='Administrador',
                    email='admin@teste.com',
                    type='Admin',
                    company=company,
                    enabled=True
                )
                user.set_password('admin')  # Usa o método set_password para criptografar a senha
                user.save()

                self.stdout.write(
                    self.style.SUCCESS(
                        f'\nUsuário de teste criado com sucesso:'
                        f'\nLogin: admin'
                        f'\nSenha: admin'
                        f'\nEmpresa: {company.name}'
                    )
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Erro ao criar ambiente de teste: {str(e)}')
            )