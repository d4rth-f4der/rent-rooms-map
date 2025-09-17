<script setup lang="ts">
import { ref, watch } from 'vue'
import { MIN_QUERY_LEN } from '@/stores/rooms'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const input = ref(props.modelValue)

// Sync down when external model changes
watch(
  () => props.modelValue,
  (v) => {
    if (v !== input.value) input.value = v
  },
)

// Debounced emit up
let t: ReturnType<typeof setTimeout> | null = null
watch(
  input,
  (v) => {
    if (t) clearTimeout(t)
    t = setTimeout(() => {
      emit('update:modelValue', v)
    }, 250)
  },
)
</script>

<template>
  <div class="w-full">
    <label class="block text-sm font-medium text-gray-700 mb-1">Пошук</label>
    <input
      v-model="input"
      type="text"
      :placeholder="`Введіть мінімум ${MIN_QUERY_LEN} символи...`"
      class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <p v-if="input && input.length > 0 && input.length < MIN_QUERY_LEN" class="mt-1 text-sm text-red-600">
      Мінімум {{ MIN_QUERY_LEN }} символи для пошуку
    </p>
  </div>
</template>

<style scoped></style>
