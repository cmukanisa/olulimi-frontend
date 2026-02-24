<script setup lang="ts">
interface SidebarLink {
  label: string
  to: string
  icon: string
}

const props = defineProps<{
  links: SidebarLink[]
  title: string
}>()

const uiStore = useUiStore()
const route = useRoute()

const isActive = (to: string): boolean => {
  return route.path === to
}
</script>

<template>
  <aside
    class="fixed left-0 top-14 sm:top-16 bottom-0 z-40 bg-white border-r border-slate-200 transition-all duration-300 overflow-hidden"
    :class="[
      uiStore.sidebarOpen ? 'w-64' : 'w-16',
      'hidden lg:block'
    ]"
  >
    <!-- Toggle button -->
    <button
      @click="uiStore.toggleSidebar()"
      class="absolute -right-0 top-4 w-full flex justify-end pr-4 text-slate-400 hover:text-slate-600 transition-colors"
      :aria-label="uiStore.sidebarOpen ? 'Réduire le menu' : 'Agrandir le menu'"
    >
      <Icon
        :name="uiStore.sidebarOpen ? 'heroicons:chevron-left' : 'heroicons:chevron-right'"
        class="w-5 h-5"
      />
    </button>

    <!-- Title -->
    <div class="px-4 pt-6 pb-4" v-if="uiStore.sidebarOpen">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {{ props.title }}
      </h2>
    </div>
    <div v-else class="pt-12" />

    <!-- Links -->
    <nav class="px-2 space-y-1">
      <NuxtLink
        v-for="link in props.links"
        :key="link.to"
        :to="link.to"
        class="flex items-center rounded-lg transition-colors group"
        :class="[
          isActive(link.to)
            ? 'bg-primary-50 text-primary-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
          uiStore.sidebarOpen ? 'px-3 py-2.5' : 'px-3 py-2.5 justify-center'
        ]"
        :title="!uiStore.sidebarOpen ? link.label : undefined"
      >
        <Icon
          :name="link.icon"
          class="w-5 h-5 flex-shrink-0"
          :class="isActive(link.to) ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'"
        />
        <span
          v-if="uiStore.sidebarOpen"
          class="ml-3 text-sm font-medium whitespace-nowrap"
        >
          {{ link.label }}
        </span>
      </NuxtLink>
    </nav>
  </aside>

  <!-- Mobile overlay -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="uiStore.sidebarOpen"
        class="fixed inset-0 bg-black/50 z-30 lg:hidden"
        @click="uiStore.toggleSidebar()"
      />
    </Transition>
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <aside
        v-if="uiStore.sidebarOpen"
        class="fixed left-0 top-14 sm:top-16 bottom-0 w-64 bg-white border-r border-slate-200 z-40 lg:hidden"
      >
        <div class="px-4 pt-6 pb-4">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {{ props.title }}
          </h2>
        </div>
        <nav class="px-2 space-y-1">
          <NuxtLink
            v-for="link in props.links"
            :key="link.to"
            :to="link.to"
            class="flex items-center px-3 py-2.5 rounded-lg transition-colors group"
            :class="
              isActive(link.to)
                ? 'bg-primary-50 text-primary-700'
                : 'text-slate-600 hover:bg-slate-100'
            "
            @click="uiStore.toggleSidebar()"
          >
            <Icon
              :name="link.icon"
              class="w-5 h-5 flex-shrink-0"
              :class="isActive(link.to) ? 'text-primary-600' : 'text-slate-400'"
            />
            <span class="ml-3 text-sm font-medium">{{ link.label }}</span>
          </NuxtLink>
        </nav>
      </aside>
    </Transition>
  </Teleport>
</template>
