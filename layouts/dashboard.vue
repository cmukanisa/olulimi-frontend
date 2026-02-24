<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <AppNavbar />
    <main class="flex-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <slot />
      </div>
    </main>
  </div>
</template>
