<script setup lang="ts">
const uiStore = useUiStore()

const sidebarLinks = [
  { label: 'Tableau de bord', to: '/admin', icon: 'heroicons:home' },
  { label: 'Utilisateurs', to: '/admin/users', icon: 'heroicons:users' },
  { label: 'Cours', to: '/admin/courses', icon: 'heroicons:academic-cap' },
  { label: 'Statistiques', to: '/admin/stats', icon: 'heroicons:chart-bar' },
]
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <AppNavbar />
    <div class="flex flex-1">
      <AppSidebar
        title="Administration"
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
