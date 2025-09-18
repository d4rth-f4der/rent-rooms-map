<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Room } from '@/stores/rooms'

const props = defineProps<{ room: Room; query?: string }>()
const emit = defineEmits<{ (e: 'hover', id: string | null): void }>()
const router = useRouter()

function openDetail() {
  router.push({ name: 'property-detail', params: { id: props.room.id } })
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function highlight(text: string, query?: string): string {
  const escaped = escapeHtml(text)
  const q = (query ?? '').trim()
  if (!q || q.length < 2) return escaped
  const escapedQuery = escapeHtml(q)
  const re = new RegExp(escapeRegExp(escapedQuery), 'gi')
  return escaped.replace(re, (m) => `<mark>${m}</mark>`)
}
</script>

<template>
  <div
    :id="`room-card-${room.id}`"
    class="room-card rounded-lg border p-3 shadow-sm hover:shadow-lg transition-all duration-200 transform-gpu hover:-translate-y-0.5 cursor-pointer bg-white"
    @click="openDetail"
    @mouseenter="emit('hover', room.id)"
    @mouseleave="emit('hover', null)"
  >
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 class="text-lg font-semibold" v-html="highlight(room.name, query)"></h3>
        <p class="text-gray-600 text-sm" v-html="highlight(room.location, query)"></p>
      </div>
      <div class="text-right min-w-[100px]">
        <div class="text-xl font-bold">${{ room.price }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
