# Guia de Instalação e Configuração - SiPreciConts

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm (versão 9 ou superior)
- Git

## 1. Criação do Projeto

```bash
# Criar projeto com Vite
npm create vite@latest sipreciconts -- --template react-ts

# Entrar no diretório
cd sipreciconts
```

## 2. Instalação de Dependências

```bash
# Instalar dependências base
npm install

# Instalar dependências do projeto
npm install react-router-dom @radix-ui/react-alert-dialog axios react-hook-form lucide-react

# Instalar dependências de desenvolvimento
npm install -D tailwindcss postcss autoprefixer @types/node
```

## 3. Configuração do Tailwind CSS

```bash
# Inicializar Tailwind CSS
npx tailwindcss init -p
```

Criar/atualizar arquivo `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [],
}
```

## 4. Configuração do Projeto

### 4.1. Criar arquivo `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### 4.2. Atualizar `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4.3. Criar `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

## 5. Estrutura de Pastas

```bash
# Criar estrutura base de diretórios
mkdir -p src/{components,layouts,pages,services,types,utils}/{ui,Customer}
```

## 6. Executando o Projeto

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview do build
npm run preview
```

## 7. Configuração do Git

```bash
# Inicializar repositório
git init

# Criar .gitignore
cat > .gitignore << EOL
# Dependências
node_modules
.pnp
.pnp.js

# Produção
dist
build

# Ambiente
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor
.vscode
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Sistema
.DS_Store
Thumbs.db
EOL

# Commit inicial
git add .
git commit -m "Configuração inicial do projeto"
```

## 8. Scripts do package.json

Atualizar o `package.json` para incluir os scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\""
  }
}
```

## 9. Verificação de Instalação

Para verificar se tudo está funcionando corretamente:

1. Execute o projeto:
```bash
npm run dev
```

2. Acesse no navegador:
```
http://localhost:3000
```

## 10. Problemas Comuns

### 10.1. Erro de módulos não encontrados
```bash
npm install
```

### 10.2. Erro de tipos TypeScript
```bash
npm install -D @types/react @types/react-dom
```

### 10.3. Erro de CORS com o backend
Verificar a configuração da baseURL no arquivo de API e as configurações CORS do backend.

## 11. Próximos Passos

1. Configurar variáveis de ambiente
2. Configurar testes
3. Configurar CI/CD
4. Documentar componentes

Este guia deve ser suficiente para configurar o ambiente de desenvolvimento. Caso precise de ajuda com algum passo específico, me avise!