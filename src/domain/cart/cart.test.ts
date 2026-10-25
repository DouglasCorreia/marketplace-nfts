import { describe, expect, it } from 'vitest'
import { calculateSubtotal, changeQuantity, type CartLine } from './cart'

describe('cart rules', () => {
  it('calculates the subtotal using integer wei', () => {
    const lines: CartLine[] = [
      { nftId: 'a', quantity: 2, priceEth: '0.125' },
      { nftId: 'b', quantity: 1, priceEth: '0.3' },
    ]
    expect(calculateSubtotal(lines)).toBe(550_000_000_000_000_000n)
  })

  it('rejects a quantity above the edition availability', () => {
    expect(() => changeQuantity({ nftId: 'a', quantity: 1, priceEth: '0.1', available: 2 }, 3)).toThrow('availability')
  })
})
