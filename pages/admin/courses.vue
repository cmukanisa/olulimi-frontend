<script setup lang="ts">
import type { Course } from '~/types/course'

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const { t } = useLocale()
useHead({ title: computed(() => t('head.adminCourses')) })

const { fetchCourses } = useCourses()
const { error: showError } = useToast()

const courses = ref<Course[]>([])
const loading = ref(true)

const statusLabel = (status: string) => {
  const map: Record<string, string> = { draft: 'Brouillon', published: 'Publie', archived: 'Archive' }
  return map[status] ?? status
}

const statusClass = (status: string) => {
  const map: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    published: 'bg-secondary-100 text-secondary-700',
    archived: 'bg-accent-100 text-accent-700',
  }
  return map[status] ?? 'bg-slate-100 text-slate-700'
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

onMounted(async () => {
  try {
    courses.value = await fetchCourses()
  } catch {
    showError('Impossible de charger les cours.')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-slate-900 mb-8">
      Tous les cours
    </h1>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
    </div>

    <!-- Table -->
    <div v-else class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Titre</th>
              <th class="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Auteur</th>
              <th class="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Statut</th>
              <th class="text-center text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Sessions</th>
              <th class="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="course in courses"
              :key="course.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Icon name="heroicons:book-open" class="w-5 h-5 text-primary-600" />
                  </div>
                  <div class="min-w-0">
                    <p class="font-medium text-slate-900 text-sm truncate">{{ course.title }}</p>
                    <p class="text-xs text-slate-500">{{ course.level }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4 text-sm text-slate-600">
                {{ course.authorName }}
              </td>
              <td class="px-5 py-4">
                <span
                  :class="statusClass(course.status)"
                  class="text-xs px-2 py-0.5 rounded-full font-medium"
                >
                  {{ statusLabel(course.status) }}
                </span>
              </td>
              <td class="px-5 py-4 text-center text-sm text-slate-600">
                {{ course.sessionsCount }}
              </td>
              <td class="px-5 py-4 text-sm text-slate-600">
                {{ formatDate(course.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="courses.length === 0" class="p-8 text-center">
        <Icon name="heroicons:book-open" class="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <p class="text-slate-500">Aucun cours sur la plateforme.</p>
      </div>
    </div>
  </div>
</template>
