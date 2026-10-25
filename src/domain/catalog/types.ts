import type { CatalogSearch } from './catalog'

export interface NFT {
  id: string
  name: string
  collection: string
  creator: string
  category: Exclude<CatalogSearch['category'], 'all'>
  priceEth: string
  edition: number
  available: number
  palette: string
  artwork: 'emerald-ape' | 'sage-nomad' | 'ivory-baron' | 'golden-beat'
  network?: 'Ethereum' | 'Polygon' | 'Solana'
  featured: boolean
}

export interface CatalogResponse {
  items: NFT[]
  total: number
  page: number
  pageSize: number
}
