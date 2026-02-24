<script setup lang="ts">
import type { Course, Session, Chapter } from '~/types/course'
import type { UserProgress } from '~/types/learning'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

const route = useRoute()
const courseId = route.params.courseId as string

const { fetchCourse, fetchSessions, fetchChapters } = useCourses()
const { fetchCourseProgress } = useLearning()

const course = ref<Course | null>(null)
const sessions = ref<Session[]>([])
const chaptersBySession = ref<Record<string, Chapter[]>>({})
const progressData = ref<UserProgress | null>(null)
const completedChapterIds = ref<Set<string>>(new Set())
const expandedSessions = ref<Set<string>>(new Set())
const loading = ref(true)

useHead({ title: computed(() => course.value ? `${course.value.title} — Olulimi Lwirhu` : 'Cours — Olulimi Lwirhu') })

const totalChapters = computed(() =>
  Object.values(chaptersBySession.value).reduce((sum, chapters) => sum + chapters.length, 0)
)

const progressPercent = computed(() => {
  if (totalChapters.value === 0) return 0
  return Math.round((completedChapterIds.value.size / totalChapters.value) * 100)
})

const toggleSession = (sessionId: string) => {
  if (expandedSessions.value.has(sessionId)) {
    expandedSessions.value.delete(sessionId)
  } else {
    expandedSessions.value.add(sessionId)
  }
}

onMounted(async () => {
  try {
    const [courseData, sessionsData] = await Promise.all([
      fetchCourse(courseId),
      fetchSessions(courseId),
    ])
    course.value = courseData
    sessions.value = sessionsData.sort((a, b) => a.sortOrder - b.sortOrder)

    // Fetch chapters for each session
    const chapterPromises = sessions.value.map(async (s) => {
      const chapters = await fetchChapters(s.id)
      chaptersBySession.value[s.id] = chapters.sort((a, b) => a.sortOrder - b.sortOrder)
    })
    await Promise.all(chapterPromises)

    // Expand first session by default
    if (sessions.value.length > 0) {
      expandedSessions.value.add(sessions.value[0].id)
    }

    // Fetch progress
    try {
      const prog = await fetchCourseProgress(courseId)
      progressData.value = prog
    } catch {
      // no progress yet
    }
  } catch {
    // handled silently
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
    </div>

    <template v-else-if="course">
      <!-- Breadcrumb -->
      <UiBreadcrumb :items="[
        { label: 'Mes cours', to: '/my-courses' },
        { label: course.title },
      ]" />

      <!-- Course header -->
      <div class="mb-8">
        <NuxtLink to="/my-courses" class="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mb-4">
          <Icon name="heroicons:arrow-left" class="w-4 h-4" />
          Retour a mes cours
        </NuxtLink>
        <h1 class="text-3xl font-bold text-slate-900">
          {{ course.title }}
        </h1>
        <p v-if="course.description" class="mt-2 text-slate-600">
          {{ course.description }}
        </p>
      </div>

      <!-- Progress bar -->
      <div class="card p-5 mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-slate-700">Progression globale</span>
          <span class="text-sm font-semibold text-primary-600">{{ progressPercent }}%</span>
        </div>
        <div class="w-full bg-slate-200 rounded-full h-3">
          <div
            class="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-700"
            :style="{ width: `${progressPercent}%` }"
          />
        </div>
        <p class="mt-2 text-xs text-slate-500">
          {{ completedChapterIds.size }} / {{ totalChapters }} chapitres completes
        </p>
      </div>

      <!-- Sessions accordion -->
      <div class="space-y-3">
        <div
          v-for="session in sessions"
          :key="session.id"
          class="card overflow-hidden"
        >
          <!-- Session header -->
          <button
            class="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            @click="toggleSession(session.id)"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm">
                {{ session.sortOrder }}
              </div>
              <div>
                <h3 class="font-semibold text-slate-900">{{ session.title }}</h3>
                <p class="text-xs text-slate-500">
                  {{ chaptersBySession[session.id]?.length ?? 0 }} chapitres
                </p>
              </div>
            </div>
            <Icon
              name="heroicons:chevron-down"
              class="w-5 h-5 text-slate-400 transition-transform duration-200"
              :class="{ 'rotate-180': expandedSessions.has(session.id) }"
            />
          </button>

          <!-- Chapters list -->
          <div
            v-if="expandedSessions.has(session.id)"
            class="border-t border-slate-200"
          >
            <div
              v-for="chapter in chaptersBySession[session.id] ?? []"
              :key="chapter.id"
              class="border-b border-slate-100 last:border-0"
            >
              <NuxtLink
                :to="`/learn/${courseId}/${chapter.id}`"
                class="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
              >
                <div
                  class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                  :class="completedChapterIds.has(chapter.id)
                    ? 'bg-secondary-100'
                    : 'bg-slate-100'"
                >
                  <Icon
                    v-if="completedChapterIds.has(chapter.id)"
                    name="heroicons:check"
                    class="w-4 h-4 text-secondary-600"
                  />
                  <span v-else class="w-2 h-2 rounded-full bg-slate-300" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-800 truncate">
                    {{ chapter.title }}
                  </p>
                  <p v-if="chapter.estimatedDuration" class="text-xs text-slate-500">
                    {{ chapter.estimatedDuration }} min
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    v-if="chapter.type === 'practice'"
                    class="text-xs bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full"
                  >
                    Pratique
                  </span>
                  <Icon name="heroicons:chevron-right" class="w-4 h-4 text-slate-400" />
                </div>
              </NuxtLink>
            </div>
            <div
              v-if="!chaptersBySession[session.id]?.length"
              class="px-5 py-8 text-center text-sm text-slate-400"
            >
              Aucun chapitre dans cette session.
            </div>
          </div>
        </div>
      </div>

      <!-- Empty sessions -->
      <div v-if="sessions.length === 0" class="card p-12 text-center">
        <Icon name="heroicons:folder-open" class="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <p class="text-slate-500">Ce cours ne contient pas encore de sessions.</p>
      </div>
    </template>
  </div>
</template>
