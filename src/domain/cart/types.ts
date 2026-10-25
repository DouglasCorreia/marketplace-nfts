import type { NFT } from '../catalog/types'

export const editionOptions = ['1/1', '1/10', '1/50', 'ABERTA'] as const
export type EditionSelection = (typeof editionOptions)[number]

export function defaultEditionSelection(totalEditions: number): EditionSelection {
  if (totalEditions === 1) return '1/1'
  if (totalEditions === 10) return '1/10'
  if (totalEditions === 50) return '1/50'
  return 'ABERTA'
}

export function maxQuantityForEdition(edition: EditionSelection, available: number): number {
  if (edition === 'ABERTA') return available
  return Math.min(Number(edition.split('/')[1]), available)
}

export interface CartEntry {
  nftId: string
  edition: EditionSelection
  quantity: number
}

export interface CartResponse {
  items: { nft: NFT; edition: EditionSelection; quantity: number }[]
  version: number
  subtotalEth: string
}
