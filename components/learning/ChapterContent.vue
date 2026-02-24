<script setup lang="ts">
import type { Chapter } from '~/types/course'

interface Props {
  chapter: Chapter
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-8">
    <!-- Text content -->
    <div v-if="chapter.content" class="card p-6 sm:p-8">
      <div
        class="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-primary-600"
        v-html="chapter.content"
      />
    </div>

    <!-- Audio player -->
    <div v-if="chapter.audioUrl" class="card p-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
          <Icon name="heroicons:speaker-wave" class="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h3 class="font-semibold text-slate-900 text-sm">Audio</h3>
          <p class="text-xs text-slate-500">Ecoutez la prononciation</p>
        </div>
      </div>
      <audio
        :src="chapter.audioUrl"
        controls
        preload="metadata"
        class="w-full h-12 rounded-lg"
      >
        Votre navigateur ne supporte pas la lecture audio.
      </audio>
    </div>

    <!-- Video player -->
    <div v-if="chapter.videoUrl" class="card p-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
          <Icon name="heroicons:video-camera" class="w-5 h-5 text-accent-600" />
        </div>
        <div>
          <h3 class="font-semibold text-slate-900 text-sm">Video</h3>
          <p class="text-xs text-slate-500">Regardez la lecon en video</p>
        </div>
      </div>
      <div class="aspect-video bg-black rounded-lg overflow-hidden">
        <video
          :src="chapter.videoUrl"
          controls
          preload="metadata"
          class="w-full h-full object-contain"
        >
          Votre navigateur ne supporte pas la lecture video.
        </video>
      </div>
    </div>

    <!-- Duration -->
    <div v-if="chapter.estimatedDuration" class="flex items-center gap-2 text-sm text-slate-500">
      <Icon name="heroicons:clock" class="w-4 h-4" />
      Duree estimee : {{ chapter.estimatedDuration }} minutes
    </div>
  </div>
</template>
