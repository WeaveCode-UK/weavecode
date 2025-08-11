import { query } from './postgres.js'

// Modelo User
export class User {
  static async create({ name, email, passwordHash, roles = ['user'] }) {
    const sql = `
      INSERT INTO users (name, email, password_hash, roles, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, name, email, roles, created_at, updated_at
    `
    const result = await query(sql, [name, email, passwordHash, roles])
    return result.rows[0]
  }

  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = $1'
    const result = await query(sql, [email])
    return result.rows[0]
  }

  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = $1'
    const result = await query(sql, [id])
    return result.rows[0]
  }

  static async update(id, updates) {
    const fields = Object.keys(updates)
    const values = Object.values(updates)
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ')
    
    const sql = `
      UPDATE users 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `
    const result = await query(sql, [id, ...values])
    return result.rows[0]
  }
}

// Modelo Customer
export class Customer {
  static async create({ name, email, phone, notes }) {
    const sql = `
      INSERT INTO customers (name, email, phone, notes, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, name, email, phone, notes, created_at, updated_at
    `
    const result = await query(sql, [name, email, phone, notes])
    return result.rows[0]
  }

  static async findAll() {
    const sql = 'SELECT * FROM customers ORDER BY created_at DESC'
    const result = await query(sql)
    return result.rows
  }

  static async findById(id) {
    const sql = 'SELECT * FROM customers WHERE id = $1'
    const result = await query(sql, [id])
    return result.rows[0]
  }

  static async update(id, updates) {
    const fields = Object.keys(updates)
    const values = Object.values(updates)
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ')
    
    const sql = `
      UPDATE customers 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `
    const result = await query(sql, [id, ...values])
    return result.rows[0]
  }

  static async delete(id) {
    const sql = 'DELETE FROM customers WHERE id = $1 RETURNING *'
    const result = await query(sql, [id])
    return result.rows[0]
  }
}

// Function to create tables (migration)
export async function createTables() {
  try {
    // Tabela users
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        roles TEXT[] DEFAULT ARRAY['user'],
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Tabela customers
    await query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    console.log('✅ Tables created successfully')
    return true
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error)
    return false
  }
}

// Function to check if tables exist
export async function checkTables() {
  try {
    const result = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'customers')
    `)
    
    const existingTables = result.rows.map(row => row.table_name)
    console.log('📋 Tabelas existentes:', existingTables)
    
    return {
      users: existingTables.includes('users'),
      customers: existingTables.includes('customers')
    }
  } catch (error) {
    console.error('❌ Error checking tables:', error)
    return { users: false, customers: false }
  }
}
