import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addCartItem, fetchCart, removeCartItem, updateCartItem } from './api'
import type { EditionSelection } from '../../domain/cart/types'

export const cartKey = ['cart'] as const

export function useCart() {
  return useQuery({ queryKey: cartKey, queryFn: ({ signal }) => fetchCart(signal) })
}

export function useCartMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: cartKey })
  const add = useMutation({ mutationFn: (item: { nftId: string; edition: EditionSelection; quantity: number }) => addCartItem(item.nftId, item.edition, item.quantity), onSuccess: invalidate })
  const update = useMutation({ mutationFn: ({ nftId, edition, quantity }: { nftId: string; edition: EditionSelection; quantity: number }) => updateCartItem(nftId, edition, quantity), onSuccess: invalidate })
  const remove = useMutation({ mutationFn: ({ nftId, edition }: { nftId: string; edition: EditionSelection }) => removeCartItem(nftId, edition), onSuccess: invalidate })
  return { add, update, remove }
}
