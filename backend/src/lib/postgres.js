import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

// Configuração da conexão PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Máximo de conexões no pool
  idleTimeoutMillis: 30000, // Tempo limite para conexões ociosas
  connectionTimeoutMillis: 2000, // Tempo limite para estabelecer conexão
})

// Testar conexão
pool.on('connect', () => {
  console.log('✅ PostgreSQL conectado via driver pg')
})

pool.on('error', (err) => {
  console.error('❌ Erro na conexão PostgreSQL:', err)
})

// Função para executar queries
export async function query(text, params) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log(`📊 Query executada em ${duration}ms`)
    return res
  } catch (error) {
    console.error('❌ Erro na query:', error)
    throw error
  }
}

// Função para executar uma única query
export async function getClient() {
  const client = await pool.connect()
  const query = client.query
  const release = client.release
  
  // Interceptar queries para logging
  client.query = (...args) => {
    client.lastQuery = args
    return query.apply(client, args)
  }
  
  // Interceptar release para logging
  client.release = () => {
    console.log('🔌 Cliente PostgreSQL liberado')
    return release.apply(client)
  }
  
  return client
}

// Função para testar conexão
export async function testConnection() {
  try {
    const result = await query('SELECT NOW() as current_time')
    console.log('✅ Teste de conexão PostgreSQL:', result.rows[0])
    return true
  } catch (error) {
    console.error('❌ Falha no teste de conexão PostgreSQL:', error)
    return false
  }
}

// Função para fechar pool (usar apenas no shutdown)
export async function closePool() {
  await pool.end()
  console.log('🔌 Pool PostgreSQL fechado')
}

export default pool
