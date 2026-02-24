export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()

  authStore.initAuth()

  if (authStore.token) {
    await authStore.fetchUser()
  }
})
