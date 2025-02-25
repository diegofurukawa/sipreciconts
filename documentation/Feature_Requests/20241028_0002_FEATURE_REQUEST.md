### ====================================================================================
### 20241026_0002_FEATURE_REQUES.md
### ====================================================================================

# Feature Request Template

## Funcionalidade
[Impostos]
[BackEnd]
[FrontEnd]

# Premissas
  1. Acompanhar Estrutura do Projeto
  2. Backend e Frontend separtados
  3. Paginas Responsivas

## Descrição
[
    Criar cadastro de Impostos

    Usuário deve ser capaz de criar um novo com todos os campos    
    Usuário deve ser capaz de Editar um seguindo as mesmas premissas de criação.
    Usuário deve ser capaz de Eliminar um IMPORTANTE Função Excluir deve apenas setar um o campo enabled = 0 e o filtro da tela deve considerar esse campo como enabled = 1.
    Usuário deve ser capaz de importar um arquivo xls, csv, txt
    Usuário deve ser capaz de Exportar um arquivo csv

class Tax(models.Model):
    TYPE_CHOICES = [
        ('tax', 'Imposto'),
        ('fee', 'Taxa'),
    ]
    GROUP_CHOICES = [
        ('federal', 'Federal'),
        ('state', 'Estadual'),
        ('municipal', 'Municipal'),
        ('other', 'Outro'),
    ]
    OPERATOR_CHOICES = [
        ('+', 'Adição'),
        ('-', 'Subtração'),
        ('*', 'Multiplicação'),
        ('/', 'Divisão'),
    ]

    description = models.CharField(max_length=100, verbose_name="Descrição")
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, verbose_name="Tipo")
    acronym = models.CharField(max_length=10, verbose_name="Sigla")
    group = models.CharField(max_length=20, choices=GROUP_CHOICES, verbose_name="Grupo")
    calc_operator = models.CharField(max_length=1, choices=[
        ('%', 'Percentual'),
        ('0', 'Fixo'),
        ('+', 'Adição'),
        ('-', 'Subtração'),
        ('*', 'Multiplicação'),
        ('/', 'Divisão'),
        
    ], default='%')
    value = models.DecimalField(max_digits=10, decimal_places=4, verbose_name="Valor")
    enabled = models.BooleanField(default=True, verbose_name="Ativo")
]

## Casos de Uso
- [ ] Caso 1 - Criação
    [
      Usuário deve ser capaz de criar um novo registro preenchendo todos os campos 
      ou apenas os obrigatorios.
    ]

- [ ] Caso 2 - Edição
    [
      Usuário deve ser capaz de Editar um registro seguindo as mesmas premissas de criação.
    ]

- [ ] Caso 3 - Excluir
    [
      Usuário deve ser capaz de Eliminar. 
      IMPORTANTE Função Excluir deve apenas setar um o campo enabled = 0 e o filtro da tela deve considerar esse campo como enabled = 1.
      Não devemos excluir fisicamente o registro
    ]

- [ ] Caso 4 - Importar em Massa
    [
      Usuário deve ser capaz de importar um arquivo xls, csv, txt que no mesmo contenha no minimo os campos obrigatorios Nome e Telefone. 
      Validação
      1. Validar se no arquivo contem os Campos equivalentes aos da tabela      
    ]

- [ ] Caso 5 - Exportar em Massa
    [
      Usuário deve ser capaz de Exportar um arquivo csv dos dados contidos na tabela
    ]

## Testes Necessários
- [ ] Testes 1 - Criação
- [ ] Testes 2 - Edição
- [ ] Testes 3 - Excluir
- [ ] Testes 4 - Importar
- [ ] Testes 5 - Exportar

## Critérios de Aceite
- [ ] Critério 1 - Criação
- [ ] Critério 2 - Edição
- [ ] Critério 3 - Excluir
- [ ] Critério 4 - Importar
- [ ] Critério 5 - Exportar

## Configuração de Teste
- Jest
- React Testing Library
- Cypress (E2E)