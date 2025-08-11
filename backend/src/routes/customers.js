import { Router } from 'express'
import { Customer } from '../lib/models.js'
import requireAuth from '../middleware/requireAuth.js'

const router = Router()

router.get('/', requireAuth, async (_req, res) => {
  try {
    const customers = await Customer.findAll()
    res.json(customers)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/', requireAuth, async (req, res) => {
  try {
    const customer = await Customer.create(req.body)
    res.status(201).json(customer)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updated = await Customer.update(req.params.id, req.body)
    if (!updated) {
      return res.status(404).json({ error: 'Customer not found' })
    }
    res.json(updated)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await Customer.delete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: 'Customer not found' })
    }
    res.json({ ok: true, deleted })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

export default router


