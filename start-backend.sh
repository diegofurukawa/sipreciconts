#!/bin/bash
# Wrapper para executar o script da pasta scripts
cd "$(dirname "$0")"
./scripts/start-backend.sh "$@"
