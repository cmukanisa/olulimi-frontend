<script setup lang="ts">
const authStore = useAuthStore()
const { logout } = useAuth()
const router = useRouter()
const { t, locale, setLocale, localeOptions } = useLocale()

const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)
const searchQuery = ref('')
const mobileSearchQuery = ref('')
const searchFocused = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)
const langDropdownOpen = ref(false)
const langDropdownRef = ref<HTMLElement | null>(null)

const publicLinks = computed(() => [
  { label: t('nav.courses'), to: '/courses', icon: 'heroicons:book-open' },
  { label: t('nav.library'), to: '/library', icon: 'heroicons:building-library' },
  { label: t('nav.translator'), to: '/translator', icon: 'heroicons:language' },
  { label: t('nav.about'), to: '/about', icon: 'heroicons:information-circle' },
])

const handleSearch = () => {
  const q = searchQuery.value.trim()
  if (q) {
    router.push({ path: '/translator', query: { q } })
    searchQuery.value = ''
    searchFocused.value = false
    searchInputRef.value?.blur()
  }
}

const handleMobileSearch = () => {
  const q = mobileSearchQuery.value.trim()
  if (q) {
    router.push({ path: '/translator', query: { q } })
    mobileSearchQuery.value = ''
    closeMobileMenu()
  }
}

