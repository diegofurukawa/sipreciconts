#!/bin/bash

# Script para reorganizar os arquivos .sh para uma pasta scripts
# Executar a partir da raiz do projeto

echo "===== Reorganizando scripts .sh para pasta scripts ====="

# Criar pasta scripts se não existir
mkdir -p scripts

# Lista de scripts para mover
SCRIPTS=(
  "find_in_files.sh"
  "reorganize_frontend.sh"
  "script_backup.sh"
  "script_backup_backend.sh"
  "script_backup_frontend.sh"
  "setup-backend.sh"
  "sipreciconts_start.sh"
  "start-backend.sh"
  "start-frontend.sh"
)

# Mover cada script para a pasta scripts
for script in "${SCRIPTS[@]}"; do
  if [ -f "$script" ]; then
    echo "Movendo $script para pasta scripts/"
    mv "$script" "scripts/"
  else
    echo "Aviso: $script não encontrado na raiz do projeto"
  fi
done

# Criar scripts wrapper na raiz que chamam os scripts na pasta scripts
echo "Criando scripts wrapper na raiz..."

# Wrapper para start-backend.sh
cat > start-backend.sh << 'EOF'
#!/bin/bash
# Wrapper para executar o script da pasta scripts
cd "$(dirname "$0")"
./scripts/start-backend.sh "$@"
EOF
chmod +x start-backend.sh

# Wrapper para start-frontend.sh
cat > start-frontend.sh << 'EOF'
#!/bin/bash
# Wrapper para executar o script da pasta scripts
cd "$(dirname "$0")"
./scripts/start-frontend.sh "$@"
EOF
chmod +x start-frontend.sh

# Wrapper para setup-backend.sh
cat > setup-backend.sh << 'EOF'
#!/bin/bash
# Wrapper para executar o script da pasta scripts
cd "$(dirname "$0")"
./scripts/setup-backend.sh "$@"
EOF
chmod +x setup-backend.sh

echo "===== Ajustando caminhos nos scripts movidos ====="

# Atualizar caminhos no start-backend.sh
sed -i 's|cd backend|cd ../backend|g' scripts/start-backend.sh
sed -i 's|../Logs/backend.log|../../Logs/backend.log|g' scripts/start-backend.sh

# Atualizar caminhos no start-frontend.sh
sed -i 's|cd frontend|cd ../frontend|g' scripts/start-frontend.sh
sed -i 's|../Logs/frontend.log|../../Logs/frontend.log|g' scripts/start-frontend.sh

# Atualizar caminhos para backups (ajustar os caminhos para considerar que agora estamos executando a partir da pasta scripts)
sed -i 's|BACKUP_DIR="$HOME/GitHub/sipreciconts/backup|BACKUP_DIR="$HOME/GitHub/sipreciconts/backup|g' scripts/script_backup.sh
sed -i 's|BACKUP_DIR="$HOME/GitHub/sipreciconts/backup|BACKUP_DIR="$HOME/GitHub/sipreciconts/backup|g' scripts/script_backup_backend.sh
sed -i 's|BACKUP_DIR="$HOME/GitHub/sipreciconts/backup|BACKUP_DIR="$HOME/GitHub/sipreciconts/backup|g' scripts/script_backup_frontend.sh

# Atualizar script reorganize_frontend.sh
sed -i 's|FRONTEND_DIR="./frontend"|FRONTEND_DIR="../frontend"|g' scripts/reorganize_frontend.sh
sed -i 's|BACKUP_DIR="./frontend_backup|BACKUP_DIR="../frontend_backup|g' scripts/reorganize_frontend.sh

# Criar wrapper runscript.sh na raiz para executar qualquer script da pasta scripts
cat > runscript.sh << 'EOF'
#!/bin/bash
# Script auxiliar para executar scripts da pasta scripts

if [ $# -eq 0 ]; then
  echo "Uso: ./runscript.sh <nome_do_script> [argumentos]"
  echo "Scripts disponíveis:"
  ls -1 scripts/*.sh | sed 's|scripts/||'
  exit 1
fi

SCRIPT="$1"
shift  # Remove o primeiro argumento

if [ -f "scripts/$SCRIPT" ]; then
  cd "$(dirname "$0")"
  ./scripts/$SCRIPT "$@"
else
  echo "Erro: Script '$SCRIPT' não encontrado na pasta scripts/"
  echo "Scripts disponíveis:"
  ls -1 scripts/*.sh | sed 's|scripts/||'
  exit 1
fi
EOF
chmod +x runscript.sh

echo "===== Reorganização concluída ====="
echo "Scripts foram movidos para a pasta scripts/"
echo "Wrappers foram criados na raiz para start-backend.sh, start-frontend.sh e setup-backend.sh"
echo "Use ./runscript.sh <nome_do_script> para executar outros scripts"