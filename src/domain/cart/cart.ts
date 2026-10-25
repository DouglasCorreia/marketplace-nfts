import { formatEth, toWei } from '../catalog/catalog'

export interface CartLine {
  nftId: string
  quantity: number
  priceEth: string
  available?: number
}

export function calculateSubtotal(lines: readonly CartLine[]): bigint {
  return lines.reduce((total, line) => total + toWei(line.priceEth) * BigInt(line.quantity), 0n)
}

export function subtotalEth(lines: readonly CartLine[]): string {
  return formatEth(calculateSubtotal(lines))
}

export function changeQuantity<T extends CartLine>(line: T, quantity: number): T {
  if (!Number.isInteger(quantity) || quantity < 1) throw new Error('Quantity must be a positive integer')
  if (line.available !== undefined && quantity > line.available) throw new Error('Quantity exceeds availability')
  return { ...line, quantity }
}
