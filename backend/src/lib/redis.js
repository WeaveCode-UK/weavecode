import { createClient } from 'redis'

// Configuração do Redis
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://redis.railway.internal:6379',
  socket: {
    connectTimeout: 10000,
    lazyConnect: true,
  }
})

// Eventos de conexão
redisClient.on('connect', () => {
  console.log('✅ Redis conectado com sucesso')
})

redisClient.on('error', (err) => {
  console.error('❌ Erro Redis:', err)
})

redisClient.on('ready', () => {
  console.log('🚀 Redis pronto para uso')
})

// Função para conectar
export async function connectRedis() {
  try {
    await redisClient.connect()
    return true
  } catch (error) {
    console.error('❌ Falha ao conectar Redis:', error)
    return false
  }
}

// Função para desconectar
export async function disconnectRedis() {
  try {
    await redisClient.quit()
    console.log('👋 Redis desconectado')
  } catch (error) {
    console.error('❌ Erro ao desconectar Redis:', error)
  }
}

// Funções de cache
export async function setCache(key, value, ttl = 300) {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value))
    return true
  } catch (error) {
    console.error('❌ Erro ao definir cache:', error)
    return false
  }
}

export async function getCache(key) {
  try {
    const value = await redisClient.get(key)
    return value ? JSON.parse(value) : null
  } catch (error) {
    console.error('❌ Erro ao obter cache:', error)
    return null
  }
}

export async function deleteCache(key) {
  try {
    await redisClient.del(key)
    return true
  } catch (error) {
    console.error('❌ Erro ao deletar cache:', error)
    return false
  }
}

export async function clearCache() {
  try {
    await redisClient.flushDb()
    console.log('🧹 Cache limpo com sucesso')
    return true
  } catch (error) {
    console.error('❌ Erro ao limpar cache:', error)
    return false
  }
}

// Função para testar conexão
export async function testRedisConnection() {
  try {
    await redisClient.ping()
    console.log('🏓 Redis PING: PONG')
    return true
  } catch (error) {
    console.error('❌ Redis PING falhou:', error)
    return false
  }
}

export default redisClient
