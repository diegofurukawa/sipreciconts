#!/bin/bash

# Script para reorganizar a estrutura do frontend
# Execute este script da raiz do projeto

echo "Iniciando reorganização da estrutura do frontend..."

# Diretório base do frontend
FRONTEND_DIR="../frontend"
SRC_DIR="$FRONTEND_DIR/src"

# Criar backup antes de começar
BACKUP_DIR="../frontend_backup_$(date +%Y%m%d_%H%M%S)"
echo "Criando backup em $BACKUP_DIR..."
cp -r $FRONTEND_DIR $BACKUP_DIR

# Lista de diretórios antigos a serem removidos depois da migração
OLD_DIRS=(
  "$SRC_DIR/pages/Login"
  "$SRC_DIR/components/ui/accordion"
  "$SRC_DIR/components/ui/alert-dialog"
  "$SRC_DIR/components/ui/simplealert"
  "$SRC_DIR/components/ui/table-pagination"
  "$SRC_DIR/components/ui/toast"
  "$SRC_DIR/services/api/modules"
)

# Criar diretórios necessários
echo "Criando diretórios da nova estrutura..."

# Estrutura principal
mkdir -p $SRC_DIR/assets/images
mkdir -p $SRC_DIR/assets/styles
mkdir -p $SRC_DIR/components/common
mkdir -p $SRC_DIR/components/feedback
mkdir -p $SRC_DIR/components/ui
mkdir -p $SRC_DIR/config
mkdir -p $SRC_DIR/contexts
mkdir -p $SRC_DIR/core/auth
mkdir -p $SRC_DIR/hooks
mkdir -p $SRC_DIR/layouts/AuthLayout
mkdir -p $SRC_DIR/layouts/MainLayout
mkdir -p $SRC_DIR/types
mkdir -p $SRC_DIR/utils
mkdir -p $SRC_DIR/services/api
mkdir -p $SRC_DIR/services/modules

# Estrutura de páginas
mkdir -p $SRC_DIR/pages/Auth/components
mkdir -p $SRC_DIR/pages/Auth/hooks
mkdir -p $SRC_DIR/pages/Company/components
mkdir -p $SRC_DIR/pages/Company/hooks
mkdir -p $SRC_DIR/pages/Company/types
mkdir -p $SRC_DIR/pages/Customer/components
mkdir -p $SRC_DIR/pages/Customer/hooks
mkdir -p $SRC_DIR/pages/Customer/types
mkdir -p $SRC_DIR/pages/Supply/components
mkdir -p $SRC_DIR/pages/Supply/hooks
mkdir -p $SRC_DIR/pages/Tax/components
mkdir -p $SRC_DIR/pages/Tax/hooks

echo "Diretórios criados com sucesso!"

# Função para mover arquivos com verificação
move_file() {
  local src="$1"
  local dest="$2"
  
  if [ -f "$src" ]; then
    echo "Movendo $src para $dest"
    # Cria o diretório de destino se não existir
    mkdir -p "$(dirname "$dest")"
    # Move o arquivo
    mv "$src" "$dest"
  fi
}

