<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: ['guest'] })
useHead({ title: 'Connexion' })

import {
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EnvelopeIcon,
  UserIcon,
  LockClosedIcon,
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth'

const { t } = useLocale()
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const { loginWithGoogle, loading: googleLoading } = useGoogleAuth()

const email = ref('')
const password = ref('')

const loading = ref(false)
const error = ref<string | null>(null)

const showPassword = ref(false)
const rememberMe = ref(false)

const showResetSuccess = ref(route.query.reset === 'success')

const isEmail = computed(() => {
  return email.value.includes('@')
})

const isFormValid = computed(() => {
  if (!email.value) return false
  if (isEmail.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.value) && password.value.length >= 1
  }
  return email.value.length > 0 && password.value.length >= 1
})

const emailError = computed(() => {
  if (!email.value) return null
  if (isEmail.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      return t('auth.emailInvalid')
    }
  }
  return null
})

async function handleSubmit() {
  if (!isFormValid.value) return

  error.value = null
  loading.value = true

  try {
    const result = await auth.login(email.value.trim(), password.value)

    if (result.success) {
      let redirectUrl = ''
      if (typeof window !== 'undefined') {
        const storedUrl = localStorage.getItem('auth_redirect_url')
        if (storedUrl && storedUrl !== '/auth/login' && !storedUrl.startsWith('/auth/')) {
          redirectUrl = storedUrl
          localStorage.removeItem('auth_redirect_url')
        }
      }

      if (!redirectUrl) {
        const roles = auth.user?.roles || []
        if (roles.includes('ROLE_ADMIN')) {
          redirectUrl = '/admin'
        } else if (roles.includes('ROLE_TEACHER')) {
          redirectUrl = '/teacher'
        } else {
          redirectUrl = '/dashboard'
        }
      }

      await router.push(redirectUrl)
    } else {
      error.value = result.message || t('auth.loginError')
    }
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : t('auth.connectionError')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <!-- Icon -->
    <div class="auth-icon-container">
      <UserIcon class="auth-icon" />
    </div>

    <!-- Title -->
    <h1 class="auth-title">
      {{ t('auth.login') }}
    </h1>
    <p class="auth-subtitle">
      {{ t('auth.loginSubtitle') }}
    </p>

    <!-- Success message after password reset -->
    <div
      v-if="showResetSuccess"
      class="mb-4 p-4 bg-green-50 border border-green-200 rounded"
    >
      <div class="flex items-center gap-2 text-green-600">
        <CheckCircleIcon class="h-5 w-5" />
        <span class="text-sm font-medium">{{ t('auth.passwordReset') }}</span>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="error"
      class="mb-4 p-4 bg-red-50 border border-red-200 rounded"
    >
      <div class="flex items-center gap-2 text-red-600">
        <ExclamationCircleIcon class="h-5 w-5" />
        <span class="text-sm font-medium">{{ error }}</span>
      </div>
    </div>

    <!-- Login Form -->
    <form
      class="space-y-3"
      @submit.prevent="handleSubmit"
    >
      <!-- Email Field -->
      <div>
        <label
          for="email"
          class="block text-sm font-normal text-slate-700 mb-1"
        >
          {{ t('auth.email') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <EnvelopeIcon
              v-if="isEmail"
              class="h-5 w-5 text-primary-500"
            />
            <UserIcon
              v-else
              class="h-5 w-5 text-slate-400"
            />
          </div>
          <input
            id="email"
            v-model="email"
            type="text"
            autocomplete="username"
            required
            autofocus
            placeholder="email@exemple.com"
            class="form-input !pl-11"
            :class="[
              email && emailError ? '!border-red-500' : '',
              isEmail && !emailError ? '!border-primary-300' : ''
            ]"
          >
        </div>
        <p
          v-if="emailError"
          class="mt-1 text-xs text-red-500"
        >
          {{ emailError }}
        </p>
      </div>

      <!-- Password Field -->
      <div>
        <label
          for="password"
          class="block text-sm font-normal text-slate-700 mb-1"
        >
          {{ t('auth.password') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <LockClosedIcon class="h-5 w-5 text-slate-400" />
          </div>
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            required
            placeholder="••••••••"
            class="form-input !pl-11 !pr-11"
          >
          <button
            type="button"
            class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
            @click="showPassword = !showPassword"
          >
            <EyeSlashIcon
              v-if="showPassword"
              class="h-5 w-5"
            />
            <EyeIcon
              v-else
              class="h-5 w-5"
            />
          </button>
        </div>
      </div>

      <!-- Remember Me & Forgot Password -->
      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="rememberMe"
            type="checkbox"
            class="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          >
          <span class="text-sm text-slate-600">{{ t('auth.rememberMe') }}</span>
        </label>
        <NuxtLink
          to="/auth/forgot-password"
          class="text-sm text-primary-600 hover:underline"
        >
          {{ t('auth.forgotPassword') }}
        </NuxtLink>
      </div>

      <!-- Submit Button -->
      <BaseButton
        type="submit"
        variant="primary"
        size="lg"
        :loading="loading"
        :disabled="!isFormValid"
        class="w-full !py-2 mt-2"
      >
        {{ t('auth.submit') }}
      </BaseButton>
    </form>

    <!-- Divider -->
    <div class="relative my-5">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-slate-200" />
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-3 bg-slate-50 text-slate-400">{{ t('auth.or') }}</span>
      </div>
    </div>

    <!-- Google OAuth -->
    <button
      type="button"
      :disabled="googleLoading"
      class="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50"
      @click="loginWithGoogle"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      <span>{{ t('auth.googleContinue') }}</span>
    </button>

    <!-- Register link -->
    <div class="mt-6 text-center">
      <span class="text-sm text-slate-500">{{ t('auth.noAccount') }}</span>
      <NuxtLink
        to="/auth/register"
        class="text-sm text-primary-600 hover:underline ml-1"
      >
        {{ t('auth.signUp') }}
      </NuxtLink>
    </div>
  </div>
</template>
