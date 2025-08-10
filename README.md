# 🚀 WeaveCode - Plataforma de Soluções Web

**Empresa**: WeaveCode  
**Email**: info@weavecode.co.uk  
**Stack**: Full-Stack Moderno com VPS

## 🏗️ Arquitetura

### Frontend
- **React.js** (Vite) - SPA moderna
- **JavaScript ES6+** - Código moderno
- **TailwindCSS** - Estilização utilitária
- **React Router** - Navegação SPA

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **JWT** - Autenticação segura
- **Bcrypt** - Hash de senhas
- **Prisma ORM** - Banco de dados

### Database
- **PostgreSQL** - Banco relacional robusto
- **Redis** - Cache e sessões
- **Prisma** - ORM moderno

### Infraestrutura
- **VPS Hetzner** - Hosting econômico
- **Docker** - Containerização
- **Caddy** - Reverse proxy + SSL automático
- **GitHub Actions** - CI/CD automático

## 🚀 Deploy na VPS

### Pré-requisitos
- ✅ VPS Hetzner CX32 configurada
- ✅ IP público da VPS
- ✅ Chave SSH configurada

### Configuração Rápida

1. **Conectar na VPS:**
```bash
ssh root@SEU_IP_DA_VPS
```

2. **Executar script de configuração:**
```bash
curl -fsSL https://raw.githubusercontent.com/SEU_USUARIO/weavecode/main/deploy/vps-setup.sh -o vps-setup.sh
chmod +x vps-setup.sh
./vps-setup.sh
```

3. **Configurar variáveis de ambiente:**
```bash
nano /opt/weavecode/.env
```

4. **Primeiro deploy:**
```bash
cd /opt/weavecode
./deploy.sh
```

### Scripts Disponíveis

- **`vps-setup.sh`** - Configuração automática da VPS
- **`health-check.sh`** - Monitoramento de saúde
- **`backup-postgres.sh`** - Backup automático do banco
- **`deploy.sh`** - Deploy automático

## 🔧 Configuração Local

### Instalação

```bash
# Clonar repositório
git clone https://github.com/SEU_USUARIO/weavecode.git
cd weavecode

# Frontend
cd frontend
npm install
npm run dev

# Backend
cd ../backend
npm install
npm run dev
```

### Variáveis de Ambiente

**Frontend** (`.env`):
```bash
VITE_API_URL=http://localhost:4000
VITE_STRIPE_PUBLISHABLE_KEY=sua_chave_stripe
```

**Backend** (`.env`):
```bash
NODE_ENV=development
PORT=4000
JWT_SECRET=sua_chave_jwt
DATABASE_URL=postgresql://weavecode:weavecode123@localhost:5432/weavecode
STRIPE_SECRET_KEY=sua_chave_stripe
PAYPAL_CLIENT_ID=seu_paypal_client_id
PAYPAL_CLIENT_SECRET=seu_paypal_client_secret
SENDGRID_API_KEY=sua_chave_sendgrid
CHATWOOT_API_KEY=sua_chave_chatwoot
```

## 🐳 Docker

### Build da Imagem

```bash
# Backend
cd backend
docker build -t weavecode-backend:latest .

# Frontend (opcional)
cd ../frontend
docker build -t weavecode-frontend:latest .
```

### Docker Compose

```bash
# Produção
docker-compose -f deploy/docker-compose.prod.yml up -d

# Desenvolvimento
docker-compose up -d
```

## 🔄 CI/CD

### GitHub Actions

**Workflows disponíveis:**
- **`ci.yml`** - Build e teste
- **`deploy-vps.yml`** - Deploy automático para VPS

### Secrets Necessários

Configure no GitHub (`Settings` > `Secrets` > `Actions`):

- `VPS_HOST` - IP da VPS
- `VPS_USER` - Usuário SSH (root)
- `VPS_SSH_KEY` - Chave SSH privada
- `VPS_PORT` - Porta SSH (22)

## 📊 Monitoramento

### Health Checks

