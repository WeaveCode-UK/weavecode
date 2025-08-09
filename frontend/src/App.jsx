import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AuthAPI } from './lib/api'
import { getToken, setToken, clearToken } from './lib/auth'

function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold">WeaveCode</h1>
      <p className="mt-2 text-gray-600">Construímos experiências web modernas.</p>
      <div className="mt-6 flex gap-3">
        <Link className="px-4 py-2 rounded bg-primary text-white" to="/pricing">Ver Preços</Link>
        <Link className="px-4 py-2 rounded border" to="/about">Sobre</Link>
      </div>
    </div>
  )
}

function Pricing() {
  const pricing = {
    currency_symbol: '£',
    website_build: {
      label: 'Website (com manutenção / apenas site)',
      plans: [
        { slug: 'essential', name: 'Essential', with_maintenance: 399, site_only: 639 },
        { slug: 'business', name: 'Business', with_maintenance: 549, site_only: 789 },
        { slug: 'ecommerce', name: 'E-commerce', with_maintenance: 1999, site_only: 2399 },
        { slug: 'bespoke', name: 'Bespoke', with_maintenance: null, site_only: null, note: 'Sob orçamento' }
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
      <h1 className="text-2xl font-semibold">Preços</h1>
      <section className="mt-6">
        <h2 className="text-lg font-medium">Website (com manutenção / apenas site)</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead className="text-sm text-gray-500">
              <tr>
                <th className="py-2">Plano</th>
                <th className="py-2">Com manutenção</th>
                <th className="py-2">Apenas site</th>
              </tr>
            </thead>
            <tbody>
              {pricing.website_build.plans.map((p) => (
                <tr key={p.slug} className="bg-white">
                  <td className="py-3 font-medium">{p.name}</td>
                  <td className="py-3">{p.with_maintenance != null ? `${pricing.currency_symbol}${p.with_maintenance.toLocaleString('en-GB')}` : p.note ?? 'Sob orçamento'}</td>
                  <td className="py-3">{p.site_only != null ? `${pricing.currency_symbol}${p.site_only.toLocaleString('en-GB')}` : p.note ?? 'Sob orçamento'}</td>
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
      <h1 className="text-2xl font-semibold">Sobre</h1>
      <p className="mt-2 text-gray-600">Somos uma empresa focada em soluções web modernas.</p>
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
            <Link to="/pricing">Preços</Link>
            <Link to="/customers">Clientes</Link>
            <Link to="/about">Sobre</Link>
            {user ? <LogoutButton /> : <Link to="/login">Entrar</Link>}
          </nav>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login onLogin={(token) => { setToken(token); AuthAPI.me().then(setUser); }} />} />
        <Route path="/customers" element={user ? <Customers /> : <Navigate to="/login" />} />
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
      setError('Falha no login')
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-2xl font-semibold mb-4">Entrar</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full border px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border px-3 py-2" placeholder="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="px-4 py-2 rounded bg-primary text-white" type="submit">Entrar</button>
      </form>
    </main>
  )
}

function Customers() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    import('./lib/api').then(({ CustomersAPI }) => CustomersAPI.list().then(setItems).catch(() => setError('Falha ao carregar')).finally(() => setLoading(false)))
  }, [])
  if (loading) return <div className="p-6">Carregando...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Clientes</h1>
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
