import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../lib/models.js'
import { getCache, setCache, deleteCache } from '../lib/redis.js'

const router = express.Router()

// POST /api/auth/register - Registrar novo usuário
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, roles = ['user'] } = req.body
    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Nome, email e senha são obrigatórios'
      })
    }
    
    // Verificar se usuário já existe
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Usuário já existe com este email'
      })
    }
    
    // Hash da senha
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)
    
    // Criar usuário
    const user = await User.create({
      name,
      email,
      passwordHash,
      roles
    })
    
    // Limpar cache de usuários
    await deleteCache('users:all')
    console.log('🧹 Cache de usuários limpo após registro')
    
    // Gerar JWT
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
      message: 'Usuário registrado com sucesso',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Erro ao registrar usuário:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    })
  }
})

// POST /api/auth/login - Login do usuário
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email e senha são obrigatórios'
      })
    }
    
    // Buscar usuário
    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      })
    }
    
    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      })
    }
    
    // Gerar JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )
    
    // Salvar sessão no cache por 24 horas
    const sessionKey = `session:${user.id}`
    await setCache(sessionKey, {
      userId: user.id,
      email: user.email,
      roles: user.roles,
      lastLogin: new Date().toISOString()
    }, 86400) // 24 horas
    
    console.log(`💾 Sessão do usuário ${user.id} salva no cache Redis`)
    
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
      message: 'Login realizado com sucesso',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Erro ao fazer login:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    })
  }
})

// POST /api/auth/logout - Logout do usuário
router.post('/logout', async (req, res) => {
  try {
    const { userId } = req.body
    
    if (userId) {
      // Limpar sessão do cache
      const sessionKey = `session:${userId}`
      await deleteCache(sessionKey)
      console.log(`🧹 Sessão do usuário ${userId} limpa do cache Redis`)
    }
    
    res.json({
      success: true,
      message: 'Logout realizado com sucesso',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Erro ao fazer logout:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    })
  }
})

// GET /api/auth/profile - Perfil do usuário (com cache)
router.get('/profile', async (req, res) => {
  try {
    // Extrair token do header Authorization
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token de autenticação necessário'
      })
    }
    
    const token = authHeader.substring(7)
    
    // Verificar JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.userId
    
    // Tentar obter do cache primeiro
    const sessionKey = `session:${userId}`
    let userSession = await getCache(sessionKey)
    
    if (userSession) {
      console.log(`📦 Perfil do usuário ${userId} obtido do cache Redis`)
      return res.json({
        success: true,
        data: userSession,
        source: 'cache',
        timestamp: new Date().toISOString()
      })
    }
    
    // Se não estiver no cache, buscar do banco
    console.log(`🗄️ Buscando perfil do usuário ${userId} do PostgreSQL`)
    const user = await User.findById(userId)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      })
    }
    
    // Salvar no cache por 1 hora (3600 segundos)
    await setCache(sessionKey, {
      userId: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      lastLogin: new Date().toISOString()
    }, 3600)
    
    console.log(`💾 Perfil do usuário ${userId} salvo no cache Redis`)
    
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
        error: 'Token inválido'
      })
    }
    
    console.error('❌ Erro ao buscar perfil:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    })
  }
})

// GET /api/auth/users - Listar todos os usuários (com cache, apenas admin)
router.get('/users', async (req, res) => {
  try {
    // Verificar se é admin (implementar middleware de autorização)
    const cacheKey = 'users:all'
    
    // Tentar obter do cache primeiro
    let users = await getCache(cacheKey)
    
    if (users) {
      console.log('📦 Usuários obtidos do cache Redis')
      return res.json({
        success: true,
        data: users,
        source: 'cache',
        timestamp: new Date().toISOString()
      })
    }
    
    // Se não estiver no cache, buscar do banco
    console.log('🗄️ Buscando usuários do PostgreSQL')
    users = await User.findAll()
    
    // Remover senhas dos dados
    const safeUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      created_at: user.created_at,
      updated_at: user.updated_at
    }))
    
    // Salvar no cache por 10 minutos (600 segundos)
    await setCache(cacheKey, safeUsers, 600)
    console.log('💾 Usuários salvos no cache Redis')
    
    res.json({
      success: true,
      data: safeUsers,
      source: 'database',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Erro ao buscar usuários:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    })
  }
})

export default router


