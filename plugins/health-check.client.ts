export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const { warning } = useToast()

  const checkBackend = async () => {
    try {
      await $fetch(`${config.public.apiBase}/courses`, {
        method: 'GET',
        timeout: 5000,
      })
    } catch {
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
