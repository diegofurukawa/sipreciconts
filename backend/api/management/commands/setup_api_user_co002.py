# api/management/commands/setup_api_user.py
from django.core.management.base import BaseCommand
from django.db import transaction
from backend.api.models.company_model import Company
from backend.api.models.user_model import User

class Command(BaseCommand):
    help = 'Cria uma empresa e um usuário inicial para a API'

    def handle(self, *args, **kwargs):
        try:
            with transaction.atomic():
                # Criar empresa inicial
                company, created = Company.objects.get_or_create(
                    name='MAGALU LTDA',
                    defaults={
                        'company_id': 'CO002',
                        'document': '03.250.731/0001-83',
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
                if not User.objects.filter(login='user_CO002').exists():
                    user = User.objects.create(
                        login='user_CO002',
                        user_name='CO002 - user',
                        email='user_CO002@empresa.com',
                        type='User',
                        company=company,
                        enabled=True
                    )
                    user.set_password('dgo@2337')
                    user.save()

                    self.stdout.write(
                        self.style.SUCCESS(
                            f'\nUsuário API criado com sucesso:'
                            f'\nLogin: user_CO002'
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