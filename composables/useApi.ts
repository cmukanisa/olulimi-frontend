export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const { error: showError, warning: showWarning } = useToast()

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
      } else if (!error.statusCode || error.message?.includes('fetch') || error.message?.includes('Failed') || error.message?.includes('ECONNREFUSED')) {
        if (!navigator.onLine) {
          showWarning('Vous etes hors ligne. Verifiez votre connexion internet.')
        } else {
          showError('Le serveur est indisponible. Veuillez reessayer plus tard.')
        }
      } else if (error.statusCode >= 500) {
        showError('Erreur serveur. Veuillez reessayer plus tard.')
      }
      throw error
    }
  }

  const checkBackendHealth = async (): Promise<boolean> => {
    try {
      await $fetch(`${config.public.apiBase}/courses`, {
        method: 'GET',
        timeout: 5000,
      })
      return true
    } catch {
      return false
    }
  }

  return { apiFetch, checkBackendHealth }
}
