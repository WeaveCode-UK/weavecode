import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../lib/models.js'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' })
    }
    
    const exists = await User.findByEmail(email)
    if (exists) {
      return res.status(409).json({ error: 'Usuário já existe' })
    }
    
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash, roles: ['user'] })
    
    return res.status(201).json({ ok: true, user: { id: user.id, name: user.name, email: user.email } })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' })
    }
    
    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }
    
    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }
    
    const token = jwt.sign(
      { sub: user.id, email: user.email, roles: user.roles }, 
      process.env.JWT_SECRET || 'dev-secret', 
      { expiresIn: '2h' }
    )
    
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, roles: user.roles } })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

router.get('/me', async (req, res) => {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
    const user = await User.findById(payload.sub)
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    const { password_hash, ...safeUser } = user
    return res.json(safeUser)
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
})

export default router


