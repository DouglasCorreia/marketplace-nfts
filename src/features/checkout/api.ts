import { http } from '../../lib/http/client'
import { clearCheckoutKey, getCheckoutKey } from '../../lib/storage/checkout'
import type { Order } from '../../domain/order/order'

export interface CreateOrderInput {
  walletAddress: string
  network: 'Ethereum' | 'Polygon'
  paymentDecision: 'approve' | 'decline'
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const key = getCheckoutKey()
  const response = await http.post<Order>('/orders', input, { headers: { 'Idempotency-Key': key }, timeout: 8000 })
  clearCheckoutKey()
  return response.data
}

export async function fetchOrder(id: string, signal?: AbortSignal): Promise<Order> {
  const response = await http.get<Order>(`/orders/${id}`, { signal })
  return response.data
}
