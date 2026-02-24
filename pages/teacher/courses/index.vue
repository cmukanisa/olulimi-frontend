<script setup lang="ts">
import type { Course } from '~/types/course'

definePageMeta({
  middleware: 'teacher',
  layout: 'teacher',
})

useHead({ title: 'Mes cours — Enseignant — Olulimi Lwirhu' })

const { fetchMyCourses } = useTeacher()
const { deleteCourse } = useCourses()
const { success, error: showError } = useToast()

const courses = ref<Course[]>([])
const loading = ref(true)
const statusFilter = ref<'all' | 'draft' | 'published' | 'archived'>('all')
const deleteConfirm = ref<string | null>(null)

const filteredCourses = computed(() => {
  if (statusFilter.value === 'all') return courses.value
  return courses.value.filter(c => c.status === statusFilter.value)
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

const handleDelete = async (id: string) => {
  try {
    await deleteCourse(id)
    courses.value = courses.value.filter(c => c.id !== id)
    success('Cours supprime avec succes.')
  } catch {
    showError('Erreur lors de la suppression du cours.')
  } finally {
    deleteConfirm.value = null
  }
}

onMounted(async () => {
  try {
    courses.value = await fetchMyCourses()
  } catch {
    showError('Impossible de charger vos cours.')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-slate-900">
        Mes cours
      </h1>
      <NuxtLink to="/teacher/courses/new" class="btn btn-primary flex items-center gap-2">
        <Icon name="heroicons:plus" class="w-5 h-5" />
        Nouveau cours
      </NuxtLink>
    </div>

    <!-- Status filter -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="filter in (['all', 'draft', 'published', 'archived'] as const)"
        :key="filter"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="statusFilter === filter
          ? 'bg-primary-600 text-white'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
        @click="statusFilter = filter"
      >
        {{ filter === 'all' ? 'Tous' : filter === 'draft' ? 'Brouillon' : filter === 'published' ? 'Publie' : 'Archive' }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
    </div>

    <!-- Empty -->
    <div v-else-if="filteredCourses.length === 0" class="card p-16 text-center">
      <Icon name="heroicons:book-open" class="w-20 h-20 mx-auto text-slate-300 mb-6" />
      <h2 class="text-xl font-semibold text-slate-700 mb-2">
        {{ statusFilter === 'all' ? 'Aucun cours' : 'Aucun cours avec ce statut' }}
      </h2>
      <p class="text-slate-500 mb-6">Creez un nouveau cours pour commencer.</p>
      <NuxtLink to="/teacher/courses/new" class="btn btn-primary inline-block">
        Creer un cours
      </NuxtLink>
    </div>

    <!-- Courses grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="course in filteredCourses"
        :key="course.id"
        class="card overflow-hidden hover:shadow-md transition-shadow"
      >
        <!-- Cover -->
        <div class="h-40 bg-gradient-to-br from-primary-400 to-primary-600 relative">
          <img
            v-if="course.coverImage"
            :src="course.coverImage"
            :alt="course.title"
            class="w-full h-full object-cover"
          />
          <span
            :class="statusClass(course.status)"
            class="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium"
          >
            {{ statusLabel(course.status) }}
          </span>
        </div>

        <div class="p-5">
          <h3 class="font-semibold text-slate-900 mb-1 truncate">
            {{ course.title }}
          </h3>
          <div class="flex items-center gap-3 text-xs text-slate-500 mb-4">
            <span class="flex items-center gap-1">
              <Icon name="heroicons:folder" class="w-3.5 h-3.5" />
              {{ course.sessionsCount }} sessions
            </span>
            <span class="flex items-center gap-1">
              <Icon name="heroicons:academic-cap" class="w-3.5 h-3.5" />
              {{ course.level }}
            </span>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <NuxtLink :to="`/teacher/courses/${course.id}/edit`" class="btn btn-outline text-xs flex-1 text-center">
              Modifier
            </NuxtLink>
            <NuxtLink :to="`/teacher/courses/${course.id}/stats`" class="btn btn-outline text-xs flex-1 text-center">
              Stats
            </NuxtLink>
            <div v-if="deleteConfirm !== course.id">
              <button
                class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Supprimer"
                @click="deleteConfirm = course.id"
              >
                <Icon name="heroicons:trash" class="w-4 h-4" />
              </button>
            </div>
            <div v-else class="flex items-center gap-1">
              <button class="btn btn-danger text-xs" @click="handleDelete(course.id)">
                Oui
              </button>
              <button class="btn btn-outline text-xs" @click="deleteConfirm = null">
                Non
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
