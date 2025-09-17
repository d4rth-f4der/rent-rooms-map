<script setup lang="ts">
const props = defineProps<{ current: number; total: number }>()
const emit = defineEmits<{ (e: 'change', page: number): void }>()

function to(page: number) {
  if (page < 1 || page > props.total) return
  emit('change', page)
}
</script>

<template>
  <div class="flex items-center gap-2 mt-2" v-if="total > 1">
    <button class="px-3 py-1 rounded border hover:bg-gray-50" @click="to(current - 1)" :disabled="current === 1">
      « Prev
    </button>
    <span class="text-sm">Стр. {{ current }} из {{ total }}</span>
    <button class="px-3 py-1 rounded border hover:bg-gray-50" @click="to(current + 1)" :disabled="current === total">
      Next »
    </button>
  </div>
</template>

<style scoped></style>
