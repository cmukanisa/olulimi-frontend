<script setup lang="ts">
import type { DictionaryEntry } from '~/types/dictionary'

defineProps<{
  entry: DictionaryEntry
}>()

const categoryColors: Record<string, string> = {
  nom: 'bg-blue-100 text-blue-700',
  verbe: 'bg-green-100 text-green-700',
  adjectif: 'bg-purple-100 text-purple-700',
  adverbe: 'bg-orange-100 text-orange-700',
  pronom: 'bg-pink-100 text-pink-700',
  préposition: 'bg-cyan-100 text-cyan-700',
  conjonction: 'bg-amber-100 text-amber-700',
  interjection: 'bg-red-100 text-red-700',
}

const getCategoryClass = (category: string | null) => {
  if (!category) return 'bg-slate-100 text-slate-700'
  return categoryColors[category.toLowerCase()] || 'bg-slate-100 text-slate-700'
}
</script>

<template>
  <div class="card p-5 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between gap-4">
      <div class="flex-1">
        <!-- Mashi word -->
        <h3 class="text-xl font-bold text-slate-900">
          {{ entry.mashiWord }}
        </h3>

        <!-- Phonetic -->
        <p v-if="entry.phonetic" class="text-sm italic text-slate-500 mt-0.5">
          /{{ entry.phonetic }}/
        </p>

        <!-- French translation -->
        <p class="mt-2 text-base text-primary-700 font-medium">
          {{ entry.frenchTranslation }}
        </p>
      </div>

      <!-- Grammatical category badge -->
      <span
        v-if="entry.grammaticalCategory"
        class="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
        :class="getCategoryClass(entry.grammaticalCategory)"
      >
        {{ entry.grammaticalCategory }}
      </span>
    </div>

    <!-- Notes -->
    <p v-if="entry.notes" class="mt-3 text-sm text-slate-600 italic">
      {{ entry.notes }}
    </p>

    <!-- Synonyms -->
    <div v-if="entry.synonyms && entry.synonyms.length > 0" class="mt-3">
      <span class="text-xs font-medium text-slate-500 uppercase tracking-wide">Synonymes :</span>
      <div class="flex flex-wrap gap-1.5 mt-1">
        <span
          v-for="synonym in entry.synonyms"
          :key="synonym"
          class="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600"
        >
          {{ synonym }}
        </span>
      </div>
    </div>

    <!-- Examples -->
    <div v-if="entry.examples && entry.examples.length > 0" class="mt-4 space-y-2">
      <span class="text-xs font-medium text-slate-500 uppercase tracking-wide">Exemples :</span>
      <div
        v-for="example in entry.examples"
        :key="example.id"
        class="pl-3 border-l-2 border-primary-200"
      >
        <p class="text-sm font-medium text-slate-800">
          {{ example.mashiPhrase }}
        </p>
        <p class="text-sm text-slate-500">
          {{ example.frenchTranslation }}
        </p>
      </div>
    </div>
  </div>
</template>
