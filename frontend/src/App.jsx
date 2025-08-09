import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

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
  return (
    <BrowserRouter>
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
          <Link to="/" className="font-semibold">WeaveCode</Link>
          <nav className="flex gap-4 text-sm text-gray-600">
            <Link to="/">Home</Link>
            <Link to="/pricing">Preços</Link>
            <Link to="/about">Sobre</Link>
          </nav>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}
