import { getToken } from './auth'

const BASE_URL = '/api'

export async function api(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  if (!res.ok) throw new Error(await res.text())
  const text = await res.text()
  try { return JSON.parse(text) } catch { return text }
}

export const AuthAPI = {
  async login(email, password) {
    return api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
  },
  async register(name, email, password) {
    return api('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) })
  },
  async me() {
    return api('/auth/me')
  },
}

export const CustomersAPI = {
  list() { return api('/customers') },
  create(payload) { return api('/customers', { method: 'POST', body: JSON.stringify(payload) }) },
}


