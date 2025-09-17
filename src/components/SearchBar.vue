<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const value = computed({
  get: () => props.modelValue,
  set: (v: string) => emit('update:modelValue', v),
})
</script>

<template>
  <div class="w-full">
    <label class="block text-sm font-medium text-gray-700 mb-1">Поиск</label>
    <input
      v-model="value"
      type="text"
      placeholder="Введите минимум 2 символа..."
      class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <p v-if="value && value.length > 0 && value.length < 2" class="mt-1 text-sm text-red-600">
      Минимум 2 символа для поиска
    </p>
  </div>
</template>

<style scoped></style>
