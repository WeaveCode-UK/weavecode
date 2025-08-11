import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AuthAPI } from './lib/api'
import { getToken, setToken, clearToken } from './lib/auth'
import Checkout from './pages/Checkout'
import Contact from './pages/Contact'

function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold">WeaveCode</h1>
      <p className="mt-2 text-gray-600">We build modern web experiences.</p>
      <div className="mt-6 flex gap-3">
        <Link className="px-4 py-2 rounded bg-primary text-white" to="/pricing">View Prices</Link>
        <Link className="px-4 py-2 rounded border" to="/about">About</Link>
      </div>
    </div>
  )
}

function Pricing() {
  const pricing = {
    currency_symbol: '£',
    website_build: {
      label: 'Website (with maintenance / site only)',
      plans: [
        { slug: 'essential', name: 'Essential', with_maintenance: 399, site_only: 639 },
        { slug: 'business', name: 'Business', with_maintenance: 549, site_only: 789 },
        { slug: 'ecommerce', name: 'E-commerce', with_maintenance: 1999, site_only: 2399 },
        { slug: 'bespoke', name: 'Bespoke', with_maintenance: null, site_only: null, note: 'On quote' }
      ]
    },
    recurring: [
      { slug: 'hosting_only', name: 'Hosting Only', monthly: 15, annual: 150 },
      { slug: 'essential_enhanced_digital_presence', name: 'Essential & Enhanced Digital Presence', monthly: 25, annual: 240 },
      { slug: 'ecommerce_launch_package', name: 'E-commerce Launch Package', monthly: 35, annual: 350 }
    ]
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Prices</h1>
      <section className="mt-6">
        <h2 className="text-lg font-medium">Website (with maintenance / site only)</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead className="text-sm text-gray-500">
              <tr>
                <th className="py-2">Plano</th>
                <th className="py-2">With maintenance</th>
                <th className="py-2">Site only</th>
              </tr>
            </thead>
            <tbody>
              {pricing.website_build.plans.map((p) => (
                <tr key={p.slug} className="bg-white">
                  <td className="py-3 font-medium">{p.name}</td>
                  <td className="py-3">{p.with_maintenance != null ? `${pricing.currency_symbol}${p.with_maintenance.toLocaleString('en-GB')}` : p.note ?? 'On quote'}</td>
                  <td className="py-3">{p.site_only != null ? `${pricing.currency_symbol}${p.site_only.toLocaleString('en-GB')}` : p.note ?? 'On quote'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-medium">Planos recorrentes</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead className="text-sm text-gray-500">
              <tr>
                <th className="py-2">Plano</th>
                <th className="py-2">Mensal</th>
                <th className="py-2">Anual</th>
              </tr>
            </thead>
            <tbody>
              {pricing.recurring.map((r) => (
                <tr key={r.slug} className="bg-white">
                  <td className="py-3 font-medium">{r.name}</td>
                  <td className="py-3">{`${pricing.currency_symbol}${r.monthly.toLocaleString('en-GB')}`}</td>
                  <td className="py-3">{`${pricing.currency_symbol}${r.annual.toLocaleString('en-GB')}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

function About() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">About</h1>
      <p className="mt-2 text-gray-600">We are a company focused on modern web solutions.</p>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) { setLoading(false); return }
    AuthAPI.me().then(setUser).catch(() => clearToken()).finally(() => setLoading(false))
  }, [])

  function LogoutButton() {
    return (
      <button onClick={() => { clearToken(); setUser(null) }} className="text-sm text-gray-600">Sair</button>
    )
  }

  if (loading) return <div className="p-6">Carregando...</div>

  return (
    <BrowserRouter>
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
          <Link to="/" className="font-semibold">WeaveCode</Link>
          <nav className="flex gap-4 text-sm text-gray-600">
            <Link to="/">Home</Link>
            <Link to="/pricing">Prices</Link>
            <Link to="/customers">Customers</Link>
            <Link to="/about">About</Link>
            <Link to="/checkout">Checkout</Link>
            <Link to="/contact">Contact</Link>
            {user ? <LogoutButton /> : <>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Registrar</Link>
            </>}
          </nav>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login onLogin={(token) => { setToken(token); AuthAPI.me().then(setUser); }} />} />
        <Route path="/register" element={<Register onRegistered={() => { /* opcional: redirecionar */ }} />} />
        <Route path="/customers" element={user ? <Customers /> : <Navigate to="/login" />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await AuthAPI.login(email, password)
      onLogin(res.token)
    } catch (e) {
      setError('Login failed')
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-2xl font-semibold mb-4">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full border px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="px-4 py-2 rounded bg-primary text-white" type="submit">Sign In</button>
      </form>
    </main>
  )
}

function Customers() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    import('./lib/api').then(({ CustomersAPI }) => CustomersAPI.list().then(setItems).catch(() => setError('Failed to load')).finally(() => setLoading(false)))
  }, [])
  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Customers</h1>
      <form className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3" onSubmit={async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
          const { CustomersAPI } = await import('./lib/api')
          const created = await CustomersAPI.create(form)
          setItems((prev) => [created, ...prev])
          setForm({ name: '', email: '', phone: '', notes: '' })
        } catch {
          alert('Failed to create customer')
        } finally {
          setSaving(false)
        }
      }}>
        <input required className="border px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required className="border px-3 py-2" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="border px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="border px-3 py-2 sm:col-span-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button disabled={saving} className="px-4 py-2 rounded bg-primary text-white sm:col-span-2" type="submit">{saving ? 'Saving...' : 'Add customer'}</button>
      </form>
      <ul className="mt-4 divide-y">
        {items.map((c) => (
          <li key={c._id} className="py-3">
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-gray-600">{c.email} · {c.phone}</div>
          </li>
        ))}
      </ul>
    </main>
  )
}

function Register({ onRegistered }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await AuthAPI.register(name, email, password)
      setOk(true)
      onRegistered?.()
    } catch (e) {
      setError('Registration failed')
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-2xl font-semibold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full border px-3 py-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full border px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {ok && <p className="text-green-700 text-sm">Registered successfully. Please sign in.</p>}
        <button className="px-4 py-2 rounded bg-primary text-white" type="submit">Register</button>
      </form>
    </main>
  )
}
