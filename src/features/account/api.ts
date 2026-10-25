import { http } from '../../lib/http/client'
import type { SessionResponse } from '../../domain/account/session'

export async function fetchSession(signal?: AbortSignal): Promise<SessionResponse> {
  const response = await http.get<SessionResponse>('/session', { signal })
  return response.data
}

export async function login(email: string, password: string): Promise<SessionResponse> {
  const response = await http.post<SessionResponse>('/auth/login', { email, password })
  return response.data
}

export async function register(name: string, email: string, password: string): Promise<SessionResponse> {
  const response = await http.post<SessionResponse>('/auth/register', { name, email, password })
  return response.data
}

export async function logout(): Promise<void> {
  await http.post('/auth/logout')
}
