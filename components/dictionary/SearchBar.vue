<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-slate-400" />
    </div>
    <input
      type="text"
      :value="modelValue"
      @input="onInput"
      placeholder="Rechercher un mot..."
      class="w-full pl-12 pr-4 py-3.5 text-lg border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors shadow-sm"
    />
    <div
      v-if="modelValue"
      class="absolute inset-y-0 right-0 pr-4 flex items-center"
    >
      <button
        @click="emit('update:modelValue', '')"
        class="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <Icon name="heroicons:x-mark" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
