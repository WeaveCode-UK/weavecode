import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { testConnection } from './src/lib/postgres.js'
import { createTables, checkTables } from './src/lib/models.js'
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
    const dbStatus = await testConnection()
    if (dbStatus) {
      res.json({ 
        ok: true, 
        service: 'weavecode-backend', 
        db: 'postgres', 
        time: new Date().toISOString(),
        connection: 'direct-pg'
      })
    } else {
      res.status(500).json({ 
        ok: false, 
        service: 'weavecode-backend', 
        db: 'postgres', 
        error: 'db-connection-failed' 
      })
    }
  } catch (error) {
    res.status(500).json({ 
      ok: false, 
      service: 'weavecode-backend', 
      db: 'postgres', 
      error: 'db-error',
      message: error.message 
    })
  }
})

app.use('/api/auth', authRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/support', supportRouter)
app.use('/api/email', emailRouter)
app.use('/api/customers', customersRouter)

async function start() {
  try {
    // Testar conexão PostgreSQL
    console.log('🔌 Testando conexão PostgreSQL...')
    const connectionOk = await testConnection()
    
    if (!connectionOk) {
      throw new Error('Falha na conexão com PostgreSQL')
    }
    
    // Verificar tabelas existentes
    console.log('📋 Verificando tabelas...')
    const tables = await checkTables()
    
    // Criar tabelas se não existirem
    if (!tables.users || !tables.customers) {
      console.log('🏗️ Criando tabelas...')
      await createTables()
    }
    
    console.log('✅ PostgreSQL conectado via driver pg')
    console.log('✅ Tabelas verificadas/criadas')
    
  } catch (e) {
    console.error('❌ Falha na conexão com PostgreSQL:', e)
    process.exit(1)
  }
  
  app.listen(port, () => {
    console.log(`🚀 API listening on http://localhost:${port}`)
    console.log(`🌐 Health check: http://localhost:${port}/api/health`)
  })
}

start().catch((e) => {
  console.error('💥 Fatal start error:', e)
  process.exit(1)
})


