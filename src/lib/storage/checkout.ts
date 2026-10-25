const idempotencyKey = 'gallery.mock.checkout-key.v1'

export function getCheckoutKey(): string {
  if (typeof window === 'undefined') return 'server-checkout'
  const existing = window.sessionStorage.getItem(idempotencyKey)
  if (existing) return existing
  const next = window.crypto.randomUUID()
  window.sessionStorage.setItem(idempotencyKey, next)
  return next
}

export function clearCheckoutKey(): void {
  if (typeof window !== 'undefined') window.sessionStorage.removeItem(idempotencyKey)
}
