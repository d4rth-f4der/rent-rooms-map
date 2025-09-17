<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoomsStore } from '@/stores/rooms'
import SearchBar from '@/components/SearchBar.vue'
import Pagination from '@/components/Pagination.vue'
import RoomCard from '@/components/RoomCard.vue'
import MapView from '@/components/MapView.vue'

const store = useRoomsStore()

onMounted(() => {
  store.loadMockData()
})

const rooms = computed(() => store.paginatedRooms)
const totalPages = computed(() => store.totalPages)
const page = computed(() => store.filters.page)
const query = computed({
  get: () => store.filters.query,
  set: (v: string) => store.setQuery(v),
})

function changePage(p: number) {
  store.setPage(p)
}
</script>

<template>
  <div class="container mx-auto p-4 space-y-4">
    <h1 class="text-2xl font-bold">Список об'єктів оренди</h1>

    <SearchBar v-model="query" />

    <div class="grid gap-4 md:grid-cols-2">
      <div class="space-y-3">
        <RoomCard v-for="r in rooms" :key="r.id" :room="r" :query="query" />
        <p v-if="rooms.length === 0" class="text-sm text-gray-600">Нічого не знайдено.</p>
        <Pagination :current="page" :total="totalPages" @change="changePage" />
      </div>
      <div class="min-h-[400px]">
        <MapView :rooms="store.filteredRooms" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
