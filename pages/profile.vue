<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

const { t } = useLocale()
useHead({ title: computed(() => t('head.profile')) })

const authStore = useAuthStore()
const { updateProfile } = useAuth()
const { success, error: showError } = useToast()

const fullName = ref(authStore.user?.fullName ?? '')
const preferredLanguage = ref(authStore.user?.preferredLanguage ?? 'fr')
const saving = ref(false)

const initials = computed(() => {
  const name = authStore.user?.fullName ?? ''
  return name
    .split(' ')
    .map(p => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const handleSave = async () => {
  saving.value = true
  try {
    await updateProfile({
      fullName: fullName.value,
      preferredLanguage: preferredLanguage.value,
    })
    success('Profil mis a jour avec succes.')
  } catch {
    showError('Erreur lors de la mise a jour du profil.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-slate-900 mb-8">
      Mon profil
    </h1>

    <div class="card p-6 sm:p-8">
      <!-- Avatar -->
      <div class="flex items-center gap-5 mb-8 pb-8 border-b border-slate-200">
        <div v-if="authStore.user?.avatar" class="w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary-100">
          <img :src="authStore.user.avatar" :alt="authStore.user.fullName" class="w-full h-full object-cover" />
        </div>
        <div v-else class="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center ring-4 ring-primary-100">
          <span class="text-2xl font-bold text-white">{{ initials }}</span>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-slate-900">
            {{ authStore.user?.fullName }}
          </h2>
          <p class="text-sm text-slate-500">
            {{ authStore.user?.email }}
          </p>
          <div class="flex gap-2 mt-2">
            <span
              v-for="role in authStore.userRoles"
              :key="role"
              class="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700"
            >
              {{ role.replace('ROLE_', '') }}
            </span>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSave">
        <div class="space-y-5">
          <!-- Full name -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-slate-700 mb-1">
              Nom complet
            </label>
            <input
              id="fullName"
              v-model="fullName"
              type="text"
              class="input-field"
              required
            />
          </div>

          <!-- Email (readonly) -->
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="email"
              :value="authStore.user?.email"
              type="email"
              class="input-field !bg-slate-50 cursor-not-allowed"
              disabled
            />
            <p class="mt-1 text-xs text-slate-400">L'adresse email ne peut pas etre modifiee.</p>
          </div>

          <!-- Preferred language -->
          <div>
            <label for="preferredLanguage" class="block text-sm font-medium text-slate-700 mb-1">
              Langue preferee
            </label>
            <select
              id="preferredLanguage"
              v-model="preferredLanguage"
              class="input-field"
            >
              <option value="fr">Francais</option>
              <option value="mashi">Mashi</option>
              <option value="en">Anglais</option>
              <option value="sw">Swahili</option>
            </select>
          </div>
        </div>

        <!-- Save -->
        <div class="mt-8 flex justify-end">
          <button
            type="submit"
            class="btn btn-primary flex items-center gap-2"
            :disabled="saving"
          >
            <Icon v-if="saving" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
            <Icon v-else name="heroicons:check" class="w-4 h-4" />
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
