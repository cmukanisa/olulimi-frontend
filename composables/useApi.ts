export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const { error: showError } = useToast()

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
      if (error.statusCode === 401) {
        authStore.logout()
        navigateTo('/auth/login')
      } else if (!error.statusCode && error.message?.includes('fetch')) {
        showError('Le serveur est indisponible. Veuillez reessayer plus tard.')
      }
      throw error
    }
  }

  return { apiFetch }
}
