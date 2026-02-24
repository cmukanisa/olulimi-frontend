<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: ['guest'] })

import {
  ShieldCheckIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/vue/24/outline'

const { t } = useLocale()
const { apiFetch } = useApi()
const router = useRouter()

useHead({ title: computed(() => t('auth.verifyTitle')) })

// Reset code storage
const STORAGE_KEY = 'reset_code_data'
const CODE_EXPIRY_MINUTES = 15

interface StoredIdentifier {
  identifier: string
  type: 'email' | 'phone'
  expiresAt: number
}

function getStoredIdentifier(): StoredIdentifier | null {
  if (typeof window !== 'undefined') {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) return JSON.parse(data)
    } catch {}
  }
  return null
}

function getRemainingTime(): number {
  const stored = getStoredIdentifier()
  if (!stored) return 0
  return Math.max(0, Math.floor((stored.expiresAt - Date.now()) / 1000))
}

function formatRemainingTime(): string {
  const seconds = getRemainingTime()
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function isCodeExpired(): boolean {
  return getRemainingTime() <= 0
}

function clearResetCode(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY)
}

const storedData = ref(getStoredIdentifier())
const contact = computed(() => storedData.value?.identifier || '')

// 6-digit code inputs
const codeInputs = ref<string[]>(['', '', '', '', '', ''])
const inputRefs = ref<(HTMLInputElement | null)[]>([])
const error = ref('')
const isSubmitting = ref(false)
const isResending = ref(false)
const resendCooldown = ref(0)

const remainingTime = ref(getRemainingTime())
const remainingTimeFormatted = computed(() => formatRemainingTime())
let countdownInterval: ReturnType<typeof setInterval> | null = null

function startCountdown() {
  countdownInterval = setInterval(() => {
    remainingTime.value = getRemainingTime()
    if (isCodeExpired()) {
      if (countdownInterval) clearInterval(countdownInterval)
      error.value = t('auth.codeExpired')
    }
  }, 1000)
}

const fullCode = computed(() => codeInputs.value.join(''))
const isCodeComplete = computed(() => fullCode.value.length === 6 && codeInputs.value.every(c => /^\d$/.test(c)))

function handleInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')

  if (value.length === 0) {
    target.value = ''
    codeInputs.value[index] = ''
    return
  }

  if (value.length > 1) {
    const digits = value.slice(0, 6 - index).split('')
    digits.forEach((digit, i) => {
      if (index + i < 6) codeInputs.value[index + i] = digit
    })
    target.value = digits[0]
    const nextEmptyIndex = codeInputs.value.findIndex((c, i) => i >= index && c === '')
    nextTick(() => inputRefs.value[nextEmptyIndex === -1 ? 5 : nextEmptyIndex]?.focus())
    return
  }

  const digit = value.charAt(0)
  target.value = digit
  codeInputs.value[index] = digit

  if (digit && index < 5) {
    nextTick(() => inputRefs.value[index + 1]?.focus())
  }

  if (isCodeComplete.value) handleSubmit()
}

function handleKeypress(event: KeyboardEvent) {
  if (!/^\d$/.test(event.key)) event.preventDefault()
}

function handleKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace') {
    if (!codeInputs.value[index] && index > 0) {
      event.preventDefault()
      codeInputs.value[index - 1] = ''
      nextTick(() => inputRefs.value[index - 1]?.focus())
    } else {
      codeInputs.value[index] = ''
    }
  } else if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    inputRefs.value[index - 1]?.focus()
  } else if (event.key === 'ArrowRight' && index < 5) {
    event.preventDefault()
    inputRefs.value[index + 1]?.focus()
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault()
  const digits = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6).split('')
  digits.forEach((digit, i) => { codeInputs.value[i] = digit })
  const nextEmptyIndex = codeInputs.value.findIndex(c => c === '')
  nextTick(() => inputRefs.value[nextEmptyIndex === -1 ? 5 : nextEmptyIndex]?.focus())
  if (digits.length === 6) nextTick(() => handleSubmit())
}

function setInputRef(el: HTMLInputElement | null, index: number) {
  inputRefs.value[index] = el
}

async function handleSubmit() {
  if (!isCodeComplete.value || isSubmitting.value) return
  if (isCodeExpired()) {
    error.value = t('auth.codeExpired')
    return
  }

  error.value = ''
  isSubmitting.value = true

  try {
    const response = await apiFetch<{ resetToken: string }>('/auth/verify-code', {
      method: 'POST',
      body: { email: contact.value, code: fullCode.value },
    })
    clearResetCode()
    router.push(`/auth/reset-password/${response.resetToken}`)
  } catch (err: any) {
    error.value = err?.data?.message || t('auth.codeInvalid')
    codeInputs.value = ['', '', '', '', '', '']
    nextTick(() => inputRefs.value[0]?.focus())
  } finally {
    isSubmitting.value = false
  }
}

