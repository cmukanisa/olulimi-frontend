<script setup lang="ts">
const { t } = useLocale()

useHead({ title: computed(() => t('head.home')) })
useSeoMeta({
  title: computed(() => t('head.home')),
  ogTitle: computed(() => t('head.home')),
  description: computed(() => t('seo.homeDesc')),
  ogDescription: computed(() => t('seo.homeDesc')),
  ogType: 'website',
})

// Dynamic hero words
const heroWords = computed(() => t('home.heroWords').split(','))
const currentWordIndex = ref(0)
const currentWord = computed(() => heroWords.value[currentWordIndex.value])
const wordVisible = ref(true)

let heroInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  heroInterval = setInterval(() => {
    wordVisible.value = false
    setTimeout(() => {
      currentWordIndex.value = (currentWordIndex.value + 1) % heroWords.value.length
      wordVisible.value = true
    }, 400)
  }, 3000)
})

onUnmounted(() => {
  if (heroInterval) clearInterval(heroInterval)
})

const features = computed(() => [
  { title: t('feature.courses'), description: t('feature.coursesDesc'), icon: 'heroicons:book-open' },
  { title: t('feature.quiz'), description: t('feature.quizDesc'), icon: 'heroicons:puzzle-piece' },
  { title: t('feature.translator'), description: t('feature.translatorDesc'), icon: 'heroicons:language' },
  { title: t('feature.library'), description: t('feature.libraryDesc'), icon: 'heroicons:book-open' },
  { title: t('feature.phonetic'), description: t('feature.phoneticDesc'), icon: 'heroicons:speaker-wave' },
  { title: t('feature.examples'), description: t('feature.examplesDesc'), icon: 'heroicons:chat-bubble-left-right' },
  { title: t('feature.progress'), description: t('feature.progressDesc'), icon: 'heroicons:chart-bar' },
  { title: t('feature.dialects'), description: t('feature.dialectsDesc'), icon: 'heroicons:map' },
])
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <!-- Background decorations -->
      <div aria-hidden="true" class="absolute inset-0 -z-10">
        <!-- Primary radial glow -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(13,110,253,0.08),transparent_70%)]" />
        <!-- Secondary glow -->
        <div class="absolute top-20 right-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(13,110,253,0.04),transparent_70%)]" />
        <div class="absolute top-40 left-0 w-[300px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.04),transparent_70%)]" />
      </div>

      <!-- Dot grid pattern -->
      <div aria-hidden="true" class="absolute inset-0 -z-10 opacity-[0.35]" style="background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px); background-size: 24px 24px;" />

      <!-- Faded vertical border lines -->
      <div aria-hidden="true" class="absolute inset-0 max-w-7xl mx-auto hidden lg:block">
        <div class="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-slate-200 to-slate-200" />
        <div class="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-slate-200 to-slate-200" />
      </div>

      <div class="relative max-w-7xl mx-auto flex flex-col items-center justify-center gap-5 px-4 pt-14 pb-12 sm:pt-20 sm:pb-16 md:pt-24 md:pb-20">

        <!-- Badge pill -->
        <NuxtLink
          to="/courses"
          class="group flex items-center gap-3 rounded-full border border-primary-200 bg-white/80 backdrop-blur-sm px-4 py-2 shadow-sm hover:shadow-md hover:border-primary-300 transition-all"
        >
          <span class="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100">
            <Icon name="heroicons:sparkles" class="w-3 h-3 text-primary-600" />
          </span>
          <span class="text-xs font-medium text-slate-700">{{ t('home.badge') }}</span>
          <Icon name="heroicons:arrow-right" class="w-3.5 h-3.5 text-primary-400 group-hover:translate-x-0.5 transition-transform" />
        </NuxtLink>

        <!-- Main heading -->
        <h1 class="text-balance text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
          <span
            class="inline-block text-primary-600 transition-all duration-400 ease-out"
            :class="wordVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'"
          >{{ currentWord }}</span>
          {{ t('home.heroSuffix') }}
        </h1>

        <!-- Subtitle -->
        <div class="mx-auto max-w-lg text-center text-sm text-slate-500 sm:text-base leading-relaxed space-y-1">
          <p>{{ t('home.subtitle1') }}</p>
          <p>{{ t('home.subtitle2') }}</p>
          <p>{{ t('home.subtitle3') }}</p>
        </div>

        <!-- CTA buttons -->
        <div class="flex flex-row flex-wrap items-center justify-center gap-3 pt-3">
          <NuxtLink
            to="/about"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all"
          >
            <Icon name="heroicons:information-circle" class="w-4 h-4" />
            {{ t('home.learnMore') }}
          </NuxtLink>
          <NuxtLink
            to="/courses"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-primary-600 text-white hover:bg-primary-700 shadow-sm shadow-primary-600/20 hover:shadow-md hover:shadow-primary-600/30 transition-all"
          >
            {{ t('home.discoverCourses') }}
            <Icon name="heroicons:arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- Stats -->
        <div class="flex items-center gap-6 sm:gap-10 pt-6 text-center">
          <div>
            <p class="text-2xl font-bold text-slate-900 sm:text-3xl">4M+</p>
            <p class="text-xs text-slate-500 mt-0.5">{{ t('home.speakers') }}</p>
          </div>
          <div class="h-8 w-px bg-slate-200" />
          <div>
            <p class="text-2xl font-bold text-slate-900 sm:text-3xl">6</p>
            <p class="text-xs text-slate-500 mt-0.5">{{ t('home.variants') }}</p>
          </div>
          <div class="h-8 w-px bg-slate-200" />
          <div>
            <p class="text-2xl font-bold text-slate-900 sm:text-3xl">100%</p>
            <p class="text-xs text-slate-500 mt-0.5">{{ t('home.free') }}</p>
          </div>
        </div>
      </div>

      <!-- Bottom fade to white -->
      <div aria-hidden="true" class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>

    <!-- Features — hover effects grid -->
    <section class="border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 class="text-center text-lg font-medium text-slate-500 tracking-tight sm:text-xl pt-12 sm:pt-16">
          {{ t('home.featuresTitle') }} <span class="text-slate-900 font-semibold">{{ t('home.featuresTitleHighlight') }}</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10">
          <div
            v-for="(feature, index) in features"
            :key="feature.title"
            class="flex flex-col py-10 relative group/feature border-slate-200"
            :class="[
              'lg:border-r',
              (index === 0 || index === 4) && 'lg:border-l',
              index < 4 && 'lg:border-b',
            ]"
          >
            <!-- Hover gradient overlay -->
            <div
              v-if="index < 4"
              class="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-slate-100 to-transparent pointer-events-none"
            />
            <div
              v-else
              class="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-slate-100 to-transparent pointer-events-none"
            />

            <!-- Icon -->
            <div class="mb-4 relative z-10 px-10 text-slate-500">
              <Icon :name="feature.icon" class="w-6 h-6" />
            </div>

            <!-- Title with accent bar -->
            <div class="text-lg font-bold mb-2 relative z-10 px-10">
              <div class="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-slate-300 group-hover/feature:bg-primary-500 transition-all duration-200 origin-center" />
              <span class="group-hover/feature:translate-x-2 group-hover/feature:text-primary-600 transition duration-200 inline-block text-slate-800">
                {{ feature.title }}
              </span>
            </div>

            <!-- Description -->
            <p class="text-sm text-slate-500 max-w-xs relative z-10 px-10">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>



    <!-- CTA — Simple -->
    <section class="border-t border-slate-200 py-16 sm:py-20">
      <div class="max-w-2xl mx-auto px-4 text-center">
        <h2 class="text-2xl font-bold text-slate-900 sm:text-3xl">
          {{ t('home.ctaTitle') }} <span class="text-primary-600">{{ t('home.ctaTitleHighlight') }}</span>
        </h2>
        <p class="mt-3 text-slate-500">
          {{ t('home.ctaDescription') }}
        </p>
        <div class="mt-6">
          <NuxtLink
            to="/auth/register"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            {{ t('home.ctaButton') }}
            <Icon name="heroicons:arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
