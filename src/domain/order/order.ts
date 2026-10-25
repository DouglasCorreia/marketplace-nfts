export type OrderStatus = 'pending' | 'confirmed' | 'declined'

export interface VersionedOrder {
  status: OrderStatus
  version: number
}

export interface OrderItemSnapshot {
  nftId: string
  edition: string
  name: string
  collection: string
  creator: string
  quantity: number
  unitPriceEth: string
  lineTotalEth: string
}

export interface TransactionReceipt {
  transactionHash: string
  explorerUrl: string
}

export interface Order extends VersionedOrder {
  id: string
  status: OrderStatus
  createdAt: string
  network: 'Ethereum' | 'Polygon'
  walletAddress: string
  items: OrderItemSnapshot[]
  subtotalEth: string
  networkFeeEth: string
  totalEth: string
  receipt: TransactionReceipt | null
}

export function applyOrderUpdate<T extends VersionedOrder>(current: T, event: VersionedOrder): T | VersionedOrder {
  if (current.status === 'confirmed' || current.status === 'declined') return current
  if (event.version <= current.version) return current
  return event
}
