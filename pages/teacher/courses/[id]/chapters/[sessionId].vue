<script setup lang="ts">
import type { Course, Session, Chapter, CreateChapterRequest } from '~/types/course'

definePageMeta({
  middleware: 'teacher',
  layout: 'teacher',
})

const route = useRoute()
const courseId = route.params.id as string
const sessionId = route.params.sessionId as string

const { fetchCourse, fetchChapters, createChapter } = useCourses()
const { apiFetch } = useApi()
const { success, error: showError } = useToast()

const course = ref<Course | null>(null)
const session = ref<Session | null>(null)
const chapters = ref<Chapter[]>([])
const loading = ref(true)
const showAddForm = ref(false)
const saving = ref(false)

const newChapter = reactive<CreateChapterRequest>({
  title: '',
  content: '',
  sortOrder: 1,
  estimatedDuration: 10,
  type: 'theory',
  audioUrl: '',
  videoUrl: '',
})

useHead({ title: computed(() => session.value ? `Chapitres — ${session.value.title}` : 'Chapitres — Olulimi Lwirhu') })

const sortedChapters = computed(() =>
  [...chapters.value].sort((a, b) => a.sortOrder - b.sortOrder)
)

const typeLabel = (type: string) => type === 'practice' ? 'Pratique' : 'Theorie'
const typeClass = (type: string) => type === 'practice'
  ? 'bg-accent-100 text-accent-700'
  : 'bg-primary-100 text-primary-700'

const handleAddChapter = async () => {
  if (!newChapter.title.trim()) return
  saving.value = true
  try {
    const chapter = await createChapter(sessionId, {
      title: newChapter.title,
      content: newChapter.content || undefined,
      sortOrder: newChapter.sortOrder,
      estimatedDuration: newChapter.estimatedDuration || undefined,
      type: newChapter.type,
      audioUrl: newChapter.audioUrl || undefined,
      videoUrl: newChapter.videoUrl || undefined,
    })
    chapters.value.push(chapter)
    newChapter.title = ''
    newChapter.content = ''
    newChapter.sortOrder = chapters.value.length + 1
    newChapter.audioUrl = ''
    newChapter.videoUrl = ''
    showAddForm.value = false
    success('Chapitre ajoute avec succes.')
  } catch {
    showError('Erreur lors de la creation du chapitre.')
  } finally {
    saving.value = false
  }
}

const handleDeleteChapter = async (chapterId: string) => {
  try {
    await apiFetch(`/chapters/${chapterId}`, { method: 'DELETE' })
    chapters.value = chapters.value.filter(c => c.id !== chapterId)
    success('Chapitre supprime.')
  } catch {
    showError('Erreur lors de la suppression.')
  }
}

onMounted(async () => {
  try {
    const [courseData, chaptersData] = await Promise.all([
      fetchCourse(courseId),
      fetchChapters(sessionId),
    ])
    course.value = courseData
    chapters.value = chaptersData
    newChapter.sortOrder = chaptersData.length + 1

    // Fetch session info
    const sessions = await apiFetch<Session[]>(`/courses/${courseId}/sessions`)
    session.value = sessions.find(s => s.id === sessionId) ?? null
  } catch {
    showError('Impossible de charger les donnees.')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <NuxtLink :to="`/teacher/courses/${courseId}/sessions`" class="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mb-6">
      <Icon name="heroicons:arrow-left" class="w-4 h-4" />
      Retour aux sessions
    </NuxtLink>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
    </div>

    <template v-else>
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">
            Chapitres de la session
          </h1>
          <p v-if="session" class="mt-1 text-slate-500">
            {{ session.title }} — {{ course?.title }}
          </p>
        </div>
        <button
          class="btn btn-primary flex items-center gap-2"
          @click="showAddForm = !showAddForm"
        >
          <Icon :name="showAddForm ? 'heroicons:x-mark' : 'heroicons:plus'" class="w-5 h-5" />
          {{ showAddForm ? 'Fermer' : 'Ajouter un chapitre' }}
        </button>
      </div>

      <!-- Add form -->
      <div v-if="showAddForm" class="card p-6 mb-6 border-primary-200">
        <h3 class="font-semibold text-slate-900 mb-4">Nouveau chapitre</h3>
        <form @submit.prevent="handleAddChapter">
          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-slate-700 mb-1">Titre *</label>
                <input v-model="newChapter.title" type="text" class="input-field" placeholder="Titre du chapitre" required />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Ordre</label>
                  <input v-model.number="newChapter.sortOrder" type="number" class="input-field" min="1" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select v-model="newChapter.type" class="input-field">
                    <option value="theory">Theorie</option>
                    <option value="practice">Pratique</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Contenu</label>
              <textarea v-model="newChapter.content" class="input-field min-h-[100px]" rows="4" placeholder="Contenu du chapitre (HTML autorise)..." />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Duree (min)</label>
                <input v-model.number="newChapter.estimatedDuration" type="number" class="input-field" min="1" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">URL audio</label>
                <input v-model="newChapter.audioUrl" type="url" class="input-field" placeholder="https://..." />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">URL video</label>
                <input v-model="newChapter.videoUrl" type="url" class="input-field" placeholder="https://..." />
              </div>
            </div>
          </div>
          <div class="mt-5 flex justify-end">
            <button type="submit" class="btn btn-primary" :disabled="saving || !newChapter.title.trim()">
              {{ saving ? 'Ajout...' : 'Ajouter le chapitre' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Chapters list -->
      <div v-if="sortedChapters.length === 0 && !showAddForm" class="card p-12 text-center">
        <Icon name="heroicons:document-text" class="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h3 class="text-lg font-medium text-slate-700 mb-2">Aucun chapitre</h3>
        <p class="text-slate-500">Ajoutez des chapitres pour structurer cette session.</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="chap in sortedChapters"
          :key="chap.id"
          class="card p-5 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4 min-w-0 flex-1">
              <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold flex-shrink-0">
                {{ chap.sortOrder }}
              </div>
              <div class="min-w-0">
                <h3 class="font-semibold text-slate-900 truncate">{{ chap.title }}</h3>
                <div class="flex items-center gap-2 mt-1">
                  <span :class="typeClass(chap.type)" class="text-xs px-2 py-0.5 rounded-full font-medium">
                    {{ typeLabel(chap.type) }}
                  </span>
                  <span v-if="chap.estimatedDuration" class="text-xs text-slate-500">
                    {{ chap.estimatedDuration }} min
                  </span>
                  <Icon v-if="chap.audioUrl" name="heroicons:speaker-wave" class="w-3.5 h-3.5 text-slate-400" title="Audio" />
                  <Icon v-if="chap.videoUrl" name="heroicons:video-camera" class="w-3.5 h-3.5 text-slate-400" title="Video" />
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2 ml-4">
              <NuxtLink
                :to="`/teacher/courses/${courseId}/quiz/${chap.id}`"
                class="btn btn-outline text-xs"
              >
                Quiz
              </NuxtLink>
              <button
                class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Supprimer"
                @click="handleDeleteChapter(chap.id)"
              >
                <Icon name="heroicons:trash" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
