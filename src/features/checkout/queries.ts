import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cartKey } from '../cart/queries'
import type { CreateOrderInput } from './api'
import { createOrder, fetchOrder } from './api'

export const orderKey = (id: string) => ['order', id] as const

export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateOrderInput) => createOrder(input),
    onSuccess: (order) => {
      queryClient.setQueryData(orderKey(order.id), order)
      if (order.status === 'confirmed') void queryClient.invalidateQueries({ queryKey: cartKey })
    },
  })
}

export function useOrder(id: string) {
  return useQuery({ queryKey: orderKey(id), queryFn: ({ signal }) => fetchOrder(id, signal), retry: false })
}
