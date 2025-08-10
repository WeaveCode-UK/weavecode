#!/bin/bash

# WeaveCode PostgreSQL Backup Script
# Script de backup automático com rotação

set -e

# Configurações
BACKUP_DIR="/opt/weavecode/backups"
LOG_FILE="/opt/weavecode/logs/backup.log"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função de log
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Função de erro
error() {
    log "❌ ERRO: $1"
    exit 1
}

# Função de sucesso
success() {
    log "✅ $1"
}

# Verificar se o diretório de backup existe
if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    success "Diretório de backup criado: $BACKUP_DIR"
fi

# Verificar se o diretório de logs existe
if [ ! -d "$(dirname "$LOG_FILE")" ]; then
    mkdir -p "$(dirname "$LOG_FILE")"
    success "Diretório de logs criado: $(dirname "$LOG_FILE")"
fi

log "🚀 Iniciando backup do PostgreSQL..."

# Verificar se o PostgreSQL está rodando
if ! docker ps | grep -q weavecode-postgres; then
    error "PostgreSQL não está rodando. Verifique o status do Docker."
fi

# Nome do arquivo de backup
BACKUP_FILE="postgres_$DATE.sql"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILE"

# Criar backup
log "📥 Criando backup: $BACKUP_FILE"

if docker exec weavecode-postgres pg_dump -U weavecode weavecode > "$BACKUP_PATH" 2>> "$LOG_FILE"; then
    success "Backup criado com sucesso: $BACKUP_FILE"
    
    # Verificar tamanho do backup
    BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
    log "📊 Tamanho do backup: $BACKUP_SIZE"
    
    # Comprimir backup (opcional)
    if command -v gzip > /dev/null; then
        log "🗜️ Comprimindo backup..."
        gzip "$BACKUP_PATH"
        BACKUP_PATH="$BACKUP_PATH.gz"
        COMPRESSED_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
        log "📊 Tamanho comprimido: $COMPRESSED_SIZE"
    fi
    
else
    error "Falha ao criar backup. Verifique os logs: $LOG_FILE"
fi

# Backup das configurações
log "⚙️ Fazendo backup das configurações..."
CONFIG_BACKUP="config_$DATE.tar.gz"
CONFIG_PATH="$BACKUP_DIR/$CONFIG_BACKUP"

if tar -czf "$CONFIG_PATH" -C /opt/weavecode .env 2>> "$LOG_FILE"; then
    success "Backup de configurações criado: $CONFIG_BACKUP"
else
    log "⚠️ Aviso: Falha ao criar backup de configurações"
fi

# Limpar backups antigos
log "🧹 Limpando backups antigos (mais de $RETENTION_DAYS dias)..."

# Contar backups antes da limpeza
BACKUPS_BEFORE=$(find "$BACKUP_DIR" -name "*.sql*" -o -name "*.tar.gz" | wc -l)

# Remover backups antigos
find "$BACKUP_DIR" -name "*.sql*" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true

# Contar backups após a limpeza
BACKUPS_AFTER=$(find "$BACKUP_DIR" -name "*.sql*" -o -name "*.tar.gz" | wc -l)
BACKUPS_REMOVED=$((BACKUPS_BEFORE - BACKUPS_AFTER))

if [ $BACKUPS_REMOVED -gt 0 ]; then
    success "Removidos $BACKUPS_REMOVED backups antigos"
else
    log "ℹ️ Nenhum backup antigo removido"
fi

# Verificar espaço em disco
DISK_USAGE=$(df -h "$BACKUP_DIR" | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
    log "⚠️ ATENÇÃO: Uso de disco alto: ${DISK_USAGE}%"
fi

# Listar backups atuais
log "📋 Backups disponíveis:"
ls -lah "$BACKUP_DIR"/*.sql* "$BACKUP_DIR"/*.tar.gz 2>/dev/null | while read -r line; do
    log "   $line"
done || log "   Nenhum backup encontrado"

# Estatísticas finais
TOTAL_BACKUPS=$(find "$BACKUP_DIR" -name "*.sql*" -o -name "*.tar.gz" | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)

log "📊 Estatísticas finais:"
log "   Total de backups: $TOTAL_BACKUPS"
log "   Tamanho total: $TOTAL_SIZE"
log "   Retenção: $RETENTION_DAYS dias"

# Verificar integridade do backup (opcional)
if command -v gzip > /dev/null && [[ "$BACKUP_PATH" == *.gz ]]; then
    log "🔍 Verificando integridade do backup..."
    if gzip -t "$BACKUP_PATH" 2>/dev/null; then
        success "Backup comprimido é válido"
    else
        error "Backup comprimido está corrompido!"
    fi
fi

success "Backup concluído com sucesso!"
log "🎉 Processo de backup finalizado em $(date '+%Y-%m-%d %H:%M:%S')"

# Retornar sucesso
exit 0
