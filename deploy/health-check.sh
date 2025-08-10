#!/bin/bash

# WeaveCode Health Check Script
# Script de verificação de saúde dos serviços

set -e

# Configurações
LOG_FILE="/opt/weavecode/logs/health.log"
ALERT_LOG="/opt/weavecode/logs/alerts.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')
ALERT_THRESHOLD=3  # Número de falhas antes de alertar

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função de log
log() {
    echo "$DATE - $1" | tee -a "$LOG_FILE"
}

# Função de alerta
alert() {
    echo "$DATE - 🚨 ALERTA: $1" | tee -a "$ALERT_LOG"
}

# Função de sucesso
success() {
    echo -e "${GREEN}✅ $1${NC}"
    log "✅ $1"
}

# Função de erro
error() {
    echo -e "${RED}❌ $1${NC}"
    log "❌ $1"
}

# Função de aviso
warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
    log "⚠️ $1"
}

# Função de info
info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
    log "ℹ️ $1"
}

# Verificar se os diretórios existem
if [ ! -d "$(dirname "$LOG_FILE")" ]; then
    mkdir -p "$(dirname "$LOG_FILE")"
fi

if [ ! -d "$(dirname "$ALERT_LOG")" ]; then
    mkdir -p "$(dirname "$ALERT_LOG")"
fi

log "🔍 Iniciando verificação de saúde dos serviços..."

# Contadores
TOTAL_CHECKS=0
SUCCESS_CHECKS=0
FAILED_CHECKS=0

# Função para incrementar contadores
check_result() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if [ $1 -eq 0 ]; then
        SUCCESS_CHECKS=$((SUCCESS_CHECKS + 1))
    else
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

# 1. Verificar Docker
info "🐳 Verificando Docker..."
if systemctl is-active --quiet docker; then
    success "Docker está rodando"
    check_result 0
else
    error "Docker não está rodando"
    systemctl restart docker
    check_result 1
    alert "Docker parou e foi reiniciado"
fi

# 2. Verificar Caddy
info "🌐 Verificando Caddy..."
if systemctl is-active --quiet caddy; then
    success "Caddy está rodando"
    check_result 0
else
    error "Caddy não está rodando"
    systemctl restart caddy
    check_result 1
    alert "Caddy parou e foi reiniciado"
fi

# 3. Verificar PostgreSQL
info "🐘 Verificando PostgreSQL..."
if docker ps | grep -q weavecode-postgres; then
    # Verificar se está respondendo
    if docker exec weavecode-postgres pg_isready -U weavecode -d weavecode > /dev/null 2>&1; then
        success "PostgreSQL está rodando e respondendo"
        check_result 0
    else
        error "PostgreSQL não está respondendo"
        check_result 1
        alert "PostgreSQL não está respondendo"
    fi
else
    error "PostgreSQL não está rodando"
    check_result 1
    alert "PostgreSQL parou"
fi

# 4. Verificar Redis
info "🔴 Verificando Redis..."
if docker ps | grep -q weavecode-redis; then
    # Verificar se está respondendo
    if docker exec weavecode-redis redis-cli --raw incr ping > /dev/null 2>&1; then
        success "Redis está rodando e respondendo"
        check_result 0
    else
        error "Redis não está respondendo"
        check_result 1
        alert "Redis não está respondendo"
    fi
else
    error "Redis não está rodando"
    check_result 1
    alert "Redis parou"
fi

