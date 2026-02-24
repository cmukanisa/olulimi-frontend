<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: ['guest'] })

import {
  KeyIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline'

const { t } = useLocale()
const { apiFetch } = useApi()

useHead({ title: computed(() => t('auth.forgotTitle')) })

const email = ref('')
const error = ref('')
const isSubmitting = ref(false)
const linkSent = ref(false)

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const emailError = computed(() => {
  if (!email.value) return null
  if (!emailRegex.test(email.value)) return t('auth.emailInvalid')
  return null
})

const canSubmit = computed(() => {
  return emailRegex.test(email.value) && !isSubmitting.value
})

async function handleSubmit() {
  if (!canSubmit.value) return

  error.value = ''
  isSubmitting.value = true

  try {
    await apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value.trim() },
    })
    linkSent.value = true
  } catch (err: any) {
    // Show success anyway to prevent email enumeration
    linkSent.value = true
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div>
    <!-- Icon -->
    <div class="auth-icon-container">
      <KeyIcon class="auth-icon" />
    </div>

    <!-- Title -->
    <h1 class="auth-title">
      {{ t('auth.forgotTitle') }}
    </h1>
    <p class="auth-subtitle">
      {{ t('auth.forgotSubtitle') }}
    </p>

    <!-- Success message -->
    <div
      v-if="linkSent"
      class="mb-4 p-4 bg-green-50 border border-green-200 rounded"
    >
      <div class="flex items-start gap-2 text-green-600">
        <CheckCircleIcon class="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <p class="text-sm font-medium">{{ t('auth.resetLinkSent') }}</p>
          <p class="text-sm mt-1 text-green-500">{{ t('auth.resetLinkSentDesc') }}</p>
        </div>
      </div>
    </div>

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
    <form
      v-if="!linkSent"
      class="space-y-5"
      @submit.prevent="handleSubmit"
    >
      <!-- Email field -->
      <div>
        <label for="email" class="block text-sm font-normal text-slate-700 mb-1">
          {{ t('auth.emailOrPhone') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <EnvelopeIcon class="h-5 w-5" :class="email && !emailError ? 'text-primary-500' : 'text-slate-400'" />
          </div>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            required
            autofocus
            placeholder="email@exemple.com"
            class="form-input !pl-11"
            :class="[
              email && emailError ? '!border-red-500' : '',
              email && !emailError ? '!border-primary-300' : ''
            ]"
          >
        </div>
        <p v-if="emailError" class="mt-1 text-xs text-red-500">
          {{ emailError }}
        </p>
      </div>

      <!-- Submit button -->
      <BaseButton
        type="submit"
        variant="primary"
        size="lg"
        :loading="isSubmitting"
        :disabled="!canSubmit"
        class="w-full !py-2 mt-2"
      >
        {{ t('auth.sendResetLink') }}
      </BaseButton>
    </form>

    <!-- Back to login (after success) -->
    <div v-if="linkSent" class="mt-4">
      <NuxtLink
        to="/auth/login"
        class="w-full flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <ArrowLeftIcon class="h-4 w-4" />
        {{ t('auth.backToLogin') }}
      </NuxtLink>
    </div>

    <!-- Back link -->
    <div v-else class="mt-4 text-center">
      <NuxtLink
        to="/auth/login"
        class="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600 transition-colors"
      >
        <ArrowLeftIcon class="h-4 w-4" />
        {{ t('auth.backToLogin') }}
      </NuxtLink>
    </div>
  </div>
</template>
