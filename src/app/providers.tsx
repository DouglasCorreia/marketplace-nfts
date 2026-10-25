import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import { LiveUpdates } from './LiveUpdates'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 } },
})

export function Providers() {
  return (
    <QueryClientProvider client={queryClient}>
      <LiveUpdates />
      
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
