export interface User {
  id: string
  email: string
  fullName: string
  avatar: string | null
  preferredLanguage: string
  roles: string[]
  isActive: boolean
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
}

export interface AuthTokenResponse {
  token: string
}
