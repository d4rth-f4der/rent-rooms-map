<script setup lang="ts">
defineOptions({ name: 'AppPagination' })
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
      « Попередня
    </button>
    <span class="text-sm">Стор. {{ current }} з {{ total }}</span>
    <button class="px-3 py-1 rounded border hover:bg-gray-50" @click="to(current + 1)" :disabled="current === total">
      Наступна »
    </button>
  </div>
</template>

<style scoped></style>
