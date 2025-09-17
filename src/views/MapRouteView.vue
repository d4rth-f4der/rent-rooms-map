<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoomsStore } from '@/stores/rooms'
import MapView from '@/components/MapView.vue'

const router = useRouter()
const store = useRoomsStore()

onMounted(() => {
  store.loadMockData()
})

const rooms = computed(() => store.filteredRooms)

function onSelect(id: string) {
  router.push({ name: 'property-detail', params: { id } })
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Карта об'єктів</h1>
    <div class="h-[70vh]">
      <MapView :rooms="rooms" @select="onSelect" />
    </div>
  </div>
</template>

<style scoped></style>
