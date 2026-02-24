<script setup lang="ts">
import type { Chapter } from '~/types/course'
import type { QuizQuestion } from '~/types/learning'

definePageMeta({
  middleware: 'teacher',
  layout: 'teacher',
})

const route = useRoute()
const courseId = route.params.id as string
const chapterId = route.params.chapterId as string

const { fetchChapters } = useCourses()
const { apiFetch } = useApi()
const { success, error: showError } = useToast()

const chapter = ref<Chapter | null>(null)
const loading = ref(true)
const saving = ref(false)

const quizTitle = ref('')
const quizType = ref<'qcm' | 'true_false'>('qcm')
const questions = ref<Array<{
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}>>([])

useHead({ title: computed(() => chapter.value ? `Quiz — ${chapter.value.title}` : 'Quiz — Olulimi Lwirhu') })

const addQuestion = () => {
  questions.value.push({
    question: '',
    options: quizType.value === 'qcm' ? ['', '', '', ''] : ['Vrai', 'Faux'],
    correctAnswer: '',
    explanation: '',
  })
}

const removeQuestion = (index: number) => {
  questions.value.splice(index, 1)
}

const addOption = (qIndex: number) => {
  questions.value[qIndex].options.push('')
}

const removeOption = (qIndex: number, oIndex: number) => {
  questions.value[qIndex].options.splice(oIndex, 1)
}

const handleSave = async () => {
  if (!quizTitle.value.trim() || questions.value.length === 0) return
  saving.value = true
  try {
    await apiFetch('/quizzes', {
      method: 'POST',
      body: {
        title: quizTitle.value,
        type: quizType.value,
        chapterId,
        questions: questions.value.map(q => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || null,
        })),
      },
    })
    success('Quiz cree avec succes !')
  } catch {
    showError('Erreur lors de la creation du quiz.')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    // Find the chapter across all sessions
    const sessions = await apiFetch<any[]>(`/courses/${courseId}/sessions`)
    for (const session of sessions) {
      const chapters = await fetchChapters(session.id)
      const found = chapters.find(c => c.id === chapterId)
      if (found) {
        chapter.value = found
        break
      }
    }
  } catch {
    showError('Impossible de charger les donnees.')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <button class="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mb-6" @click="$router.back()">
      <Icon name="heroicons:arrow-left" class="w-4 h-4" />
      Retour
    </button>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
    </div>

    <template v-else>
      <h1 class="text-3xl font-bold text-slate-900 mb-2">
        Quiz du chapitre
      </h1>
      <p v-if="chapter" class="text-slate-500 mb-8">
        {{ chapter.title }}
      </p>

      <form @submit.prevent="handleSave">
        <!-- Quiz info -->
        <div class="card p-6 mb-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Titre du quiz <span class="text-red-500">*</span>
              </label>
              <input v-model="quizTitle" type="text" class="input-field" placeholder="Ex: Quiz - Les salutations" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Type
              </label>
              <select v-model="quizType" class="input-field">
                <option value="qcm">QCM (Choix multiples)</option>
                <option value="true_false">Vrai / Faux</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Questions -->
        <div class="space-y-4 mb-6">
          <div
            v-for="(q, qIndex) in questions"
            :key="qIndex"
            class="card p-6"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-slate-900">
                Question {{ qIndex + 1 }}
              </h3>
              <button
                type="button"
                class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                @click="removeQuestion(qIndex)"
              >
                <Icon name="heroicons:trash" class="w-4 h-4" />
              </button>
            </div>

            <div class="space-y-4">
              <!-- Question text -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Enonce <span class="text-red-500">*</span>
                </label>
                <input v-model="q.question" type="text" class="input-field" placeholder="Posez votre question..." required />
              </div>

              <!-- Options -->
              <div v-if="quizType === 'qcm'">
                <label class="block text-sm font-medium text-slate-700 mb-2">Options</label>
                <div class="space-y-2">
                  <div v-for="(option, oIndex) in q.options" :key="oIndex" class="flex items-center gap-2">
                    <input
                      v-model="q.options[oIndex]"
                      type="text"
                      class="input-field flex-1"
                      :placeholder="`Option ${oIndex + 1}`"
                    />
                    <button
                      v-if="q.options.length > 2"
                      type="button"
                      class="p-2 text-red-400 hover:text-red-600"
                      @click="removeOption(qIndex, oIndex)"
                    >
                      <Icon name="heroicons:x-mark" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  class="mt-2 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  @click="addOption(qIndex)"
                >
                  <Icon name="heroicons:plus" class="w-4 h-4" />
                  Ajouter une option
                </button>
              </div>

              <!-- Correct answer -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Bonne reponse <span class="text-red-500">*</span>
                </label>
                <select v-if="quizType === 'qcm'" v-model="q.correctAnswer" class="input-field">
                  <option value="" disabled>Selectionnez la bonne reponse</option>
                  <option v-for="(opt, i) in q.options" :key="i" :value="opt">
                    {{ opt || `Option ${i + 1}` }}
                  </option>
                </select>
                <select v-else v-model="q.correctAnswer" class="input-field">
                  <option value="" disabled>Selectionnez</option>
                  <option value="true">Vrai</option>
                  <option value="false">Faux</option>
                </select>
              </div>

              <!-- Explanation -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Explication (optionnelle)
                </label>
                <input v-model="q.explanation" type="text" class="input-field" placeholder="Pourquoi cette reponse est correcte..." />
              </div>
            </div>
          </div>
        </div>

        <!-- Add question -->
        <button
          type="button"
          class="btn btn-outline w-full flex items-center justify-center gap-2 mb-8"
          @click="addQuestion"
        >
          <Icon name="heroicons:plus-circle" class="w-5 h-5" />
          Ajouter une question
        </button>

        <!-- Save -->
        <div class="flex justify-end">
          <button
            type="submit"
            class="btn btn-primary flex items-center gap-2"
            :disabled="saving || !quizTitle.trim() || questions.length === 0"
            :class="{ 'opacity-50 cursor-not-allowed': saving || !quizTitle.trim() || questions.length === 0 }"
          >
            <Icon v-if="saving" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
            <Icon v-else name="heroicons:check" class="w-4 h-4" />
            Enregistrer le quiz
          </button>
        </div>
      </form>
    </template>
  </div>
</template>
