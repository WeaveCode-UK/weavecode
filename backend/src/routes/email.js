import { Router } from 'express'
import sgMail from '@sendgrid/mail'

const router = Router()

sgMail.setApiKey(process.env.SENDGRID_API_KEY || 'SG.xxxxxx')

router.post('/send', async (req, res) => {
  const { to, subject, text, html } = req.body
  try {
    const msg = { to, from: process.env.EMAIL_FROM || 'info@weavecode.co.uk', subject, text, html }
    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send(msg)
      return res.json({ ok: true })
    }
    // Sem API key, apenas ecoa (modo dev)
    return res.json({ ok: true, simulated: true, message: msg })
  } catch (e) {
    return res.status(500).json({ error: 'Email error', details: e.message })
  }
})

export default router


