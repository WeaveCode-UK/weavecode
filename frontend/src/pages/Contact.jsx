import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ to: '', subject: '', text: '' })
  const [status, setStatus] = useState('')

  async function send(e) {
    e.preventDefault()
    setStatus('')
    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setStatus(data.ok ? 'Sent' : 'Failed')
    } catch {
      setStatus('Failed')
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-2xl font-semibold mb-2">Contact</h1>
      <form onSubmit={send} className="space-y-3">
        <input className="w-full border px-3 py-2" placeholder="Recipient (email)" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
        <input className="w-full border px-3 py-2" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        <textarea className="w-full border px-3 py-2" rows={5} placeholder="Message" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
        <button className="px-4 py-2 rounded bg-primary text-white" type="submit">Send</button>
      </form>
      {status && <p className="mt-3 text-sm">Status: {status}</p>}
    </main>
  )
}


