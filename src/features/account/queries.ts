import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchSession, login, logout, register } from './api'

export const sessionKey = ['session'] as const

export function useSession() {
  return useQuery({ queryKey: sessionKey, queryFn: ({ signal }) => fetchSession(signal), staleTime: 0, retry: false })
}

export function useAuthMutations() {
  const queryClient = useQueryClient()
  const signIn = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
    onSuccess: (session) => queryClient.setQueryData(sessionKey, session),
  })
  const signUp = useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) => register(name, email, password),
    onSuccess: (session) => queryClient.setQueryData(sessionKey, session),
  })
  const signOut = useMutation({
    mutationFn: logout,
    onSuccess: async () => { await queryClient.cancelQueries(); queryClient.clear() },
  })
  return { signIn, signUp, signOut }
}
