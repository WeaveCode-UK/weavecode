import { Router } from 'express'

const router = Router()

// Chatwoot proxy stub
router.post('/chatwoot', async (req, res) => {
  // Aqui você integraria com a API do Chatwoot usando o token/endpoint do workspace
  return res.json({ ok: true, message: 'Stub Chatwoot recebido', payload: req.body })
})

export default router


