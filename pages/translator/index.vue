<script setup lang="ts">
useHead({ title: 'Traducteur Mashi-Français — Olulimi Lwirhu' })
useSeoMeta({
  title: 'Traducteur Mashi-Français — Olulimi Lwirhu',
  ogTitle: 'Traducteur Mashi-Français — Olulimi Lwirhu',
  description: 'Traduisez des mots et phrases entre le Mashi et le Français. Traducteur en ligne gratuit avec phonetique et exemples.',
  ogDescription: 'Traduisez des mots et phrases entre le Mashi et le Français.',
})

const { t } = useLocale()
const route = useRoute()
const router = useRouter()
const { entries, loading, error, searchEntries } = useDictionary()

const sourceText = ref('')
const sourceLang = ref<'mashi' | 'french'>('french')
const targetLang = computed(() => sourceLang.value === 'french' ? 'mashi' : 'french')

// Mashi dialect variants
const mashiVariants = [
  { value: 'mashi', label: 'Mashi (standard)' },
  { value: 'mashi-bukavu', label: 'Mashi de Bukavu' },
  { value: 'mashi-kabare', label: 'Mashi de Kabare' },
  { value: 'mashi-walungu', label: 'Mashi de Walungu' },
  { value: 'mashi-ngweshe', label: 'Mashi de Ngweshe' },
  { value: 'mashi-kalehe', label: 'Mashi de Kalehe' },
]
const selectedMashiVariant = ref('mashi')
const mashiLabel = computed(() => mashiVariants.find(v => v.value === selectedMashiVariant.value)?.label || 'Mashi')

// French / English variants
const otherLangVariants = [
  { value: 'french', label: 'Français', icon: 'heroicons:language' },
  { value: 'english', label: 'English', icon: 'heroicons:language' },
]
const selectedOtherLang = ref('french')
const otherLangLabel = computed(() => otherLangVariants.find(v => v.value === selectedOtherLang.value)?.label || 'Français')
const otherLangIcon = computed(() => otherLangVariants.find(v => v.value === selectedOtherLang.value)?.icon || 'heroicons:language')

// Dropdown state — one per side
const sourceDropOpen = ref(false)
const targetDropOpen = ref(false)
const sourceBtnRef = ref<HTMLElement | null>(null)
const targetBtnRef = ref<HTMLElement | null>(null)

const toggleSourceDrop = () => {
  sourceDropOpen.value = !sourceDropOpen.value
  targetDropOpen.value = false
}
const toggleTargetDrop = () => {
  targetDropOpen.value = !targetDropOpen.value
  sourceDropOpen.value = false
}

const closeDropdowns = (e: MouseEvent) => {
  const target = e.target as Node
  if (sourceBtnRef.value && !sourceBtnRef.value.contains(target)) sourceDropOpen.value = false
  if (targetBtnRef.value && !targetBtnRef.value.contains(target)) targetDropOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', closeDropdowns)
  const q = route.query.q as string | undefined
  if (q?.trim()) {
    sourceText.value = q.trim()
    searchEntries(q.trim())
  }
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})

const swapLanguages = () => {
  sourceLang.value = sourceLang.value === 'french' ? 'mashi' : 'french'
  if (translationText.value) {
    sourceText.value = translationText.value
  }
}

const translationText = computed(() => {
  if (!entries.value.length || !sourceText.value.trim()) return ''
  const entry = entries.value[0]
  if (sourceLang.value === 'french') {
    return entry.mashiWord
  }
  return entry.frenchTranslation
})

const phonetic = computed(() => {
  if (!entries.value.length) return ''
  return entries.value[0].phonetic || ''
})

const category = computed(() => {
  if (!entries.value.length) return ''
  return entries.value[0].grammaticalCategory || ''
})

const otherResults = computed(() => {
  if (entries.value.length <= 1) return []
  return entries.value.slice(1, 5)
})

const examples = computed(() => {
  if (!entries.value.length) return []
  return entries.value[0].examples || []
})

let debounce: ReturnType<typeof setTimeout> | null = null

watch(sourceText, (val) => {
  if (debounce) clearTimeout(debounce)

  // Update URL in real-time
  if (val.trim()) {
    router.replace({ query: { q: val.trim() } })
  } else {
    router.replace({ query: {} })
  }

  if (!val.trim()) {
    entries.value = []
    return
  }
  debounce = setTimeout(() => {
    searchEntries(val.trim())
  }, 400)
})
</script>