# Função para mover diretórios inteiros
move_dir_contents() {
  local src="$1"
  local dest="$2"
  
  if [ -d "$src" ] && [ "$(ls -A "$src" 2>/dev/null)" ]; then
    echo "Movendo conteúdo de $src para $dest"
    # Cria o diretório de destino se não existir
    mkdir -p "$dest"
    # Move o conteúdo (não o diretório em si)
    mv "$src"/* "$dest"/ 2>/dev/null || true
  fi
}

# Mover componentes UI
echo "Migrando componentes UI..."
move_dir_contents "$SRC_DIR/components/ui" "$SRC_DIR/components/ui"

# Mover contextos
echo "Migrando contextos..."
move_file "$SRC_DIR/contexts/AuthContext.tsx" "$SRC_DIR/contexts/AuthContext.tsx"
move_file "$SRC_DIR/contexts/CompanyContext.tsx" "$SRC_DIR/contexts/CompanyContext.tsx"
move_file "$SRC_DIR/contexts/ToastContext.tsx" "$SRC_DIR/contexts/ToastContext.tsx"

# Mover core auth
echo "Migrando core auth..."
move_dir_contents "$SRC_DIR/core/auth" "$SRC_DIR/core/auth"

# Mover utilitários
echo "Migrando utilitários..."
move_file "$SRC_DIR/utils/date.ts" "$SRC_DIR/utils/date.ts"

# Mover tipos
echo "Migrando tipos..."
move_file "$SRC_DIR/types/api.types.ts" "$SRC_DIR/types/api.types.ts"

# Mover serviços
echo "Migrando serviços API..."
move_dir_contents "$SRC_DIR/services/api" "$SRC_DIR/services/api"

# Migrar módulos específicos

# Migrar Login para Auth
echo "Migrando Login para Auth..."
if [ -d "$SRC_DIR/pages/Login" ]; then
  # Mover componentes
  move_dir_contents "$SRC_DIR/pages/Login/components" "$SRC_DIR/pages/Auth/components"
  
  # Mover hooks
  move_dir_contents "$SRC_DIR/pages/Login/hooks" "$SRC_DIR/pages/Auth/hooks"
  
  # Mover arquivo principal
  move_file "$SRC_DIR/pages/Login/index.tsx" "$SRC_DIR/pages/Auth/index.tsx"
fi

# Migrar Company
echo "Migrando Company..."
if [ -d "$SRC_DIR/pages/Company" ]; then
  # Mover componentes
  move_dir_contents "$SRC_DIR/pages/Company/components" "$SRC_DIR/pages/Company/components"
  
  # Mover hooks
  move_dir_contents "$SRC_DIR/pages/Company/hooks" "$SRC_DIR/pages/Company/hooks"
  
  # Mover tipos
  move_dir_contents "$SRC_DIR/pages/Company/types" "$SRC_DIR/pages/Company/types"
fi

# Migrar Customer
echo "Migrando Customer..."
if [ -d "$SRC_DIR/pages/Customer" ]; then
  # Mover componentes
  move_dir_contents "$SRC_DIR/pages/Customer/components" "$SRC_DIR/pages/Customer/components"
  
  # Mover hooks
  move_dir_contents "$SRC_DIR/pages/Customer/hooks" "$SRC_DIR/pages/Customer/hooks"
  
  # Mover tipos
  move_dir_contents "$SRC_DIR/pages/Customer/types" "$SRC_DIR/pages/Customer/types"
  
  # Garantir arquivo index
  if [ ! -f "$SRC_DIR/pages/Customer/index.tsx" ] && [ -f "$SRC_DIR/pages/Customer/index.tsx" ]; then
    move_file "$SRC_DIR/pages/Customer/index.tsx" "$SRC_DIR/pages/Customer/index.tsx"
  fi
fi

# Migrar Supply
echo "Migrando Supply..."
if [ -d "$SRC_DIR/pages/Supply" ]; then
  # Mover arquivos individuais se existirem
  move_file "$SRC_DIR/pages/Supply/SupplyForm.tsx" "$SRC_DIR/pages/Supply/components/SupplyForm.tsx"
  move_file "$SRC_DIR/pages/Supply/SupplyList.tsx" "$SRC_DIR/pages/Supply/components/SupplyList.tsx"
  move_file "$SRC_DIR/pages/Supply/SupplyHeader.tsx" "$SRC_DIR/pages/Supply/components/SupplyHeader.tsx"
  
  # Mover o index
  move_file "$SRC_DIR/pages/Supply/index.tsx" "$SRC_DIR/pages/Supply/index.tsx"
  
  # Mover diretório de componentes se existir
  move_dir_contents "$SRC_DIR/pages/Supply/components" "$SRC_DIR/pages/Supply/components"
  
  # Mover diretório de hooks se existir
  move_dir_contents "$SRC_DIR/pages/Supply/hooks" "$SRC_DIR/pages/Supply/hooks"
fi

# Migrar Tax
echo "Migrando Tax..."
if [ -d "$SRC_DIR/pages/Tax" ]; then
  # Mover componentes
  move_file "$SRC_DIR/pages/Tax/TaxForm.tsx" "$SRC_DIR/pages/Tax/components/TaxForm.tsx"
  move_file "$SRC_DIR/pages/Tax/TaxList.tsx" "$SRC_DIR/pages/Tax/components/TaxList.tsx"
  
  # Criar arquivo index se não existir
  if [ ! -f "$SRC_DIR/pages/Tax/index.tsx" ]; then
    echo "import { TaxList } from './components/TaxList';

export default function TaxPage() {
  return <TaxList />;
}" > $SRC_DIR/pages/Tax/index.tsx
  fi
fi

# Mover módulos de serviço
echo "Migrando módulos de serviço..."
move_file "$SRC_DIR/services/api/modules/auth.ts" "$SRC_DIR/services/modules/auth.ts"
move_file "$SRC_DIR/services/api/modules/company.ts" "$SRC_DIR/services/modules/company.ts"
move_file "$SRC_DIR/services/api/modules/customer.ts" "$SRC_DIR/services/modules/customer.ts"
move_file "$SRC_DIR/services/api/modules/tax.ts" "$SRC_DIR/services/modules/tax.ts"

# Remover diretórios antigos agora que tudo foi migrado
echo "Removendo diretórios antigos..."
for dir in "${OLD_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    # Verificar se o diretório está vazio antes de remover
    if [ -z "$(ls -A "$dir" 2>/dev/null)" ]; then
      echo "Removendo diretório vazio: $dir"
      rmdir "$dir" 2>/dev/null || true
    else
      echo "Atenção: $dir ainda contém arquivos. Talvez tenha havido uma migração parcial."
    fi
  fi
done

# Procurar e remover diretórios vazios recursivamente
echo "Removendo diretórios vazios recursivamente..."
find $SRC_DIR -type d -empty -delete 2>/dev/null || true

echo "Reorganização concluída!"
echo "Um backup do estado original foi criado em: $BACKUP_DIR"
echo "Você precisará ajustar manualmente as importações em seus arquivos."
echo "Sugestão: Use uma ferramenta como o VSCode para encontrar/substituir importações."