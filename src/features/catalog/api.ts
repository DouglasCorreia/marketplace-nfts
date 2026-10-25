import { http } from '../../lib/http/client'
import type { CatalogSearch } from '../../domain/catalog/catalog'
import type { CatalogResponse, NFT } from '../../domain/catalog/types'

export async function fetchCatalog(search: CatalogSearch, signal?: AbortSignal): Promise<CatalogResponse> {
  const response = await http.get<CatalogResponse>('/nfts', { params: search, signal })
  return response.data
}

export async function fetchNFT(id: string, signal?: AbortSignal): Promise<NFT> {
  const response = await http.get<NFT>(`/nfts/${id}`, { signal })
  return response.data
}
