import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../lib/models.js'
import { getCache, setCache, deleteCache } from '../lib/redis.js'

const router = express.Router()

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, roles = ['user'] } = req.body
    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email and password are required'
      })
    }
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      })
    }
    
    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)
    
    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash,
      roles
    })
    
    // Clear user cache
    await deleteCache('users:all')
    console.log('🧹 User cache cleared after registration')
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )
    
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles
        },
        token
      },
      message: 'User registered successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error registering user:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    })
  }
})

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      })
    }
    
    // Find user
    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      })
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      })
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )
    
    // Save session to cache for 24 hours
    const sessionKey = `session:${user.id}`
    await setCache(sessionKey, {
      userId: user.id,
      email: user.email,
      roles: user.roles,
      lastLogin: new Date().toISOString()
    }, 86400) // 24 hours
    
    console.log(`💾 Session for user ${user.id} saved to Redis cache`)
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles
        },
        token
      },
      message: 'Login successful',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error logging in:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    })
  }
})

// POST /api/auth/logout - User logout
router.post('/logout', async (req, res) => {
  try {
    const { userId } = req.body
    
    if (userId) {
      // Clear session from cache
      const sessionKey = `session:${userId}`
      await deleteCache(sessionKey)
      console.log(`🧹 Session for user ${userId} cleared from Redis cache`)
    }
    
    res.json({
      success: true,
      message: 'Logout successful',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error logging out:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    })
  }
})

// GET /api/auth/profile - User profile (with cache)
router.get('/profile', async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication token required'
      })
    }
    
    const token = authHeader.substring(7)
    
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.userId
    
    // Try to get from cache first
    const sessionKey = `session:${userId}`
    let userSession = await getCache(sessionKey)
    
    if (userSession) {
      console.log(`📦 User profile for ${userId} obtained from Redis cache`)
      return res.json({
        success: true,
        data: userSession,
        source: 'cache',
        timestamp: new Date().toISOString()
      })
    }
    
    // If not in cache, fetch from database
    console.log(`🗄️ Fetching user profile for ${userId} from PostgreSQL`)
    const user = await User.findById(userId)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }
    
    // Save to cache for 1 hour (3600 seconds)
    await setCache(sessionKey, {
      userId: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      lastLogin: new Date().toISOString()
    }, 3600)
    
    console.log(`💾 User profile for ${userId} saved to Redis cache`)
    
    res.json({
      success: true,
      data: {
        userId: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles
      },
      source: 'database',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      })
    }
    
    console.error('❌ Error fetching profile:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    })
  }
})

// GET /api/auth/users - List all users (with cache, only admin)
router.get('/users', async (req, res) => {
  try {
    // Check if admin (implement authorization middleware)
    const cacheKey = 'users:all'
    
    // Try to get from cache first
    let users = await getCache(cacheKey)
    
    if (users) {
      console.log('📦 Users obtained from Redis cache')
      return res.json({
        success: true,
        data: users,
        source: 'cache',
        timestamp: new Date().toISOString()
      })
    }
    
    // If not in cache, fetch from database
    console.log('🗄️ Fetching users from PostgreSQL')
    users = await User.findAll()
    
    // Remove passwords from data
    const safeUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      created_at: user.created_at,
      updated_at: user.updated_at
    }))
    
    // Save to cache for 10 minutes (600 seconds)
    await setCache(cacheKey, safeUsers, 600)
    console.log('💾 Users saved to Redis cache')
    
    res.json({
      success: true,
      data: safeUsers,
      source: 'database',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error fetching users:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    })
  }
})

export default router


