import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import prisma from './src/lib/prisma.js'
import authRouter from './src/routes/auth.js'
import paymentsRouter from './src/routes/payments.js'
import supportRouter from './src/routes/support.js'
import emailRouter from './src/routes/email.js'
import customersRouter from './src/routes/customers.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1;`
    res.json({ ok: true, service: 'weavecode-backend', db: 'postgres', time: new Date().toISOString() })
  } catch {
    res.status(500).json({ ok: false, service: 'weavecode-backend', db: 'postgres', error: 'db' })
  }
})

app.use('/api/auth', authRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/support', supportRouter)
app.use('/api/email', emailRouter)
app.use('/api/customers', customersRouter)

async function start() {
  try {
    await prisma.$connect()
    console.log('Prisma connected to Postgres')
  } catch (e) {
    console.error('Failed to connect to Postgres via Prisma:', e)
    process.exit(1)
  }
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`)
  })
}

start().catch((e) => {
  console.error('Fatal start error:', e)
  process.exit(1)
})


