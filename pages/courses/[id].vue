<script setup lang="ts">
useHead({ title: computed(() => course.value ? `${course.value.title} — Olulimi Lwirhu` : 'Detail du cours — Olulimi Lwirhu') })
useSeoMeta({
  title: computed(() => course.value?.title ? `${course.value.title} — Cours Mashi` : 'Detail du cours — Olulimi Lwirhu'),
  ogTitle: computed(() => course.value?.title || 'Detail du cours — Olulimi Lwirhu'),
  description: computed(() => course.value?.description || 'Detail du cours de Mashi sur Olulimi Lwirhu'),
  ogDescription: computed(() => course.value?.description || 'Detail du cours de Mashi sur Olulimi Lwirhu'),
})

const route = useRoute()
const courseId = route.params.id as string

const { course, sessions, loading, error, fetchCourse, fetchSessions } = useCourses()
const { enrollments, loading: enrollLoading, fetchEnrollments, isEnrolled, enroll, unenroll } = useEnrollments()
const authStore = useAuthStore()

const enrolled = computed(() => isEnrolled(courseId))
const openSessions = ref<Set<string>>(new Set())

const toggleSession = (sessionId: string) => {
  if (openSessions.value.has(sessionId)) {
    openSessions.value.delete(sessionId)
  } else {
    openSessions.value.add(sessionId)
  }
}

const levelConfig = computed(() => {
  switch (course.value?.level) {
    case 'beginner':
      return { label: 'Débutant', class: 'bg-green-100 text-green-700' }
    case 'intermediate':
      return { label: 'Intermédiaire', class: 'bg-yellow-100 text-yellow-700' }
    case 'advanced':
      return { label: 'Avancé', class: 'bg-red-100 text-red-700' }
    default:
      return { label: course.value?.level || '', class: 'bg-slate-100 text-slate-700' }
  }
})

const handleEnroll = async () => {
  if (!authStore.isAuthenticated) {
    navigateTo('/auth/login')
    return
  }
  await enroll(courseId)
}

const handleUnenroll = async () => {
  await unenroll(courseId)
}

