<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const { t } = useLocale()
useHead({ title: computed(() => t('head.googleCallback')) })

const route = useRoute()
const { handleGoogleCallback, loading, error } = useGoogleAuth()

onMounted(async () => {
  const code = route.query.code as string
  if (code) {
    await handleGoogleCallback(code)
  }
})
</script>

<template>
  <div class="text-center py-12">
    <div v-if="loading" class="space-y-4">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 mx-auto" />
      <p class="text-slate-600">
        {{ t('auth.googleLoading') }}
      </p>
    </div>
    <div v-else-if="error" class="space-y-4">
      <p class="text-red-600">{{ error }}</p>
      <NuxtLink to="/auth/login" class="btn btn-outline inline-flex">
        {{ t('auth.googleBack') }}
      </NuxtLink>
    </div>
  </div>
</template>
