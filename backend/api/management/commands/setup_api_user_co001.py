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
                if not User.objects.filter(login='user_co001').exists():
                    user = User.objects.create(
                        login='user_co001',
                        user_name='co001 - user',
                        email='user_co001@empresa.com',
                        type='User',
                        company=company,
                        enabled=True
                    )
                    user.set_password('dgo@2337')
                    user.save()

                    self.stdout.write(
                        self.style.SUCCESS(
                            f'\nUsuário API criado com sucesso:'
                            f'\nLogin: user_co001'
                            f'\nSenha: dgo@2337'
                            f'\nEmpresa: {company.name}'
                        )
                    )
                else:
                    self.stdout.write(self.style.WARNING('Usuário API já existe'))

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Erro ao criar usuário API: {str(e)}')
            )