```bash
# Verificar saúde dos serviços
/opt/weavecode/health-check.sh

# Ver logs em tempo real
tail -f /opt/weavecode/logs/health.log
tail -f /opt/weavecode/logs/alerts.log
```

### Backups

```bash
# Backup manual
/opt/weavecode/backup-postgres.sh

# Verificar backups
ls -la /opt/weavecode/backups/
```

## 🔒 Segurança

### Configurado Automaticamente

- ✅ Firewall UFW (portas 22, 80, 443)
- ✅ Headers de segurança (Caddy)
- ✅ Rate limiting para API
- ✅ Backup automático
- ✅ Monitoramento contínuo

### Recomendações Adicionais

- 🔑 Trocar senha padrão do PostgreSQL
- 🔑 Configurar fail2ban para SSH
- 🔑 Monitorar logs regularmente
- 🔑 Atualizar sistema regularmente

## 🌐 Domínio e SSL

### Configuração de Domínio

1. **Editar Caddyfile:**
```bash
nano /etc/caddy/Caddyfile
```

2. **Substituir comentários:**
```caddy
# De:
# tls seu-email@weavecode.co.uk

# Para:
tls seu-email@weavecode.co.uk
```

3. **Reiniciar Caddy:**
```bash
systemctl restart caddy
```

## 📱 Funcionalidades

### Implementadas
- ✅ Autenticação JWT
- ✅ CRUD de clientes
- ✅ Sistema de preços
- ✅ Estrutura de pagamentos (Stripe/PayPal)
- ✅ Sistema de email (SendGrid)
- ✅ Integração Chatwoot (stub)

### Planejadas (Fase 2)
- 🚧 Chatwoot completo (Java/Spring)
- 🚧 Dashboard administrativo
- 🚧 Relatórios e analytics
- 🚧 Sistema de notificações

## 💰 Preços dos Serviços

| Serviço | Descrição | Preço |
|---------|-----------|-------|
| **Landing Page** | Página institucional responsiva | £299 |
| **E-commerce** | Loja virtual completa | £799 |
| **Sistema Web** | Aplicação personalizada | £1,499 |
| **API REST** | Backend para aplicações | £599 |
| **Manutenção** | Suporte mensal | £99/mês |

## 🆘 Suporte

### Logs Importantes

```bash
# Backend
docker logs weavecode-backend

# PostgreSQL
docker logs weavecode-postgres

# Caddy
journalctl -u caddy -f

# Sistema
tail -f /opt/weavecode/logs/health.log
```

### Comandos Úteis

```bash
# Status dos serviços
docker ps
systemctl status caddy

# Reiniciar serviços
docker-compose restart
systemctl restart caddy

# Verificar conectividade
netstat -tlnp
ufw status
```

## 🎯 Próximos Passos

1. ✅ **VPS configurada** - Infraestrutura pronta
2. 🔄 **Deploy automático** - CI/CD funcionando
3. 🌐 **Domínio configurado** - SSL automático
4. 💳 **Pagamentos reais** - Stripe/PayPal
5. 📧 **Email real** - SendGrid configurado
6. 🚀 **Chatwoot** - Sistema de suporte

## 📚 Documentação

- **`deploy/VPS_SETUP_GUIDE.md`** - Guia completo da VPS
- **`deploy/docker-compose.prod.yml`** - Docker Compose produção
- **`deploy/Caddyfile`** - Configuração Caddy
- **`.github/workflows/`** - Workflows CI/CD

## 🎉 Status do Projeto

**✅ COMPLETO:**
- Frontend React + TailwindCSS
- Backend Node.js + Express
- Database PostgreSQL + Prisma
- VPS Hetzner configurada
- Docker + Docker Compose
- Caddy (reverse proxy + SSL)
- Backup automático
- Monitoramento contínuo
- CI/CD GitHub Actions

**🚀 PRONTO PARA PRODUÇÃO!**

---

**WeaveCode** - Transformando ideias em soluções web inovadoras! 🚀
