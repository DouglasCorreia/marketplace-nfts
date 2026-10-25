import { rm } from 'node:fs/promises'

await rm('.mock-data', { recursive: true, force: true })
console.log('Mock state cleared.')
