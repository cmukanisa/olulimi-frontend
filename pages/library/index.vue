<script setup lang="ts">
useHead({ title: 'Bibliotheque — Olulimi Lwirhu' })
useSeoMeta({
  title: 'Bibliotheque Mashi — Olulimi Lwirhu',
  ogTitle: 'Bibliotheque Mashi — Olulimi Lwirhu',
  description: 'Explorez notre collection de livres et ressources sur la langue et la culture Mashi. Telechargement gratuit.',
  ogDescription: 'Explorez notre collection de livres et ressources sur la langue et la culture Mashi.',
})

const { t } = useLocale()
const { books, categories, loading, fetchBooks, fetchCategories } = useLibrary()

const selectedCategory = ref<string | null>(null)

const filteredBooks = computed(() => {
  if (!selectedCategory.value) return books.value
  return books.value.filter((b) => b.categoryId === selectedCategory.value)
})

const selectCategory = (categoryId: string | null) => {
  selectedCategory.value = categoryId
}

onMounted(async () => {
  await Promise.all([fetchBooks(), fetchCategories()])
})
</script>

<template>
  <div>
    <!-- Header -->
    <section class="border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">
          {{ t('library.title') }}
        </h1>
        <p class="mt-1 text-slate-500">
          {{ t('library.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Category filters -->
    <section class="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-13 sm:top-14 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div class="flex items-center gap-2 flex-wrap">
          <button
            @click="selectCategory(null)"
            class="px-3.5 py-1 rounded-full text-sm font-medium transition-colors"
            :class="
              selectedCategory === null
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            "
          >
            {{ t('library.all') }}
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="selectCategory(cat.id)"
            class="px-3.5 py-1 rounded-full text-sm font-medium transition-colors"
            :class="
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            "
          >
            {{ cat.name }}
            <span class="ml-1 text-xs opacity-70">({{ cat.booksCount }})</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Books grid -->
    <section class="py-10 sm:py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading -->
        <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div v-for="i in 10" :key="i" class="card overflow-hidden animate-pulse">
            <div class="aspect-[3/4] bg-slate-200" />
            <div class="p-4 space-y-2">
              <div class="h-4 bg-slate-200 rounded w-3/4" />
              <div class="h-3 bg-slate-200 rounded w-1/2" />
            </div>
          </div>
        </div>

        <!-- Books -->
        <div v-else-if="filteredBooks.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <LibraryBookCard
            v-for="book in filteredBooks"
            :key="book.id"
            :book="book"
          />
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-20">
          <Icon name="heroicons:book-open" class="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 class="text-base font-medium text-slate-900">{{ t('library.noResults') }}</h3>
          <p class="mt-1 text-sm text-slate-500">{{ t('library.noResultsHint') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