const collapseSearch = () => {
  if (!searchQuery.value.trim()) {
    searchFocused.value = false
  }
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const closeUserMenu = () => {
  userMenuOpen.value = false
}

const handleLogout = () => {
  closeUserMenu()
  closeMobileMenu()
  logout()
}

const scrolled = ref(false)

onMounted(() => {
  const handleScroll = () => {
    scrolled.value = window.scrollY > 10
  }
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.user-menu-container')) {
      userMenuOpen.value = false
    }
    if (langDropdownRef.value && !langDropdownRef.value.contains(target)) {
      langDropdownOpen.value = false
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<template>
  <div class="bg-slate-100 border-b border-slate-200">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-8">
      <p class="truncate text-xs text-slate-500">
        {{ t('banner.madeBy') }}
        <a href="https://www.facebook.com/share/1FMBtvmNZY/" target="_blank" rel="noopener" class="font-semibold text-slate-700 hover:text-primary-600 transition-colors inline-flex items-center gap-1">
          Franck Minani <Icon name="mdi:facebook" class="w-3 h-3" />
        </a>
        {{ t('banner.and') }}
        <a href="https://github.com/cmukanisa" target="_blank" rel="noopener" class="font-semibold text-slate-700 hover:text-primary-600 transition-colors inline-flex items-center gap-1">
          Christian Kasse <Icon name="mdi:github" class="w-3 h-3" />
        </a>
      </p>
      <div class="flex items-center gap-3 shrink-0">
        <a href="mailto:contact@Olulimi.com" class="hidden sm:inline-flex items-center gap-1 text-xs text-slate-500 hover:text-primary-600 transition-colors">
          <Icon name="heroicons:envelope" class="w-3.5 h-3.5" />
          contact@Olulimi.com
        </a>
        <div class="flex items-center gap-2 text-slate-400">
          <a href="https://www.facebook.com/share/1FMBtvmNZY/" target="_blank" rel="noopener" aria-label="Facebook" class="hover:text-primary-600 transition-colors">
            <Icon name="mdi:facebook" class="w-3.5 h-3.5" />
          </a>
          <a href="https://github.com/cmukanisa" target="_blank" rel="noopener" aria-label="GitHub" class="hover:text-primary-600 transition-colors">
            <Icon name="mdi:github" class="w-3.5 h-3.5" />
          </a>
          <a href="#" aria-label="X / Twitter" class="hover:text-primary-600 transition-colors">
            <Icon name="mdi:twitter" class="w-3.5 h-3.5" />
          </a>
          <a href="#" aria-label="Instagram" class="hover:text-primary-600 transition-colors">
            <Icon name="mdi:instagram" class="w-3.5 h-3.5" />
          </a>
          <a href="#" aria-label="YouTube" class="hover:text-primary-600 transition-colors">
            <Icon name="mdi:youtube" class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  </div>

  <header
    class="sticky top-0 z-50 w-full border-b transition-all duration-300"
    :class="[
      scrolled
        ? 'border-slate-200 bg-white/80 shadow-sm backdrop-blur-xl'
        : 'border-transparent bg-white'
    ]"
  >
    <nav class="mx-auto flex h-13 sm:h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Left: Logo + links -->
      <div
        class="flex items-center gap-4 lg:gap-6 transition-all duration-300"
        :class="{ 'lg:opacity-0 lg:w-0 lg:overflow-hidden': searchFocused }"
      >
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-primary-600 tracking-tight shrink-0">
          <Icon name="heroicons:academic-cap" class="w-5 h-5" />
          <span class="text-sm sm:text-base">Olulimi Lwirhu</span>
        </NuxtLink>
        <div class="hidden lg:flex items-center gap-0.5">
          <NuxtLink
            v-for="link in publicLinks"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            active-class="text-primary-600 bg-primary-50"
          >
            <Icon :name="link.icon" class="w-4 h-4" />
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>

      <!-- Right -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Search (desktop) — expands on focus -->
        <form
          @submit.prevent="handleSearch"
          class="hidden md:flex items-center relative transition-all duration-300 ease-out"
          :class="searchFocused ? 'w-80 lg:w-96' : 'w-40 lg:w-44'"
        >
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="heroicons:magnifying-glass" class="w-4 h-4 text-slate-400" />
          </div>
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            :placeholder="t('nav.search')"
            class="w-full pl-9 pr-8 py-1.5 text-sm border rounded-full bg-slate-50 text-slate-900 outline-none transition-all duration-300"
            :class="searchFocused
              ? 'border-primary-300 ring-2 ring-primary-100 bg-white shadow-sm'
              : 'border-slate-200 hover:border-slate-300'"
            @focus="searchFocused = true"
            @blur="collapseSearch"
          />
          <button
            v-if="searchQuery"
            type="button"
            @mousedown.prevent="searchQuery = ''; searchFocused = false"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <Icon name="heroicons:x-mark" class="w-3.5 h-3.5" />
          </button>
        </form>

        <!-- Not authenticated -->
        <template v-if="!authStore.isAuthenticated">
          <NuxtLink
            to="/auth/login"
            class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            :class="{ 'lg:hidden': searchFocused }"
          >
            <Icon name="heroicons:power" class="w-4 h-4" />
            {{ t('nav.login') }}
          </NuxtLink>
          <NuxtLink
            to="/auth/register"
            class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            :class="{ 'lg:hidden': searchFocused }"
          >
            <Icon name="heroicons:user-plus" class="w-4 h-4" />
            {{ t('nav.register') }}
          </NuxtLink>
        </template>

        <!-- Authenticated -->
        <template v-else>
          <NuxtLink
            v-if="authStore.isTeacher"
            to="/teacher"
            class="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            :class="{ 'lg:hidden': searchFocused }"
          >
            <Icon name="heroicons:pencil-square" class="w-4 h-4" />
            {{ t('nav.teacher') }}
          </NuxtLink>
          <NuxtLink
            v-if="authStore.isAdmin"
            to="/admin"
            class="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            :class="{ 'lg:hidden': searchFocused }"
          >
            <Icon name="heroicons:cog-6-tooth" class="w-4 h-4" />
            {{ t('nav.admin') }}
          </NuxtLink>

          <!-- User menu dropdown -->
          <div class="relative user-menu-container hidden sm:block">
            <button
              @click="toggleUserMenu"
              class="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span class="text-xs sm:text-sm font-semibold text-primary-700">
                  {{ authStore.user?.fullName?.charAt(0)?.toUpperCase() || 'U' }}
                </span>
              </div>
              <Icon name="heroicons:chevron-down" class="w-3.5 h-3.5 text-slate-400" />
            </button>

            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black/5 py-1 z-50"
              >
                <div class="px-4 py-3 border-b border-slate-100">
                  <p class="text-sm font-medium text-slate-900">{{ authStore.user?.fullName }}</p>
                  <p class="text-xs text-slate-500 truncate">{{ authStore.user?.email }}</p>
                </div>
                <NuxtLink to="/dashboard" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" @click="closeUserMenu">
                  <Icon name="heroicons:squares-2x2" class="w-4 h-4" />
                  {{ t('nav.dashboard') }}
                </NuxtLink>
                <NuxtLink to="/my-courses" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" @click="closeUserMenu">
                  <Icon name="heroicons:book-open" class="w-4 h-4" />
                  {{ t('nav.myCourses') }}
                </NuxtLink>
                <NuxtLink to="/profile" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" @click="closeUserMenu">
                  <Icon name="heroicons:user" class="w-4 h-4" />
                  {{ t('nav.profile') }}
                </NuxtLink>
                <button @click="handleLogout" class="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4" />
                  {{ t('nav.logout') }}
                </button>
              </div>
            </Transition>
          </div>
        </template>

        <!-- Language selector -->
        <div class="relative" ref="langDropdownRef">
          <button
            @click="langDropdownOpen = !langDropdownOpen"
            class="inline-flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 rounded-full text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Icon name="heroicons:language" class="w-4 h-4" />
            <span class="hidden sm:inline">{{ localeOptions.find(o => o.value === locale)?.label || 'FR' }}</span>
            <Icon name="heroicons:chevron-down" class="w-3 h-3 hidden sm:block" />
          </button>
          <div
            v-if="langDropdownOpen"
            class="absolute right-0 mt-1 w-40 bg-white rounded-lg border border-slate-200 shadow-lg z-50 py-1"
          >
            <button
              v-for="opt in localeOptions"
              :key="opt.value"
              @click="setLocale(opt.value); langDropdownOpen = false"
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              :class="{ 'bg-primary-50 text-primary-700': locale === opt.value }"
            >
              <Icon :name="opt.icon" class="w-4 h-4" />
              {{ opt.fullLabel }}
              <Icon v-if="locale === opt.value" name="heroicons:check" class="w-3.5 h-3.5 ml-auto text-primary-600" />
            </button>
          </div>
        </div>

        <!-- Mobile hamburger -->
        <button
          @click="toggleMobileMenu"
          class="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Menu"
        >
          <Icon name="heroicons:bars-3" class="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </nav>
  </header>

  <!-- Mobile sidebar overlay -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
        @click="closeMobileMenu"
      />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <aside
        v-if="mobileMenuOpen"
        class="fixed top-0 left-0 bottom-0 w-72 sm:w-80 bg-white shadow-2xl z-[70] flex flex-col lg:hidden"
      >
        <!-- Sidebar header -->
        <div class="flex items-center justify-between px-4 h-12 sm:h-14 border-b border-slate-100">
          <NuxtLink to="/" class="flex items-center gap-2 font-bold text-primary-600" @click="closeMobileMenu">
            <Icon name="heroicons:academic-cap" class="w-5 h-5" />
            Olulimi Lwirhu
          </NuxtLink>
          <button @click="closeMobileMenu" class="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <Icon name="heroicons:x-mark" class="w-5 h-5" />
          </button>
        </div>

        <!-- Mobile search -->
        <div class="px-4 pt-4 pb-2">
          <form @submit.prevent="handleMobileSearch" class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="heroicons:magnifying-glass" class="w-4 h-4 text-slate-400" />
            </div>
            <input
              v-model="mobileSearchQuery"
              type="text"
              :placeholder="t('nav.search')"
              class="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-full bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary-100 focus:border-primary-300 focus:bg-white outline-none transition-all"
            />
          </form>
        </div>

        <!-- Sidebar content -->
        <div class="flex-1 overflow-y-auto py-2">
          <div class="px-3 space-y-0.5">
            <NuxtLink
              to="/"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              active-class="text-primary-600 bg-primary-50"
              @click="closeMobileMenu"
            >
              <Icon name="heroicons:home" class="w-5 h-5 text-slate-400" />
              {{ t('nav.home') }}
            </NuxtLink>
            <NuxtLink
              v-for="link in publicLinks"
              :key="link.to"
              :to="link.to"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              active-class="text-primary-600 bg-primary-50"
              @click="closeMobileMenu"
            >
              <Icon :name="link.icon" class="w-5 h-5 text-slate-400" />
              {{ link.label }}
            </NuxtLink>
          </div>

          <template v-if="authStore.isAuthenticated">
            <div class="border-t border-slate-100 mt-3 pt-3 px-3 space-y-0.5">
              <p class="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{{ t('nav.mySpace') }}</p>
              <NuxtLink to="/dashboard" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors" @click="closeMobileMenu">
                <Icon name="heroicons:squares-2x2" class="w-5 h-5 text-slate-400" />
                {{ t('nav.dashboard') }}
              </NuxtLink>
              <NuxtLink to="/my-courses" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors" @click="closeMobileMenu">
                <Icon name="heroicons:book-open" class="w-5 h-5 text-slate-400" />
                {{ t('nav.myCourses') }}
              </NuxtLink>
              <NuxtLink to="/profile" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors" @click="closeMobileMenu">
                <Icon name="heroicons:user" class="w-5 h-5 text-slate-400" />
                {{ t('nav.profile') }}
              </NuxtLink>
            </div>

            <div v-if="authStore.isTeacher || authStore.isAdmin" class="border-t border-slate-100 mt-3 pt-3 px-3 space-y-0.5">
              <p class="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{{ t('nav.management') }}</p>
              <NuxtLink v-if="authStore.isTeacher" to="/teacher" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors" @click="closeMobileMenu">
                <Icon name="heroicons:pencil-square" class="w-5 h-5 text-slate-400" />
                {{ t('nav.teacherSpace') }}
              </NuxtLink>
              <NuxtLink v-if="authStore.isAdmin" to="/admin" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors" @click="closeMobileMenu">
                <Icon name="heroicons:cog-6-tooth" class="w-5 h-5 text-slate-400" />
                {{ t('nav.administration') }}
              </NuxtLink>
            </div>
          </template>
        </div>

        <!-- Sidebar footer -->
        <div class="border-t border-slate-100 p-4">
          <template v-if="!authStore.isAuthenticated">
            <NuxtLink to="/auth/login" class="flex items-center justify-center gap-2 w-full py-2 rounded-full text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors mb-2" @click="closeMobileMenu">
              {{ t('nav.login') }}
            </NuxtLink>
            <NuxtLink to="/auth/register" class="flex items-center justify-center gap-2 w-full py-2 rounded-full text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors" @click="closeMobileMenu">
              {{ t('nav.register') }}
            </NuxtLink>
          </template>
          <template v-else>
            <div class="flex items-center gap-3 mb-3">
              <div class="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                <span class="text-sm font-semibold text-primary-700">{{ authStore.user?.fullName?.charAt(0)?.toUpperCase() || 'U' }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-slate-900 truncate">{{ authStore.user?.fullName }}</p>
                <p class="text-xs text-slate-500 truncate">{{ authStore.user?.email }}</p>
              </div>
            </div>
            <button @click="handleLogout" class="flex items-center justify-center gap-2 w-full py-2 rounded-full text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
              <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4" />
              {{ t('nav.logout') }}
            </button>
          </template>
          <!-- Mobile language selector -->
          <div class="flex gap-1 mt-3">
            <button
              v-for="opt in localeOptions"
              :key="opt.value"
              @click="setLocale(opt.value)"
              class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-medium border transition-colors"
              :class="locale === opt.value
                ? 'border-primary-300 bg-primary-50 text-primary-700'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'"
            >
              <Icon :name="opt.icon" class="w-4 h-4" />
              {{ opt.label }}
            </button>
          </div>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>
