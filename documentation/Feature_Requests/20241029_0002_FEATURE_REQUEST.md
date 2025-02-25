### ====================================================================================
### 20241026_0002_FEATURE_REQUES.md
### ====================================================================================

# Feature Request Template

## Funcionalidade
[Company] + [FrontEnd]

# Premissas
  1. Acompanhar Estrutura do Projeto
  2. Backend e Frontend separtados
  3. Paginas Responsivas

## Descrição
Criar Web CRUD para Cadastro de Insumos

Usuario deve ser capaz de criar um novo com todos os campos
	(Material: name, nick_name, ean_code, description, unit_measure, type)  
	Tipo: Veiculo, Armamento, Material, Uniforme
	Unidade de Medida: unidade, kilograma, mililitro
Usuario deve ser capaz de Editar um seguindo as mesmas premissas de criação.
Usuario deve ser capaz de Eliminar um IMPORTANTE Função Excluir deve apenas setar um o campo enabled = 0 e o filtro da tela deve considerar esse campo como enabled = 1.
Usuario deve ser capaz de importar um arquivo xls, csv, txt
Usuario deve ser capaz de Exportar um arquivo csv

Devemos seguir mesmo layout já existente nas paginas de clientes e impostos

## Casos de Uso
- [ ] Caso 1 - Criação
    [
      Usuario deve ser capaz de criar um novo registro preenchendo todos os campos 
      ou apenas os obrigatorios.
    ]

- [ ] Caso 2 - Edição
    [
      Usuario deve ser capaz de Editar um registro seguindo as mesmas premissas de criação.
    ]

- [ ] Caso 3 - Excluir
    [
      Usuario deve ser capaz de Eliminar. 
      IMPORTANTE Função Excluir deve apenas setar um o campo enabled = 0 e o filtro da tela deve considerar esse campo como enabled = 1.
      Não devemos excluir fisicamente o registro
    ]

- [ ] Caso 4 - Importar em Massa
    [
      Usuario deve ser capaz de importar um arquivo xls, csv, txt que no mesmo contenha no minimo os campos obrigatorios. 
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