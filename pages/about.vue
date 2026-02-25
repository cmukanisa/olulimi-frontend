<script setup lang="ts">
const { t } = useLocale()

useHead({ title: computed(() => t('head.about')) })
useSeoMeta({
  title: computed(() => t('head.about')),
  ogTitle: computed(() => t('head.about')),
  description: computed(() => t('seo.aboutDesc')),
  ogDescription: computed(() => t('seo.aboutDesc')),
})

const reasons = computed(() => [
  { title: t('about.reason1Title'), description: t('about.reason1Desc'), icon: 'heroicons:globe-alt' },
  { title: t('about.reason2Title'), description: t('about.reason2Desc'), icon: 'heroicons:heart' },
  { title: t('about.reason3Title'), description: t('about.reason3Desc'), icon: 'heroicons:sparkles' },
  { title: t('about.reason4Title'), description: t('about.reason4Desc'), icon: 'heroicons:flag' },
])
</script>

<template>
  <div>
    <!-- Header -->
    <section class="border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 text-center">
        <h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">
          {{ t('about.title') }}
        </h1>
        <p class="mt-2 text-slate-500 max-w-xl mx-auto">
          {{ t('about.subtitle') }}
        </p>
      </div>
    </section>

    <!-- History -->
    <section class="py-12 sm:py-16">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
            <Icon name="heroicons:book-open" class="w-5 h-5 text-slate-600" />
          </div>
          <h2 class="text-xl font-semibold text-slate-900">{{ t('about.historyTitle') }}</h2>
        </div>
        <div class="space-y-4 text-slate-600 leading-relaxed">
          <p>{{ t('about.historyP1') }}</p>
          <p>{{ t('about.historyP2') }}</p>
          <p>{{ t('about.historyP3') }}</p>
        </div>
      </div>
    </section>

    <!-- Why learn Mashi -->
    <section class="py-12 sm:py-16 border-t border-slate-100">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
            <Icon name="heroicons:heart" class="w-5 h-5 text-slate-600" />
          </div>
          <h2 class="text-xl font-semibold text-slate-900">{{ t('about.whyTitle') }}</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="reason in reasons"
            :key="reason.title"
            class="rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors"
          >
            <div class="flex items-center gap-2.5 mb-2">
              <Icon :name="reason.icon" class="w-4 h-4 text-slate-400" />
              <h3 class="text-sm font-semibold text-slate-900">{{ reason.title }}</h3>
            </div>
            <p class="text-sm text-slate-500 leading-relaxed">{{ reason.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="py-12 sm:py-16 border-t border-slate-100">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
            <Icon name="heroicons:users" class="w-5 h-5 text-slate-600" />
          </div>
          <h2 class="text-xl font-semibold text-slate-900">{{ t('about.teamTitle') }}</h2>
        </div>
        <div class="space-y-4 text-slate-600 leading-relaxed">
          <p>{{ t('about.teamP1') }}</p>
          <p>{{ t('about.teamP2') }}</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-12 sm:py-16 border-t border-slate-200">
      <div class="max-w-2xl mx-auto px-4 text-center">
        <h2 class="text-xl font-bold text-slate-900 sm:text-2xl">
          {{ t('about.ctaTitle') }}
        </h2>
        <p class="mt-2 text-slate-500">
          {{ t('about.ctaSubtitle') }}
        </p>
        <div class="mt-5">
          <NuxtLink
            to="/courses"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            {{ t('about.ctaButton') }}
            <Icon name="heroicons:arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
