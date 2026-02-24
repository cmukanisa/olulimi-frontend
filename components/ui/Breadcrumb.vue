<script setup lang="ts">
defineProps<{
  items: Array<{
    label: string
    to?: string
  }>
}>()
</script>

<template>
  <nav aria-label="Breadcrumb" class="mb-6">
    <ol class="flex items-center gap-1.5 text-sm text-slate-500 flex-wrap">
      <li>
        <NuxtLink to="/" class="hover:text-primary-600 transition-colors">
          <Icon name="heroicons:home" class="w-4 h-4" />
        </NuxtLink>
      </li>
      <li v-for="(item, index) in items" :key="index" class="flex items-center gap-1.5">
        <Icon name="heroicons:chevron-right" class="w-3.5 h-3.5 text-slate-300" />
        <NuxtLink
          v-if="item.to && index < items.length - 1"
          :to="item.to"
          class="hover:text-primary-600 transition-colors"
        >
          {{ item.label }}
        </NuxtLink>
        <span v-else class="font-medium text-slate-900">
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>
