const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : '/api'

const DEFAULT_GET_TIMEOUT_MS = 3000
const DEFAULT_POST_TIMEOUT_MS = 15000

export const api = {
  get: async (path, timeoutMs = DEFAULT_GET_TIMEOUT_MS) => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(`${API_BASE}${path}`, { signal: controller.signal })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `GET ${path} failed (${res.status})`)
      }
      return await res.json()
    } finally {
      clearTimeout(timer)
    }
  },

  post: async (path, data, timeoutMs = DEFAULT_POST_TIMEOUT_MS) => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const sessionStr = typeof window !== 'undefined' && window.localStorage.getItem('sb-fktasrpefkesugzalwyg-auth-token')
      const token = sessionStr ? JSON.parse(sessionStr)?.access_token : null
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        signal: controller.signal
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `POST ${path} failed (${res.status})`)
      }
      return await res.json()
    } finally {
      clearTimeout(timer)
    }
  },

  put: async (path, data, timeoutMs = DEFAULT_POST_TIMEOUT_MS) => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `PUT ${path} failed (${res.status})`)
      }
      return await res.json()
    } finally {
      clearTimeout(timer)
    }
  },

  delete: async (path, timeoutMs = DEFAULT_POST_TIMEOUT_MS) => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method: 'DELETE',
        signal: controller.signal
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `DELETE ${path} failed (${res.status})`)
      }
      return await res.json()
    } finally {
      clearTimeout(timer)
    }
  }
}

export default api
