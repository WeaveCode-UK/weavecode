import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = Router()

// Fake in-memory users for bootstrap
const users = []

router.post('/register', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' })
  const exists = users.find((u) => u.email === email)
  if (exists) return res.status(409).json({ error: 'Usuário já existe' })
  const hash = await bcrypt.hash(password, 10)
  users.push({ email, password: hash })
  return res.status(201).json({ ok: true })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = users.find((u) => u.email === email)
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' })
  const token = jwt.sign({ sub: email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1h' })
  return res.json({ token })
})

export default router


