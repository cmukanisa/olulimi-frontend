<script setup lang="ts">
import type { Flashcard } from '~/types/learning'

interface Props {
  cards: Flashcard[]
}

const props = defineProps<Props>()

const currentIndex = ref(0)
const isFlipped = ref(false)
const knownCount = ref(0)
const unknownCount = ref(0)
const finished = ref(false)

const currentCard = computed(() => props.cards[currentIndex.value])
const totalCards = computed(() => props.cards.length)
const progressPercent = computed(() => Math.round(((currentIndex.value) / totalCards.value) * 100))

const flipCard = () => {
  isFlipped.value = !isFlipped.value
}

const markKnown = () => {
  knownCount.value++
  goNext()
}

const markUnknown = () => {
  unknownCount.value++
  goNext()
}

const goNext = () => {
  isFlipped.value = false
  if (currentIndex.value < totalCards.value - 1) {
    setTimeout(() => {
      currentIndex.value++
    }, 200)
  } else {
    finished.value = true
  }
}

const restart = () => {
  currentIndex.value = 0
  isFlipped.value = false
  knownCount.value = 0
  unknownCount.value = 0
  finished.value = false
}
</script>

<template>
  <div>
    <!-- Finished screen -->
    <div v-if="finished" class="card p-8 text-center max-w-md mx-auto">
      <Icon name="heroicons:trophy" class="w-16 h-16 mx-auto text-accent-500 mb-4" />
      <h2 class="text-2xl font-bold text-slate-900 mb-4">Session terminee !</h2>
      <div class="flex items-center justify-center gap-8 mb-6">
        <div class="text-center">
          <p class="text-3xl font-bold text-secondary-600">{{ knownCount }}</p>
          <p class="text-sm text-slate-500">Connues</p>
        </div>
        <div class="w-px h-12 bg-slate-200" />
        <div class="text-center">
          <p class="text-3xl font-bold text-red-500">{{ unknownCount }}</p>
          <p class="text-sm text-slate-500">A revoir</p>
        </div>
      </div>
      <button class="btn btn-primary" @click="restart">
        Recommencer
      </button>
    </div>

    <!-- Card review -->
    <template v-else>
      <!-- Progress -->
      <div class="mb-6">
        <div class="flex items-center justify-between text-sm mb-2">
          <span class="text-slate-600">Carte {{ currentIndex + 1 }} / {{ totalCards }}</span>
          <span class="font-medium text-primary-600">{{ progressPercent }}%</span>
        </div>
        <div class="w-full bg-slate-200 rounded-full h-2">
          <div
            class="bg-primary-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${progressPercent}%` }"
          />
        </div>
      </div>

      <!-- Flashcard -->
      <div class="flex justify-center mb-8">
        <div
          class="w-full max-w-lg cursor-pointer perspective-1000"
          style="perspective: 1000px;"
          @click="flipCard"
        >
          <div
            class="relative w-full transition-transform duration-500 preserve-3d"
            :class="{ 'rotate-y-180': isFlipped }"
            style="transform-style: preserve-3d; min-height: 280px;"
            :style="{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }"
          >
            <!-- Front -->
            <div
              class="absolute inset-0 card p-8 flex flex-col items-center justify-center backface-hidden"
              style="backface-visibility: hidden;"
            >
              <p class="text-xs text-slate-400 uppercase tracking-wider mb-4">Mashi</p>
              <p class="text-3xl sm:text-4xl font-bold text-slate-900 text-center">
                {{ currentCard.mashiWord }}
              </p>
              <p class="mt-6 text-sm text-slate-400 flex items-center gap-1">
                <Icon name="heroicons:hand-raised" class="w-4 h-4" />
                Cliquez pour retourner
              </p>
            </div>

            <!-- Back -->
            <div
              class="absolute inset-0 card p-8 flex flex-col items-center justify-center backface-hidden"
              style="backface-visibility: hidden; transform: rotateY(180deg);"
            >
              <p class="text-xs text-slate-400 uppercase tracking-wider mb-4">Francais</p>
              <p class="text-3xl sm:text-4xl font-bold text-primary-600 text-center">
                {{ currentCard.frenchTranslation }}
              </p>
              <p v-if="currentCard.phonetic" class="mt-4 text-lg text-slate-500 italic">
                /{{ currentCard.phonetic }}/
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center justify-center gap-4">
        <button
          class="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
          @click="markUnknown"
        >
          <Icon name="heroicons:x-mark" class="w-5 h-5" />
          Je ne connais pas
        </button>
        <button
          class="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-secondary-700 bg-secondary-100 hover:bg-secondary-200 transition-colors"
          @click="markKnown"
        >
          <Icon name="heroicons:check" class="w-5 h-5" />
          Je connais
        </button>
      </div>
    </template>
  </div>
</template>
