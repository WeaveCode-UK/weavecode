import { createClient } from 'redis'

// Redis configuration
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://redis.railway.internal:6379',
  socket: {
    connectTimeout: 10000,
    lazyConnect: true,
  }
})

// Connection events
redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully')
})

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err)
})

redisClient.on('ready', () => {
  console.log('🚀 Redis ready for use')
})

// Function to connect
export async function connectRedis() {
  try {
    await redisClient.connect()
    return true
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error)
    return false
  }
}

// Function to disconnect
export async function disconnectRedis() {
  try {
    await redisClient.quit()
    console.log('👋 Redis disconnected')
  } catch (error) {
    console.error('❌ Error disconnecting from Redis:', error)
  }
}

// Cache functions
export async function setCache(key, value, ttl = 300) {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value))
    return true
  } catch (error) {
    console.error('❌ Error setting cache:', error)
    return false
  }
}

export async function getCache(key) {
  try {
    const value = await redisClient.get(key)
    return value ? JSON.parse(value) : null
  } catch (error) {
    console.error('❌ Error getting cache:', error)
    return null
  }
}

export async function deleteCache(key) {
  try {
    await redisClient.del(key)
    return true
  } catch (error) {
    console.error('❌ Error deleting cache:', error)
    return false
  }
}

export async function clearCache() {
  try {
    await redisClient.flushDb()
    console.log('🧹 Cache cleared successfully')
    return true
  } catch (error) {
    console.error('❌ Error clearing cache:', error)
    return false
  }
}

// Function to test connection
export async function testRedisConnection() {
  try {
    await redisClient.ping()
    console.log('🏓 Redis PING: PONG')
    return true
  } catch (error) {
    console.error('❌ Redis PING failed:', error)
    return false
  }
}

export default redisClient
