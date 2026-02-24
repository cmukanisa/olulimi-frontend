<script setup lang="ts">
import type { User } from '~/types/auth'

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const route = useRoute()
const userId = route.params.id as string

const { fetchUser, updateUser, deactivateUser } = useAdmin()
const { success, error: showError } = useToast()

const user = ref<User | null>(null)
const loading = ref(true)
const saving = ref(false)
const showDeactivateModal = ref(false)

const selectedRole = ref('ROLE_USER')

useHead({ title: computed(() => user.value ? `${user.value.fullName} — Admin` : 'Utilisateur — Admin') })

const initials = computed(() => {
  const name = user.value?.fullName ?? ''
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
})

const roleBadge = (roles: string[]) => {
  if (roles.includes('ROLE_ADMIN')) return { label: 'Admin', class: 'bg-red-100 text-red-700' }
  if (roles.includes('ROLE_TEACHER')) return { label: 'Enseignant', class: 'bg-accent-100 text-accent-700' }
  return { label: 'Etudiant', class: 'bg-primary-100 text-primary-700' }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

const handleSave = async () => {
  if (!user.value) return
  saving.value = true
  try {
    const roles = [selectedRole.value]
    if (selectedRole.value === 'ROLE_ADMIN') roles.unshift('ROLE_TEACHER')
    if (selectedRole.value !== 'ROLE_USER') roles.push('ROLE_USER')

    const updated = await updateUser(userId, {
      roles,
      isActive: user.value.isActive,
    })
    user.value = updated
    success('Utilisateur mis a jour avec succes.')
  } catch {
    showError('Erreur lors de la mise a jour.')
  } finally {
    saving.value = false
  }
}

const handleDeactivate = async () => {
  try {
    await deactivateUser(userId)
    if (user.value) user.value.isActive = false
    showDeactivateModal.value = false
    success('Utilisateur desactive.')
  } catch {
    showError('Erreur lors de la desactivation.')
  }
}

const toggleActive = () => {
  if (user.value) {
    if (user.value.isActive) {
      showDeactivateModal.value = true
    } else {
      user.value.isActive = true
    }
  }
}

onMounted(async () => {
  try {
    user.value = await fetchUser(userId)
    if (user.value.roles.includes('ROLE_ADMIN')) selectedRole.value = 'ROLE_ADMIN'
    else if (user.value.roles.includes('ROLE_TEACHER')) selectedRole.value = 'ROLE_TEACHER'
    else selectedRole.value = 'ROLE_USER'
  } catch {
    showError('Impossible de charger l\'utilisateur.')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <UiBreadcrumb :items="[
      { label: 'Admin', to: '/admin' },
      { label: 'Utilisateurs', to: '/admin/users' },
      { label: user?.fullName || 'Utilisateur' },
    ]" />

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
    </div>

    <template v-else-if="user">
      <h1 class="text-3xl font-bold text-slate-900 mb-8">
        {{ user.fullName }}
      </h1>

      <!-- User info card -->
      <div class="card p-6 sm:p-8 mb-6">
        <div class="flex items-center gap-5 mb-6 pb-6 border-b border-slate-200">
          <div v-if="user.avatar" class="w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary-100">
            <img :src="user.avatar" :alt="user.fullName" class="w-full h-full object-cover" />
          </div>
          <div v-else class="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center ring-4 ring-primary-100">
            <span class="text-2xl font-bold text-white">{{ initials }}</span>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-slate-900">
              {{ user.fullName }}
            </h2>
            <p class="text-sm text-slate-500">{{ user.email }}</p>
            <div class="flex items-center gap-2 mt-2">
              <span
                :class="roleBadge(user.roles).class"
                class="text-xs px-2.5 py-1 rounded-full font-medium"
              >
                {{ roleBadge(user.roles).label }}
              </span>
              <span
                class="text-xs px-2.5 py-1 rounded-full font-medium"
                :class="user.isActive
                  ? 'bg-secondary-100 text-secondary-700'
                  : 'bg-slate-100 text-slate-600'"
              >
                {{ user.isActive ? 'Actif' : 'Inactif' }}
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-2">
              Membre depuis le {{ formatDate(user.createdAt) }}
            </p>
          </div>
        </div>

        <!-- Actions form -->
        <div class="space-y-5">
          <!-- Role -->
          <div>
            <label for="role" class="block text-sm font-medium text-slate-700 mb-1">
              Role
            </label>
            <select id="role" v-model="selectedRole" class="input-field">
              <option value="ROLE_USER">Etudiant</option>
              <option value="ROLE_TEACHER">Enseignant</option>
              <option value="ROLE_ADMIN">Administrateur</option>
            </select>
          </div>

          <!-- Active status -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Statut du compte
            </label>
            <button
              type="button"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              :class="user.isActive ? 'bg-secondary-500' : 'bg-slate-300'"
              @click="toggleActive"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="user.isActive ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
            <span class="ml-3 text-sm text-slate-600">
              {{ user.isActive ? 'Actif' : 'Inactif' }}
            </span>
          </div>
        </div>

        <!-- Save -->
        <div class="mt-8 flex justify-end">
          <button
            class="btn btn-primary flex items-center gap-2"
            :disabled="saving"
            @click="handleSave"
          >
            <Icon v-if="saving" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
            <Icon v-else name="heroicons:check" class="w-4 h-4" />
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </template>

    <!-- Deactivation modal -->
    <Teleport to="body">
      <div
        v-if="showDeactivateModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-black/50" @click="showDeactivateModal = false" />
        <div class="relative card p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold text-slate-900 mb-2">
            Confirmer la desactivation
          </h3>
          <p class="text-slate-600 mb-6">
            Etes-vous sur de vouloir desactiver le compte de <strong>{{ user?.fullName }}</strong> ?
            L'utilisateur ne pourra plus se connecter.
          </p>
          <div class="flex items-center justify-end gap-3">
            <button class="btn btn-outline" @click="showDeactivateModal = false">
              Annuler
            </button>
            <button class="btn btn-danger" @click="handleDeactivate">
              Desactiver
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
