#!/bin/bash

# WeaveCode VPS Setup Script
# Configuração automática da VPS Hetzner para o projeto WeaveCode

set -e  # Para em caso de erro

echo "🚀 Iniciando configuração da VPS WeaveCode..."

# Atualizar sistema
echo "📦 Atualizando sistema..."
apt update && apt upgrade -y

# Instalar dependências básicas
echo "🔧 Instalando dependências básicas..."
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Instalar Docker
echo "🐳 Instalando Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Adicionar usuário ao grupo docker
usermod -aG docker $USER

# Instalar Docker Compose standalone (backup)
echo "📋 Instalando Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Instalar Caddy
echo "🌐 Instalando Caddy..."
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install -y caddy

# Configurar firewall UFW
echo "🔥 Configurando firewall..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp

# Criar diretórios do projeto
echo "📁 Criando estrutura de diretórios..."
mkdir -p /opt/weavecode
mkdir -p /opt/weavecode/backups
mkdir -p /opt/weavecode/logs
mkdir -p /opt/weavecode/ssl

# Configurar Caddy
echo "⚙️ Configurando Caddy..."
cat > /etc/caddy/Caddyfile << 'EOF'
# WeaveCode Caddy Configuration
# Substitua 'seu-dominio.com' pelo seu domínio real

# HTTP -> HTTPS redirect
:80 {
    redir https://{host}{uri} permanent
}

# HTTPS configuration
:443 {
    # Substitua pelo seu domínio
    # tls seu-email@weavecode.co.uk
    
    # Reverse proxy para o backend
    reverse_proxy localhost:4000 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }
    
    # Logs
    log {
        output file /var/log/caddy/weavecode.log
        format json
    }
}

# Health check endpoint
:4000/health {
    respond "OK" 200
}
EOF

# Habilitar e iniciar Caddy
systemctl enable caddy
systemctl start caddy

# Configurar PostgreSQL
echo "🐘 Configurando PostgreSQL..."
mkdir -p /opt/weavecode/postgres
mkdir -p /opt/weavecode/postgres/data
mkdir -p /opt/weavecode/postgres/backups

# Criar usuário para o projeto
useradd -r -s /bin/false weavecode
chown -R weavecode:weavecode /opt/weavecode

# Configurar variáveis de ambiente
echo "🔐 Configurando variáveis de ambiente..."
cat > /opt/weavecode/.env << 'EOF'
# WeaveCode Environment Variables
NODE_ENV=production
PORT=4000
JWT_SECRET=CHANGE_THIS_IN_PRODUCTION
DATABASE_URL=postgresql://weavecode:weavecode123@localhost:5432/weavecode
STRIPE_SECRET_KEY=your_stripe_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
SENDGRID_API_KEY=your_sendgrid_api_key
CHATWOOT_API_KEY=your_chatwoot_api_key
EOF

# Configurar backup automático
echo "💾 Configurando backup automático..."
cat > /etc/cron.daily/weavecode-backup << 'EOF'
#!/bin/bash
# Backup diário do WeaveCode
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/weavecode/backups"
LOG_FILE="/opt/weavecode/logs/backup.log"

echo "$(date): Iniciando backup..." >> $LOG_FILE

# Backup do PostgreSQL (só se estiver rodando)
if docker ps | grep -q weavecode-postgres; then
    docker exec weavecode-postgres pg_dump -U weavecode weavecode > $BACKUP_DIR/postgres_$DATE.sql 2>> $LOG_FILE
else
    echo "$(date): PostgreSQL não está rodando, pulando backup..." >> $LOG_FILE
fi

# Backup dos arquivos de configuração
tar -czf $BACKUP_DIR/config_$DATE.tar.gz -C /opt/weavecode .env 2>> $LOG_FILE

# Limpar backups antigos (manter últimos 7 dias)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "$(date): Backup concluído" >> $LOG_FILE
EOF

chmod +x /etc/cron.daily/weavecode-backup

# Configurar monitoramento básico
echo "📊 Configurando monitoramento..."
cat > /opt/weavecode/health-check.sh << 'EOF'
#!/bin/bash
# Script de verificação de saúde dos serviços

LOG_FILE="/opt/weavecode/logs/health.log"
DATE=$(date)

echo "$DATE: Verificando saúde dos serviços..." >> $LOG_FILE

# Verificar Docker
if ! systemctl is-active --quiet docker; then
    echo "$DATE: ERRO: Docker não está rodando" >> $LOG_FILE
    systemctl restart docker
fi

# Verificar Caddy
if ! systemctl is-active --quiet caddy; then
    echo "$DATE: ERRO: Caddy não está rodando" >> $LOG_FILE
    systemctl restart caddy
fi

# Verificar PostgreSQL
if ! docker ps | grep -q weavecode-postgres; then
    echo "$DATE: ERRO: PostgreSQL não está rodando" >> $LOG_FILE
fi

# Verificar Backend
if ! curl -f http://localhost:4000/health > /dev/null 2>&1; then
    echo "$DATE: ERRO: Backend não está respondendo" >> $LOG_FILE
fi

echo "$DATE: Verificação concluída" >> $LOG_FILE
EOF

chmod +x /opt/weavecode/health-check.sh

# Adicionar ao crontab (verificar a cada 5 minutos)
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/weavecode/health-check.sh") | crontab -

# Configurar logrotate
echo "📝 Configurando rotação de logs..."
cat > /etc/logrotate.d/weavecode << 'EOF'
/opt/weavecode/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 weavecode weavecode
}
EOF

# Criar script de deploy
echo "🚀 Criando script de deploy..."
cat > /opt/weavecode/deploy.sh << 'EOF'
#!/bin/bash
# Script de deploy automático do WeaveCode

set -e

echo "🚀 Iniciando deploy do WeaveCode..."

cd /opt/weavecode

# Parar serviços
echo "⏹️ Parando serviços..."
docker-compose down

# Pull das imagens mais recentes
echo "📥 Baixando imagens mais recentes..."
docker-compose pull

# Iniciar serviços
echo "▶️ Iniciando serviços..."
docker-compose up -d

# Aguardar serviços ficarem prontos
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 30

# Verificar saúde
echo "🔍 Verificando saúde dos serviços..."
./health-check.sh

echo "✅ Deploy concluído com sucesso!"
EOF

chmod +x /opt/weavecode/deploy.sh

# Configurar permissões
chown -R weavecode:weavecode /opt/weavecode
chmod -R 755 /opt/weavecode

echo "🎉 Configuração da VPS concluída com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure seu domínio no Caddyfile"
echo "2. Ajuste as variáveis de ambiente em /opt/weavecode/.env"
echo "3. Execute o deploy inicial: cd /opt/weavecode && ./deploy.sh"
echo ""
echo "🔐 Credenciais padrão:"
echo "PostgreSQL: weavecode/weavecode123"
echo "Usuário sistema: weavecode"
echo ""
echo "📁 Diretórios criados:"
echo "- /opt/weavecode (projeto principal)"
echo "- /opt/weavecode/backups (backups automáticos)"
echo "- /opt/weavecode/logs (logs do sistema)"
echo "- /opt/weavecode/ssl (certificados SSL)"
echo ""
echo "🚀 VPS configurada e pronta para o deploy!"
