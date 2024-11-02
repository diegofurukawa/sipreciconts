# api/management/commands/setup_api_user.py
from django.core.management.base import BaseCommand
from django.db import transaction
from api.models.company import Company
from api.models.user import User

class Command(BaseCommand):
    help = 'Cria uma empresa e um usuário inicial para a API'

    def handle(self, *args, **kwargs):
        try:
            with transaction.atomic():
                # Criar empresa inicial
                company, created = Company.objects.get_or_create(
                    name='LOJAS G MOVEIS LTDA',
                    defaults={
                        'company_id': 'co001',
                        'document': '31.642.458/0001-78',
                        'email': 'admin@empresa.com',
                        'phone': '(00) 0000-0000',
                        'enabled': True
                    }
                )

                if created:
                    self.stdout.write(self.style.SUCCESS(f'Empresa criada: {company.name}'))
                else:
                    self.stdout.write(self.style.WARNING('Empresa já existe'))

                # Criar usuário API
                if not User.objects.filter(login='api_admin').exists():
                    user = User.objects.create(
                        login='api_admin',
                        user_name='Administrador API',
                        email='api_admin@empresa.com',
                        type='Admin',
                        company=company,
                        enabled=True
                    )
                    user.set_password('api_admin')
                    user.save()

                    self.stdout.write(
                        self.style.SUCCESS(
                            f'\nUsuário API criado com sucesso:'
                            f'\nLogin: api_admin'
                            f'\nSenha: api_admin'
                            f'\nEmpresa: {company.name}'
                        )
                    )
                else:
                    self.stdout.write(self.style.WARNING('Usuário API já existe'))

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Erro ao criar usuário API: {str(e)}')
            )