import type { NFT } from '../../domain/catalog/types'

const artworkFiles: Record<NFT['artwork'], string> = {
  'emerald-ape': 'emerald-ape',
  'sage-nomad': 'sage-nomad',
  'ivory-baron': 'ivory-baron',
  'golden-beat': 'golden-beat',
}

export function Artwork({ nft, className = '', loading = 'lazy', fetchPriority = 'auto' }: { nft: NFT; className?: string; loading?: 'eager' | 'lazy'; fetchPriority?: 'high' | 'low' | 'auto' }) {
  const file = artworkFiles[nft.artwork]
  return <div className={`relative isolate h-full w-full overflow-hidden bg-kurio-panel ${className}`}><img className="absolute inset-0 block size-full object-cover" src={`/assets/nfts/${file}.png`} alt={`Arte ${nft.name}`} loading={loading} decoding="async" fetchPriority={fetchPriority} /></div>
}
