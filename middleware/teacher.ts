export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }
  if (!authStore.isTeacher && !authStore.isAdmin) {
    return navigateTo('/dashboard')
  }
})
