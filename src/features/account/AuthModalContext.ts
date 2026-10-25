import { createContext, useContext } from 'react'

export type AuthModalMode = 'login' | 'register'
export const AuthModalContext = createContext<{ openAuth: (mode: AuthModalMode) => void; closeAuth: () => void } | null>(null)

export function useAuthModal() {
  const context = useContext(AuthModalContext)
  if (!context) throw new Error('Auth modal must be used inside AppShell')
  return context
}
