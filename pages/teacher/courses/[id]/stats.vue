<script setup lang="ts">
import type { Course, TeacherCourseStats } from '~/types/course'

definePageMeta({
  middleware: 'teacher',
  layout: 'teacher',
})

const route = useRoute()
const courseId = route.params.id as string

const { fetchCourse } = useCourses()
const { fetchMyCourseStats } = useTeacher()
const { error: showError } = useToast()

const course = ref<Course | null>(null)
const stats = ref<TeacherCourseStats | null>(null)
const loading = ref(true)

useHead({ title: computed(() => course.value ? `Statistiques — ${course.value.title}` : 'Statistiques — Olulimi Lwirhu') })

onMounted(async () => {
  try {
    const [courseData, statsData] = await Promise.all([
      fetchCourse(courseId),
      fetchMyCourseStats(courseId),
    ])
    course.value = courseData
    stats.value = statsData
  } catch {
    showError('Impossible de charger les statistiques.')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <NuxtLink :to="`/teacher/courses/${courseId}/edit`" class="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mb-6">
      <Icon name="heroicons:arrow-left" class="w-4 h-4" />
      Retour au cours
    </NuxtLink>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
    </div>

    <template v-else-if="course && stats">
      <h1 class="text-3xl font-bold text-slate-900 mb-2">
        Statistiques du cours
      </h1>
      <p class="text-slate-500 mb-8">{{ course.title }}</p>

      <!-- Stats cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <Icon name="heroicons:users" class="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500">Inscrits</p>
              <p class="text-2xl font-bold text-slate-900">{{ stats.enrollmentCount }}</p>
            </div>
          </div>
        </div>
        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center">
              <Icon name="heroicons:chart-bar" class="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500">Taux completion</p>
              <p class="text-2xl font-bold text-slate-900">{{ Math.round(stats.averageCompletionRate) }}%</p>
            </div>
          </div>
        </div>
        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
              <Icon name="heroicons:trophy" class="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500">Score moyen</p>
              <p class="text-2xl font-bold text-slate-900">{{ Math.round(stats.averageScore) }}%</p>
            </div>
          </div>
        </div>
        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Icon name="heroicons:folder" class="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500">Sessions</p>
              <p class="text-2xl font-bold text-slate-900">{{ stats.sessionsCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Enrolled students table (placeholder) -->
      <div class="card overflow-hidden">
        <div class="p-5 border-b border-slate-200">
          <h2 class="text-lg font-semibold text-slate-900">
            Apprenants inscrits
          </h2>
        </div>
        <div class="p-8 text-center">
          <Icon name="heroicons:users" class="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p class="text-slate-500">
            Le detail des apprenants inscrits sera disponible prochainement.
          </p>
        </div>
      </div>
    </template>
  </div>
</template>
