# api/management/commands/setup_api_user.py
from django.core.management.base import BaseCommand
from django.db import transaction
from api.models.company import Company
from api.models.user import User

v_user_login ='user_co003',
v_user_password = 'dgo@2337'
v_user_name = f'Usuario - {v_user_login}',
v_user_email = f'{v_user_login}@empresa.com',
v_user_type ='User',
v_user_enabled = True

v_company_id = 'CO002',
v_company_name = 'MAGALU LTDA',
v_company_document = '03.250.731/0001-83',
v_company_email = 'admin@empresa.com',
v_company_phone = '(00) 0000-0000',
v_company_enabled = True

class Command(BaseCommand):
    help = 'Cria uma empresa e um usuário inicial para a API'

    def handle(self, *args, **kwargs):
        try:
            with transaction.atomic():
                # Criar empresa inicial
                company, created = Company.objects.get_or_create(
                    name = v_company_name,
                    defaults={
                        'company_id': v_company_id,
                        'document': v_company_document,
                        'email': v_company_email,
                        'phone': v_company_phone,
                        'enabled': v_company_enabled
                    }
                )

                if created:
                    self.stdout.write(self.style.SUCCESS(f'Empresa criada: {company.name}'))
                else:
                    self.stdout.write(self.style.WARNING('Empresa já existe'))

                # Criar usuário API
                if not User.objects.filter(login = v_user_login).exists():
                    user = User.objects.create(
                        login = v_user_login,
                        user_name = v_user_name,
                        email = v_user_email,
                        type = v_user_type,
                        company = company,
                        enabled = v_user_enabled
                    )
                    user.set_password(v_user_password)
                    user.save()

                    self.stdout.write(
                        self.style.SUCCESS(
                            f'\nUsuário API criado com sucesso:'
                            f'\nLogin: {v_user_login}'
                            f'\nSenha: {v_user_password}'
                            f'\nEmpresa: {company.name}'
                        )
                    )
                else:
                    self.stdout.write(self.style.WARNING('Usuário API já existe'))

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Erro ao criar usuário API: {str(e)}')
            )