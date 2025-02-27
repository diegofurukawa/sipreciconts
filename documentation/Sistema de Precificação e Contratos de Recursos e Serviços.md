# Sistema de Precificação e Contratos de Recursos e Serviços

## Visão Geral

O **SiPreciConts** é uma plataforma integrada para gerenciamento de precificação e contratos, focada em recursos e serviços. O sistema oferece uma interface web responsiva acessível tanto por navegadores desktop quanto por dispositivos móveis.

## Tecnologias

### Backend
- **Python & Django**: Framework principal para desenvolvimento do servidor
- **Django REST Framework**: API RESTful para comunicação com o frontend
- **PostgreSQL**: Banco de dados relacional

### Frontend
- **React**: Biblioteca para construção de interfaces
- **TypeScript**: Linguagem tipada para desenvolvimento frontend
- **TailwindCSS**: Framework de CSS utilitário
- **Vite**: Ferramenta de build e desenvolvimento

## Arquitetura do Sistema

O sistema é dividido em dois componentes principais:
1. **Backend**: API RESTful desenvolvida com Django
2. **Frontend**: Aplicação SPA (Single Page Application) desenvolvida com React

## Módulos do Sistema

### Home
- Dashboard personalizado
- Visão geral das métricas principais
- Atalhos para funcionalidades mais usadas

### Cadastros

#### Empresa
- Cadastro da empresa principal
- Informações fiscais e administrativas
- Configurações gerais do sistema

#### Filial
- Gestão de filiais da empresa
- Hierarquia organizacional
- Centros de custo

#### Base Operacional
- Cadastro de bases operacionais
- Vinculação com contratos
- Logística e recursos disponíveis

#### Localização
- **País**: Cadastro de países
- **Estado**: Unidades federativas
- **Cidade**: Municípios e distritos

#### Impostos
- **ISS**: Tabela de alíquotas por município (importação disponível)
- **PIS**: Configuração e alíquotas
- **COFINS**: Configuração e alíquotas
- **Taxas e Despesas**: Outras obrigações fiscais

#### Produtos
- Cadastro de produtos oferecidos
- Categorias e subcategorias
- Precificação base

#### Cargos & Salários
- Plano de cargos e salários
- Faixas salariais
- Progressões e níveis

#### Benefícios
- Tipos de benefícios oferecidos
- Valores e regras de aplicação
- Integração com cálculo de custos

#### Insumos
- **Material**: Consumíveis e equipamentos
- **Veículos**: Frota e custos associados
- **Armamento**: Controle de armamentos (para segurança)
- **Uniforme**: Itens de vestimenta e EPIs

### Preço

#### Escalas
- Configuração de escalas de trabalho
- Turnos e jornadas
- Regras de horas extras e adicional noturno

#### Gabarito
- Templates de composição de preço
- Modelos pré-configurados
- Automatização de cálculos

#### Mês - Padrão
- Definição do mês comercial padrão
- Dias úteis e feriados
- Base de cálculo para faturamento

#### Encargos
- **Cálculo de Encargos**: Automação de encargos trabalhistas
- **Convenção**: Cadastro de convenções coletivas
- **Config Cálculo**: Parametrização dos cálculos
- **Premissas de Cálculo**: Bases e regras para precificação

### Comercial

#### Prospecção
- Cadastro de leads e oportunidades
- Funil de vendas
- Acompanhamento de propostas

#### Orçamento
- Criação de orçamentos
- Composição de custos
- Simulações de preço

#### Contratos
- Gestão de contratos ativos
- Aditivos e renovações
- Monitoramento de prazos e valores

#### Faturamento
- Geração de faturas
- Controle de medições
- Acompanhamento de recebimentos

## Interface do Usuário

- **Portal Web Responsivo**: Acesso via navegador em qualquer dispositivo
- **Templates CSS**: Design consistente em toda a aplicação
- **Arquivos Estáticos**: Otimizados para carregamento rápido

## Implantação e Ambiente

O sistema pode ser implantado em ambiente de nuvem ou on-premise, utilizando Docker para containerização e facilidade de deploy.

## Segurança

- Autenticação baseada em tokens JWT
- Autorização por perfil de usuário
- Criptografia de dados sensíveis
- Proteção contra vulnerabilidades web comuns

## Integrações

O sistema está preparado para integrar com:
- Sistemas de ERP
- Sistemas contábeis
- Plataformas de RH
- Ferramentas de CRM

## Requisitos de Sistema

### Servidor
- Python 3.9+
- PostgreSQL 13+
- 4GB RAM (mínimo)
- 50GB de espaço em disco

### Cliente
- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Conexão com internet

## Documentação e Suporte

- Manual do usuário detalhado
- Documentação técnica da API
- Suporte via ticket e e-mail
- Treinamentos para usuários e administradores