<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: ['guest'] })

import {
  LockClosedIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/vue/24/outline'

const { t } = useLocale()
const { apiFetch } = useApi()
const router = useRouter()
const route = useRoute()

useHead({ title: computed(() => t('auth.resetTitle')) })

const password = ref('')
const passwordConfirmation = ref('')
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const error = ref('')
const isSubmitting = ref(false)

const token = computed(() => route.params.token as string || '')

const passwordError = computed(() => {
  if (!password.value) return ''
  if (password.value.length < 6) return t('auth.passwordMin')
  return ''
})

const confirmationError = computed(() => {
  if (!passwordConfirmation.value) return ''
  if (passwordConfirmation.value !== password.value) return t('auth.passwordMismatch')
  return ''
})

const canSubmit = computed(() => {
  return password.value.length >= 6
    && passwordConfirmation.value === password.value
    && !isSubmitting.value
})

onMounted(() => {
  if (!token.value) {
    router.push('/auth/forgot-password')
  }
})

async function handleSubmit() {
  if (!canSubmit.value) return

  error.value = ''
  isSubmitting.value = true

  try {
    await apiFetch('/auth/reset-password', {
      method: 'POST',
      body: {
        token: token.value,
        password: password.value,
        passwordConfirmation: passwordConfirmation.value,
      },
    })
    router.push('/auth/login?reset=success')
  } catch (err: any) {
    error.value = err?.data?.message || t('auth.resetError')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div>
    <!-- Icon -->
    <div class="auth-icon-container">
      <LockClosedIcon class="auth-icon" />
    </div>

    <!-- Title -->
    <h1 class="auth-title">
      {{ t('auth.resetTitle') }}
    </h1>
    <p class="auth-subtitle">
      {{ t('auth.resetSubtitle') }}
    </p>

    <!-- Error message -->
    <div
      v-if="error"
      class="mb-4 p-4 bg-red-50 border border-red-200 rounded"
    >
      <div class="flex items-center gap-2 text-red-600">
        <ExclamationCircleIcon class="h-5 w-5" />
        <span class="text-sm font-medium">{{ error }}</span>
      </div>
    </div>

    <!-- Form -->
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- New password -->
      <div>
        <label for="password" class="block text-sm font-normal text-slate-700 mb-1">
          {{ t('auth.newPassword') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <LockClosedIcon class="h-5 w-5 text-slate-400" />
          </div>
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            required
            :placeholder="t('auth.newPasswordPlaceholder')"
            class="form-input !pl-11 !pr-11"
            :class="password && passwordError ? '!border-red-500' : ''"
          >
          <button
            type="button"
            class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
            @click="showPassword = !showPassword"
          >
            <EyeSlashIcon v-if="showPassword" class="h-5 w-5" />
            <EyeIcon v-else class="h-5 w-5" />
          </button>
        </div>
        <p v-if="passwordError" class="mt-1 text-xs text-red-500">
          {{ passwordError }}
        </p>
        <p v-else class="text-xs text-slate-500 mt-1">
          {{ t('auth.minChars') }}
        </p>
      </div>

      <!-- Confirm password -->
      <div>
        <label for="passwordConfirmation" class="block text-sm font-normal text-slate-700 mb-1">
          {{ t('auth.confirmNewPassword') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <LockClosedIcon class="h-5 w-5 text-slate-400" />
          </div>
          <input
            id="passwordConfirmation"
            v-model="passwordConfirmation"
            :type="showPasswordConfirmation ? 'text' : 'password'"
            autocomplete="new-password"
            required
            :placeholder="t('auth.confirmNewPasswordPlaceholder')"
            class="form-input !pl-11 !pr-11"
            :class="passwordConfirmation && confirmationError ? '!border-red-500' : ''"
          >
          <button
            type="button"
            class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
            @click="showPasswordConfirmation = !showPasswordConfirmation"
          >
            <EyeSlashIcon v-if="showPasswordConfirmation" class="h-5 w-5" />
            <EyeIcon v-else class="h-5 w-5" />
          </button>
        </div>
        <p v-if="confirmationError" class="mt-1 text-xs text-red-500">
          {{ confirmationError }}
        </p>
      </div>

      <!-- Submit -->
      <BaseButton
        type="submit"
        variant="primary"
        size="lg"
        :loading="isSubmitting"
        :disabled="!canSubmit"
        class="w-full !py-2 mt-2"
      >
        {{ t('auth.resetButton') }}
      </BaseButton>

      <!-- Back link -->
      <div class="mt-4 text-center">
        <NuxtLink
          to="/auth/login"
          class="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeftIcon class="h-4 w-4" />
          {{ t('auth.backToLogin') }}
        </NuxtLink>
      </div>
    </form>
  </div>
</template>
