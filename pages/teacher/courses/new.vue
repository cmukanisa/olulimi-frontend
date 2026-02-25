<script setup lang="ts">
definePageMeta({
  middleware: 'teacher',
  layout: 'teacher',
})

const { t } = useLocale()
useHead({ title: computed(() => t('head.teacherNewCourse')) })

const { createCourse } = useCourses()
const { success, error: showError } = useToast()
const router = useRouter()

const form = reactive({
  title: '',
  description: '',
  level: 'beginner' as string,
  coverImage: '',
})

const saving = ref(false)

const handleSubmit = async () => {
  if (!form.title.trim()) return
  saving.value = true
  try {
    const course = await createCourse({
      title: form.title,
      description: form.description || undefined,
      level: form.level,
      coverImage: form.coverImage || undefined,
    })
    success('Cours cree avec succes !')
    await router.push(`/teacher/courses/${course.id}/edit`)
  } catch {
    showError('Erreur lors de la creation du cours.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <UiBreadcrumb :items="[
      { label: 'Enseignant', to: '/teacher' },
      { label: 'Mes cours', to: '/teacher/courses' },
      { label: 'Nouveau cours' },
    ]" />

    <h1 class="text-3xl font-bold text-slate-900 mb-8">
      Nouveau cours
    </h1>

    <div class="card p-6 sm:p-8">
      <form @submit.prevent="handleSubmit">
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
              placeholder="Ex: Introduction au Mashi"
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
              placeholder="Decrivez le contenu et les objectifs du cours..."
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

        <div class="mt-8 flex items-center justify-end gap-3">
          <NuxtLink to="/teacher/courses" class="btn btn-outline">
            Annuler
          </NuxtLink>
          <button
            type="submit"
            class="btn btn-primary flex items-center gap-2"
            :disabled="saving || !form.title.trim()"
            :class="{ 'opacity-50 cursor-not-allowed': saving || !form.title.trim() }"
          >
            <Icon v-if="saving" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
            <Icon v-else name="heroicons:plus" class="w-4 h-4" />
            Creer le cours
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
