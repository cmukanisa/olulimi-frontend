export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()


  const apiFetch = async <T>(url: string, options: any = {}): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }

    try {
      return await $fetch<T>(`${config.public.apiBase}${url}`, {
        ...options,
        headers,
      })
    } catch (error: any) {
      if (error.statusCode === 401 && authStore.token) {
        authStore.logout()
        navigateTo('/auth/login')
      }
      throw error
    }
  }

  const checkBackendHealth = async (): Promise<boolean> => {
    try {
      await $fetch.raw(`${config.public.apiBase}`, {
        method: 'HEAD',
        timeout: 5000,
      })
      return true
    } catch (err: unknown) {
      const error = err as { statusCode?: number }
      return !!error.statusCode && error.statusCode < 500
    }
  }

  return { apiFetch, checkBackendHealth }
}
