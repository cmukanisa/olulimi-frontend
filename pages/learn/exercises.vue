<script setup lang="ts">
import type { TranslationExercise } from '~/types/learning'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

const { t } = useLocale()
useHead({ title: computed(() => t('head.exercises')) })

const { fetchExercises } = useLearning()
const { error: showError } = useToast()

const exercises = ref<TranslationExercise[]>([])
const loading = ref(true)
const directionFilter = ref<'all' | 'mashi_to_french' | 'french_to_mashi'>('all')

const filteredExercises = computed(() => {
  if (directionFilter.value === 'all') return exercises.value
  return exercises.value.filter(e => e.direction === directionFilter.value)
})

onMounted(async () => {
  try {
    exercises.value = await fetchExercises()
  } catch {
    showError('Impossible de charger les exercices.')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900">
        Exercices de traduction
      </h1>
      <p class="mt-2 text-slate-600">
        Pratiquez la traduction entre le Mashi et le Francais.
      </p>
    </div>

    <!-- Direction filter -->
    <div class="flex flex-wrap gap-2 mb-8">
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="directionFilter === 'all'
          ? 'bg-primary-600 text-white'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
        @click="directionFilter = 'all'"
      >
        Tous
      </button>
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="directionFilter === 'mashi_to_french'
          ? 'bg-primary-600 text-white'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
        @click="directionFilter = 'mashi_to_french'"
      >
        Mashi → Francais
      </button>
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="directionFilter === 'french_to_mashi'
          ? 'bg-primary-600 text-white'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
        @click="directionFilter = 'french_to_mashi'"
      >
        Francais → Mashi
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
    </div>

    <!-- Empty -->
    <div v-else-if="filteredExercises.length === 0" class="card p-16 text-center">
      <Icon name="heroicons:language" class="w-20 h-20 mx-auto text-slate-300 mb-6" />
      <h2 class="text-xl font-semibold text-slate-700 mb-2">Aucun exercice disponible</h2>
      <p class="text-slate-500">
        Les exercices de traduction seront bientot disponibles.
      </p>
    </div>

    <!-- Exercises list -->
    <div v-else class="space-y-6">
      <LearningExerciseForm
        v-for="exercise in filteredExercises"
        :key="exercise.id"
        :exercise="exercise"
      />
    </div>
  </div>
</template>
