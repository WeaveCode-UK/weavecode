import { Router } from 'express'

const router = Router()

// Chatwoot proxy stub
router.post('/chatwoot', async (req, res) => {
  // Here you would integrate with the Chatwoot API using the workspace token/endpoint
  return res.json({ ok: true, message: 'Stub Chatwoot recebido', payload: req.body })
})

export default router


