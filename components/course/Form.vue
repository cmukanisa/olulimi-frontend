<script setup lang="ts">
const props = defineProps<{
  modelValue: {
    title: string
    description: string
    level: string
    coverImage: string
    status?: string
  }
  showStatus?: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: typeof props.modelValue]
  submit: []
}>()

const update = (key: string, value: string) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <form @submit.prevent="emit('submit')">
    <div class="space-y-5">
      <!-- Title -->
      <div>
        <label for="course-title" class="block text-sm font-medium text-slate-700 mb-1">
          Titre du cours <span class="text-red-500">*</span>
        </label>
        <input
          id="course-title"
          :value="modelValue.title"
          @input="update('title', ($event.target as HTMLInputElement).value)"
          type="text"
          class="input-field"
          placeholder="Ex: Introduction au Mashi"
          required
        />
      </div>

      <!-- Description -->
      <div>
        <label for="course-description" class="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          id="course-description"
          :value="modelValue.description"
          @input="update('description', ($event.target as HTMLTextAreaElement).value)"
          class="input-field min-h-[120px] resize-y"
          placeholder="Decrivez le contenu et les objectifs du cours..."
          rows="4"
        />
      </div>

      <!-- Level -->
      <div>
        <label for="course-level" class="block text-sm font-medium text-slate-700 mb-1">
          Niveau
        </label>
        <select
          id="course-level"
          :value="modelValue.level"
          @change="update('level', ($event.target as HTMLSelectElement).value)"
          class="input-field"
        >
          <option value="beginner">Debutant</option>
          <option value="intermediate">Intermediaire</option>
          <option value="advanced">Avance</option>
        </select>
      </div>

      <!-- Status (optional) -->
      <div v-if="showStatus && modelValue.status !== undefined">
        <label for="course-status" class="block text-sm font-medium text-slate-700 mb-1">
          Statut
        </label>
        <select
          id="course-status"
          :value="modelValue.status"
          @change="update('status', ($event.target as HTMLSelectElement).value)"
          class="input-field"
        >
          <option value="draft">Brouillon</option>
          <option value="published">Publie</option>
          <option value="archived">Archive</option>
        </select>
      </div>

      <!-- Cover image -->
      <div>
        <label for="course-cover" class="block text-sm font-medium text-slate-700 mb-1">
          URL de l'image de couverture
        </label>
        <input
          id="course-cover"
          :value="modelValue.coverImage"
          @input="update('coverImage', ($event.target as HTMLInputElement).value)"
          type="url"
          class="input-field"
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </div>

    <div class="mt-8 flex items-center justify-end gap-3">
      <slot name="actions" />
    </div>
  </form>
</template>
