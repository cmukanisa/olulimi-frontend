<script setup lang="ts">
import type { User } from '~/types/auth'

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

useHead({ title: 'Gestion des utilisateurs — Admin — Olulimi Lwirhu' })

const { fetchUsers, deactivateUser } = useAdmin()
const { success, error: showError } = useToast()

const users = ref<User[]>([])
const loading = ref(true)
const search = ref('')
const roleFilter = ref<'all' | 'student' | 'teacher' | 'admin'>('all')
const deactivateConfirm = ref<string | null>(null)

const filteredUsers = computed(() => {
  let result = users.value

  // Search filter
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    result = result.filter(u =>
      u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    )
  }

  // Role filter
  if (roleFilter.value !== 'all') {
    const roleMap: Record<string, string> = {
      student: 'ROLE_USER',
      teacher: 'ROLE_TEACHER',
      admin: 'ROLE_ADMIN',
    }
    result = result.filter(u => u.roles.includes(roleMap[roleFilter.value]))
  }

  return result
})

const roleBadge = (roles: string[]) => {
  if (roles.includes('ROLE_ADMIN')) return { label: 'Admin', class: 'bg-red-100 text-red-700' }
  if (roles.includes('ROLE_TEACHER')) return { label: 'Enseignant', class: 'bg-accent-100 text-accent-700' }
  return { label: 'Etudiant', class: 'bg-primary-100 text-primary-700' }
}

const statusBadge = (isActive: boolean) => {
  return isActive
    ? { label: 'Actif', class: 'bg-secondary-100 text-secondary-700' }
    : { label: 'Inactif', class: 'bg-slate-100 text-slate-600' }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const handleDeactivate = async (userId: string) => {
  try {
    await deactivateUser(userId)
    const user = users.value.find(u => u.id === userId)
    if (user) user.isActive = false
    success('Utilisateur desactive.')
  } catch {
    showError('Erreur lors de la desactivation.')
  } finally {
    deactivateConfirm.value = null
  }
}

onMounted(async () => {
  try {
    users.value = await fetchUsers()
  } catch {
    showError('Impossible de charger les utilisateurs.')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-slate-900 mb-8">
      Gestion des utilisateurs
    </h1>

    <!-- Search and filters -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <div class="flex-1 relative">
        <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          v-model="search"
          type="text"
          class="input-field pl-10"
          placeholder="Rechercher par nom ou email..."
        />
      </div>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="filter in (['all', 'student', 'teacher', 'admin'] as const)"
          :key="filter"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="roleFilter === filter
            ? 'bg-primary-600 text-white'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
          @click="roleFilter = filter"
        >
          {{ filter === 'all' ? 'Tous' : filter === 'student' ? 'Etudiants' : filter === 'teacher' ? 'Enseignants' : 'Admins' }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
    </div>

    <!-- Users table -->
    <div v-else class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Nom</th>
              <th class="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Email</th>
              <th class="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Role</th>
              <th class="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Statut</th>
              <th class="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Inscription</th>
              <th class="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div v-if="user.avatar" class="w-8 h-8 rounded-full overflow-hidden">
                    <img :src="user.avatar" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span class="text-xs font-medium text-primary-600">
                      {{ user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) }}
                    </span>
                  </div>
                  <span class="font-medium text-slate-900 text-sm">
                    {{ user.fullName }}
                  </span>
                </div>
              </td>
              <td class="px-5 py-4 text-sm text-slate-600">
                {{ user.email }}
              </td>
              <td class="px-5 py-4">
                <span
                  :class="roleBadge(user.roles).class"
                  class="text-xs px-2 py-0.5 rounded-full font-medium"
                >
                  {{ roleBadge(user.roles).label }}
                </span>
              </td>
              <td class="px-5 py-4">
                <span
                  :class="statusBadge(user.isActive).class"
                  class="text-xs px-2 py-0.5 rounded-full font-medium"
                >
                  {{ statusBadge(user.isActive).label }}
                </span>
              </td>
              <td class="px-5 py-4 text-sm text-slate-600">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink
                    :to="`/admin/users/${user.id}`"
                    class="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Detail
                  </NuxtLink>
                  <template v-if="user.isActive">
                    <button
                      v-if="deactivateConfirm !== user.id"
                      class="text-xs text-red-500 hover:text-red-600 font-medium"
                      @click="deactivateConfirm = user.id"
                    >
                      Desactiver
                    </button>
                    <div v-else class="flex items-center gap-1">
                      <button class="text-xs text-red-600 font-bold" @click="handleDeactivate(user.id)">
                        Confirmer
                      </button>
                      <button class="text-xs text-slate-500" @click="deactivateConfirm = null">
                        Annuler
                      </button>
                    </div>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredUsers.length === 0" class="p-8 text-center">
        <Icon name="heroicons:users" class="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <p class="text-slate-500">Aucun utilisateur trouve.</p>
      </div>
    </div>
  </div>
</template>
