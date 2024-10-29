### ====================================================================================
### FEATURE_REQUES
### ====================================================================================

# Feature Request Template

## Funcionalidade
[API] + [Company] + [BackEnd]

# Premissas
  1. Acompanhar Estrutura do Projeto
  2. Backend e Frontend separtados
  3. Paginas Responsivas

## Descrição
Criar API CRUD para Cadastro de Empresa

API deve ser capaz de criar um novo com todos os campos
	(Company: nick_name, full_name, type, document, address, phone, description - Campos Obrigatorios: nick_name, type)
  typo: Física, Jurídica
API deve ser capaz de Editar um seguindo as mesmas premissas de criação.
API deve ser capaz de Eliminar um IMPORTANTE Função Excluir deve apenas setar um o campo enabled = 0 e o filtro da tela deve considerar esse campo como enabled = 1.
API deve ser capaz de importar um arquivo xls, csv, txt
API deve ser capaz de Exportar um arquivo csv

## O que vamos Desenvolver
Vamos Criar as Models
  backend/api/models/company.py
Vamos Criar as Serializers para cada modelo
  backend/api/serializers/company.py
Vamos Criar as ViewSets para cada modelo
  backend/api/views/company.py
Vamos realizar a Configuração do Admin
  backend/api/admin/company.py
Vamos realizar a Configuração das URLs
  backend/api/urls
Gerar massa de Testes para Importar e Exportar
  gerar (35 registros para testes de paginação) um arquivo csv com as informações da tabela para importação

