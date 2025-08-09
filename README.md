# WeaveCode – Monorepo (Frontend + Backend)

## Stack
- Frontend: React (Vite), JavaScript ES6+, TailwindCSS
- Backend: Node.js + Express.js
- Banco: MongoDB Atlas (Mongoose)
- Auth: JWT + Bcrypt
- Pagamentos: Stripe + PayPal (preparado)
- E-mail: SendGrid (form de contato)
- Deploy: Frontend (Vercel/Netlify), Backend (GCP/AWS)

## Estrutura
- `frontend/` SPA com rotas públicas/protegidas (`/login`, `/register`, `/customers`, `/checkout`, `/contact`)
- `backend/` API REST (`/api/auth`, `/api/customers`, `/api/payments`, `/api/email`, `/api/support`)
- `assets/` assets gerados (logos, favicon, OG)

## Backend
- Rotas principais:
  - Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
  - Customers (JWT): `GET/POST/PUT/DELETE /api/customers`
  - Pagamentos: `POST /api/payments/stripe/checkout`, `POST /api/payments/paypal/checkout`
  - Email: `POST /api/email/send`
- `.env` (ver `backend/.env.example`):
```
PORT=4000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
SENDGRID_API_KEY=...
EMAIL_FROM=info@weavecode.co.uk
```
- Rodar:
```
cd backend
npm i
npm run dev
```

## Frontend
- `.env` público (ver `frontend/.env.example`):
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_PAYPAL_CLIENT_ID=...
```
- Rodar:
```
cd frontend
npm i
npm run dev
```
- Rotas: `/`, `/pricing`, `/login`, `/register`, `/customers` (JWT), `/checkout`, `/contact`

## Pagamentos (preparado)
- Stripe: backend usa `STRIPE_SECRET_KEY`; frontend lê `VITE_STRIPE_PUBLISHABLE_KEY`.
- PayPal: backend `PAYPAL_CLIENT_ID/SECRET` (SDK legada); considerar `@paypal/paypal-server-sdk` em fase futura.

## Email (SendGrid)
- Configure `SENDGRID_API_KEY` e `EMAIL_FROM`. Sem chave, endpoint responde em modo simulado.

## Chatwoot (fase 2)
- Widget no frontend e/ou proxy de API no backend (`/api/support/chatwoot`).
- Reimplementação Java Spring: ver `CHATWOOT_PLAN.md`.

## Deploy
- Frontend: Vercel/Netlify (output `dist/`).
- Backend: GCP/AWS (Node 18+, variáveis `.env`).
