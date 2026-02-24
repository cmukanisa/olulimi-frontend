<script setup lang="ts">
import type { Quiz } from '~/types/learning'

interface Props {
  quiz: Quiz
}

const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [answers: Record<string, string>]
}>()

const currentIndex = ref(0)
const answers = ref<Record<string, string>>({})

const totalQuestions = computed(() => props.quiz.questions.length)
const currentQuestion = computed(() => props.quiz.questions[currentIndex.value])
const isFirst = computed(() => currentIndex.value === 0)
const isLast = computed(() => currentIndex.value === totalQuestions.value - 1)
const progressPercent = computed(() => Math.round(((currentIndex.value + 1) / totalQuestions.value) * 100))
const allAnswered = computed(() =>
  props.quiz.questions.every(q => answers.value[q.id] !== undefined)
)

const selectAnswer = (answer: string) => {
  answers.value[currentQuestion.value.id] = answer
}

const goNext = () => {
  if (!isLast.value) {
    currentIndex.value++
  }
}

const goPrevious = () => {
  if (!isFirst.value) {
    currentIndex.value--
  }
}

const handleSubmit = () => {
  emit('submit', { ...answers.value })
}

const isSelected = (option: string) => {
  return answers.value[currentQuestion.value.id] === option
}
</script>

<template>
  <div class="space-y-6">
    <!-- Progress -->
    <div>
      <div class="flex items-center justify-between text-sm mb-2">
        <span class="text-slate-600">
          Question {{ currentIndex + 1 }} / {{ totalQuestions }}
        </span>
        <span class="font-medium text-primary-600">{{ progressPercent }}%</span>
      </div>
      <div class="w-full bg-slate-200 rounded-full h-2">
        <div
          class="bg-primary-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>
    </div>

    <!-- Question -->
    <div class="card p-6 sm:p-8">
      <h3 class="text-lg font-semibold text-slate-900 mb-6">
        {{ currentQuestion.question }}
      </h3>

      <!-- QCM options -->
      <div v-if="quiz.type === 'qcm'" class="space-y-3">
        <button
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          class="w-full text-left p-4 rounded-xl border-2 transition-all duration-200"
          :class="isSelected(option)
            ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'"
          @click="selectAnswer(option)"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
              :class="isSelected(option)
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 text-slate-600'"
            >
              {{ String.fromCharCode(65 + index) }}
            </div>
            <span class="text-slate-800">{{ option }}</span>
          </div>
        </button>
      </div>

      <!-- True/False -->
      <div v-else-if="quiz.type === 'true_false'" class="flex gap-4">
        <button
          class="flex-1 p-6 rounded-xl border-2 text-center font-semibold transition-all duration-200"
          :class="isSelected('true')
            ? 'border-secondary-500 bg-secondary-50 text-secondary-700 ring-1 ring-secondary-500'
            : 'border-slate-200 hover:border-secondary-300 text-slate-700'"
          @click="selectAnswer('true')"
        >
          <Icon name="heroicons:check-circle" class="w-8 h-8 mx-auto mb-2" />
          Vrai
        </button>
        <button
          class="flex-1 p-6 rounded-xl border-2 text-center font-semibold transition-all duration-200"
          :class="isSelected('false')
            ? 'border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500'
            : 'border-slate-200 hover:border-red-300 text-slate-700'"
          @click="selectAnswer('false')"
        >
          <Icon name="heroicons:x-circle" class="w-8 h-8 mx-auto mb-2" />
          Faux
        </button>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex items-center justify-between">
      <button
        class="btn btn-outline flex items-center gap-2"
        :disabled="isFirst"
        :class="{ 'opacity-50 cursor-not-allowed': isFirst }"
        @click="goPrevious"
      >
        <Icon name="heroicons:arrow-left" class="w-4 h-4" />
        Precedent
      </button>
      <div class="flex gap-1.5">
        <button
          v-for="(_, index) in quiz.questions"
          :key="index"
          class="w-3 h-3 rounded-full transition-colors"
          :class="[
            index === currentIndex ? 'bg-primary-600' :
            answers[quiz.questions[index].id] ? 'bg-primary-300' :
            'bg-slate-200'
          ]"
          @click="currentIndex = index"
        />
      </div>
      <button
        v-if="!isLast"
        class="btn btn-primary flex items-center gap-2"
        @click="goNext"
      >
        Suivant
        <Icon name="heroicons:arrow-right" class="w-4 h-4" />
      </button>
      <button
        v-else
        class="btn btn-secondary flex items-center gap-2"
        :disabled="!allAnswered"
        :class="{ 'opacity-50 cursor-not-allowed': !allAnswered }"
        @click="handleSubmit"
      >
        <Icon name="heroicons:paper-airplane" class="w-4 h-4" />
        Soumettre
      </button>
    </div>
  </div>
</template>
