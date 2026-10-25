export type CatalogCategory = 'all' | 'art' | 'photography' | 'music' | 'art-3d' | 'collectibles' | 'generative' | 'games' | 'subscriptions' | 'utility'
export type CatalogSort = 'featured' | 'price-asc' | 'price-desc' | 'newest'

export interface CatalogSearch {
  q: string
  category: CatalogCategory
  sort: CatalogSort
  page: number
}

const categories: readonly CatalogCategory[] = ['all', 'art', 'photography', 'music', 'art-3d', 'collectibles', 'generative', 'games', 'subscriptions', 'utility']
const sortOptions: readonly CatalogSort[] = ['featured', 'price-asc', 'price-desc', 'newest']

export function parseCatalogSearch(input: Record<string, unknown>): CatalogSearch {
  const category = typeof input.category === 'string' && categories.includes(input.category as CatalogCategory)
    ? input.category as CatalogCategory
    : 'all'
  const sort = typeof input.sort === 'string' && sortOptions.includes(input.sort as CatalogSort)
    ? input.sort as CatalogSort
    : 'featured'
  const pageValue = Number(input.page)
  return {
    q: typeof input.q === 'string' ? input.q.trim() : '',
    category,
    sort,
    page: Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1,
  }
}

export function toWei(value: string): bigint {
  if (!/^\d+(\.\d{1,18})?$/.test(value)) throw new Error('Invalid ETH precision')
  const [whole, fraction = ''] = value.split('.')
  return BigInt(whole) * 10n ** 18n + BigInt(fraction.padEnd(18, '0') || '0')
}

export function formatEth(value: bigint): string {
  const whole = value / 10n ** 18n
  const fraction = (value % 10n ** 18n).toString().padStart(18, '0').replace(/0+$/, '')
  return fraction ? `${whole}.${fraction}` : whole.toString()
}
