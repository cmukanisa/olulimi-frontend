<script setup lang="ts">
import type { FlashcardDeck as FlashcardDeckType, Flashcard } from '~/types/learning'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

useHead({ title: 'Flashcards — Olulimi Lwirhu' })

const { fetchFlashcardDecks } = useLearning()
const { apiFetch } = useApi()
const { error: showError } = useToast()

const decks = ref<FlashcardDeckType[]>([])
const selectedDeck = ref<FlashcardDeckType | null>(null)
const cards = ref<Flashcard[]>([])
const loading = ref(true)
const loadingCards = ref(false)

const selectDeck = async (deck: FlashcardDeckType) => {
  selectedDeck.value = deck
  loadingCards.value = true
  try {
    cards.value = await apiFetch<Flashcard[]>(`/flashcard-decks/${deck.id}/cards`)
  } catch {
    showError('Impossible de charger les cartes.')
    cards.value = []
  } finally {
    loadingCards.value = false
  }
}

const exitReview = () => {
  selectedDeck.value = null
  cards.value = []
}

onMounted(async () => {
  try {
    decks.value = await fetchFlashcardDecks()
  } catch {
    showError('Impossible de charger les decks.')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
    </div>

    <!-- Review mode -->
    <template v-else-if="selectedDeck">
      <div class="mb-6">
        <button class="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1" @click="exitReview">
          <Icon name="heroicons:arrow-left" class="w-4 h-4" />
          Retour aux decks
        </button>
        <h1 class="text-2xl font-bold text-slate-900 mt-3">
          {{ selectedDeck.name }}
        </h1>
        <p v-if="selectedDeck.description" class="text-slate-600 mt-1">
          {{ selectedDeck.description }}
        </p>
      </div>

      <div v-if="loadingCards" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
      </div>
      <div v-else-if="cards.length === 0" class="card p-12 text-center">
        <Icon name="heroicons:rectangle-stack" class="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <p class="text-slate-500">Ce deck ne contient pas encore de cartes.</p>
      </div>
      <LearningFlashcardDeck v-else :cards="cards" />
    </template>

    <!-- Deck list -->
    <template v-else>
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900">
          Flashcards
        </h1>
        <p class="mt-2 text-slate-600">
          Revisez votre vocabulaire Mashi avec des cartes memoire.
        </p>
      </div>

      <div v-if="decks.length === 0" class="card p-16 text-center">
        <Icon name="heroicons:rectangle-stack" class="w-20 h-20 mx-auto text-slate-300 mb-6" />
        <h2 class="text-xl font-semibold text-slate-700 mb-2">Aucun deck disponible</h2>
        <p class="text-slate-500">Les decks de flashcards seront bientot disponibles.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          v-for="deck in decks"
          :key="deck.id"
          class="card p-6 text-left hover:shadow-md hover:border-primary-300 transition-all group"
          @click="selectDeck(deck)"
        >
          <div class="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Icon name="heroicons:rectangle-stack" class="w-6 h-6 text-accent-600" />
          </div>
          <h3 class="font-semibold text-slate-900 mb-1">
            {{ deck.name }}
          </h3>
          <p v-if="deck.description" class="text-sm text-slate-500 mb-3 line-clamp-2">
            {{ deck.description }}
          </p>
          <div class="flex items-center gap-2 text-xs text-slate-500">
            <Icon name="heroicons:document-text" class="w-4 h-4" />
            {{ deck.cardsCount }} cartes
          </div>
          <span v-if="deck.category" class="inline-block mt-3 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
            {{ deck.category }}
          </span>
        </button>
      </div>
    </template>
  </div>
</template>
