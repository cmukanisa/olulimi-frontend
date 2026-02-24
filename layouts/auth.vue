<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <!-- Top bar -->
    <header class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-11">
        <NuxtLink to="/" class="flex items-center gap-1.5 text-primary-600 hover:text-primary-700 transition-colors">
          <Icon name="heroicons:academic-cap" class="w-5 h-5" />
          <span class="text-base font-bold">Olulimi Lwirhu</span>
        </NuxtLink>
        <NuxtLink to="/" class="text-sm text-slate-500 hover:text-primary-600 transition-colors flex items-center gap-1">
          <Icon name="heroicons:arrow-left" class="w-4 h-4" />
          Retour a l'accueil
        </NuxtLink>
      </div>
    </header>

    <!-- Form Container -->
    <div class="flex-1 flex items-center justify-center px-4 py-6 sm:py-8">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </div>

    <!-- Footer -->
    <div class="px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500 border-t border-slate-200 bg-white">
      <span>&copy; {{ currentYear }} Olulimi Lwirhu. Tous droits reserves.</span>
    </div>
  </div>
</template>