# 5. Verificar Backend
info "⚙️ Verificando Backend..."
if docker ps | grep -q weavecode-backend; then
    # Verificar se está respondendo
    if curl -f http://localhost:4000/health > /dev/null 2>&1; then
        success "Backend está rodando e respondendo"
        check_result 0
        
        # Verificar tempo de resposta
        RESPONSE_TIME=$(curl -w "%{time_total}" -s -o /dev/null http://localhost:4000/health)
        if (( $(echo "$RESPONSE_TIME > 2.0" | bc -l) )); then
            warning "Backend lento: ${RESPONSE_TIME}s"
        else
            info "Backend responsivo: ${RESPONSE_TIME}s"
        fi
    else
        error "Backend não está respondendo"
        check_result 1
        alert "Backend não está respondendo"
    fi
else
    error "Backend não está rodando"
    check_result 1
    alert "Backend parou"
fi

# 6. Verificar uso de recursos
info "💾 Verificando uso de recursos..."

# Uso de CPU
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
if (( $(echo "$CPU_USAGE > 80" | bc -l) )); then
    warning "CPU alto: ${CPU_USAGE}%"
    alert "CPU em uso alto: ${CPU_USAGE}%"
else
    info "CPU normal: ${CPU_USAGE}%"
fi

# Uso de memória
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
if (( $(echo "$MEMORY_USAGE > 80" | bc -l) )); then
    warning "Memória alta: ${MEMORY_USAGE}%"
    alert "Memória em uso alto: ${MEMORY_USAGE}%"
else
    info "Memória normal: ${MEMORY_USAGE}%"
fi

# Uso de disco
DISK_USAGE=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
    warning "Disco alto: ${DISK_USAGE}%"
    alert "Disco em uso alto: ${DISK_USAGE}%"
else
    info "Disco normal: ${DISK_USAGE}%"
fi

# 7. Verificar conectividade de rede
info "🌐 Verificando conectividade..."

# Testar conectividade externa
if ping -c 1 8.8.8.8 > /dev/null 2>&1; then
    success "Conectividade externa OK"
    check_result 0
else
    error "Sem conectividade externa"
    check_result 1
    alert "Sem conectividade externa"
fi

# Testar DNS
if nslookup google.com > /dev/null 2>&1; then
    success "DNS funcionando"
    check_result 0
else
    error "DNS não está funcionando"
    check_result 1
    alert "DNS não está funcionando"
fi

# 8. Verificar logs de erro
info "📝 Verificando logs de erro..."

# Verificar logs do Docker
DOCKER_ERRORS=$(docker logs --since 1h weavecode-backend 2>&1 | grep -i "error\|exception\|fatal" | wc -l)
if [ "$DOCKER_ERRORS" -gt 0 ]; then
    warning "Encontrados $DOCKER_ERRORS erros nos logs do backend (última hora)"
fi

# Verificar logs do Caddy
CADDY_ERRORS=$(journalctl -u caddy --since "1 hour ago" | grep -i "error\|fatal" | wc -l)
if [ "$CADDY_ERRORS" -gt 0 ]; then
    warning "Encontrados $CADDY_ERRORS erros nos logs do Caddy (última hora)"
fi

# 9. Verificar backups
info "💾 Verificando backups..."
if [ -d "/opt/weavecode/backups" ]; then
    LATEST_BACKUP=$(find /opt/weavecode/backups -name "*.sql*" -o -name "*.tar.gz" -printf '%T@ %p\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2)
    
    if [ -n "$LATEST_BACKUP" ]; then
        BACKUP_AGE=$(( $(date +%s) - $(stat -c %Y "$LATEST_BACKUP") ))
        BACKUP_AGE_HOURS=$((BACKUP_AGE / 3600))
        
        if [ "$BACKUP_AGE_HOURS" -gt 24 ]; then
            warning "Último backup tem $BACKUP_AGE_HOURS horas"
            alert "Backup desatualizado: $BACKUP_AGE_HOURS horas"
        else
            success "Backup recente: $BACKUP_AGE_HOURS horas atrás"
        fi
        check_result 0
    else
        error "Nenhum backup encontrado"
        check_result 1
        alert "Nenhum backup encontrado"
    fi
else
    error "Diretório de backups não existe"
    check_result 1
fi

# 10. Verificar certificados SSL (se configurado)
info "🔒 Verificando certificados SSL..."
if [ -f "/etc/caddy/Caddyfile" ]; then
    if grep -q "tls" /etc/caddy/Caddyfile; then
        success "SSL configurado no Caddyfile"
        check_result 0
    else
        info "SSL não configurado (opcional)"
        check_result 0
    fi
else
    warning "Caddyfile não encontrado"
    check_result 1
fi

# Resumo final
echo ""
log "📊 RESUMO DA VERIFICAÇÃO:"
log "   Total de verificações: $TOTAL_CHECKS"
log "   Sucessos: $SUCCESS_CHECKS"
log "   Falhas: $FAILED_CHECKS"
log "   Taxa de sucesso: $(( (SUCCESS_CHECKS * 100) / TOTAL_CHECKS ))%"

# Determinar status geral
if [ $FAILED_CHECKS -eq 0 ]; then
    success "🎉 Todos os serviços estão funcionando perfeitamente!"
    STATUS="HEALTHY"
elif [ $FAILED_CHECKS -le 2 ]; then
    warning "⚠️ Alguns serviços têm problemas menores"
    STATUS="WARNING"
else
    error "🚨 Múltiplos serviços com problemas críticos!"
    STATUS="CRITICAL"
    alert "STATUS CRÍTICO: $FAILED_CHECKS serviços falharam"
fi

log "🏥 Status geral: $STATUS"

# Salvar status para monitoramento externo
echo "$STATUS" > /opt/weavecode/status.txt

# Verificar se precisa reiniciar serviços
if [ $FAILED_CHECKS -gt 0 ]; then
    log "🔄 Verificando se serviços precisam ser reiniciados..."
    
    # Reiniciar Docker se necessário
    if ! systemctl is-active --quiet docker; then
        log "🔄 Reiniciando Docker..."
        systemctl restart docker
    fi
    
    # Reiniciar Caddy se necessário
    if ! systemctl is-active --quiet caddy; then
        log "🔄 Reiniciando Caddy..."
        systemctl restart caddy
    fi
fi

log "🔍 Verificação de saúde concluída em $(date '+%Y-%m-%d %H:%M:%S')"

# Retornar código de saída baseado no status
if [ "$STATUS" = "HEALTHY" ]; then
    exit 0
elif [ "$STATUS" = "WARNING" ]; then
    exit 1
else
    exit 2
fi
