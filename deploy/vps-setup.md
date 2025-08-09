# Configuração do VPS WeaveCode

## Especificações Recomendadas

### Hetzner Cloud (Recomendado)
- **Plano**: CX21 (2 vCPU, 8GB RAM, 80GB SSD)
- **Preço**: ~£20-25/mês
- **Localização**: Frankfurt (FSN1) ou Nuremberg (NBG1)
- **Rede**: 20TB transferência

### Alternativas
- **Contabo**: VPS M (2 vCPU, 8GB RAM, 200GB SSD) - ~£15/mês
- **OVH**: VPS SSD 2 (2 vCPU, 8GB RAM, 80GB SSD) - ~£18/mês

## Configuração Inicial

### 1. Acesso SSH
```bash
# Conectar ao VPS
ssh root@YOUR_VPS_IP

# Criar usuário não-root
adduser weavecode
usermod -aG sudo weavecode

# Configurar SSH key
mkdir -p /home/weavecode/.ssh
cp ~/.ssh/authorized_keys /home/weavecode/.ssh/
chown -R weavecode:weavecode /home/weavecode/.ssh
chmod 700 /home/weavecode/.ssh
chmod 600 /home/weavecode/.ssh/authorized_keys

# Desabilitar login root
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl restart sshd
```

### 2. Instalar Dependências
```bash
# Atualizar sistema
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker weavecode

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Instalar Caddy
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install caddy

# Instalar ferramentas úteis
apt install -y htop nginx-full certbot python3-certbot-nginx fail2ban ufw
```

### 3. Configurar Firewall
```bash
# UFW
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow 4000
ufw enable

# Fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

### 4. Configurar Caddy
```bash
# Criar diretórios
mkdir -p /var/www/frontend
mkdir -p /var/log/caddy
chown -R weavecode:weavecode /var/www/frontend
chown -R weavecode:weavecode /var/log/caddy

# Copiar Caddyfile
cp /opt/weavecode/deploy/caddy/Caddyfile /etc/caddy/Caddyfile

# Configurar serviço
systemctl enable caddy
systemctl start caddy
```

### 5. Configurar PostgreSQL
```bash
# Criar diretório de dados
mkdir -p /var/lib/postgresql/data
chown -R 999:999 /var/lib/postgresql/data

# Criar diretório de backups
mkdir -p /opt/weavecode/backups
chown -R weavecode:weavecode /opt/weavecode/backups
```

## Variáveis de Ambiente

### GitHub Secrets
Configure no repositório GitHub:
- `VPS_HOST`: IP do seu VPS
- `VPS_USER`: usuário (weavecode)
- `VPS_SSH_KEY`: chave SSH privada
- `VPS_PORT`: porta SSH (22)

### .env do Backend
```bash
# Produção
NODE_ENV=production
PORT=4000
JWT_SECRET=SUA_CHAVE_SUPER_SECRETA_AQUI
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/weavecode
STRIPE_SECRET_KEY=sk_live_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
SENDGRID_API_KEY=...
```

## Deploy

### 1. Primeiro Deploy
```bash
# No VPS
cd /opt/weavecode
git clone https://github.com/WeaveCode-UK/weavecode.git .
chown -R weavecode:weavecode .

# Configurar .env
cp backend/.env.example backend/.env
# Editar backend/.env com valores de produção

# Subir serviços
docker-compose up -d

# Aplicar migrações
docker-compose exec backend npx prisma migrate deploy
```

### 2. Deploy Automático
Após configurar os secrets do GitHub, cada push para `main` disparará o deploy automático.

## Monitoramento

### Scripts de Manutenção
```bash
# Backup manual
./scripts/backup-postgres.ps1

# Health check
./scripts/health-check.ps1

# Logs
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f caddy
```

### Logs do Sistema
```bash
# Caddy
journalctl -u caddy -f

# Docker
docker system df
docker stats

# Sistema
htop
df -h
free -h
```

## Backup e Recuperação

### Backup Automático
```bash
# Cron job para backup diário
crontab -e

# Adicionar linha:
0 2 * * * /opt/weavecode/scripts/backup-postgres.ps1 >> /var/log/backup.log 2>&1
```

### Recuperação
```bash
# Restaurar backup
docker exec -i weavecode-postgres psql -U postgres -d weavecode < backup_YYYYMMDD_HHMMSS.sql
```

## Segurança

### SSL/TLS
- Caddy gerencia automaticamente certificados Let's Encrypt
- Renovação automática a cada 60 dias

### Atualizações
```bash
# Atualizar sistema
apt update && apt upgrade -y

# Atualizar Docker
docker system prune -a
docker-compose pull
docker-compose up -d
```

## Custos Estimados

### VPS Hetzner CX21
- **Mensal**: £20-25
- **Anual**: £240-300

### Domínio
- **weavecode.co.uk**: ~£10-15/ano

### Total Estimado
- **Mensal**: £25-30
- **Anual**: £300-360

## Suporte

Para problemas técnicos:
1. Verificar logs: `docker-compose logs -f [serviço]`
2. Health check: `./scripts/health-check.ps1`
3. Restart serviços: `docker-compose restart`
4. Backup antes de mudanças críticas
