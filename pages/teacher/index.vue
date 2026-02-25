<script setup lang="ts">
import type { Course } from '~/types/course'

definePageMeta({
  middleware: 'teacher',
  layout: 'teacher',
})

const { t } = useLocale()
useHead({ title: computed(() => t('head.teacher')) })

const { fetchMyCourses } = useTeacher()
const { error: showError } = useToast()

const courses = ref<Course[]>([])
const loading = ref(true)

const totalCourses = computed(() => courses.value.length)
const totalEnrolled = computed(() => 0) // placeholder, no enrollment count on Course type
const averageScore = computed(() => 0) // placeholder

const recentCourses = computed(() =>
  [...courses.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
)

onMounted(async () => {
  try {
    courses.value = await fetchMyCourses()
  } catch {
    showError('Impossible de charger vos cours.')
  } finally {
    loading.value = false
  }
})

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
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">
          Espace enseignant
        </h1>
        <p class="mt-2 text-slate-600">
          Gerez vos cours et suivez les performances de vos apprenants.
        </p>
      </div>
      <NuxtLink to="/teacher/courses/new" class="btn btn-primary flex items-center gap-2">
        <Icon name="heroicons:plus" class="w-5 h-5" />
        Creer un cours
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
    </div>

    <template v-else>
      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <Icon name="heroicons:book-open" class="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500">Mes cours</p>
              <p class="text-2xl font-bold text-slate-900">{{ totalCourses }}</p>
            </div>
          </div>
        </div>
        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center">
              <Icon name="heroicons:users" class="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500">Total inscrits</p>
              <p class="text-2xl font-bold text-slate-900">{{ totalEnrolled }}</p>
            </div>
          </div>
        </div>
        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
              <Icon name="heroicons:chart-bar" class="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500">Score moyen</p>
              <p class="text-2xl font-bold text-slate-900">{{ averageScore }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent courses -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-slate-900">Cours recents</h2>
          <NuxtLink to="/teacher/courses" class="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
            Voir tout
            <Icon name="heroicons:arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>

        <div v-if="recentCourses.length === 0" class="card p-12 text-center">
          <Icon name="heroicons:book-open" class="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <h3 class="text-lg font-medium text-slate-700 mb-2">Aucun cours</h3>
          <p class="text-slate-500 mb-4">Creez votre premier cours pour commencer.</p>
          <NuxtLink to="/teacher/courses/new" class="btn btn-primary inline-block">
            Creer un cours
          </NuxtLink>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="course in recentCourses"
            :key="course.id"
            class="card p-5 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div class="flex items-center gap-4 min-w-0 flex-1">
              <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Icon name="heroicons:book-open" class="w-5 h-5 text-primary-600" />
              </div>
              <div class="min-w-0">
                <h3 class="font-semibold text-slate-900 truncate">{{ course.title }}</h3>
                <div class="flex items-center gap-3 mt-1">
                  <span :class="statusClass(course.status)" class="text-xs px-2 py-0.5 rounded-full font-medium">
                    {{ statusLabel(course.status) }}
                  </span>
                  <span class="text-xs text-slate-500">
                    {{ course.sessionsCount }} sessions
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2 ml-4">
              <NuxtLink :to="`/teacher/courses/${course.id}/edit`" class="btn btn-outline text-xs">
                Modifier
              </NuxtLink>
              <NuxtLink :to="`/teacher/courses/${course.id}/stats`" class="btn btn-outline text-xs">
                Stats
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
