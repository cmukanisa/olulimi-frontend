export const useGoogleAuth = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const router = useRouter()

  const loading = ref(false)
  const error = ref<string | null>(null)

  const loginWithGoogle = async () => {
    if (!config.public.googleClientId) {
      error.value = 'Google OAuth non configure.'
      return
    }

    loading.value = true
    error.value = null

    try {
      const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
      googleAuthUrl.searchParams.set('client_id', config.public.googleClientId as string)
      googleAuthUrl.searchParams.set('redirect_uri', `${window.location.origin}/auth/google/callback`)
      googleAuthUrl.searchParams.set('response_type', 'code')
      googleAuthUrl.searchParams.set('scope', 'openid email profile')
      googleAuthUrl.searchParams.set('access_type', 'offline')
      googleAuthUrl.searchParams.set('prompt', 'select_account')

      window.location.href = googleAuthUrl.toString()
    } catch {
      error.value = 'Erreur lors de la connexion avec Google.'
      loading.value = false
    }
  }

  const handleGoogleCallback = async (code: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ token: string }>(`${config.public.apiBase}/login/google`, {
        method: 'POST',
        body: { code, redirectUri: `${window.location.origin}/auth/google/callback` },
      })

      authStore.setToken(response.token)
      await authStore.fetchUser()

      const roles = authStore.user?.roles || []
      if (roles.includes('ROLE_ADMIN')) {
        await router.push('/admin')
      } else if (roles.includes('ROLE_TEACHER')) {
        await router.push('/teacher')
      } else {
        await router.push('/dashboard')
      }
    } catch {
      error.value = 'Erreur lors de la connexion avec Google.'
    } finally {
      loading.value = false
    }
  }

  return { loading, error, loginWithGoogle, handleGoogleCallback }
}
