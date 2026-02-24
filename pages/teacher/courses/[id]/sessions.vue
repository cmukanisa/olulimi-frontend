<script setup lang="ts">
import type { Course, Session, CreateSessionRequest } from '~/types/course'

definePageMeta({
  middleware: 'teacher',
  layout: 'teacher',
})

const route = useRoute()
const courseId = route.params.id as string

const { fetchCourse, fetchSessions, createSession } = useCourses()
const { success, error: showError } = useToast()
const { apiFetch } = useApi()

const course = ref<Course | null>(null)
const sessions = ref<Session[]>([])
const loading = ref(true)
const showAddForm = ref(false)
const saving = ref(false)

const newSession = reactive<CreateSessionRequest>({
  title: '',
  description: '',
  sortOrder: 1,
})

useHead({ title: computed(() => course.value ? `Sessions — ${course.value.title}` : 'Sessions — Olulimi Lwirhu') })

const sortedSessions = computed(() =>
  [...sessions.value].sort((a, b) => a.sortOrder - b.sortOrder)
)

const handleAddSession = async () => {
  if (!newSession.title.trim()) return
  saving.value = true
  try {
    const session = await createSession(courseId, {
      title: newSession.title,
      description: newSession.description || undefined,
      sortOrder: newSession.sortOrder,
    })
    sessions.value.push(session)
    newSession.title = ''
    newSession.description = ''
    newSession.sortOrder = sessions.value.length + 1
    showAddForm.value = false
    success('Session ajoutee avec succes.')
  } catch {
    showError('Erreur lors de la creation de la session.')
  } finally {
    saving.value = false
  }
}

const handleDeleteSession = async (sessionId: string) => {
  try {
    await apiFetch(`/sessions/${sessionId}`, { method: 'DELETE' })
    sessions.value = sessions.value.filter(s => s.id !== sessionId)
    success('Session supprimee.')
  } catch {
    showError('Erreur lors de la suppression.')
  }
}

onMounted(async () => {
  try {
    const [courseData, sessionsData] = await Promise.all([
      fetchCourse(courseId),
      fetchSessions(courseId),
    ])
    course.value = courseData
    sessions.value = sessionsData
    newSession.sortOrder = sessionsData.length + 1
  } catch {
    showError('Impossible de charger les donnees.')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <NuxtLink :to="`/teacher/courses/${courseId}/edit`" class="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mb-6">
      <Icon name="heroicons:arrow-left" class="w-4 h-4" />
      Retour au cours
    </NuxtLink>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
    </div>

    <template v-else-if="course">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">
            Sessions du cours
          </h1>
          <p class="mt-1 text-slate-500">{{ course.title }}</p>
        </div>
        <button
          class="btn btn-primary flex items-center gap-2"
          @click="showAddForm = !showAddForm"
        >
          <Icon :name="showAddForm ? 'heroicons:x-mark' : 'heroicons:plus'" class="w-5 h-5" />
          {{ showAddForm ? 'Fermer' : 'Ajouter une session' }}
        </button>
      </div>

      <!-- Add form -->
      <div v-if="showAddForm" class="card p-6 mb-6 border-primary-200">
        <h3 class="font-semibold text-slate-900 mb-4">Nouvelle session</h3>
        <form @submit.prevent="handleAddSession">
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-1">Titre *</label>
              <input v-model="newSession.title" type="text" class="input-field" placeholder="Titre de la session" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Ordre</label>
              <input v-model.number="newSession.sortOrder" type="number" class="input-field" min="1" />
            </div>
            <div class="flex items-end">
              <button type="submit" class="btn btn-primary w-full" :disabled="saving">
                {{ saving ? 'Ajout...' : 'Ajouter' }}
              </button>
            </div>
          </div>
          <div class="mt-3">
            <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea v-model="newSession.description" class="input-field" rows="2" placeholder="Description optionnelle..." />
          </div>
        </form>
      </div>

      <!-- Sessions list -->
      <div v-if="sortedSessions.length === 0" class="card p-12 text-center">
        <Icon name="heroicons:folder-open" class="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h3 class="text-lg font-medium text-slate-700 mb-2">Aucune session</h3>
        <p class="text-slate-500">Ajoutez votre premiere session pour structurer le cours.</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="session in sortedSessions"
          :key="session.id"
          class="card p-5 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4 min-w-0 flex-1">
              <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 font-bold flex-shrink-0">
                {{ session.sortOrder }}
              </div>
              <div class="min-w-0">
                <h3 class="font-semibold text-slate-900 truncate">
                  {{ session.title }}
                </h3>
                <p class="text-xs text-slate-500">
                  {{ session.chaptersCount }} chapitres
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 ml-4">
              <NuxtLink
                :to="`/teacher/courses/${courseId}/chapters/${session.id}`"
                class="btn btn-outline text-xs"
              >
                Chapitres
              </NuxtLink>
              <button
                class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Supprimer"
                @click="handleDeleteSession(session.id)"
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
