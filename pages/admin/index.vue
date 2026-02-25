<script setup lang="ts">
import type { AdminStats } from '~/types/admin'

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const { t } = useLocale()
useHead({ title: computed(() => t('head.admin')) })

const { fetchStats } = useAdmin()
const { error: showError } = useToast()

const stats = ref<AdminStats | null>(null)
const loading = ref(true)
const animatedStats = reactive({
  totalUsers: 0,
  totalTeachers: 0,
  totalCourses: 0,
  totalEnrollments: 0,
})

const animateCounter = (key: keyof typeof animatedStats, target: number) => {
  const duration = 1200
  const steps = 40
  const increment = target / steps
  let current = 0
  const interval = setInterval(() => {
    current += increment
    if (current >= target) {
      animatedStats[key] = target
      clearInterval(interval)
    } else {
      animatedStats[key] = Math.round(current)
    }
  }, duration / steps)
}

onMounted(async () => {
  try {
    stats.value = await fetchStats()
    if (stats.value) {
      animateCounter('totalUsers', stats.value.totalUsers)
      animateCounter('totalTeachers', stats.value.totalTeachers)
      animateCounter('totalCourses', stats.value.totalCourses)
      animateCounter('totalEnrollments', stats.value.totalEnrollments)
    }
  } catch {
    showError('Impossible de charger les statistiques.')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-slate-900 mb-2">
      Administration
    </h1>
    <p class="text-slate-600 mb-8">
      Vue d'ensemble de la plateforme Olulimi Lwirhu.
    </p>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
    </div>

    <template v-else>
      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div class="card p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <Icon name="heroicons:users" class="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500">Utilisateurs</p>
              <p class="text-2xl font-bold text-slate-900 tabular-nums">{{ animatedStats.totalUsers }}</p>
            </div>
          </div>
        </div>
        <div class="card p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center">
              <Icon name="heroicons:academic-cap" class="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500">Enseignants</p>
              <p class="text-2xl font-bold text-slate-900 tabular-nums">{{ animatedStats.totalTeachers }}</p>
            </div>
          </div>
        </div>
        <div class="card p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
              <Icon name="heroicons:book-open" class="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500">Cours</p>
              <p class="text-2xl font-bold text-slate-900 tabular-nums">{{ animatedStats.totalCourses }}</p>
            </div>
          </div>
        </div>
        <div class="card p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Icon name="heroicons:clipboard-document-check" class="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500">Inscriptions</p>
              <p class="text-2xl font-bold text-slate-900 tabular-nums">{{ animatedStats.totalEnrollments }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick links -->
      <h2 class="text-xl font-semibold text-slate-900 mb-4">Gestion rapide</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink to="/admin/users" class="card p-6 hover:shadow-md hover:border-primary-300 transition-all group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon name="heroicons:user-group" class="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 class="font-semibold text-slate-900">Utilisateurs</h3>
              <p class="text-sm text-slate-500">Gerer les comptes et roles</p>
            </div>
          </div>
        </NuxtLink>
        <NuxtLink to="/admin/courses" class="card p-6 hover:shadow-md hover:border-primary-300 transition-all group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon name="heroicons:book-open" class="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <h3 class="font-semibold text-slate-900">Cours</h3>
              <p class="text-sm text-slate-500">Voir tous les cours</p>
            </div>
          </div>
        </NuxtLink>
        <NuxtLink to="/admin/stats" class="card p-6 hover:shadow-md hover:border-primary-300 transition-all group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon name="heroicons:chart-bar-square" class="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <h3 class="font-semibold text-slate-900">Statistiques</h3>
              <p class="text-sm text-slate-500">Tableaux de bord detailles</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </template>
  </div>
</template>
