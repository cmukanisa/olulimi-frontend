<script setup lang="ts">
useHead({ title: computed(() => book.value ? `${book.value.title} — Bibliotheque Olulimi` : 'Detail du livre — Olulimi Lwirhu') })
useSeoMeta({
  title: computed(() => book.value?.title ? `${book.value.title} — Bibliotheque Olulimi` : 'Detail du livre — Olulimi Lwirhu'),
  ogTitle: computed(() => book.value?.title || 'Detail du livre — Olulimi Lwirhu'),
  description: computed(() => book.value?.description || 'Livre sur la langue et la culture Mashi'),
  ogDescription: computed(() => book.value?.description || 'Livre sur la langue et la culture Mashi'),
})

const route = useRoute()
const bookId = route.params.id as string

const { book, loading, error, fetchBook } = useLibrary()

onMounted(() => {
  fetchBook(bookId)
})

const bookColors = [
  'from-indigo-500 to-indigo-700',
  'from-emerald-500 to-emerald-700',
  'from-amber-500 to-amber-700',
  'from-rose-500 to-rose-700',
]

const placeholderGradient = computed(() => {
  if (!book.value) return bookColors[0]
  const index = book.value.title.length % bookColors.length
  return bookColors[index]
})
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="animate-pulse flex flex-col sm:flex-row gap-8">
        <div class="w-48 h-64 bg-slate-200 rounded-xl flex-shrink-0" />
        <div class="flex-1 space-y-4">
          <div class="h-8 bg-slate-200 rounded w-2/3" />
          <div class="h-4 bg-slate-200 rounded w-1/3" />
          <div class="h-4 bg-slate-200 rounded w-full" />
          <div class="h-4 bg-slate-200 rounded w-3/4" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <Icon name="heroicons:exclamation-triangle" class="w-16 h-16 text-red-400 mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-slate-900">{{ error }}</h2>
      <NuxtLink to="/library" class="btn btn-outline mt-6 inline-flex">
        <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
        Retour à la bibliothèque
      </NuxtLink>
    </div>

    <!-- Book detail -->
    <div v-else-if="book" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <UiBreadcrumb :items="[
        { label: 'Bibliotheque', to: '/library' },
        { label: book.title },
      ]" />

      <div class="card p-6 sm:p-8">
        <div class="flex flex-col sm:flex-row gap-8">
          <!-- Cover -->
          <div class="w-48 flex-shrink-0 mx-auto sm:mx-0">
            <div class="aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
              <img
                v-if="book.coverImage"
                :src="book.coverImage"
                :alt="book.title"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br flex items-center justify-center"
                :class="placeholderGradient"
              >
                <Icon name="heroicons:book-open" class="w-16 h-16 text-white/40" />
              </div>
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1 space-y-4">
            <div>
              <span
                v-if="book.categoryName"
                class="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary-100 text-secondary-700 mb-2"
              >
                {{ book.categoryName }}
              </span>
              <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">
                {{ book.title }}
              </h1>
              <p class="mt-1 text-lg text-slate-600">
                {{ book.author }}
              </p>
            </div>

            <div class="flex flex-wrap gap-4 text-sm text-slate-500">
              <span v-if="book.publicationYear" class="flex items-center">
                <Icon name="heroicons:calendar" class="w-4 h-4 mr-1" />
                {{ book.publicationYear }}
              </span>
              <span v-if="book.language" class="flex items-center">
                <Icon name="heroicons:language" class="w-4 h-4 mr-1" />
                {{ book.language }}
              </span>
            </div>

            <p v-if="book.description" class="text-slate-600 leading-relaxed">
              {{ book.description }}
            </p>

            <div v-if="book.fileUrl" class="pt-4">
              <a
                :href="book.fileUrl"
                target="_blank"
                class="btn btn-primary inline-flex items-center space-x-2"
              >
                <Icon name="heroicons:arrow-down-tray" class="w-5 h-5" />
                <span>Télécharger</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
