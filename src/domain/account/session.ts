export interface User {
  id: string
  name: string
  email: string
}

export interface SessionResponse {
  user: User | null
}