<template>
  <div class="min-h-[calc(100vh-theme(spacing.14))]">
    <!-- Header -->
    <section class="border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div class="flex items-center gap-3">
          <Icon name="heroicons:language" class="w-6 h-6 text-primary-600" />
          <h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">{{ t('translator.title') }}</h1>
        </div>
      </div>
    </section>

    <!-- Translator -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Language selector bar -->
      <div class="flex items-center justify-center gap-2 sm:gap-3 mb-4">

        <!-- Source language button + dropdown -->
        <div ref="sourceBtnRef" class="relative flex-1 sm:flex-none">
          <button
            @click="toggleSourceDrop"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-lg text-sm font-medium transition-colors bg-primary-50 text-primary-700 border border-primary-200"
          >
            <Icon :name="sourceLang === 'french' ? otherLangIcon : 'heroicons:language'" class="w-4 h-4" />
            {{ sourceLang === 'french' ? otherLangLabel : mashiLabel }}
            <Icon name="heroicons:chevron-down" class="w-3 h-3 ml-0.5" />
          </button>

          <!-- Dropdown: French/English (when source = french) -->
          <div
            v-if="sourceDropOpen && sourceLang === 'french'"
            class="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg border border-slate-200 shadow-lg z-20 py-1"
          >
            <button
              v-for="v in otherLangVariants"
              :key="v.value"
              @click="selectedOtherLang = v.value; sourceDropOpen = false"
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              :class="{ 'bg-primary-50 text-primary-700': selectedOtherLang === v.value }"
            >
              <Icon :name="v.icon" class="w-4 h-4" />
              {{ v.label }}
              <Icon v-if="selectedOtherLang === v.value" name="heroicons:check" class="w-3.5 h-3.5 ml-auto text-primary-600" />
            </button>
          </div>

          <!-- Dropdown: Mashi variants (when source = mashi) -->
          <div
            v-if="sourceDropOpen && sourceLang === 'mashi'"
            class="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg border border-slate-200 shadow-lg z-20 py-1"
          >
            <button
              v-for="v in mashiVariants"
              :key="v.value"
              @click="selectedMashiVariant = v.value; sourceDropOpen = false"
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              :class="{ 'bg-primary-50 text-primary-700': selectedMashiVariant === v.value }"
            >
              <Icon name="heroicons:language" class="w-4 h-4" />
              {{ v.label }}
              <Icon v-if="selectedMashiVariant === v.value" name="heroicons:check" class="w-3.5 h-3.5 ml-auto text-primary-600" />
            </button>
          </div>
        </div>

        <!-- Swap button -->
        <button
          @click="swapLanguages"
          class="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors shrink-0"
          :title="t('translator.swapLangs')"
        >
          <Icon name="heroicons:arrows-right-left" class="w-4 h-4" />
        </button>

        <!-- Target language button + dropdown -->
        <div ref="targetBtnRef" class="relative flex-1 sm:flex-none">
          <button
            @click="toggleTargetDrop"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-lg text-sm font-medium transition-colors bg-slate-100 text-slate-700 border border-slate-200"
          >
            <Icon :name="targetLang === 'french' ? otherLangIcon : 'heroicons:language'" class="w-4 h-4" />
            {{ targetLang === 'french' ? otherLangLabel : mashiLabel }}
            <Icon name="heroicons:chevron-down" class="w-3 h-3 ml-0.5" />
          </button>

          <!-- Dropdown: French/English (when target = french) -->
          <div
            v-if="targetDropOpen && targetLang === 'french'"
            class="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg border border-slate-200 shadow-lg z-20 py-1"
          >
            <button
              v-for="v in otherLangVariants"
              :key="v.value"
              @click="selectedOtherLang = v.value; targetDropOpen = false"
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              :class="{ 'bg-primary-50 text-primary-700': selectedOtherLang === v.value }"
            >
              <Icon :name="v.icon" class="w-4 h-4" />
              {{ v.label }}
              <Icon v-if="selectedOtherLang === v.value" name="heroicons:check" class="w-3.5 h-3.5 ml-auto text-primary-600" />
            </button>
          </div>

          <!-- Dropdown: Mashi variants (when target = mashi) -->
          <div
            v-if="targetDropOpen && targetLang === 'mashi'"
            class="absolute top-full right-0 mt-1 w-52 bg-white rounded-lg border border-slate-200 shadow-lg z-20 py-1"
          >
            <button
              v-for="v in mashiVariants"
              :key="v.value"
              @click="selectedMashiVariant = v.value; targetDropOpen = false"
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              :class="{ 'bg-primary-50 text-primary-700': selectedMashiVariant === v.value }"
            >
              <Icon name="heroicons:language" class="w-4 h-4" />
              {{ v.label }}
              <Icon v-if="selectedMashiVariant === v.value" name="heroicons:check" class="w-3.5 h-3.5 ml-auto text-primary-600" />
            </button>
          </div>
        </div>
      </div>

      <!-- Translation panels -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        <!-- Source panel -->
        <div class="relative border-b md:border-b-0 md:border-r border-slate-200">
          <textarea
            v-model="sourceText"
            :placeholder="sourceLang === 'mashi' ? t('translator.placeholderMashi') : (selectedOtherLang === 'english' ? t('translator.placeholderEn') : t('translator.placeholderFr'))"
            class="w-full h-44 sm:h-52 p-4 text-base text-slate-900 placeholder-slate-400 resize-none outline-none bg-transparent"
          />
          <button
            v-if="sourceText"
            @click="sourceText = ''"
            class="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Icon name="heroicons:x-mark" class="w-3.5 h-3.5" />
          </button>
          <div class="absolute bottom-3 right-4 text-xs text-slate-400">
            {{ sourceText.length }}
          </div>
        </div>

        <!-- Target panel -->
        <div class="relative bg-slate-50/50">
          <div class="w-full h-44 sm:h-52 p-4 overflow-y-auto">
            <div v-if="loading" class="flex items-center gap-2 text-slate-400">
              <Icon name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
              <span class="text-sm">{{ t('translator.translating') }}</span>
            </div>

            <template v-else-if="translationText">
              <p class="text-base text-slate-900">{{ translationText }}</p>
              <div class="flex items-center gap-2 mt-2">
                <span v-if="phonetic" class="text-xs text-slate-500 italic">/{{ phonetic }}/</span>
                <span v-if="category" class="text-xs px-2 py-0.5 rounded-md bg-slate-200 text-slate-600">{{ category }}</span>
              </div>
            </template>

            <p v-else-if="!sourceText.trim()" class="text-base text-slate-400">{{ t('translator.translation') }}</p>

            <div v-else-if="!loading && sourceText.trim() && !translationText" class="text-slate-500">
              <p class="text-sm">{{ t('translator.noResult') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
        <Icon name="heroicons:exclamation-triangle" class="w-4 h-4 shrink-0" />
        {{ error }}
      </div>

      <!-- Other results -->
      <div v-if="otherResults.length > 0" class="mt-6">
        <h3 class="text-xs font-medium text-slate-500 mb-2">{{ t('translator.otherResults') }}</h3>
        <div class="space-y-1.5">
          <div
            v-for="entry in otherResults"
            :key="entry.id"
            class="flex items-start justify-between gap-3 p-2.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors cursor-pointer"
            @click="sourceText = sourceLang === 'french' ? entry.frenchTranslation : entry.mashiWord"
          >
            <div>
              <p class="text-sm font-medium text-slate-900">
                {{ sourceLang === 'french' ? entry.mashiWord : entry.frenchTranslation }}
              </p>
              <p class="text-xs text-slate-500 mt-0.5">
                {{ sourceLang === 'french' ? entry.frenchTranslation : entry.mashiWord }}
                <span v-if="entry.phonetic" class="italic ml-1">/{{ entry.phonetic }}/</span>
              </p>
            </div>
            <span v-if="entry.grammaticalCategory" class="text-xs px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 shrink-0">
              {{ entry.grammaticalCategory }}
            </span>
          </div>
        </div>
      </div>

      <!-- Examples -->
      <div v-if="examples.length > 0" class="mt-6">
        <h3 class="text-xs font-medium text-slate-500 mb-2">{{ t('translator.examples') }}</h3>
        <div class="space-y-1.5">
          <div
            v-for="example in examples"
            :key="example.id"
            class="p-2.5 rounded-lg border border-slate-200 bg-white"
          >
            <p class="text-sm font-medium text-slate-900">{{ example.mashiPhrase }}</p>
            <p class="text-xs text-slate-500 mt-0.5">{{ example.frenchTranslation }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
