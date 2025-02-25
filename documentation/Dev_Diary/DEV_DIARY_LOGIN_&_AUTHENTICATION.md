# Estrutura de Arquivos - Login e Autenticação

## Frontend

### Páginas e Componentes
```
src/
├── pages/
│   └── Login/
│       ├── index.tsx                 # Página principal de login
│       ├── components/
│       │   └── LoginForm.tsx         # Componente do formulário de login
│       └── styles/
│           └── login.styles.ts       # Estilos específicos do login
├── components/
│   └── PrivateRoute/
│       └── index.tsx                 # Componente para proteção de rotas
```

### Contextos e Hooks
```
src/
├── contexts/
│   ├── AuthContext.tsx              # Contexto de autenticação
│   └── ToastContext.tsx             # Contexto para feedback (notificações)
├── hooks/
│   ├── useAuth.ts                   # Hook para gerenciar autenticação
│   └── useToast.ts                  # Hook para gerenciar notificações
```

### Serviços e API
```
src/
├── services/
│   └── api/
│       ├── index.ts                 # Exportações principais da API
│       ├── base.ts                  # Configuração base do axios
│       ├── auth.ts                  # Serviços de autenticação
│       ├── token.ts                 # Gerenciamento de tokens
│       ├── utils.ts                 # Utilitários da API
│       └── types.ts                 # Tipos e interfaces
```

### Tipos
```
src/
└── types/
    ├── auth.types.ts               # Tipos relacionados à autenticação
    └── index.ts                    # Exportações de tipos
```

### Rotas
```
src/
└── routes/
    ├── index.tsx                   # Configuração principal das rotas
    ├── modules/
    │   └── auth.routes.tsx         # Rotas específicas de autenticação
    └── components/
        └── PrivateRoute.tsx        # Componente de rota privada
```

## Backend

### API Django
```
backend/
├── api/
│   ├── views/
│   │   └── login.py                # View de autenticação
│   ├── serializers/
│   │   └── user.py                 # Serializer de usuário
│   ├── models/
│   │   └── user.py                 # Modelo de usuário
│   └── urls.py                     # URLs da API
```

### Configurações
```
backend/
└── backend/
    ├── settings.py                 # Configurações do Django
    └── urls.py                     # URLs principais
```

## Arquivos Principais

### Frontend
1. `src/pages/Login/index.tsx`
   - Página principal de login
   - Layout e estrutura da página
   - Integração com o formulário

2. `src/contexts/AuthContext.tsx`
   - Gerenciamento do estado de autenticação
   - Funções de login/logout
   - Armazenamento de tokens

3. `src/services/api/auth.ts`
   - Chamadas à API de autenticação
   - Gerenciamento de tokens
   - Refresh token

4. `src/services/api/utils.ts`
   - Interceptors do axios
   - Tratamento de erros
   - Utilitários de API

### Backend
1. `backend/api/views/login.py`
   - Lógica de autenticação
   - Geração de tokens
   - Validação de credenciais

2. `backend/api/models/user.py`
   - Modelo de usuário
   - Campos e validações

3. `backend/api/serializers/user.py`
   - Serialização de dados do usuário
   - Validações de campos

## Status dos Arquivos

✅ Implementado
- AuthContext.tsx
- api/utils.ts
- api/base.ts
- Routes/index.tsx

🚧 Necessita Implementação
- LoginPage e componentes
- Serializers no backend
- Views de autenticação no backend
- Testes unitários
- Documentação

## Próximos Passos

1. Implementar página de login com formulário
2. Configurar interceptors para refresh token
3. Implementar views de autenticação no backend
4. Adicionar validações e feedback de erros
5. Implementar testes unitários
6. Documentar API e componentes

## Observações

- Usar JWT para autenticação
- Implementar refresh token
- Adicionar validação de campos
- Implementar rate limiting
- Adicionar logs de autenticação