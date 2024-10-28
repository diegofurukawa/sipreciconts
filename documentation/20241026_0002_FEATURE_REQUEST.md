### ====================================================================================
### 20241026_0002_FEATURE_REQUES.md
### ====================================================================================

# Feature Request Template

## Funcionalidade
[Clientes]

# Premissas
  1. Acompanhar Estrutura do Projeto
  2. Backend e Frontend separtados
  3. Paginas Responsivas


## Descrição
[
    Criar cadastro de Cliente

    Usuário deve ser capaz de criar um cliente novo com todos os campos 
    (Todos os campos VISIVEIS na modal de Cliente são: Nome, Documento, Tipo de Cliente, Celular, Email, Endereço, Complemento) 
    Table: customer (Criar nome como customer)
      Fields: 
        name = Nome, 
        document = Documento (UNIQUE) - Campo tipo Text, mas devemos considerar apenas numeros por enquanto, 
        customertype = Tipo de Cliente, 
        celphone = Celular, 
        email = Email, 
        address = Endereço, 
        complement = Complemento,
        created = data de criação - (Não visivel),
        updated = data de atualização - (Não visivel),
        lenabled = ativo,

    ou apenas os obrigatorios (observação: campos obrigatorios são apenas Nome e Celular)
    
    Usuário deve ser capaz de Editar um cliente seguindo as mesmas premissas de criação.
    
    Usuário deve ser capaz de Eliminar um cliente, IMPORTANTE Função Excluir deve apenas setar um o campo enabled = 0 e o filtro da tela deve considerar esse campo como enabled = 1.

    Usuário deve ser capaz de importar um arquivo xls, csv, txt

    Usuário deve ser capaz de Exportar um arquivo csv

]

## Casos de Uso
- [ ] Caso 1 - Criação de Cliente
    [
      Usuário deve ser capaz de criar um cliente novo preenchendo todos os campos 
      (Todos os campos VISIVEIS na modal de Cliente são: Nome, Documento, Tipo de Cliente, Celular, Email, Endereço, Complemento, Ativo) 
      ou apenas os obrigatorios (observação: campos obrigatorios são apenas Nome e Celular)
    ]

- [ ] Caso 2 - Edição de Cliente
    [
      Usuário deve ser capaz de Editar um cliente seguindo as mesmas premissas de criação.
    ]

- [ ] Caso 3 - Excluir Cliente
    [
      Usuário deve ser capaz de Eliminar um cliente. 
      IMPORTANTE Função Excluir deve apenas setar um o campo enabled = 0 e o filtro da tela deve considerar esse campo como enabled = 1.
      Não devemos excluir fisicamente o registro
    ]

- [ ] Caso 4 - Importar Clientes em Massa
    [
      Usuário deve ser capaz de importar um arquivo xls, csv, txt que no mesmo contenha no minimo os campos obrigatorios Nome e Telefone. 
      Validação
      1. Validar se no arquivo contem os Campos nesta mesmo ordem (Nome, Documento, Tipo de Cliente, Celular, Email, Endereço, Complemento, Ativo)
      2. Campos de Documento e celular devemos gravar apenas numeros 
      3. Campo documento quando existir deve ser gravado também no campo key      
    ]

- [ ] Caso 5 - Exportar Clientes em Massa
    [
      Usuário deve ser capaz de Exportar um arquivo csv dos dados contidos na tabela customers
    ]

## Testes Necessários
- [ ] Testes 1 - Criação de Cliente
- [ ] Testes 2 - Edição de Cliente
- [ ] Testes 3 - Excluir Cliente
- [ ] Testes 4 - Importar Clientes em Massa
- [ ] Testes 5 - Exportar Clientes em Massa

## Critérios de Aceite
- [ ] Critério 1 - Criação de Cliente
- [ ] Critério 2 - Edição de Cliente
- [ ] Critério 3 - Excluir Cliente
- [ ] Critério 4 - Importar Clientes em Massa
- [ ] Critério 5 - Exportar Clientes em Massa

## Configuração de Teste
- Jest
- React Testing Library
- Cypress (E2E)