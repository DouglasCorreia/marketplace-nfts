import { describe, expect, it } from 'vitest'
import { parseCatalogSearch, toWei, formatEth } from './catalog'

describe('catalog URL state', () => {
  it('normalizes and serializes search and filters from the URL', () => {
    expect(parseCatalogSearch({ q: '  glass  ', category: 'art', sort: 'price-asc', page: '2' })).toEqual({
      q: 'glass', category: 'art', sort: 'price-asc', page: 2,
    })
    expect(parseCatalogSearch({ category: 'unknown', sort: 'random', page: '-1' })).toEqual({
      q: '', category: 'all', sort: 'featured', page: 1,
    })
  })
})

describe('ETH precision', () => {
  it('converts decimal ETH to integer wei without floating point', () => {
    expect(toWei('0.125')).toBe(125_000_000_000_000_000n)
    expect(formatEth(125_000_000_000_000_000n)).toBe('0.125')
  })

  it('rejects more than 18 decimal places', () => {
    expect(() => toWei('0.0000000000000000001')).toThrow('precision')
  })
})
