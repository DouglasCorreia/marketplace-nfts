import { useCallback, useEffect, useState } from 'react'

const FAVORITES_STORAGE_KEY = 'kurio:favorites:v1'

function readFavorites(): string[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(readFavorites)

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === FAVORITES_STORAGE_KEY || event.key === null) setFavoriteIds(readFavorites())
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds))
    } catch {
      // Favorites remain available for the current page when browser storage is unavailable.
    }
  }, [favoriteIds])

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((current) => current.includes(id)
      ? current.filter((favoriteId) => favoriteId !== id)
      : [...current, id])
  }, [])

  return { favoriteIds, toggleFavorite }
}
