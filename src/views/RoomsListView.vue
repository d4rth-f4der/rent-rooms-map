<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoomsStore } from '@/stores/rooms'
import SearchBar from '@/components/SearchBar.vue'
import Pagination from '@/components/Pagination.vue'
import RoomCard from '@/components/RoomCard.vue'
import MapView from '@/components/MapView.vue'
import staggerAppear from '@/directives/staggerAppear'

const store = useRoomsStore()
const router = useRouter()
const hoveredId = ref<string | null>(null)

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

function onMarkerSelect(id: string) {
  router.push({ name: 'property-detail', params: { id } })
}

</script>

<template>
  <div class="container mx-auto p-3 space-y-3">
    <h1 class="text-2xl font-bold">Список об'єктів оренди</h1>

    <SearchBar v-model="query" />

    <div class="grid gap-3 md:grid-cols-2">
      <div class="space-y-2" v-stagger-appear="{ selector: ':scope > .room-card' }">
        <RoomCard
          v-for="r in rooms"
          :key="r.id"
          :room="r"
          :query="query"
          @hover="hoveredId = $event"
        />
        <p v-if="rooms.length === 0" class="text-sm text-gray-600">Нічого не знайдено.</p>
        <Pagination :current="page" :total="totalPages" @change="changePage" />
      </div>
      <div class="min-h-[320px] sm:min-h-[340px] md:min-h-[360px]">
        <MapView
          :rooms="store.filteredRooms"
          :hovered-id="hoveredId"
          @select="onMarkerSelect"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts">
export default {
  directives: {
    staggerAppear,
  },
}
</script>
