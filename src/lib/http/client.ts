import axios from 'axios'
import { getSessionToken } from '../storage/session'

export const http = axios.create({
  baseURL: '/api',
  timeout: 8000,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
})

export function apiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error)) return error.response?.data.message ?? fallback
  return error instanceof Error ? error.message : fallback
}

http.interceptors.request.use((config) => {
  const token = getSessionToken()
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  return config
})
