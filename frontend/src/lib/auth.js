export const TOKEN_KEY = 'weavecode_token'

export function getToken() {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}


