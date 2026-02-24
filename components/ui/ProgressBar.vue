<script setup lang="ts">
interface Props {
  percentage: number
  showLabel?: boolean
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  showLabel: true,
  height: 'h-3',
})

const clampedPercentage = computed(() => Math.min(100, Math.max(0, props.percentage)))

const gradientClass = computed(() => {
  if (clampedPercentage.value < 30) return 'bg-gradient-to-r from-red-400 to-red-500'
  if (clampedPercentage.value < 60) return 'bg-gradient-to-r from-yellow-400 to-orange-500'
  if (clampedPercentage.value < 90) return 'bg-gradient-to-r from-blue-400 to-indigo-500'
  return 'bg-gradient-to-r from-green-400 to-emerald-500'
})
</script>

<template>
  <div class="w-full">
    <div v-if="showLabel" class="mb-1 flex items-center justify-between">
      <span class="text-sm font-medium text-gray-700">Progression</span>
      <span class="text-sm font-semibold text-gray-900">{{ clampedPercentage }}%</span>
    </div>
    <div
      class="w-full overflow-hidden rounded-full bg-gray-200"
      :class="height"
    >
      <div
        class="rounded-full transition-all duration-700 ease-out"
        :class="[height, gradientClass]"
        :style="{ width: `${clampedPercentage}%` }"
      />
    </div>
  </div>
</template>
