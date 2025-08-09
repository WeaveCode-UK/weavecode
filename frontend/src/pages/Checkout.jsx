import { useState } from 'react'

export default function Checkout() {
  const [amount, setAmount] = useState(10)
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID

  async function createStripeIntent() {
    const res = await fetch('/api/payments/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Math.round(amount * 100), currency: 'gbp' })
    })
    const data = await res.json()
    alert(`Stripe clientSecret (dev): ${data.clientSecret || 'configure STRIPE_SECRET_KEY no backend'}`)
  }

  async function createPaypalPayment() {
    const res = await fetch('/api/payments/paypal/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amount.toFixed(2), currency: 'GBP' })
    })
    const data = await res.json()
    alert(`PayPal response (dev): ${data.id || 'configure PAYPAL_CLIENT_ID/SECRET no backend'}`)
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-2xl font-semibold mb-2">Checkout</h1>
      <p className="text-sm text-gray-600">Ambiente preparado para Stripe/PayPal. Configure as chaves no backend e no .env do frontend.</p>
      <div className="mt-6 space-y-3">
        <label className="block text-sm">Valor (£)</label>
        <input type="number" className="w-full border px-3 py-2" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <div className="text-xs text-gray-500">Stripe key: {stripeKey ? 'definida' : 'não definida'} · PayPal client: {paypalClientId ? 'definido' : 'não definido'}</div>
        <div className="flex gap-3">
          <button onClick={createStripeIntent} className="px-4 py-2 rounded bg-primary text-white">Stripe (PI)</button>
          <button onClick={createPaypalPayment} className="px-4 py-2 rounded border">PayPal</button>
        </div>
      </div>
    </main>
  )
}


