import type { LoginRequest, RegisterRequest, User, AuthTokenResponse } from '~/types/auth'

export const useAuth = () => {
  const { apiFetch } = useApi()
  const authStore = useAuthStore()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const login = async (credentials: LoginRequest) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiFetch<AuthTokenResponse>('/login', {
        method: 'POST',
        body: credentials,
      })
      authStore.setToken(response.token)
      await fetchUser()
      return true
    } catch (e: any) {
      error.value = e?.data?.message || 'Identifiants incorrects'
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (data: RegisterRequest) => {
    loading.value = true
    error.value = null
    try {
      await apiFetch('/register', {
        method: 'POST',
        body: data,
      })
      return await login({ email: data.email, password: data.password })
    } catch (e: any) {
      error.value = e?.data?.message || "Erreur lors de l'inscription"
      return false
    } finally {
      loading.value = false
    }
  }

  const fetchUser = async () => {
    try {
      const user = await apiFetch<User>('/me')
      authStore.setUser(user)
    } catch {
      authStore.logout()
    }
  }

  const updateProfile = async (data: { fullName: string; preferredLanguage: string }) => {
    loading.value = true
    error.value = null
    try {
      const user = await apiFetch<User>('/me', {
        method: 'PUT',
        body: data,
      })
      authStore.setUser(user)
      return true
    } catch (e: any) {
      error.value = e?.data?.message || 'Erreur lors de la mise a jour du profil'
      throw e
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    authStore.logout()
    navigateTo('/auth/login')
  }

  return { login, register, logout, fetchUser, updateProfile, loading, error }
}
