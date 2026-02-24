<script setup lang="ts">
const { t } = useLocale()

interface Props {
  error: {
    statusCode: number
    message: string
  }
}

const props = defineProps<Props>()

useHead({ title: `${t('error.headTitle')} ${props.error.statusCode} — Olulimi Lwirhu` })

const title = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return t('error.404.title')
    case 403:
      return t('error.403.title')
    case 500:
      return t('error.500.title')
    default:
      return t('error.default.title')
  }
})

const description = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return t('error.404.description')
    case 403:
      return t('error.403.description')
    case 500:
      return t('error.500.description')
    default:
      return props.error.message || t('error.default.description')
  }
})

const illustration = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return 'heroicons:map'
    case 403:
      return 'heroicons:lock-closed'
    case 500:
      return 'heroicons:server-stack'
    default:
      return 'heroicons:exclamation-triangle'
  }
})

const handleGoHome = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen bg-white flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">
      <!-- Illustration -->
      <div class="mb-8">
        <div class="w-32 h-32 mx-auto rounded-full bg-primary-50 flex items-center justify-center mb-6">
          <Icon :name="illustration" class="w-16 h-16 text-primary-400" />
        </div>
        <p class="text-7xl font-bold text-primary-600 mb-4 tabular-nums">
          {{ error.statusCode }}
        </p>
      </div>

      <!-- Title and description -->
      <h1 class="text-2xl font-bold text-slate-900 mb-3">
        {{ title }}
      </h1>
      <p class="text-slate-600 mb-8 leading-relaxed">
        {{ description }}
      </p>

      <!-- Actions -->
      <div class="flex items-center justify-center gap-4">
        <button class="btn btn-primary flex items-center gap-2" @click="handleGoHome">
          <Icon name="heroicons:home" class="w-5 h-5" />
          {{ t('error.goHome') }}
        </button>
        <button class="btn btn-outline" @click="$router.back()">
          {{ t('error.goBack') }}
        </button>
      </div>

      <!-- Branding -->
      <p class="mt-12 text-sm text-slate-400">
        {{ t('error.branding') }}
      </p>
    </div>
  </div>
</template>
