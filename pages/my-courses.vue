<script setup lang="ts">
import type { CourseEnrollment } from '~/types/course'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

useHead({ title: 'Mes cours — Olulimi Lwirhu' })

const { fetchMyEnrollments, unenroll } = useEnrollments()
const { success, error: showError } = useToast()

const enrollments = ref<CourseEnrollment[]>([])
const loading = ref(true)
const unenrollConfirm = ref<string | null>(null)

const loadEnrollments = async () => {
  loading.value = true
  try {
    enrollments.value = await fetchMyEnrollments()
  } catch {
    showError('Impossible de charger vos inscriptions.')
  } finally {
    loading.value = false
  }
}

const handleUnenroll = async (courseId: string) => {
  try {
    await unenroll(courseId)
    enrollments.value = enrollments.value.filter(e => e.courseId !== courseId)
    success('Desinscription effectuee avec succes.')
  } catch {
    showError('Erreur lors de la desinscription.')
  } finally {
    unenrollConfirm.value = null
  }
}

onMounted(loadEnrollments)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900">
        Mes cours
      </h1>
      <p class="mt-2 text-slate-600">
        Gerez vos inscriptions et suivez votre progression.
      </p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
    </div>

    <!-- Empty state -->
    <div v-else-if="enrollments.length === 0" class="card p-16 text-center">
      <Icon name="heroicons:academic-cap" class="w-20 h-20 mx-auto text-slate-300 mb-6" />
      <h2 class="text-xl font-semibold text-slate-700 mb-2">Aucune inscription</h2>
      <p class="text-slate-500 mb-8 max-w-md mx-auto">
        Vous n'etes inscrit a aucun cours pour le moment. Parcourez notre catalogue pour commencer.
      </p>
      <NuxtLink to="/courses" class="btn btn-primary inline-block">
        Parcourir les cours
      </NuxtLink>
    </div>

    <!-- Courses list -->
    <div v-else class="space-y-4">
      <div
        v-for="enrollment in enrollments"
        :key="enrollment.id"
        class="card p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <!-- Info -->
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-slate-900">
              {{ enrollment.courseTitle }}
            </h3>
            <p class="text-sm text-slate-500 mt-1">
              Par {{ enrollment.userName }}
            </p>
            <div class="mt-3 w-full max-w-xs">
              <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Progression</span>
                <span v-if="enrollment.isCompleted" class="text-secondary-600 font-medium">Termine</span>
                <span v-else>En cours</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2.5">
                <div
                  class="h-2.5 rounded-full transition-all duration-500"
                  :class="enrollment.isCompleted ? 'bg-secondary-500' : 'bg-primary-600'"
                  :style="{ width: enrollment.isCompleted ? '100%' : '40%' }"
                />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3 sm:flex-shrink-0">
            <NuxtLink :to="`/learn/${enrollment.courseId}`" class="btn btn-primary text-sm">
              Continuer
            </NuxtLink>
            <button
              v-if="unenrollConfirm !== enrollment.courseId"
              class="btn btn-outline text-sm !text-red-600 !border-red-300 hover:!bg-red-50"
              @click="unenrollConfirm = enrollment.courseId"
            >
              Se desinscrire
            </button>
            <div v-else class="flex items-center gap-2">
              <button
                class="btn btn-danger text-sm"
                @click="handleUnenroll(enrollment.courseId)"
              >
                Confirmer
              </button>
              <button
                class="btn btn-outline text-sm"
                @click="unenrollConfirm = null"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
