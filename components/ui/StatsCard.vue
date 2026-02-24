<script setup lang="ts">
interface Props {
  label: string
  value: string | number
  icon?: string
  trend?: number | null
  trendLabel?: string
  color?: 'indigo' | 'green' | 'blue' | 'yellow' | 'red' | 'purple'
}

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  trend: null,
  trendLabel: '',
  color: 'indigo',
})

const colorMap: Record<string, { bg: string; icon: string }> = {
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600' },
  green: { bg: 'bg-green-50', icon: 'text-green-600' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600' },
  yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600' },
  red: { bg: 'bg-red-50', icon: 'text-red-600' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600' },
}

const colors = computed(() => colorMap[props.color] || colorMap.indigo)
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-500">
          {{ label }}
        </p>
        <p class="mt-2 text-3xl font-bold text-gray-900">
          {{ value }}
        </p>
        <div v-if="trend !== null" class="mt-2 flex items-center gap-1">
          <svg
            class="h-4 w-4"
            :class="trend >= 0 ? 'text-green-500' : 'text-red-500'"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              v-if="trend >= 0"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
            />
          </svg>
          <span
            class="text-xs font-medium"
            :class="trend >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            {{ trend >= 0 ? '+' : '' }}{{ trend }}%
          </span>
          <span v-if="trendLabel" class="text-xs text-gray-500">
            {{ trendLabel }}
          </span>
        </div>
      </div>
      <div
        v-if="icon"
        class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg"
        :class="colors.bg"
      >
        <svg
          class="h-6 w-6"
          :class="colors.icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            :d="icon"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
