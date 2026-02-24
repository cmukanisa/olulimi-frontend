<script setup lang="ts">
import type { Course } from '~/types/course'

defineProps<{
  courses: Course[]
  loading: boolean
}>()
</script>

<template>
  <div>
    <!-- Loading skeletons -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="card overflow-hidden animate-pulse">
        <div class="aspect-video bg-slate-200" />
        <div class="p-5 space-y-3">
          <div class="h-5 bg-slate-200 rounded w-3/4" />
          <div class="h-4 bg-slate-200 rounded w-full" />
          <div class="h-4 bg-slate-200 rounded w-2/3" />
          <div class="flex justify-between pt-4 border-t border-slate-100">
            <div class="h-3 bg-slate-200 rounded w-20" />
            <div class="h-3 bg-slate-200 rounded w-16" />
          </div>
        </div>
      </div>
    </div>

    <!-- Course grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CourseCard
        v-for="course in courses"
        :key="course.id"
        :course="course"
      />
    </div>
  </div>
</template>
