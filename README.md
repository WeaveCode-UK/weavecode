# 🚀 WeaveCode - Web Solutions Platform

**Company**: WeaveCode  
**Email**: info@weavecode.co.uk  
**Stack**: React + Node.js + PostgreSQL + Railway  
**Status**: Production on Railway 🚀

## 🏗️ Architecture

### Frontend
- **React.js** (Vite) - Modern SPA
- **JavaScript ES6+** - Modern code
- **TailwindCSS** - Utility styling
- **React Router** - SPA navigation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing
- **Prisma ORM** - Database

### Database
- **PostgreSQL** - Robust relational database (Railway)
- **Redis** - Cache and sessions (Railway)
- **Prisma** - Modern ORM

### Infrastructure
- **Railway** - Modern deployment platform
- **GitHub Actions** - Automatic CI/CD
- **Automatic deployment** - Via GitHub

## 🚀 Deploy on Railway

### Prerequisites
- ✅ Railway account configured
- ✅ Railway CLI installed
- ✅ Project initialized on Railway

### Quick Configuration

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login to Railway:**
```bash
railway login
```

3. **Initialize project:**
```bash
railway init
```

4. **Configure environment variables:**
```bash
railway variables set DATABASE_URL="your-postgresql-url"
railway variables set JWT_SECRET="your-jwt-secret"
railway variables set STRIPE_SECRET_KEY="your-stripe-key"
```

5. **Deploy applications:**
```bash
# Backend
cd backend
railway up

# Frontend
cd frontend
railway up
```

### Available Scripts

- **`scripts/migrate-to-railway.ps1`** - Railway migration script
- **`scripts/cleanup-docker.ps1`** - Docker file cleanup

## 🔧 Local Configuration

### Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/weavecode.git
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

### Environment Variables

**Frontend** (`.env`):
```bash
VITE_API_URL=http://localhost:4000
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

**Backend** (`.env`):
```bash
NODE_ENV=development
PORT=4000
JWT_SECRET=your_jwt_key
DATABASE_URL=postgresql://weavecode:weavecode123@localhost:5432/weavecode
STRIPE_SECRET_KEY=your_stripe_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
SENDGRID_API_KEY=your_sendgrid_key
CHATWOOT_API_KEY=your_chatwoot_key
```

## 📱 Features

### Implemented
- ✅ JWT authentication
- ✅ Client CRUD
- ✅ Price system
- ✅ Payment structure (Stripe/PayPal)
- ✅ Email system (SendGrid)
- ✅ Chatwoot integration (stub)

### Planned (Phase 2)
- 🚧 Complete Chatwoot (Ruby on Rails)
- 🚧 Administrative dashboard
- 🚧 Analytics and reports
- 🚧 Notification system

## 💰 Service Prices

| Service | Description | Price |
|---------|-------------|-------|
| **Landing Page** | Responsive institutional page | £299 |
| **E-commerce** | Complete online store | £799 |
| **Web System** | Custom application | £1,499 |
| **REST API** | Backend for applications | £599 |
| **Maintenance** | Monthly support | £99/month |

## 🆘 Support

### Important Logs

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

### Useful Commands

```bash
# Service status
railway status

# Deploy applications
railway up

# Check environment variables
railway variables

# Access real-time logs
railway logs -f
```

## 🎯 Next Steps

1. ✅ **Railway configured** - Modern infrastructure
2. 🔄 **Automatic deployment** - CI/CD working
3. 🌐 **Domains configured** - Automatic SSL
4. 💳 **Real payments** - Stripe/PayPal
5. 📧 **Real email** - SendGrid configured
6. 🚀 **Chatwoot** - Support system

## 📚 Documentation

- **`README_RAILWAY.md`** - Complete Railway documentation
- **`RAILWAY_MIGRATION_GUIDE.md`** - Migration guide
- **`.github/workflows/deploy-railway.yml`** - Railway CI/CD workflow
- **`scripts/`** - Automation scripts

## 🎉 Project Status

**✅ COMPLETE:**
- React Frontend + TailwindCSS
- Node.js Backend + Express
- Railway migration completed
- Automatic deployment configured
- Documentation updated

**🔄 IN PROGRESS:**
- Custom domain configuration
- Production testing on Railway

**🚧 NEXT PHASES:**
- Complete Chatwoot
- Administrative dashboard
- Analytics and reports

## 🚀 Automatic Deployment

The project is configured with GitHub Actions for automatic deployment on Railway:

- **Push to `main`** → Automatic deployment
- **Pull Request** → Test execution
- **Separate deployment** for backend and frontend

## 💰 Railway Costs

- **Railway Hobby**: $5 minimum/month (development)
- **Railway Pro**: $20/month (production)
- **PostgreSQL**: Included in Railway plan
- **Redis**: Included in Railway plan

---

**Company**: WeaveCode  
**Email**: info@weavecode.co.uk  
**Stack**: React + Node.js + PostgreSQL + Railway  
**Status**: Production on Railway 🚀
