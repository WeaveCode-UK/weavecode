# 🚀 Guia de Migração para Railway
## WeaveCode - info@weavecode.co.uk

### 📋 Visão Geral
Este guia documenta a migração completa do projeto WeaveCode do VPS Docker para Railway, removendo todas as dependências Docker e criando um ambiente moderno e escalável para aplicações SaaS.

### 🎯 Objetivos da Migração
1. **Railway (Aplicações SaaS)**
   - ✅ Chatwoot personalizado (chatbot)
   - ✅ Sistema de booking
   - ✅ Dashboard admin
   - ✅ APIs personalizadas
   - ✅ Deploy automático via GitHub

2. **SiteGround (Sites tradicionais)**
   - ✅ Sites WordPress
   - ✅ Sites institucionais
   - ✅ E-commerce básico
   - ✅ Revenda de hosting

### 🔄 O que foi Reconfigurado

#### 1. Backend Node.js
- ❌ Removidas dependências Docker
- ✅ Configurado para Railway
- ✅ Ajustadas variáveis de ambiente
- ✅ Configurados health checks para Railway

#### 2. Database
- ❌ Removido PostgreSQL local
- ✅ Configurado PostgreSQL Railway
- ✅ Ajustado Prisma schema
- ✅ Scripts de migração criados

#### 3. Frontend React
- ❌ Removido build Docker
- ✅ Configurado deploy Railway
- ✅ Ajustadas variáveis de ambiente
- ✅ Configurados domínios personalizados

#### 4. Chatwoot
- ❌ Removida configuração Docker
- ✅ Configurado Ruby on Rails no Railway
- ✅ Ajustadas dependências
- ✅ Configurado Redis Railway

#### 5. Deploy
- ❌ Removido Docker Compose
- ❌ Removido Caddy
- ✅ Configurado GitHub Actions para Railway
- ✅ Configurado deploy automático

### 🛠️ Tecnologias da Nova Arquitetura
- **Railway**: Deploy e hospedagem
- **PostgreSQL**: Banco de dados
- **Redis**: Cache e sessões
- **GitHub Actions**: CI/CD
- **Prisma**: ORM
- **Express.js**: Backend API
- **React**: Frontend
- **Ruby on Rails**: Chatwoot

### 💰 Custos Estimados
- **Railway Hobby**: $5 mínimo/mês (desenvolvimento)
- **Railway Pro**: $20/mês (produção)
- **SiteGround**: $15-30/mês (revenda)

### 📁 Arquivos Criados/Modificados

#### Backend
- `railway.json` - Configuração Railway
- `env.example` - Variáveis de ambiente
- `package.json` - Scripts atualizados

#### Frontend
- `railway.json` - Configuração Railway
- `env.example` - Variáveis de ambiente
- `vite.config.js` - Configuração produção

#### Chatwoot
- `railway.json` - Configuração Railway

#### Deploy
- `.github/workflows/deploy-railway.yml` - GitHub Actions
- `scripts/migrate-to-railway.ps1` - Script PowerShell

### 🚀 Passos para Migração

#### 1. Preparação
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login no Railway
railway login
```

#### 2. Configurar Projeto
```bash
# Inicializar projeto Railway
railway init

# Configurar variáveis de ambiente
railway variables set DATABASE_URL="sua-url-postgresql"
railway variables set JWT_SECRET="seu-jwt-secret"
railway variables set STRIPE_SECRET_KEY="sua-stripe-key"
```

#### 3. Deploy
```bash
# Backend
cd backend
railway up

# Frontend
cd frontend
railway up

# Chatwoot
cd chatwoot
railway up
```

#### 4. Configurar Domínios
```bash
# Configurar domínios personalizados
railway domain
```

### 🔧 Configuração de Variáveis de Ambiente

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@railway-host:port/database?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
STRIPE_SECRET_KEY="sk_test_..."
PAYPAL_CLIENT_ID="your-paypal-client-id"
SENDGRID_API_KEY="SG.your-sendgrid-api-key"
EMAIL_FROM="noreply@weavecode.co.uk"
PORT=4000
NODE_ENV="production"
```

#### Frontend (.env)
```env
VITE_API_URL="https://your-backend-railway-app.railway.app"
VITE_APP_NAME="WeaveCode"
VITE_APP_VERSION="1.0.0"
```

### 📊 Health Checks
- **Backend**: `/api/health`
- **Frontend**: `/`
- **Chatwoot**: `/health`

### 🔄 Deploy Automático
O deploy automático está configurado via GitHub Actions:
- Push para `main` → Deploy automático
- Pull Request → Execução de testes
- Deploy separado para backend e frontend

### 🧪 Testes
- Backend: `npm test`
- Frontend: `npm test`
- Integração: GitHub Actions

### 📚 Recursos Adicionais
- [Documentação Railway](https://docs.railway.app)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Prisma](https://www.prisma.io/docs)
- [Vite](https://vitejs.dev/guide/)

### ✅ Checklist de Migração
- [ ] Instalar Railway CLI
- [ ] Login no Railway
- [ ] Criar projeto Railway
- [ ] Configurar variáveis de ambiente
- [ ] Deploy do backend
- [ ] Deploy do frontend
- [ ] Deploy do Chatwoot
- [ ] Configurar domínios
- [ ] Testar aplicação
- [ ] Configurar GitHub Actions
- [ ] Remover arquivos Docker antigos

### 🆘 Suporte
Para dúvidas ou problemas durante a migração:
- Email: info@weavecode.co.uk
- Documentação: Este guia
- Railway Docs: https://docs.railway.app

---

**Data da Migração**: $(Get-Date -Format "dd/MM/yyyy")
**Versão**: 1.0.0
**Status**: Em Progresso
