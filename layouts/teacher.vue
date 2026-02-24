<script setup lang="ts">
const uiStore = useUiStore()

const sidebarLinks = [
  { label: 'Tableau de bord', to: '/teacher', icon: 'heroicons:home' },
  { label: 'Mes cours', to: '/teacher/courses', icon: 'heroicons:book-open' },
  { label: 'Nouveau cours', to: '/teacher/courses/new', icon: 'heroicons:plus-circle' },
]
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <AppNavbar />
    <div class="flex flex-1">
      <AppSidebar
        title="Espace enseignant"
        :links="sidebarLinks"
      />
      <main
        class="flex-1 transition-all duration-300"
        :class="uiStore.sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
