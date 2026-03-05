export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const { warning } = useToast()

  const checkBackend = async () => {
    try {
      await $fetch.raw(`${config.public.apiBase}`, {
        method: 'HEAD',
        timeout: 5000,
      })
    } catch (err: unknown) {
      const error = err as { statusCode?: number }
      if (error.statusCode && error.statusCode < 500) return
      if (!navigator.onLine) {
        warning('Vous êtes hors ligne.')
      } else {
        warning('Serveur indisponible.')
      }
    }
  }

  // Check on app startup
  await checkBackend()

  // Listen for online/offline events
  window.addEventListener('offline', () => {
    warning('Connexion perdue.')
  })

  window.addEventListener('online', () => {
    const { success } = useToast()
    success('Connexion rétablie.')
    checkBackend()
  })
})
