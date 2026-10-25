import { useQuery } from '@tanstack/react-query'
import type { CatalogSearch } from '../../domain/catalog/catalog'
import { fetchCatalog, fetchNFT } from './api'

export const catalogKeys = {
  all: ['catalog'] as const,
  list: (search: CatalogSearch) => ['catalog', search] as const,
  detail: (id: string) => ['nft', id] as const,
}

export function useCatalog(search: CatalogSearch) {
  return useQuery({ queryKey: catalogKeys.list(search), queryFn: ({ signal }) => fetchCatalog(search, signal) })
}

export function useNFT(id: string) {
  return useQuery({ queryKey: catalogKeys.detail(id), queryFn: ({ signal }) => fetchNFT(id, signal), retry: false })
}
