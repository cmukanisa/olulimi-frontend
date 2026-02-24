import { defineStore } from 'pinia'
import type { User, AuthTokenResponse } from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig()
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isTeacher = computed(() => user.value?.roles.includes('ROLE_TEACHER') ?? false)
  const isAdmin = computed(() => user.value?.roles.includes('ROLE_ADMIN') ?? false)
  const userRoles = computed(() => user.value?.roles ?? [])

  const setToken = (newToken: string) => {
    token.value = newToken
    if (import.meta.client) {
      localStorage.setItem('auth_token', newToken)
    }
  }

  const setUser = (newUser: User) => {
    user.value = newUser
  }

  const apiFetch = async <T>(url: string, options: any = {}): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    }
    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }
    return await $fetch<T>(`${config.public.apiBase}${url}`, {
      ...options,
      headers,
    })
  }

  const fetchUser = async () => {
    try {
      const userData = await apiFetch<User>('/me')
      user.value = userData
    } catch {
      logout()
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiFetch<AuthTokenResponse>('/login', {
        method: 'POST',
        body: { email, password },
      })
      setToken(response.token)
      await fetchUser()
      return { success: true }
    } catch (e: any) {
      return { success: false, message: e?.data?.message || 'Identifiants incorrects' }
    }
  }

  const register = async (fullName: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      await apiFetch('/register', {
        method: 'POST',
        body: { fullName, email, password },
      })
      return await login(email, password)
    } catch (e: any) {
      return { success: false, message: e?.data?.message || 'Erreur lors de l\'inscription' }
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    if (import.meta.client) {
      localStorage.removeItem('auth_token')
    }
  }

  const initAuth = () => {
    if (import.meta.client) {
      const savedToken = localStorage.getItem('auth_token')
      if (savedToken) {
        token.value = savedToken
      }
    }
  }

  return { user, token, isAuthenticated, isTeacher, isAdmin, userRoles, setToken, setUser, login, register, logout, initAuth, fetchUser }
})
