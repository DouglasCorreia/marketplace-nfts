import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { catalogKeys } from '../features/catalog/queries'
import { socket, type CatalogUpdateEvent } from '../lib/socket/client'

export function LiveUpdates() {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    let latestVersion = 0

    const onConnect = () => {
      socket.emit('catalog:subscribe')
    
      void queryClient.invalidateQueries({ queryKey: catalogKeys.all })
    }
    
    const onCatalogUpdate = (event: CatalogUpdateEvent) => {
      if (event.version <= latestVersion) return
      latestVersion = event.version
      void queryClient.invalidateQueries({ queryKey: catalogKeys.all })
    }
    
    socket.on('connect', onConnect)
    socket.on('catalog:update', onCatalogUpdate)
    socket.connect()
    
    return () => {
      socket.off('connect', onConnect)
      socket.off('catalog:update', onCatalogUpdate)
      socket.disconnect()
    }
  }, [queryClient])
  
  return null
}