async function resendCode() {
  if (isResending.value || resendCooldown.value > 0) return
  isResending.value = true
  error.value = ''

  try {
    await apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: { email: contact.value },
    })

    if (typeof window !== 'undefined') {
      const stored = getStoredIdentifier()
      if (stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          ...stored,
          expiresAt: Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000,
        }))
      }
    }

    storedData.value = getStoredIdentifier()
    remainingTime.value = getRemainingTime()
    resendCooldown.value = 60

    if (countdownInterval) clearInterval(countdownInterval)
    startCountdown()

    const interval = setInterval(() => {
      resendCooldown.value--
      if (resendCooldown.value <= 0) clearInterval(interval)
    }, 1000)
  } catch (err: any) {
    error.value = err?.data?.message || t('auth.resendError')
  } finally {
    isResending.value = false
  }
}

onMounted(() => {
  if (!storedData.value || isCodeExpired()) {
    clearResetCode()
    router.push('/auth/forgot-password')
    return
  }
  startCountdown()
  nextTick(() => inputRefs.value[0]?.focus())
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

<template>
  <div>
    <!-- Icon -->
    <div class="auth-icon-container">
      <ShieldCheckIcon class="auth-icon" />
    </div>

    <!-- Title -->
    <h1 class="auth-title">
      {{ t('auth.verifyTitle') }}
    </h1>
    <p class="auth-subtitle !mb-2">
      {{ t('auth.verifySubtitle') }}
    </p>
    <p class="text-primary-600 font-medium text-center mb-4">
      {{ contact }}
    </p>

    <!-- Countdown -->
    <div class="flex items-center justify-center gap-2 mb-4">
      <ClockIcon class="h-4 w-4 text-slate-400" />
      <span
        class="text-sm font-medium"
        :class="remainingTime < 120 ? 'text-red-500' : 'text-slate-500'"
      >
        {{ t('auth.codeExpires') }} {{ remainingTimeFormatted }}
      </span>
    </div>

    <!-- Error -->
    <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded">
      <div class="flex items-center gap-2 text-red-600">
        <ExclamationCircleIcon class="h-5 w-5" />
        <span class="text-sm font-medium">{{ error }}</span>
      </div>
    </div>

    <!-- Code inputs -->
    <form @submit.prevent @paste="handlePaste">
      <div class="flex justify-center gap-2 sm:gap-3 mb-4">
        <input
          v-for="(_, index) in 6"
          :key="index"
          :ref="(el) => setInputRef(el as HTMLInputElement, index)"
          v-model="codeInputs[index]"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="6"
          autocomplete="one-time-code"
          :disabled="isSubmitting"
          class="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="codeInputs[index]
            ? 'border-primary-400 bg-primary-50 text-primary-700'
            : 'border-slate-300 bg-white text-slate-900'"
          @input="handleInput(index, $event)"
          @keypress="handleKeypress"
          @keydown="handleKeydown(index, $event)"
          @focus="inputRefs[index]?.select()"
        >
      </div>

      <div v-if="isSubmitting" class="flex items-center justify-center gap-2 py-3 text-primary-600">
        <span class="inline-flex gap-1">
          <span class="w-2 h-2 bg-primary-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span class="w-2 h-2 bg-primary-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span class="w-2 h-2 bg-primary-600 rounded-full animate-bounce" />
        </span>
        <span class="font-medium">{{ t('auth.verifying') }}</span>
      </div>
      <p v-else class="text-center text-sm text-slate-500">
        {{ t('auth.codeAutoVerify') }}
      </p>
    </form>

    <!-- Resend -->
    <div class="mt-4 text-center">
      <p class="text-sm text-slate-500 mb-2">{{ t('auth.noCodeReceived') }}</p>
      <button
        :disabled="isResending || resendCooldown > 0"
        class="text-sm font-medium transition-colors"
        :class="isResending || resendCooldown > 0
          ? 'text-slate-400 cursor-not-allowed'
          : 'text-primary-600 hover:text-primary-700'"
        @click="resendCode"
      >
        <span v-if="isResending" class="flex items-center justify-center gap-1">
          <span class="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span class="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span class="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce" />
        </span>
        <span v-else-if="resendCooldown > 0">{{ t('auth.resendIn') }} {{ resendCooldown }}s</span>
        <span v-else>{{ t('auth.resendCode') }}</span>
      </button>
    </div>

    <!-- Tip -->
    <div class="mt-8 p-4 bg-slate-50 rounded">
      <div class="flex items-start gap-3">
        <DevicePhoneMobileIcon class="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
        <div class="text-sm text-slate-500">
          <p class="font-medium text-slate-700 mb-1">{{ t('auth.tip') }}</p>
          <p>{{ t('auth.tipText') }}</p>
        </div>
      </div>
    </div>

    <!-- Back link -->
    <div class="mt-4 text-center">
      <NuxtLink
        to="/auth/forgot-password"
        class="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600 transition-colors"
      >
        <ArrowLeftIcon class="h-4 w-4" />
        {{ t('auth.changeMethod') }}
      </NuxtLink>
    </div>
  </div>
</template>
