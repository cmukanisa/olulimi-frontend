<script setup lang="ts">
import type { Quiz, QuizResult } from '~/types/learning'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

const route = useRoute()
const quizId = route.params.quizId as string

const { fetchQuiz, submitQuiz } = useLearning()
const { success, error: showError } = useToast()

const quiz = ref<Quiz | null>(null)
const result = ref<QuizResult | null>(null)
const loading = ref(true)
const submitting = ref(false)
const showResults = ref(false)
const userAnswers = ref<Record<string, string>>({})

useHead({ title: computed(() => quiz.value ? `${quiz.value.title} — Quiz` : 'Quiz — Olulimi Lwirhu') })

const scorePercent = computed(() => result.value ? Math.round(result.value.score) : 0)
const scoreColor = computed(() => {
  if (scorePercent.value >= 80) return 'text-secondary-600'
  if (scorePercent.value >= 50) return 'text-accent-600'
  return 'text-red-600'
})

const handleSubmit = async (answers: Record<string, string>) => {
  submitting.value = true
  userAnswers.value = answers
  try {
    result.value = await submitQuiz(quizId, answers)
    showResults.value = true
    success('Quiz soumis avec succes !')
  } catch {
    showError('Erreur lors de la soumission du quiz.')
  } finally {
    submitting.value = false
  }
}

const retryQuiz = () => {
  showResults.value = false
  result.value = null
  userAnswers.value = {}
}

onMounted(async () => {
  try {
    quiz.value = await fetchQuiz(quizId)
  } catch {
    showError('Impossible de charger le quiz.')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
    </div>

    <template v-else-if="quiz">
      <!-- Results -->
      <div v-if="showResults && result" class="space-y-6">
        <!-- Score card -->
        <div class="card p-8 text-center">
          <div class="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4"
            :class="scorePercent >= 80 ? 'bg-secondary-100' : scorePercent >= 50 ? 'bg-accent-100' : 'bg-red-100'"
          >
            <span class="text-3xl font-bold" :class="scoreColor">{{ scorePercent }}%</span>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 mb-2">
            {{ scorePercent >= 80 ? 'Excellent !' : scorePercent >= 50 ? 'Pas mal !' : 'Continuez vos efforts !' }}
          </h2>
          <p class="text-slate-600">
            Vous avez obtenu {{ scorePercent }}% au quiz "{{ quiz.title }}"
          </p>
        </div>

        <!-- Answers review -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-slate-900">Revue des reponses</h3>
          <div
            v-for="(question, index) in quiz.questions"
            :key="question.id"
            class="card p-5"
          >
            <div class="flex items-start gap-3">
              <div
                class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
                :class="userAnswers[question.id] === question.correctAnswer
                  ? 'bg-secondary-100'
                  : 'bg-red-100'"
              >
                <Icon
                  :name="userAnswers[question.id] === question.correctAnswer ? 'heroicons:check' : 'heroicons:x-mark'"
                  class="w-5 h-5"
                  :class="userAnswers[question.id] === question.correctAnswer ? 'text-secondary-600' : 'text-red-600'"
                />
              </div>
              <div class="flex-1">
                <p class="font-medium text-slate-900">
                  {{ index + 1 }}. {{ question.question }}
                </p>
                <p class="text-sm mt-1" :class="userAnswers[question.id] === question.correctAnswer ? 'text-secondary-600' : 'text-red-600'">
                  Votre reponse : {{ userAnswers[question.id] || 'Aucune' }}
                </p>
                <p v-if="userAnswers[question.id] !== question.correctAnswer" class="text-sm text-secondary-600 mt-1">
                  Bonne reponse : {{ question.correctAnswer }}
                </p>
                <p v-if="question.explanation" class="text-sm text-slate-500 mt-2 italic">
                  {{ question.explanation }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-center gap-4 pt-4">
          <button class="btn btn-outline" @click="retryQuiz">
            Recommencer
          </button>
          <button class="btn btn-primary" @click="$router.back()">
            Retour au cours
          </button>
        </div>
      </div>

      <!-- Quiz player -->
      <div v-else>
        <h1 class="text-2xl font-bold text-slate-900 mb-6">
          {{ quiz.title }}
        </h1>
        <LearningQuizPlayer
          :quiz="quiz"
          @submit="handleSubmit"
        />
      </div>
    </template>

    <!-- Not found -->
    <div v-else class="card p-12 text-center">
      <Icon name="heroicons:exclamation-triangle" class="w-16 h-16 mx-auto text-slate-300 mb-4" />
      <h2 class="text-lg font-semibold text-slate-700">Quiz introuvable</h2>
    </div>
  </div>
</template>
