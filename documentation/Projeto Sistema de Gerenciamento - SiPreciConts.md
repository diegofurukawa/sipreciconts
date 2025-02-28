1. # Projeto: Sistema de Gerenciamento - SiPreciConts

   ## Arquitetura do Projeto

   ### Estrutura Principal
   O projeto segue uma arquitetura moderna React com TypeScript, organizada em módulos funcionais claros:

   - `/src/assets`: Recursos estáticos da aplicação
   - `/src/components`: Componentes reutilizáveis
     - `/ErrorBoundary`: Tratamento de erros da aplicação
     - `/ui`: Biblioteca de componentes de interface
   - `/src/config`: Configurações da aplicação
   - `/src/contexts`: Contextos React para gerenciamento de estado global
   - `/src/hooks`: Custom hooks reutilizáveis
   - `/src/layouts`: Estruturas de layout para diferentes áreas do sistema
   - `/src/pages`: Páginas principais organizadas por função de negócio
   - `/src/providers`: Providers React para acesso a funcionalidades
   - `/src/routes`: Configuração e gerenciamento de rotas
   - `/src/services`: Serviços para comunicação com APIs
   - `/src/types`: Definições de tipos TypeScript
   - `/src/utils`: Funções utilitárias

   ### Módulos Principais

   #### Autenticação e Usuários
   - `/src/contexts/AuthContext.tsx`: Gerenciamento de estado de autenticação
   - `/src/pages/Auth`: Componentes e lógica de autenticação
   - `/src/services/modules/auth.ts`: Serviços de autenticação

   #### Cadastros
   - `/src/pages/Company`: Gestão de empresas
   - `/src/pages/Customer`: Gestão de clientes
   - `/src/pages/Tax`: Gestão de impostos
   - `/src/pages/Supply`: Gestão de insumos

   #### Comercial
   - `/src/pages/Quote`: Gestão de orçamentos
   - `/src/pages/Contract`: Gestão de contratos

   #### UI/UX
   - `/src/components/ui`: Biblioteca de componentes compartilhados
   - `/src/layouts`: Templates de layout para diferentes seções

   ### Padrões e Convenções

   #### Nomenclatura
   - Componentes: PascalCase (ex: `CompanyList.tsx`)
   - Hooks: camelCase com prefixo "use" (ex: `useCompanyList.ts`)
   - Contextos: PascalCase com sufixo "Context" (ex: `AuthContext.tsx`)
   - Serviços: camelCase (ex: `customer.ts`)

   #### Organização de Módulos
   Cada módulo/página principal segue uma estrutura consistente:
   - `/components`: Componentes específicos do módulo
   - `/hooks`: Hooks específicos do módulo
   - `/types`: Tipos específicos do módulo
   - `/utils`: Utilitários específicos do módulo
   - `/routes`: Configurações de rota específicas do módulo

   #### Comunicação com API
   - Modelo de serviço unificado via `ApiService.ts`
   - Autenticação gerenciada por `TokenService.ts` e `AuthContext`
   - Tratamento de erros centralizado

   #### Estado da Aplicação
   - Contextos React para estado global
   - Custom hooks para estado de componentes
   - Separação clara entre lógica de negócio e renderização

   ## Diretrizes de Desenvolvimento

   1. Priorizar tipagem completa em TypeScript
   2. Utilizar hooks customizados para lógica reutilizável
   3. Seguir design patterns estabelecidos nos componentes existentes
   4. Garantir tratamento de erros consistente
   5. Manter separação de responsabilidades (UI/lógica/serviços)





## Modelo para Criação de Novas Páginas

Toda nova página ou módulo deve seguir consistentemente o padrão de estrutura abaixo:

### Estrutura de Pastas e Arquivos

`

Global
├── components
├── config
├── contexts
├── hooks
├── layouts
├── routes
├── services
├── types
├── styles
├── utils
├── pages
	└── NewPage/ 
		├── index.tsx					# Ponto de entrada principal do módulo
		├── components/                 # Componentes específicos da página
		│   ├── ComponentForm.tsx       # Formulário para criação/edição
		│   ├── ComponentHeader.tsx     # Cabeçalho da página
		│   └── ComponentList.tsx       # Listagem de itens
		├── hooks/                      # Hooks customizados do módulo
		│   ├── useComponentForm.ts     # Lógica de formulário separada da UI
		│   └── useComponentList.ts     # Lógica de listagem separada da UI
		├── services/                   # Servicos customizados do módulo
		│   └── newpageService.ts 		# Sercicos necessarios específicos
		├── routes/                     # Configurações de rota específicas
		│   ├── component_routes.ts     # Definições de rota
		│   └── index.ts                # Exportações para uso externo
		├── types/                      # Definições de tipo específicas
		│   ├── component_types.ts      # Interfaces e tipos
		│   └── index.ts                # Exportações para uso externo
		└── utils/                      # Funções utilitárias específicas
		└── component_validators.ts  	# Validadores e utilidades

`

### Responsabilidades dos Arquivos

#### index.tsx
- Exportação principal do módulo
- Composição dos componentes principais
- Gestão da estrutura da página

#### Componentes
- **ComponentForm.tsx**: Formulário para criação e edição de recursos
- **ComponentHeader.tsx**: Cabeçalho com título, subtítulo e ações principais
- **ComponentList.tsx**: Visualização em lista ou tabela dos itens

#### Hooks
- **useComponentForm.ts**: Gerencia o estado do formulário, validações e submissão
- **useComponentList.ts**: Gerencia listagem, paginação, ordenação e filtros

#### Routes
- Definições de rota para o módulo
- Constantes para links de navegação
- Configuração de rotas aninhadas

#### Types
- Interfaces para modelos de dados
- Types para props de componentes
- Enums para valores constantes

#### Utils
- Funções de validação
- Helpers de formatação específicos
- Transformações de dados

### Boas Práticas

1. Manter a consistência em todos os módulos seguindo esta estrutura
2. Separar claramente lógica (hooks) de apresentação (componentes)
3. Utilizar types e interfaces adequadas para props e dados
4. Exportar apenas o necessário nos arquivos index.ts
5. Documentar funções e componentes complexos
6. Incluir testes unitários quando apropriado

Ao seguir este padrão, garantimos uniformidade, manutenibilidade e escalabilidade em todos os módulos da aplicação.