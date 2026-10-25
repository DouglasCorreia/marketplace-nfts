const sessionStorageKey = 'gallery.mock.session.v1'

export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(sessionStorageKey)
    if (!raw) return null
    const value: unknown = JSON.parse(raw)
    if (typeof value === 'object' && value !== null && 'token' in value && typeof value.token === 'string') return value.token
    return null
  } catch {
    return null
  }
}

export { sessionStorageKey }
