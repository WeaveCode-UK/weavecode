import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = Router()

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' })
  const exists = await User.findOne({ email })
  if (exists) return res.status(409).json({ error: 'Usuário já existe' })
  const passwordHash = await bcrypt.hash(password, 10)
  await User.create({ name, email, passwordHash })
  return res.status(201).json({ ok: true })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' })
  const token = jwt.sign({ sub: user._id.toString(), email: user.email, roles: user.roles }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '2h' })
  return res.json({ token })
})

router.get('/me', async (req, res) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
    const user = await User.findById(payload.sub).select('-passwordHash')
    if (!user) return res.status(404).json({ error: 'Not found' })
    return res.json(user)
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }
})

export default router


