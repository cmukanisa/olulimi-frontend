<script setup lang="ts">
import type { Book } from '~/types/library'

const props = defineProps<{
  book: Book
}>()

const bookColors = [
  'from-indigo-500 to-indigo-700',
  'from-emerald-500 to-emerald-700',
  'from-amber-500 to-amber-700',
  'from-rose-500 to-rose-700',
  'from-cyan-500 to-cyan-700',
  'from-violet-500 to-violet-700',
]

const placeholderGradient = computed(() => {
  const index = props.book.title.length % bookColors.length
  return bookColors[index]
})
</script>

<template>
  <NuxtLink
    :to="`/library/${book.id}`"
    class="card overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
  >
    <!-- Cover -->
    <div class="aspect-[3/4] relative overflow-hidden">
      <img
        v-if="book.coverImage"
        :src="book.coverImage"
        :alt="book.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div
        v-else
        class="w-full h-full bg-gradient-to-br flex items-center justify-center"
        :class="placeholderGradient"
      >
        <Icon name="heroicons:book-open" class="w-16 h-16 text-white/40" />
      </div>
      <!-- Category badge -->
      <span
        v-if="book.categoryName"
        class="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-slate-700 backdrop-blur-sm"
      >
        {{ book.categoryName }}
      </span>
    </div>

    <!-- Info -->
    <div class="p-4 flex flex-col flex-1">
      <h3 class="font-semibold text-slate-900 text-sm group-hover:text-primary-600 transition-colors line-clamp-2">
        {{ book.title }}
      </h3>
      <p class="mt-1 text-xs text-slate-500">
        {{ book.author }}
      </p>
    </div>
  </NuxtLink>
</template>
