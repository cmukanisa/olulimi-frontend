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
        warning('Vous etes hors ligne. Verifiez votre connexion internet.')
      } else {
        warning('Le serveur backend est indisponible. Certaines fonctionnalites peuvent ne pas fonctionner.')
      }
    }
  }

  // Check on app startup
  await checkBackend()

  // Listen for online/offline events
  window.addEventListener('offline', () => {
    warning('Connexion perdue. Vous etes hors ligne.')
  })

  window.addEventListener('online', () => {
    const { success } = useToast()
    success('Connexion retablie.')
    checkBackend()
  })
})
