<script setup lang="ts">
import type { Chapter, Session, Course } from '~/types/course'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

const route = useRoute()
const courseId = route.params.courseId as string
const chapterId = route.params.chapterId as string

const { fetchCourse, fetchSessions, fetchChapters } = useCourses()
const { markChapterComplete } = useLearning()
const { success, error: showError } = useToast()

const course = ref<Course | null>(null)
const currentSession = ref<Session | null>(null)
const chapter = ref<Chapter | null>(null)
const allChapters = ref<Chapter[]>([])
const loading = ref(true)
const marking = ref(false)
const isCompleted = ref(false)

useHead({ title: computed(() => chapter.value ? `${chapter.value.title} — Olulimi Lwirhu` : 'Chapitre — Olulimi Lwirhu') })

const currentIndex = computed(() => allChapters.value.findIndex(c => c.id === chapterId))
const previousChapter = computed(() => currentIndex.value > 0 ? allChapters.value[currentIndex.value - 1] : null)
const nextChapter = computed(() => currentIndex.value < allChapters.value.length - 1 ? allChapters.value[currentIndex.value + 1] : null)

const handleMarkComplete = async () => {
  marking.value = true
  try {
    await markChapterComplete(chapterId)
    isCompleted.value = true
    success('Chapitre marque comme termine !')
  } catch {
    showError('Erreur lors du marquage du chapitre.')
  } finally {
    marking.value = false
  }
}

onMounted(async () => {
  try {
    const [courseData, sessionsData] = await Promise.all([
      fetchCourse(courseId),
      fetchSessions(courseId),
    ])
    course.value = courseData

    // Find chapter and its session
    for (const session of sessionsData) {
      const chapters = await fetchChapters(session.id)
      const found = chapters.find(c => c.id === chapterId)
      if (found) {
        currentSession.value = session
        chapter.value = found
        allChapters.value = chapters.sort((a, b) => a.sortOrder - b.sortOrder)
        break
      }
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

    <template v-else-if="chapter && course">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-slate-500 mb-6 flex-wrap">
        <NuxtLink :to="`/learn/${courseId}`" class="hover:text-primary-600 transition-colors">
          {{ course.title }}
        </NuxtLink>
        <Icon name="heroicons:chevron-right" class="w-4 h-4 flex-shrink-0" />
        <span v-if="currentSession" class="truncate">{{ currentSession.title }}</span>
        <Icon name="heroicons:chevron-right" class="w-4 h-4 flex-shrink-0" />
        <span class="text-slate-900 font-medium truncate">{{ chapter.title }}</span>
      </nav>

      <!-- Chapter header -->
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">
          {{ chapter.title }}
        </h1>
        <div class="flex items-center gap-4 mt-3">
          <span
            class="text-xs px-2.5 py-1 rounded-full font-medium"
            :class="chapter.type === 'practice'
              ? 'bg-accent-100 text-accent-700'
              : 'bg-primary-100 text-primary-700'"
          >
            {{ chapter.type === 'practice' ? 'Pratique' : 'Theorie' }}
          </span>
          <span v-if="chapter.estimatedDuration" class="text-sm text-slate-500 flex items-center gap-1">
            <Icon name="heroicons:clock" class="w-4 h-4" />
            {{ chapter.estimatedDuration }} min
          </span>
        </div>
      </div>

      <!-- Chapter content -->
      <LearningChapterContent :chapter="chapter" />

      <!-- Mark complete -->
      <div class="mt-10 mb-8">
        <button
          v-if="!isCompleted"
          class="btn btn-secondary flex items-center gap-2 text-base"
          :disabled="marking"
          @click="handleMarkComplete"
        >
          <Icon v-if="marking" name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
          <Icon v-else name="heroicons:check-circle" class="w-5 h-5" />
          Marquer comme termine
        </button>
        <div v-else class="flex items-center gap-2 text-secondary-600 font-medium">
          <Icon name="heroicons:check-circle-solid" class="w-6 h-6" />
          Chapitre termine
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex items-center justify-between pt-6 border-t border-slate-200">
        <NuxtLink
          v-if="previousChapter"
          :to="`/learn/${courseId}/${previousChapter.id}`"
          class="btn btn-outline flex items-center gap-2 text-sm"
        >
          <Icon name="heroicons:arrow-left" class="w-4 h-4" />
          {{ previousChapter.title }}
        </NuxtLink>
        <div v-else />
        <NuxtLink
          v-if="nextChapter"
          :to="`/learn/${courseId}/${nextChapter.id}`"
          class="btn btn-primary flex items-center gap-2 text-sm"
        >
          {{ nextChapter.title }}
          <Icon name="heroicons:arrow-right" class="w-4 h-4" />
        </NuxtLink>
        <NuxtLink
          v-else
          :to="`/learn/${courseId}`"
          class="btn btn-primary flex items-center gap-2 text-sm"
        >
          Retour au cours
          <Icon name="heroicons:arrow-right" class="w-4 h-4" />
        </NuxtLink>
      </div>
    </template>

    <!-- Not found -->
    <div v-else class="card p-12 text-center">
      <Icon name="heroicons:exclamation-triangle" class="w-16 h-16 mx-auto text-slate-300 mb-4" />
      <h2 class="text-lg font-semibold text-slate-700">Chapitre introuvable</h2>
      <NuxtLink :to="`/learn/${courseId}`" class="btn btn-primary inline-block mt-4">
        Retour au cours
      </NuxtLink>
    </div>
  </div>
</template>
