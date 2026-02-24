<script setup lang="ts">
import type { Course } from '~/types/course'

const props = defineProps<{
  course: Course
}>()

const levelConfig = computed(() => {
  switch (props.course.level) {
    case 'beginner':
      return { label: 'Débutant', class: 'bg-green-100 text-green-700' }
    case 'intermediate':
      return { label: 'Intermédiaire', class: 'bg-yellow-100 text-yellow-700' }
    case 'advanced':
      return { label: 'Avancé', class: 'bg-red-100 text-red-700' }
    default:
      return { label: props.course.level, class: 'bg-slate-100 text-slate-700' }
  }
})

const gradientColors = [
  'from-primary-500 to-primary-700',
  'from-secondary-500 to-secondary-700',
  'from-accent-500 to-accent-700',
  'from-purple-500 to-purple-700',
  'from-pink-500 to-pink-700',
]

const placeholderGradient = computed(() => {
  const index = props.course.title.length % gradientColors.length
  return gradientColors[index]
})
</script>

<template>
  <NuxtLink
    :to="`/courses/${course.id}`"
    class="card overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
  >
    <!-- Cover image or placeholder -->
    <div class="aspect-video relative overflow-hidden">
      <img
        v-if="course.coverImage"
        :src="course.coverImage"
        :alt="course.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div
        v-else
        class="w-full h-full bg-gradient-to-br flex items-center justify-center"
        :class="placeholderGradient"
      >
        <Icon name="heroicons:academic-cap" class="w-12 h-12 text-white/60" />
      </div>
      <!-- Level badge -->
      <span
        class="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full"
        :class="levelConfig.class"
      >
        {{ levelConfig.label }}
      </span>
    </div>

    <!-- Content -->
    <div class="p-5 flex flex-col flex-1">
      <h3 class="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
        {{ course.title }}
      </h3>
      <p
        v-if="course.description"
        class="mt-2 text-sm text-slate-600 line-clamp-2 flex-1"
      >
        {{ course.description }}
      </p>
      <div class="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
        <span class="text-xs text-slate-500 flex items-center">
          <Icon name="heroicons:user" class="w-3.5 h-3.5 mr-1" />
          {{ course.authorName }}
        </span>
        <span class="text-xs text-slate-500 flex items-center">
          <Icon name="heroicons:folder" class="w-3.5 h-3.5 mr-1" />
          {{ course.sessionsCount }} session{{ course.sessionsCount !== 1 ? 's' : '' }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
