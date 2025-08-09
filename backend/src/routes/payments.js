import { Router } from 'express'
import Stripe from 'stripe'
import paypal from 'paypal-rest-sdk'

const router = Router()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')

paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID || 'placeholder',
  client_secret: process.env.PAYPAL_CLIENT_SECRET || 'placeholder',
})

router.post('/stripe/checkout', async (req, res) => {
  const { amount, currency = 'gbp' } = req.body
  try {
    const paymentIntent = await stripe.paymentIntents.create({ amount, currency })
    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (e) {
    res.status(500).json({ error: 'Stripe error', details: e.message })
  }
})

router.post('/paypal/checkout', (req, res) => {
  const { amount, currency = 'GBP' } = req.body
  const payment = {
    intent: 'sale',
    payer: { payment_method: 'paypal' },
    transactions: [{ amount: { total: amount, currency } }],
    redirect_urls: { return_url: 'https://example.com/success', cancel_url: 'https://example.com/cancel' },
  }
  paypal.payment.create(payment, (error, payment) => {
    if (error) return res.status(500).json({ error: 'PayPal error', details: error.response })
    res.json(payment)
  })
})

export default router


