<script setup lang="ts">
import type { CourseEnrollment } from '~/types/course'
import type { UserProgress } from '~/types/learning'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

useHead({ title: 'Tableau de bord — Olulimi Lwirhu' })

const authStore = useAuthStore()
const { fetchMyEnrollments } = useEnrollments()
const { fetchProgress } = useLearning()

const enrollments = ref<CourseEnrollment[]>([])
const progress = ref<UserProgress[]>([])
const loading = ref(true)

const enrolledCount = computed(() => enrollments.value.length)
const completedChapters = computed(() => progress.value.filter(p => p.isCompleted).length)
const averageScore = computed(() => {
  const scored = progress.value.filter(p => p.score !== null)
  if (scored.length === 0) return 0
  const total = scored.reduce((sum, p) => sum + (p.score ?? 0), 0)
  return Math.round(total / scored.length)
})

const activeCourses = computed(() =>
  enrollments.value.filter(e => !e.isCompleted).slice(0, 4)
)

onMounted(async () => {
  try {
    const [enrollData, progressData] = await Promise.all([
      fetchMyEnrollments(),
      fetchProgress(),
    ])
    enrollments.value = enrollData
    progress.value = progressData
  } catch {
    // handled silently
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900">
        Tableau de bord
      </h1>
      <p class="mt-2 text-lg text-slate-600">
        Bienvenue, <span class="font-semibold text-primary-600">{{ authStore.user?.fullName ?? 'Apprenant' }}</span>
      </p>
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
              <p class="text-sm font-medium text-slate-500">Cours inscrits</p>
              <p class="text-2xl font-bold text-slate-900">{{ enrolledCount }}</p>
            </div>
          </div>
        </div>
        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center">
              <Icon name="heroicons:check-circle" class="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500">Chapitres completes</p>
              <p class="text-2xl font-bold text-slate-900">{{ completedChapters }}</p>
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

      <!-- Active courses -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-slate-900">
            Mes cours en cours
          </h2>
          <NuxtLink to="/my-courses" class="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
            Voir tout
            <Icon name="heroicons:arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- Empty state -->
        <div v-if="activeCourses.length === 0" class="card p-12 text-center">
          <Icon name="heroicons:academic-cap" class="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <h3 class="text-lg font-medium text-slate-700 mb-2">Aucun cours en cours</h3>
          <p class="text-slate-500 mb-6">Inscrivez-vous a un cours pour commencer votre apprentissage du Mashi.</p>
          <NuxtLink to="/courses" class="btn btn-primary inline-block">
            Parcourir les cours
          </NuxtLink>
        </div>

        <!-- Course list -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="enrollment in activeCourses" :key="enrollment.id" class="card p-5 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="font-semibold text-slate-900">{{ enrollment.courseTitle }}</h3>
                <p class="text-sm text-slate-500">{{ enrollment.userName }}</p>
              </div>
            </div>
            <div class="mb-3">
              <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Progression</span>
                <span>En cours</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2">
                <div class="bg-primary-600 h-2 rounded-full transition-all duration-500" style="width: 30%" />
              </div>
            </div>
            <NuxtLink :to="`/learn/${enrollment.courseId}`" class="btn btn-primary text-sm w-full block text-center">
              Continuer
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
