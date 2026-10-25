import { describe, expect, it } from 'vitest'
import { applyOrderUpdate, type OrderStatus } from './order'

describe('order event reconciliation', () => {
  it('ignores duplicated or older order events', () => {
    const current = { id: 'ord-1', status: 'confirmed' as OrderStatus, version: 3 }
    expect(applyOrderUpdate(current, { status: 'pending', version: 2 })).toEqual(current)
  })

  it('does not reopen terminal orders', () => {
    const current = { id: 'ord-1', status: 'declined' as OrderStatus, version: 3 }
    expect(applyOrderUpdate(current, { status: 'pending', version: 4 })).toEqual(current)
  })
})
