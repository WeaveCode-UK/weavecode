import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

// PostgreSQL connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum connections in pool
  idleTimeoutMillis: 30000, // Idle connection timeout
  connectionTimeoutMillis: 2000, // Connection establishment timeout
})

// Test connection
pool.on('connect', () => {
  console.log('✅ PostgreSQL connected via pg driver')
})

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err)
})

// Function to execute queries
export async function query(text, params) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log(`📊 Query executed in ${duration}ms`)
    return res
  } catch (error) {
    console.error('❌ Query error:', error)
    throw error
  }
}

// Function to execute a single query
export async function getClient() {
  const client = await pool.connect()
  const query = client.query
  const release = client.release
  
  // Intercept queries for logging
  client.query = (...args) => {
    client.lastQuery = args
    return query.apply(client, args)
  }
  
  // Intercept release for logging
  client.release = () => {
    console.log('🔌 PostgreSQL client released')
    return release.apply(client)
  }
  
  return client
}

// Function to test connection
export async function testConnection() {
  try {
    const result = await query('SELECT NOW() as current_time')
    console.log('✅ PostgreSQL connection test:', result.rows[0])
    return true
  } catch (error) {
    console.error('❌ PostgreSQL connection test failed:', error)
    return false
  }
}

// Function to close pool (use only on shutdown)
export async function closePool() {
  await pool.end()
  console.log('🔌 PostgreSQL pool closed')
}

export default pool
