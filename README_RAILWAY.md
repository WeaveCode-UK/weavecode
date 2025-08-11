# 🚀 WeaveCode - Plataforma SaaS no Railway
## info@weavecode.co.uk

### 📋 Visão Geral
WeaveCode é uma plataforma SaaS moderna construída com React, Node.js e PostgreSQL, hospedada no Railway para máxima escalabilidade e facilidade de deploy.

### 🏗️ Arquitetura
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   PostgreSQL    │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Railway)     │
│   Railway       │    │   Railway       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Chatwoot      │    │   Redis         │    │   GitHub        │
│   (Rails)       │    │   (Cache)       │    │   Actions       │
│   Railway       │    │   Railway       │    │   (CI/CD)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🛠️ Stack Tecnológica
- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Prisma
- **Database**: PostgreSQL (Railway)
- **Cache**: Redis (Railway)
- **Chat**: Chatwoot (Ruby on Rails)
- **Deploy**: Railway + GitHub Actions
- **ORM**: Prisma
- **Autenticação**: JWT
- **Pagamentos**: Stripe + PayPal
- **Email**: SendGrid

### 🚀 Deploy Rápido

#### 1. Pré-requisitos
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login no Railway
railway login
```

#### 2. Configurar Projeto
```bash
# Clonar repositório
git clone https://github.com/weavecode/weavecode.git
cd weavecode

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

### 🔧 Variáveis de Ambiente

#### Backend
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

#### Frontend
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
O projeto está configurado com GitHub Actions para deploy automático:
- Push para `main` → Deploy automático
- Pull Request → Execução de testes
- Deploy separado para cada serviço

### 🧪 Desenvolvimento Local

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Database
```bash
# Usar PostgreSQL local ou Railway
cd backend
npm run prisma:generate
npm run prisma:migrate:dev
```

### 📁 Estrutura do Projeto
```
weavecode/
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── lib/            # Prisma client
│   │   ├── middleware/     # Autenticação
│   │   ├── models/         # Modelos Prisma
│   │   └── routes/         # Rotas da API
│   ├── prisma/             # Schema e migrações
│   ├── railway.json        # Configuração Railway
│   └── package.json
├── frontend/                # App React
│   ├── src/
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── lib/            # Utilitários e API
│   │   └── assets/         # Recursos estáticos
│   ├── railway.json        # Configuração Railway
│   └── package.json
├── chatwoot/                # Chatbot personalizado
│   ├── railway.json        # Configuração Railway
│   └── ...
├── .github/                 # GitHub Actions
│   └── workflows/
│       └── deploy-railway.yml
├── scripts/                 # Scripts de automação
│   ├── migrate-to-railway.ps1
│   └── cleanup-docker.ps1
└── README_RAILWAY.md        # Este arquivo
```

### 🎯 Funcionalidades

#### Sistema de Usuários
- ✅ Registro e login
- ✅ Autenticação JWT
- ✅ Controle de acesso por roles
- ✅ Perfis de usuário

#### Gestão de Clientes
- ✅ CRUD de clientes
- ✅ Histórico de interações
- ✅ Notas e observações
- ✅ Sistema de tags

#### Sistema de Pagamentos
- ✅ Integração Stripe
- ✅ Integração PayPal
- ✅ Webhooks seguros
- ✅ Histórico de transações

#### Sistema de Email
- ✅ Templates personalizados
- ✅ Envio via SendGrid
- ✅ Rastreamento de entrega
- ✅ Listas de distribuição

#### Chatwoot Personalizado
- ✅ Chatbot inteligente
- ✅ Integração com CRM
- ✅ Histórico de conversas
- ✅ Relatórios e analytics

### 📈 Monitoramento
- **Railway Dashboard**: Métricas de performance
- **Logs**: Acesso em tempo real
- **Health Checks**: Status automático dos serviços
- **GitHub Actions**: Histórico de deploys

### 🔒 Segurança
- **HTTPS**: Forçado em produção
- **CORS**: Configurado adequadamente
- **Helmet**: Headers de segurança
- **JWT**: Autenticação stateless
- **Rate Limiting**: Proteção contra abuso
- **Input Validation**: Sanitização de dados

### 💰 Custos
- **Railway Hobby**: $5 mínimo/mês (desenvolvimento)
- **Railway Pro**: $20/mês (produção)
- **PostgreSQL**: Incluído no plano Railway
- **Redis**: Incluído no plano Railway

### 🆘 Suporte
- **Email**: info@weavecode.co.uk
- **Documentação**: Este README
- **Railway Docs**: https://docs.railway.app
- **Issues**: GitHub Issues

### 🚀 Próximos Passos
1. **Configurar domínios personalizados**
2. **Implementar analytics avançados**
3. **Adicionar testes automatizados**
4. **Configurar backup automático**
5. **Implementar CDN para assets**
6. **Adicionar monitoramento de performance**

---

**Versão**: 1.0.0
**Última Atualização**: $(Get-Date -Format "dd/MM/yyyy")
**Status**: Produção no Railway
**Empresa**: WeaveCode
**Email**: info@weavecode.co.uk
