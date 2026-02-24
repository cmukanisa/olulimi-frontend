<script setup lang="ts">
import type { TranslationExercise } from '~/types/learning'

interface Props {
  exercise: TranslationExercise
}

const props = defineProps<Props>()

const answer = ref('')
const submitted = ref(false)
const isCorrect = ref(false)

const directionLabel = computed(() =>
  props.exercise.direction === 'mashi_to_french' ? 'Mashi → Francais' : 'Francais → Mashi'
)

const directionColor = computed(() =>
  props.exercise.direction === 'mashi_to_french'
    ? 'bg-primary-100 text-primary-700'
    : 'bg-accent-100 text-accent-700'
)

const verify = () => {
  if (!answer.value.trim()) return
  isCorrect.value = answer.value.trim().toLowerCase() === props.exercise.expectedTranslation.trim().toLowerCase()
  submitted.value = true
}

const reset = () => {
  answer.value = ''
  submitted.value = false
  isCorrect.value = false
}
</script>

<template>
  <div
    class="card p-6 transition-all"
    :class="{
      'border-secondary-400': submitted && isCorrect,
      'border-red-400': submitted && !isCorrect,
    }"
  >
    <!-- Direction badge -->
    <div class="flex items-center justify-between mb-4">
      <span
        class="text-xs font-medium px-2.5 py-1 rounded-full"
        :class="directionColor"
      >
        {{ directionLabel }}
      </span>
      <button
        v-if="submitted"
        class="text-xs text-primary-600 hover:text-primary-700 font-medium"
        @click="reset"
      >
        Recommencer
      </button>
    </div>

    <!-- Source text -->
    <div class="mb-4">
      <p class="text-sm text-slate-500 mb-1">Traduisez :</p>
      <p class="text-lg font-semibold text-slate-900">
        {{ exercise.sourceText }}
      </p>
    </div>

    <!-- Answer input -->
    <div class="flex gap-3">
      <input
        v-model="answer"
        type="text"
        class="input-field flex-1"
        :class="{
          '!border-secondary-500 !ring-secondary-500': submitted && isCorrect,
          '!border-red-500 !ring-red-500': submitted && !isCorrect,
        }"
        placeholder="Votre traduction..."
        :disabled="submitted"
        @keyup.enter="verify"
      />
      <button
        v-if="!submitted"
        class="btn btn-primary flex-shrink-0"
        :disabled="!answer.trim()"
        :class="{ 'opacity-50 cursor-not-allowed': !answer.trim() }"
        @click="verify"
      >
        Verifier
      </button>
    </div>

    <!-- Result -->
    <div v-if="submitted" class="mt-4">
      <div
        v-if="isCorrect"
        class="flex items-center gap-2 text-secondary-600"
      >
        <Icon name="heroicons:check-circle-solid" class="w-5 h-5" />
        <span class="font-medium">Correct !</span>
      </div>
      <div v-else class="space-y-2">
        <div class="flex items-center gap-2 text-red-600">
          <Icon name="heroicons:x-circle-solid" class="w-5 h-5" />
          <span class="font-medium">Incorrect</span>
        </div>
        <p class="text-sm text-slate-600">
          Reponse attendue :
          <span class="font-semibold text-secondary-600">{{ exercise.expectedTranslation }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
