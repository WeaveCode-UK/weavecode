import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import authRouter from './src/routes/auth.js'
import paymentsRouter from './src/routes/payments.js'
import supportRouter from './src/routes/support.js'
import emailRouter from './src/routes/email.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/weavecode'

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'weavecode-backend', time: new Date().toISOString() })
})

app.use('/api/auth', authRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/support', supportRouter)
app.use('/api/email', emailRouter)

async function start() {
  let uri = mongoUri
  try {
    await mongoose.connect(uri)
  } catch (err) {
    console.warn('Mongo connection failed, starting in-memory server for dev:', err?.message)
    const mem = await MongoMemoryServer.create()
    uri = mem.getUri('weavecode')
    await mongoose.connect(uri)
  }
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`)
  })
}

start().catch((e) => {
  console.error('Fatal start error:', e)
  process.exit(1)
})


