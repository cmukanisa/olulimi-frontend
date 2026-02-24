<script setup lang="ts">
const { t } = useLocale()

const links = computed(() => [
  { label: t('nav.courses'), to: '/courses' },
  { label: t('nav.library'), to: '/library' },
  { label: t('nav.translator'), to: '/translator' },
  { label: t('nav.about'), to: '/about' },
])
</script>

<template>
  <footer class="border-t border-slate-200 bg-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Icon name="heroicons:academic-cap" class="w-4 h-4 text-primary-600" />
            Olulimi Lwirhu
          </NuxtLink>
          <span class="text-xs text-slate-400">&copy; 2026</span>
        </div>
        <nav class="flex flex-wrap justify-center gap-x-5 gap-y-1">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="text-xs text-slate-500 hover:text-slate-900 transition-colors"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </div>
    </div>
  </footer>
</template>
