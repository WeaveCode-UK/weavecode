# 🚀 WeaveCode - Plataforma de Soluções Web

**Empresa**: WeaveCode  
**Email**: info@weavecode.co.uk  
**Stack**: React + Node.js + PostgreSQL + Railway  
**Status**: Produção no Railway 🚀

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
- **PostgreSQL** - Banco relacional robusto (Railway)
- **Redis** - Cache e sessões (Railway)
- **Prisma** - ORM moderno

### Infraestrutura
- **Railway** - Plataforma de deploy moderna
- **GitHub Actions** - CI/CD automático
- **Deploy automático** - Via GitHub

## 🚀 Deploy no Railway

### Pré-requisitos
- ✅ Conta Railway configurada
- ✅ Railway CLI instalado
- ✅ Projeto inicializado no Railway

### Configuração Rápida

1. **Instalar Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login no Railway:**
```bash
railway login
```

3. **Inicializar projeto:**
```bash
railway init
```

4. **Configurar variáveis de ambiente:**
```bash
railway variables set DATABASE_URL="sua-url-postgresql"
railway variables set JWT_SECRET="seu-jwt-secret"
railway variables set STRIPE_SECRET_KEY="sua-stripe-key"
```

5. **Deploy das aplicações:**
```bash
# Backend
cd backend
railway up

# Frontend
cd frontend
railway up
```

### Scripts Disponíveis

- **`scripts/migrate-to-railway.ps1`** - Script de migração para Railway
- **`scripts/cleanup-docker.ps1`** - Limpeza de arquivos Docker

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

## 📱 Funcionalidades

### Implementadas
- ✅ Autenticação JWT
- ✅ CRUD de clientes
- ✅ Sistema de preços
- ✅ Estrutura de pagamentos (Stripe/PayPal)
- ✅ Sistema de email (SendGrid)
- ✅ Integração Chatwoot (stub)

### Planejadas (Fase 2)
- 🚧 Chatwoot completo (Ruby on Rails)
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
# Backend (Railway)
railway logs backend

# Frontend (Railway)
railway logs frontend

# PostgreSQL (Railway)
railway logs postgresql

# Chatwoot (Railway)
railway logs chatwoot
```

### Comandos Úteis

```bash
# Status dos serviços
railway status

# Deploy das aplicações
railway up

# Verificar variáveis de ambiente
railway variables

# Acessar logs em tempo real
railway logs -f
```

## 🎯 Próximos Passos

1. ✅ **Railway configurado** - Infraestrutura moderna
2. 🔄 **Deploy automático** - CI/CD funcionando
3. 🌐 **Domínios configurados** - SSL automático
4. 💳 **Pagamentos reais** - Stripe/PayPal
5. 📧 **Email real** - SendGrid configurado
6. 🚀 **Chatwoot** - Sistema de suporte

## 📚 Documentação

- **`README_RAILWAY.md`** - Documentação completa para Railway
- **`RAILWAY_MIGRATION_GUIDE.md`** - Guia de migração
- **`.github/workflows/deploy-railway.yml`** - Workflow CI/CD Railway
- **`scripts/`** - Scripts de automação

## 🎉 Status do Projeto

**✅ COMPLETO:**
- Frontend React + TailwindCSS
- Backend Node.js + Express
- Migração para Railway concluída
- Deploy automático configurado
- Documentação atualizada

**🔄 EM PROGRESSO:**
- Configuração de domínios personalizados
- Testes de produção no Railway

**🚧 PRÓXIMAS FASES:**
- Chatwoot completo
- Dashboard administrativo
- Analytics e relatórios

## 🚀 Deploy Automático

O projeto está configurado com GitHub Actions para deploy automático no Railway:

- **Push para `main`** → Deploy automático
- **Pull Request** → Execução de testes
- **Deploy separado** para backend e frontend

## 💰 Custos Railway

- **Railway Hobby**: $5 mínimo/mês (desenvolvimento)
- **Railway Pro**: $20/mês (produção)
- **PostgreSQL**: Incluído no plano Railway
- **Redis**: Incluído no plano Railway

---

**Empresa**: WeaveCode  
**Email**: info@weavecode.co.uk  
**Stack**: React + Node.js + PostgreSQL + Railway  
**Status**: Produção no Railway 🚀