onMounted(async () => {
  await Promise.all([
    fetchCourse(courseId),
    fetchSessions(courseId),
  ])
  if (authStore.isAuthenticated) {
    await fetchEnrollments()
  }
})
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="animate-pulse space-y-6">
        <div class="h-64 bg-slate-200 rounded-xl" />
        <div class="h-8 bg-slate-200 rounded w-1/2" />
        <div class="h-4 bg-slate-200 rounded w-3/4" />
        <div class="h-4 bg-slate-200 rounded w-2/3" />
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <Icon name="heroicons:exclamation-triangle" class="w-16 h-16 text-red-400 mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-slate-900">{{ error }}</h2>
      <NuxtLink to="/courses" class="btn btn-outline mt-6 inline-flex">
        <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
        Retour aux cours
      </NuxtLink>
    </div>

    <!-- Course detail -->
    <div v-else-if="course">
      <!-- Breadcrumb -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <UiBreadcrumb :items="[
          { label: 'Cours', to: '/courses' },
          { label: course.title },
        ]" />
      </div>

      <!-- Cover banner -->
      <div class="relative h-64 sm:h-80 overflow-hidden">
        <img
          v-if="course.coverImage"
          :src="course.coverImage"
          :alt="course.title"
          class="w-full h-full object-cover"
        />
        <div
          v-else
          class="w-full h-full bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 flex items-center justify-center"
        >
          <Icon name="heroicons:academic-cap" class="w-24 h-24 text-white/20" />
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div class="max-w-7xl mx-auto">
            <span
              class="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
              :class="levelConfig.class"
            >
              {{ levelConfig.label }}
            </span>
            <h1 class="text-3xl sm:text-4xl font-extrabold text-white">
              {{ course.title }}
            </h1>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <!-- Main content -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Description -->
            <div class="card p-6">
              <h2 class="text-lg font-semibold text-slate-900 mb-3">
                Description
              </h2>
              <p class="text-slate-600 leading-relaxed">
                {{ course.description || 'Aucune description disponible.' }}
              </p>
            </div>

            <!-- Sessions accordion -->
            <div class="card overflow-hidden">
              <div class="p-6 border-b border-slate-200">
                <h2 class="text-lg font-semibold text-slate-900">
                  Contenu du cours
                </h2>
                <p class="text-sm text-slate-500 mt-1">
                  {{ sessions.length }} session{{ sessions.length !== 1 ? 's' : '' }}
                </p>
              </div>

              <div v-if="sessions.length > 0" class="divide-y divide-slate-200">
                <div v-for="session in sessions" :key="session.id">
                  <button
                    @click="toggleSession(session.id)"
                    class="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <span class="text-sm font-semibold text-primary-700">
                          {{ session.sortOrder }}
                        </span>
                      </div>
                      <div>
                        <h3 class="font-medium text-slate-900 text-sm">
                          {{ session.title }}
                        </h3>
                        <p class="text-xs text-slate-500">
                          {{ session.chaptersCount }} chapitre{{ session.chaptersCount !== 1 ? 's' : '' }}
                        </p>
                      </div>
                    </div>
                    <Icon
                      name="heroicons:chevron-down"
                      class="w-5 h-5 text-slate-400 transition-transform duration-200"
                      :class="{ 'rotate-180': openSessions.has(session.id) }"
                    />
                  </button>
                  <Transition
                    enter-active-class="transition-all duration-200 ease-out"
                    enter-from-class="max-h-0 opacity-0"
                    enter-to-class="max-h-96 opacity-100"
                    leave-active-class="transition-all duration-150 ease-in"
                    leave-from-class="max-h-96 opacity-100"
                    leave-to-class="max-h-0 opacity-0"
                  >
                    <div v-if="openSessions.has(session.id)" class="overflow-hidden">
                      <div class="px-4 pb-4 pl-16">
                        <p v-if="session.description" class="text-sm text-slate-500 mb-2">
                          {{ session.description }}
                        </p>
                        <p class="text-xs text-slate-400 italic">
                          Inscrivez-vous pour accéder aux chapitres de cette session.
                        </p>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
              <div v-else class="p-8 text-center text-slate-500">
                <Icon name="heroicons:folder-open" class="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p>Aucune session disponible pour le moment.</p>
              </div>
            </div>
          </div>

          <!-- Sidebar info -->
          <div class="space-y-6">
            <div class="card p-6 space-y-4 sticky top-22 sm:top-28">
              <!-- Author -->
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span class="text-sm font-semibold text-primary-700">
                    {{ course.authorName?.charAt(0)?.toUpperCase() || 'A' }}
                  </span>
                </div>
                <div>
                  <p class="text-xs text-slate-500">Enseignant</p>
                  <p class="text-sm font-medium text-slate-900">{{ course.authorName }}</p>
                </div>
              </div>

              <div class="border-t border-slate-200 pt-4 space-y-3">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">Niveau</span>
                  <span
                    class="font-medium px-2 py-0.5 rounded-full text-xs"
                    :class="levelConfig.class"
                  >
                    {{ levelConfig.label }}
                  </span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">Sessions</span>
                  <span class="font-medium text-slate-900">{{ sessions.length }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">Chapitres</span>
                  <span class="font-medium text-slate-900">
                    {{ sessions.reduce((sum, s) => sum + s.chaptersCount, 0) }}
                  </span>
                </div>
              </div>

              <!-- Enrollment actions -->
              <div class="border-t border-slate-200 pt-4">
                <button
                  v-if="!enrolled"
                  @click="handleEnroll"
                  :disabled="enrollLoading"
                  class="btn btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Icon v-if="enrollLoading" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
                  <span>S'inscrire au cours</span>
                </button>
                <button
                  v-else
                  @click="handleUnenroll"
                  :disabled="enrollLoading"
                  class="btn btn-danger w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Icon v-if="enrollLoading" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
                  <span>Se désinscrire</span>
                </button>
              </div>
            </div>

            <!-- Back link -->
            <NuxtLink
              to="/courses"
              class="flex items-center text-sm text-primary-600 hover:underline"
            >
              <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-1" />
              Retour au catalogue
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
