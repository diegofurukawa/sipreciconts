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
