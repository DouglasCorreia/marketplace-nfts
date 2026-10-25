import { http } from '../../lib/http/client'
import type { CartResponse, EditionSelection } from '../../domain/cart/types'

export async function fetchCart(signal?: AbortSignal): Promise<CartResponse> {
  const response = await http.get<CartResponse>('/cart', { signal })
  return response.data
}

export async function addCartItem(nftId: string, edition: EditionSelection, quantity = 1): Promise<CartResponse> {
  const response = await http.post<CartResponse>('/cart/items', { nftId, edition, quantity })
  return response.data
}

export async function updateCartItem(nftId: string, edition: EditionSelection, quantity: number): Promise<CartResponse> {
  const response = await http.patch<CartResponse>(`/cart/items/${nftId}?edition=${encodeURIComponent(edition)}`, { quantity })
  return response.data
}

export async function removeCartItem(nftId: string, edition: EditionSelection): Promise<CartResponse> {
  const response = await http.delete<CartResponse>(`/cart/items/${nftId}?edition=${encodeURIComponent(edition)}`)
  return response.data
}
