<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  message: '',
})

const sizeClasses: Record<string, string> = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-[3px]',
  lg: 'h-12 w-12 border-4',
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 py-8">
    <div
      class="animate-spin rounded-full border-indigo-200 border-t-indigo-600"
      :class="sizeClasses[size]"
    />
    <p v-if="message" class="text-sm text-gray-500">
      {{ message }}
    </p>
  </div>
</template>
