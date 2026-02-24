<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: ['guest'] })
useHead({ title: 'Inscription' })

import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserPlusIcon,
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth'

const { t } = useLocale()
const router = useRouter()
const auth = useAuthStore()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const loading = ref(false)
const error = ref<string | null>(null)

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const isEmail = computed(() => email.value.includes('@'))

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

const passwordError = computed(() => {
  if (!password.value) return null
  if (password.value.length < 6) {
    return t('auth.passwordMin')
  }
  return null
})

const confirmPasswordError = computed(() => {
  if (!confirmPassword.value) return null
  if (confirmPassword.value !== password.value) {
    return t('auth.passwordMismatch')
  }
  return null
})

const isFormValid = computed(() => {
  return (
    fullName.value.length >= 2 &&
    email.value.length > 0 &&
    !emailError.value &&
    password.value.length >= 6 &&
    !passwordError.value &&
    confirmPassword.value === password.value
  )
})

async function handleSubmit() {
  if (!isFormValid.value) return

  error.value = null
  loading.value = true

  try {
    const result = await auth.register(fullName.value.trim(), email.value.trim(), password.value)

    if (result.success) {
      await router.push('/dashboard')
    } else {
      error.value = result.message || t('auth.registerError')
    }
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : t('auth.registerError')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <!-- Icon -->
    <div class="auth-icon-container">
      <UserPlusIcon class="auth-icon" />
    </div>

    <!-- Title -->
    <h1 class="auth-title">
      {{ t('auth.register') }}
    </h1>
    <p class="auth-subtitle">
      {{ t('auth.registerSubtitle') }}
    </p>

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

    <!-- Register Form -->
    <form
      class="space-y-3"
      @submit.prevent="handleSubmit"
    >
      <!-- Full Name Field -->
      <div>
        <label
          for="fullName"
          class="block text-sm font-normal text-slate-700 mb-1"
        >
          {{ t('auth.fullName') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <UserIcon class="h-5 w-5 text-slate-400" />
          </div>
          <input
            id="fullName"
            v-model="fullName"
            type="text"
            autocomplete="name"
            required
            autofocus
            placeholder="Jean Dupont"
            class="form-input !pl-11"
          >
        </div>
      </div>

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
            <EnvelopeIcon
              v-else
              class="h-5 w-5 text-slate-400"
            />
          </div>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            required
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
            autocomplete="new-password"
            required
            :placeholder="t('auth.passwordMinPlaceholder')"
            class="form-input !pl-11 !pr-11"
            :class="password && passwordError ? '!border-red-500' : ''"
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
        <p
          v-if="passwordError"
          class="mt-1 text-xs text-red-500"
        >
          {{ passwordError }}
        </p>
      </div>

      <!-- Confirm Password Field -->
      <div>
        <label
          for="confirmPassword"
          class="block text-sm font-normal text-slate-700 mb-1"
        >
          {{ t('auth.confirmPassword') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <LockClosedIcon class="h-5 w-5 text-slate-400" />
          </div>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            autocomplete="new-password"
            required
            :placeholder="t('auth.repeatPassword')"
            class="form-input !pl-11 !pr-11"
            :class="confirmPassword && confirmPasswordError ? '!border-red-500' : ''"
          >
          <button
            type="button"
            class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <EyeSlashIcon
              v-if="showConfirmPassword"
              class="h-5 w-5"
            />
            <EyeIcon
              v-else
              class="h-5 w-5"
            />
          </button>
        </div>
        <p
          v-if="confirmPasswordError"
          class="mt-1 text-xs text-red-500"
        >
          {{ confirmPasswordError }}
        </p>
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
        {{ t('auth.registerButton') }}
      </BaseButton>
    </form>

    <!-- Login link -->
    <div class="mt-6 text-center">
      <span class="text-sm text-slate-500">{{ t('auth.hasAccount') }}</span>
      <NuxtLink
        to="/auth/login"
        class="text-sm text-primary-600 hover:underline ml-1"
      >
        {{ t('auth.signIn') }}
      </NuxtLink>
    </div>
  </div>
</template>
