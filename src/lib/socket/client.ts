import { io } from 'socket.io-client'

export const socket = io({
  path: '/socket.io',
  transports: ['websocket'],
  autoConnect: false,
  reconnectionDelay: 500,
  reconnectionDelayMax: 3000,
})

export interface CatalogUpdateEvent {
  version: number
  updatedAt: string
}
