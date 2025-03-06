# Guia de Migração para o Novo ApiMainService

Este guia fornece instruções sobre como migrar do `ApiService` original para o novo `ApiMainService` modularizado.

## Por que migrar?

O novo `ApiMainService` oferece várias vantagens:

- **Código mais organizado**: Estrutura modular seguindo princípios SOLID
- **Manutenção simplificada**: Cada arquivo tem uma responsabilidade única
- **Melhor tratamento de erros**: Sistema robusto de tratamento de erros e retentativas
- **Facilidade para testes**: Módulos isolados facilitam a criação de testes unitários
- **Depuração aprimorada**: Sistema de logging detalhado para rastrear requisições
- **Escalabilidade**: Arquitetura que facilita a adição de novas funcionalidades

## Passos para Migração

### 1. Atualizar Importações

#### Antes:

```typescript
import { apiService } from '@/services/api/ApiService';
// ou
import { ApiService } from '@/services/api/ApiService';
```

#### Depois:

```typescript
import { apiService } from '@/services/apiMainService';
// ou
import { ApiService } from '@/services/apiMainService';
```

### 2. Atualizar Chamadas aos Métodos

A maioria dos métodos mantém a mesma assinatura, portanto, a maior parte do código continuará funcionando sem alterações.

#### Pequenas diferenças:

- O método `getPaginated` agora retorna sempre um objeto com a mesma estrutura (`{ results, count, next, previous }`)
- O método `uploadFile` agora aceita um parâmetro opcional `options` com mais configurações

### 3. Aproveitar Novas Funcionalidades

#### Tratamento de erros melhorado:

```typescript
try {
  await apiService.get('/endpoint');
} catch (error) {
  // Agora o erro é uma instância de ApiError com código padronizado
  if (error.code === 'NOT_FOUND') {
    console.log('Recurso não encontrado');
  } else if (error.code === 'VALIDATION_ERROR') {
    console.log('Erros de validação:', error.details);
  }
}
```

#### Retentativas automáticas:

O novo serviço tenta automaticamente requisições que falharam por problemas de rede ou servidor (408, 429, 500, 502, 503, 504).

#### Renovação automática de token:

O serviço agora verifica e renova tokens expirados automaticamente antes das requisições.

#### Eventos de autenticação:

```typescript
// Adicione um listener para sessão expirada
window.addEventListener('auth:sessionExpired', () => {
  // Redirecionar para login
  router.push('/login?session=expired');
});
```

### 4. Substituir Utilitários

#### Antes:

```typescript
// Verificação manual de token
if (isTokenExpired()) {
  await refreshToken();
}

// Tratamento manual de erros de API
if (error.response?.status === 401) {
  // Tratar erro de autenticação
}
```

#### Depois:

```typescript
// Verificação de token é feita automaticamente

// Para verificar manualmente se necessário
import { tokenManager } from '@/services/apiMainService/auth';
const isValid = tokenManager.isTokenValid();

// Tratamento padronizado de erros
import { errorHandler } from '@/services/apiMainService/utils';
const apiError = errorHandler.handleApiError(error);
console.log(apiError.code, apiError.message);
```

## Exemplos de Migração

### Exemplo 1: Listagem de Recursos

#### Antes:

```typescript
const fetchItems = async () => {
  try {
    const response = await apiService.get('/items', { page: 1, limit: 10 });
    setItems(response.data.results);
    setTotalItems(response.data.count);
  } catch (error) {
    console.error('Erro ao carregar itens:', error);
    showToast('error', 'Erro ao carregar itens');
  }
};
```

## Recomendações de Migração

### Abordagem Gradual

Recomendamos uma abordagem gradual para a migração:

1. **Módulo por módulo**: Migre um módulo funcional de cada vez
2. **Serviços de nível superior primeiro**: Comece migrando os serviços mais abstratos
3. **Testes antes e depois**: Realize testes após cada migração para garantir que tudo continue funcionando

### Estratégia para Projetos em Produção

Para projetos em produção, sugerimos:

