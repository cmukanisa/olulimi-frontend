<script setup lang="ts">
const { t } = useLocale()
useHead({ title: computed(() => t('head.dictionary')) })
useSeoMeta({
  title: computed(() => t('head.dictionary')),
  ogTitle: computed(() => t('head.dictionary')),
  description: computed(() => t('seo.dictionaryDesc')),
  ogDescription: computed(() => t('seo.dictionaryDesc')),
})
const route = useRoute()
const { entries, loading, error, searchEntries, fetchAllEntries } = useDictionary()

const searchQuery = ref('')

watch(searchQuery, (val) => {
  if (val.trim()) {
    searchEntries(val)
  } else {
    fetchAllEntries()
  }
})

onMounted(() => {
  const q = route.query.q as string | undefined
  if (q?.trim()) {
    searchQuery.value = q.trim()
    searchEntries(q.trim())
  } else {
    fetchAllEntries()
  }
})
</script>

<template>
  <div>
    <!-- Header -->
    <section class="border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">
          {{ t('dictionary.title') }}
        </h1>
        <p class="mt-1 text-slate-500">
          {{ t('dictionary.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Search -->
    <section class="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-13 sm:top-14 z-30">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-slate-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('dictionary.searchPlaceholder')"
            class="w-full pl-12 pr-10 py-3 text-base border border-slate-200 rounded-full bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary-100 focus:border-primary-300 focus:bg-white outline-none transition-all shadow-sm"
          />
          <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-4 flex items-center">
            <button
              @click="searchQuery = ''"
              class="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Icon name="heroicons:x-mark" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Results -->
    <section class="py-10 sm:py-12">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading -->
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 5" :key="i" class="card p-5 animate-pulse">
            <div class="h-6 bg-slate-200 rounded w-1/4 mb-2" />
            <div class="h-4 bg-slate-200 rounded w-1/3 mb-3" />
            <div class="h-4 bg-slate-200 rounded w-2/3" />
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-12">
          <Icon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p class="text-red-600">{{ error }}</p>
        </div>

        <!-- Results list -->
        <div v-else-if="entries.length > 0" class="space-y-4">
          <p class="text-sm text-slate-500 mb-2">
            {{ entries.length }} {{ entries.length !== 1 ? t('dictionary.resultsPlural') : t('dictionary.results') }}
            <span v-if="searchQuery.trim()">{{ t('dictionary.for') }} « {{ searchQuery }} »</span>
          </p>
          <DictionaryEntryCard
            v-for="entry in entries"
            :key="entry.id"
            :entry="entry"
          />
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-20">
          <Icon name="heroicons:magnifying-glass" class="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 class="text-base font-medium text-slate-900">{{ t('dictionary.noResults') }}</h3>
          <p class="mt-1 text-sm text-slate-500">
            <template v-if="searchQuery.trim()">
              {{ t('dictionary.noResultsSearch') }} « {{ searchQuery }} ». {{ t('dictionary.tryAnother') }}
            </template>
            <template v-else>
              {{ t('dictionary.empty') }}
            </template>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
