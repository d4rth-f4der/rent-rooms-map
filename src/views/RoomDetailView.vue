<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRoomsStore } from '@/stores/rooms'
import MapView from '@/components/MapView.vue'

const route = useRoute()
const router = useRouter()
const store = useRoomsStore()

onMounted(() => store.loadMockData())

const room = computed(() => store.getById(String(route.params.id)))

function back() {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="container mx-auto p-4 space-y-4">
    <button class="text-blue-600 hover:underline" @click="back">← Назад к списку</button>
    <div v-if="room" class="grid gap-4 md:grid-cols-2">
      <div class="space-y-2">
        <h1 class="text-2xl font-bold">{{ room.name }}</h1>
        <p class="text-gray-600">{{ room.location }}</p>
        <div class="flex gap-4 text-lg">
          <div><span class="font-semibold">Цена:</span> ${{ room.price }}</div>
        </div>
        <p class="text-gray-700">{{ room.description }}</p>
      </div>
      <div class="min-h-[400px]">
        <MapView :rooms="[room]" />
      </div>
    </div>
    <div v-else>
      <p>Помещение не найдено.</p>
    </div>
  </div>
</template>

<style scoped></style>
