# 🚀 Railway Migration Guide
## WeaveCode - info@weavecode.co.uk

### 📋 Overview
This guide documents the complete migration of the WeaveCode project from VPS Docker to Railway, removing all Docker dependencies and creating a modern and scalable environment for SaaS applications.

### 🎯 Migration Objectives
1. **Railway (SaaS Applications)**
   - ✅ Custom Chatwoot (chatbot)
   - ✅ Booking system
   - ✅ Admin dashboard
   - ✅ Custom APIs
   - ✅ Automatic deployment via GitHub

2. **SiteGround (Traditional sites)**
   - ✅ WordPress sites
   - ✅ Institutional sites
   - ✅ Basic e-commerce
   - ✅ Hosting resale

### 🔄 What was Reconfigured

#### 1. Node.js Backend
- ❌ Docker dependencies removed
- ✅ Configured for Railway
- ✅ Environment variables adjusted
- ✅ Health checks configured for Railway

#### 2. Database
- ❌ Local PostgreSQL removed
- ✅ Railway PostgreSQL configured
- ✅ Prisma schema adjusted
- ✅ Migration scripts created

#### 3. React Frontend
- ❌ Docker build removed
- ✅ Railway deployment configured
- ✅ Environment variables adjusted
- ✅ Custom domains configured

#### 4. Chatwoot
- ❌ Docker configuration removed
- ✅ Ruby on Rails configured on Railway
- ✅ Dependencies adjusted
- ✅ Railway Redis configured

#### 5. Deployment
- ❌ Docker Compose removed
- ❌ Caddy removed
- ✅ GitHub Actions configured for Railway
- ✅ Automatic deployment configured

### 🛠️ New Architecture Technologies
- **Railway**: Deployment and hosting
- **PostgreSQL**: Database
- **Redis**: Cache and sessions
- **GitHub Actions**: CI/CD
- **Prisma**: ORM
- **Express.js**: Backend API
- **React**: Frontend
- **Ruby on Rails**: Chatwoot

### 💰 Estimated Costs
- **Railway Hobby**: $5 minimum/month (development)
- **Railway Pro**: $20/month (production)
- **SiteGround**: $15-30/month (resale)

### 📁 Files Created/Modified

#### Backend
- `railway.json` - Railway configuration
- `env.example` - Environment variables
- `package.json` - Updated scripts

#### Frontend
- `railway.json` - Railway configuration
- `env.example` - Environment variables
- `vite.config.js` - Production configuration

#### Chatwoot
- `railway.json` - Railway configuration

#### Deployment
- `.github/workflows/deploy-railway.yml` - GitHub Actions
- `scripts/migrate-to-railway.ps1` - PowerShell script

### 🚀 Migration Steps

#### 1. Preparation
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login
```

#### 2. Configure Project
```bash
# Initialise Railway project
railway init

# Configure environment variables
railway variables set DATABASE_URL="your-postgresql-url"
railway variables set JWT_SECRET="your-jwt-secret"
railway variables set STRIPE_SECRET_KEY="your-stripe-key"
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

#### 4. Configure Domains
```bash
# Configure custom domains
railway domain
```

### 🔧 Environment Variable Configuration

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

### 🔄 Automatic Deployment
Automatic deployment is configured via GitHub Actions:
- Push to `main` → Automatic deployment
- Pull Request → Test execution
- Separate deployment for backend and frontend

### 🧪 Tests
- Backend: `npm test`
- Frontend: `npm test`
- Integration: GitHub Actions

### 📚 Additional Resources
- [Railway Documentation](https://docs.railway.app)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Prisma](https://www.prisma.io/docs)
- [Vite](https://vitejs.dev/guide/)

### ✅ Migration Checklist
- [ ] Install Railway CLI
- [ ] Login to Railway
- [ ] Create Railway project
- [ ] Configure environment variables
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Deploy Chatwoot
- [ ] Configure domains
- [ ] Test application
- [ ] Configure GitHub Actions
- [ ] Remove old Docker files

### 🆘 Support
For questions or issues during migration:
- Email: info@weavecode.co.uk
- Documentation: This guide
- Railway Docs: https://docs.railway.app

---

**Migration Date**: $(Get-Date -Format "dd/MM/yyyy")
**Version**: 1.0.0
**Status**: In Progress
