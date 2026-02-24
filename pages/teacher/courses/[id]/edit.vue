<script setup lang="ts">
import type { Course } from '~/types/course'

definePageMeta({
  middleware: 'teacher',
  layout: 'teacher',
})

const route = useRoute()
const courseId = route.params.id as string

const { fetchCourse, updateCourse } = useCourses()
const { success, error: showError } = useToast()

const course = ref<Course | null>(null)
const loading = ref(true)
const saving = ref(false)

const form = reactive({
  title: '',
  description: '',
  level: 'beginner',
  coverImage: '',
  status: 'draft',
})

useHead({ title: computed(() => course.value ? `Modifier — ${course.value.title}` : 'Modifier le cours — Olulimi Lwirhu') })

const handleSave = async () => {
  if (!form.title.trim()) return
  saving.value = true
  try {
    const updated = await updateCourse(courseId, {
      title: form.title,
      description: form.description || undefined,
      level: form.level,
      coverImage: form.coverImage || undefined,
      status: form.status,
    })
    course.value = updated
    success('Cours mis a jour avec succes.')
  } catch {
    showError('Erreur lors de la mise a jour du cours.')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    const data = await fetchCourse(courseId)
    course.value = data
    form.title = data.title
    form.description = data.description ?? ''
    form.level = data.level
    form.coverImage = data.coverImage ?? ''
    form.status = data.status
  } catch {
    showError('Impossible de charger le cours.')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <UiBreadcrumb :items="[
      { label: 'Enseignant', to: '/teacher' },
      { label: 'Mes cours', to: '/teacher/courses' },
      { label: course?.title || 'Modifier' },
    ]" />

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
    </div>

    <template v-else-if="course">
      <h1 class="text-3xl font-bold text-slate-900 mb-8">
        Modifier le cours
      </h1>

      <div class="card p-6 sm:p-8">
        <form @submit.prevent="handleSave">
          <div class="space-y-5">
            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-medium text-slate-700 mb-1">
                Titre du cours <span class="text-red-500">*</span>
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                class="input-field"
                required
              />
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                v-model="form.description"
                class="input-field min-h-[120px] resize-y"
                rows="4"
              />
            </div>

            <!-- Level -->
            <div>
              <label for="level" class="block text-sm font-medium text-slate-700 mb-1">
                Niveau
              </label>
              <select id="level" v-model="form.level" class="input-field">
                <option value="beginner">Debutant</option>
                <option value="intermediate">Intermediaire</option>
                <option value="advanced">Avance</option>
              </select>
            </div>

            <!-- Status -->
            <div>
              <label for="status" class="block text-sm font-medium text-slate-700 mb-1">
                Statut
              </label>
              <select id="status" v-model="form.status" class="input-field">
                <option value="draft">Brouillon</option>
                <option value="published">Publie</option>
                <option value="archived">Archive</option>
              </select>
            </div>

            <!-- Cover image -->
            <div>
              <label for="coverImage" class="block text-sm font-medium text-slate-700 mb-1">
                URL de l'image de couverture
              </label>
              <input
                id="coverImage"
                v-model="form.coverImage"
                type="url"
                class="input-field"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div class="mt-8 flex items-center justify-between">
            <NuxtLink
              :to="`/teacher/courses/${courseId}/sessions`"
              class="btn btn-outline flex items-center gap-2 text-sm"
            >
              <Icon name="heroicons:folder" class="w-4 h-4" />
              Gerer les sessions
            </NuxtLink>
            <button
              type="submit"
              class="btn btn-primary flex items-center gap-2"
              :disabled="saving || !form.title.trim()"
            >
              <Icon v-if="saving" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
              <Icon v-else name="heroicons:check" class="w-4 h-4" />
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </template>
  </div>
</template>
