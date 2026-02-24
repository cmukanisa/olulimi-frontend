<script setup lang="ts">
useHead({ title: 'Catalogue des cours — Olulimi Lwirhu' })
useSeoMeta({
  title: 'Catalogue des cours de Mashi — Olulimi Lwirhu',
  ogTitle: 'Catalogue des cours de Mashi — Olulimi Lwirhu',
  description: 'Parcourez nos cours de Mashi : debutant, intermediaire et avance. Apprenez a votre rythme avec des lecons structurees.',
  ogDescription: 'Parcourez nos cours de Mashi : debutant, intermediaire et avance.',
})

const { t } = useLocale()
const { courses, loading, fetchCourses } = useCourses()

const selectedLevel = ref('all')
const searchQuery = ref('')

const levels = computed(() => [
  { value: 'all', label: t('courses.all') },
  { value: 'beginner', label: t('courses.beginner') },
  { value: 'intermediate', label: t('courses.intermediate') },
  { value: 'advanced', label: t('courses.advanced') },
])

const filteredCourses = computed(() => {
  let result = courses.value
  if (selectedLevel.value !== 'all') {
    result = result.filter((c) => c.level === selectedLevel.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.authorName.toLowerCase().includes(q)
    )
  }
  return result
})

onMounted(() => {
  fetchCourses()
})
</script>

<template>
  <div>
    <!-- Header -->
    <section class="border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">
          {{ t('courses.title') }}
        </h1>
        <p class="mt-1 text-slate-500">
          {{ t('courses.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Filters -->
    <section class="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-13 sm:top-14 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div class="flex items-center gap-2 flex-wrap">
            <button
              v-for="level in levels"
              :key="level.value"
              @click="selectedLevel = level.value"
              class="px-3.5 py-1 rounded-full text-sm font-medium transition-colors"
              :class="
                selectedLevel === level.value
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              "
            >
              {{ level.label }}
            </button>
          </div>
          <div class="flex-1 w-full sm:max-w-xs sm:ml-auto">
            <div class="relative">
              <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="t('courses.searchPlaceholder')"
                class="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-full bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary-100 focus:border-primary-300 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Courses -->
    <section class="py-10 sm:py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CourseList :courses="filteredCourses" :loading="loading" />

        <div v-if="!loading && filteredCourses.length === 0" class="text-center py-20">
          <Icon name="heroicons:magnifying-glass" class="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 class="text-base font-medium text-slate-900">{{ t('courses.noResults') }}</h3>
          <p class="mt-1 text-sm text-slate-500">{{ t('courses.noResultsHint') }}</p>
          <button
            @click="selectedLevel = 'all'; searchQuery = ''"
            class="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Icon name="heroicons:arrow-path" class="w-4 h-4" />
            {{ t('courses.reset') }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
