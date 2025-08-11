# 🚀 WeaveCode - SaaS Platform on Railway
## info@weavecode.co.uk

### 📋 General Overview
WeaveCode is a modern SaaS platform built with React, Node.js, and PostgreSQL, hosted on Railway for maximum scalability and ease of deployment.

### 🏗️ Architecture
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

### 🛠️ Technical Stack
- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Prisma
- **Database**: PostgreSQL (Railway)
- **Cache**: Redis (Railway)
- **Chat**: Chatwoot (Ruby on Rails)
- **Deploy**: Railway + GitHub Actions
- **ORM**: Prisma
- **Authentication**: JWT
- **Payments**: Stripe + PayPal
- **Email**: SendGrid

### 🚀 Quick Deploy

#### 1. Prerequisites
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login
```

#### 2. Configure Project
```bash
# Clone repository
git clone https://github.com/weavecode/weavecode.git
cd weavecode

# Initialize Railway project
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

### 🔧 Environment Variables

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

### 🔄 Automatic Deployment
The project is configured with GitHub Actions for automatic deployment:
- Push to `main` → Automatic deployment
- Pull Request → Execution of tests
- Separate deployment for each service

### 🧪 Development Locally

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
# Use local PostgreSQL or Railway
cd backend
npm run prisma:generate
npm run prisma:migrate:dev
```

### 📁 Project Structure
```
weavecode/
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── lib/            # Prisma client
│   │   ├── middleware/     # Authentication
│   │   ├── models/         # Prisma models
│   │   └── routes/         # API routes
│   ├── prisma/             # Schema and migrations
│   ├── railway.json        # Railway configuration
│   └── package.json
├── frontend/                # React App
│   ├── src/
│   │   ├── pages/          # Application pages
│   │   ├── lib/            # Utilities and API
│   │   └── assets/         # Static resources
│   ├── railway.json        # Railway configuration
│   └── package.json
├── chatwoot/                # Custom Chatbot
│   ├── railway.json        # Railway configuration
│   └── ...
├── .github/                 # GitHub Actions
│   └── workflows/
│       └── deploy-railway.yml
├── scripts/                 # Automation scripts
│   ├── migrate-to-railway.ps1
│   └── cleanup-docker.ps1
└── README_RAILWAY.md        # This file
```

### 🎯 Features

#### User System
- ✅ Registration and login
- ✅ User authentication
- ✅ User profiles

#### Customer Management
- ✅ Customer CRUD
- ✅ Notes and observations
- ✅ System of tags

#### Payment System
- ✅ Stripe integration
- ✅ PayPal integration
- ✅ Secure webhooks
- ✅ Transaction history

#### Email System
- ✅ Custom templates
- ✅ Send via SendGrid
- ✅ Delivery tracking
- ✅ Distribution lists

#### Custom Chatwoot
- ✅ Intelligent chatbot
- ✅ CRM integration
- ✅ Conversation history
- ✅ Reports and analytics

### 📈 Monitoring
- **Railway Dashboard**: Performance metrics
- **Logs**: Real-time access
- **Health Checks**: Automatic status of services
- **GitHub Actions**: Deployment history

### 🔒 Security
- **HTTPS**: Forced in production
- **CORS**: Properly configured
- **Helmet**: Security headers
- **JWT**: Stateless authentication
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Data sanitization

### 💰 Costs
- **Railway Hobby**: $5 minimum/month (development)
- **Railway Pro**: $20/month (production)
- **PostgreSQL**: Included in Railway plan
- **Redis**: Included in Railway plan

### 🆘 Support
- **Email**: info@weavecode.co.uk
- **Documentation**: This README
- **Railway Docs**: https://docs.railway.app
- **Issues**: GitHub Issues

### 🚀 Next Steps
1. **Configure custom domains**
2. **Implement advanced analytics**
3. **Add automated tests**
4. **Configure automatic backup**
5. **Implement CDN for assets**
6. **Add performance monitoring**

---

**Version**: 1.0.0
**Last Update**: $(Get-Date -Format "dd/MM/yyyy")
**Status**: Production on Railway
**Company**: WeaveCode
**Email**: info@weavecode.co.uk
