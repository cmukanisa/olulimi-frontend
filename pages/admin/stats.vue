<script setup lang="ts">
import type { AdminStats } from '~/types/admin'

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const { t } = useLocale()
useHead({ title: computed(() => t('head.adminStats')) })

const { fetchStats } = useAdmin()
const { error: showError } = useToast()

const stats = ref<AdminStats | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    stats.value = await fetchStats()
  } catch {
    showError('Impossible de charger les statistiques.')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-slate-900 mb-8">
      Statistiques
    </h1>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
    </div>

    <template v-else-if="stats">
      <!-- Stats cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <Icon name="heroicons:users" class="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500">Total utilisateurs</p>
              <p class="text-2xl font-bold text-slate-900">{{ stats.totalUsers }}</p>
            </div>
          </div>
        </div>
        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center">
              <Icon name="heroicons:academic-cap" class="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500">Enseignants</p>
              <p class="text-2xl font-bold text-slate-900">{{ stats.totalTeachers }}</p>
            </div>
          </div>
        </div>
        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
              <Icon name="heroicons:book-open" class="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500">Cours</p>
              <p class="text-2xl font-bold text-slate-900">{{ stats.totalCourses }}</p>
            </div>
          </div>
        </div>
        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Icon name="heroicons:clipboard-document-check" class="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500">Inscriptions</p>
              <p class="text-2xl font-bold text-slate-900">{{ stats.totalEnrollments }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts placeholder -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-slate-900 mb-4">
            Evolution des inscriptions
          </h2>
          <div class="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
            <div class="text-center">
              <Icon name="heroicons:chart-bar" class="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p class="text-sm text-slate-400">Graphique disponible prochainement</p>
            </div>
          </div>
        </div>
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-slate-900 mb-4">
            Repartition des utilisateurs
          </h2>
          <div class="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
            <div class="text-center">
              <Icon name="heroicons:chart-pie" class="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p class="text-sm text-slate-400">Graphique disponible prochainement</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