1. **Branch separado**: Crie um branch específico para a migração
2. **Coexistência temporária**: Mantenha os dois serviços temporariamente enquanto migra gradualmente
3. **Testes A/B**: Compare o comportamento entre o serviço antigo e o novo
4. **Período de deprecação**: Marque o serviço antigo como deprecado e remova após concluir a migração

### Compatibilidade

O novo `ApiMainService` foi projetado para ser largamente compatível com o `ApiService` original, com algumas melhorias:

- Mantém a mesma API pública para os métodos mais utilizados
- Melhora o sistema de tipos para TypeScript
- Adiciona funcionalidades sem quebrar código existente

## Problemas Comuns na Migração

### Problema: Erros de tipo ao usar `error.code`

**Solução**: Importe e use os tipos do novo serviço:

```typescript
import { errorHandler } from '@/services/apiMainService/utils';
import type { ApiError } from '@/services/apiMainService/utils/errorHandler';

try {
  // Código...
} catch (error) {
  const apiError = error as ApiError;
  // Ou
  const apiError = errorHandler.handleApiError(error);
  
  console.log(apiError.code);
}
```

### Problema: Depender de `response.data` diretamente

**Solução**: Os métodos do novo serviço já retornam `response.data`, não há necessidade de acessar `.data`:

```typescript
// Antes
const data = await apiService.get('/endpoint').data;

// Depois
const data = await apiService.get('/endpoint');
```

### Problema: Método `request` genérico não existente

**Solução**: Use os métodos específicos:

```typescript
// Antes
await apiService.request({ method: 'GET', url: '/endpoint' });

// Depois
await apiService.get('/endpoint');
```

## Suporte e Recursos Adicionais

Para questões relacionadas à migração, por favor:

1. Consulte a documentação completa do `ApiMainService`
2. Revise os exemplos no diretório de exemplos
3. Abra uma issue no repositório com a tag "migração"

## Conclusão

Migrar para o novo `ApiMainService` proporciona uma base mais sólida para o desenvolvimento de sua aplicação, com melhor organização do código, tratamento de erros mais robusto e código mais testável. Recomendamos fortemente a migração, seguindo uma abordagem gradual e cuidadosa.

```
#### Depois:

```typescript
const fetchItems = async () => {
  try {
    const response = await apiService.getPaginated('/items', { page: 1, limit: 10 });
    setItems(response.results);
    setTotalItems(response.count);
  } catch (error) {
    console.error(`Erro ao carregar itens [${error.code}]:`, error.message);
    showToast('error', error.message);
  }
};
```

### Exemplo 2: Upload de Arquivo

#### Antes:

```typescript
const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    await apiService.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    showToast('success', 'Arquivo enviado com sucesso');
  } catch (error) {
    console.error('Erro ao enviar arquivo:', error);
    showToast('error', 'Erro ao enviar arquivo');
  }
};
```

#### Depois:

```typescript
const uploadFile = async (file) => {
  try {
    await apiService.uploadFile(
      '/upload', 
      file, 
      (progress) => setUploadProgress(progress)
    );
    
    showToast('success', 'Arquivo enviado com sucesso');
  } catch (error) {
    console.error('Erro ao enviar arquivo:', error.message);
    showToast('error', error.message);
  }
};
```

### Exemplo 3: Autenticação

#### Antes:

```typescript
const login = async (credentials) => {
  try {
    const response = await apiService.post('/auth/login', credentials);
    const { access, refresh } = response.data;
    
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    apiService.setHeaders({
      Authorization: `Bearer ${access}`
    });
    
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};
```

#### Depois:

```typescript
import { tokenManager } from '@/services/apiMainService/auth';

const login = async (credentials) => {
  try {
    const response = await apiService.post('/auth/login', credentials);
    const { access, refresh, user } = response;
    
    // O tokenManager cuida do armazenamento e configuração dos headers
    tokenManager.setAccessToken(access);
    tokenManager.setRefreshToken(refresh);
    
    return response;
  } catch (error) {
    console.error(`Erro ao fazer login [${error.code}]:`, error.message);
    throw error;
  }
};
```