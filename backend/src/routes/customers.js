import express from 'express'
import { Customer } from '../lib/models.js'
import { getCache, setCache, deleteCache } from '../lib/redis.js'

const router = express.Router()

// Middleware to verify if user is authenticated
const requireAuth = (req, res, next) => {
  // Implement JWT verification here
  next()
}

// GET /api/customers - List all customers (with cache)
router.get('/', requireAuth, async (req, res) => {
  try {
    const cacheKey = 'customers:all'
    
    // Try to get from cache first
    let customers = await getCache(cacheKey)
    
    if (customers) {
      console.log('📦 Customers retrieved from Redis cache')
      return res.json({
        success: true,
        data: customers,
        source: 'cache',
        timestamp: new Date().toISOString()
      })
    }
    
    // If not in cache, fetch from database
    console.log('🗄️ Fetching customers from PostgreSQL')
    customers = await Customer.findAll()
    
    // Save in cache for 5 minutes (300 seconds)
    await setCache(cacheKey, customers, 300)
    console.log('💾 Customers saved in Redis cache')
    
    res.json({
      success: true,
      data: customers,
      source: 'database',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error fetching customers:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    })
  }
})

// GET /api/customers/:id - Get customer by ID (with cache)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const cacheKey = `customer:${id}`
    
    // Try to get from cache first
    let customer = await getCache(cacheKey)
    
    if (customer) {
      console.log(`📦 Customer ${id} retrieved from Redis cache`)
      return res.json({
        success: true,
        data: customer,
        source: 'cache',
        timestamp: new Date().toISOString()
      })
    }
    
    // If not in cache, fetch from database
    console.log(`🗄️ Fetching customer ${id} from PostgreSQL`)
    customer = await Customer.findById(id)
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      })
    }
    
    // Save in cache for 10 minutes (600 seconds)
    await setCache(cacheKey, customer, 600)
    console.log(`💾 Customer ${id} saved in Redis cache`)
    
    res.json({
      success: true,
      data: customer,
      source: 'database',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error fetching customer:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    })
  }
})

// POST /api/customers - Create new customer
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, email, phone, notes } = req.body
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required'
      })
    }
    
    const customer = await Customer.create({ name, email, phone, notes })
    
    // Clear customers cache to reflect changes
    await deleteCache('customers:all')
    console.log('🧹 Customers cache cleared after creation')
    
    res.status(201).json({
      success: true,
      data: customer,
      message: 'Customer created successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error creating customer:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    })
  }
})

// PUT /api/customers/:id - Update customer
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body
    
    const customer = await Customer.update(id, updates)
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      })
    }
    
    // Clear related caches
    await deleteCache(`customer:${id}`)
    await deleteCache('customers:all')
    console.log(`🧹 Cache for customer ${id} and customers:all cleared after update`)
    
    res.json({
      success: true,
      data: customer,
      message: 'Customer updated successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error updating customer:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    })
  }
})

// DELETE /api/customers/:id - Delete customer
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    
    const customer = await Customer.delete(id)
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      })
    }
    
    // Clear related caches
    await deleteCache(`customer:${id}`)
    await deleteCache('customers:all')
    console.log(`🧹 Cache for customer ${id} and customers:all cleared after deletion`)
    
    res.json({
      success: true,
      data: customer,
      message: 'Customer deleted successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error deleting customer:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    })
  }
})

// GET /api/customers/stats - Customer statistics (with cache)
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const cacheKey = 'customers:stats'
    
    // Try to get from cache first
    let stats = await getCache(cacheKey)
    
    if (stats) {
      console.log('📦 Stats retrieved from Redis cache')
      return res.json({
        success: true,
        data: stats,
        source: 'cache',
        timestamp: new Date().toISOString()
      })
    }
    
    // If not in cache, calculate from database
    console.log('🗄️ Calculating stats from PostgreSQL')
    const allCustomers = await Customer.findAll()
    
    stats = {
      total: allCustomers.length,
      withPhone: allCustomers.filter(c => c.phone).length,
      withNotes: allCustomers.filter(c => c.notes).length,
      createdThisMonth: allCustomers.filter(c => {
        const created = new Date(c.created_at)
        const now = new Date()
        return created.getMonth() === now.getMonth() && 
               created.getFullYear() === now.getFullYear()
      }).length
    }
    
    // Save in cache for 15 minutes (900 seconds)
    await setCache(cacheKey, stats, 900)
    console.log('💾 Stats saved in Redis cache')
    
    res.json({
      success: true,
      data: stats,
      source: 'database',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error calculating stats:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    })
  }
})

export default router


