<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Room } from '@/stores/rooms'

const props = defineProps<{ room: Room }>()
const router = useRouter()

function openDetail() {
  router.push({ name: 'property-detail', params: { id: props.room.id } })
}
</script>

<template>
  <div
    class="rounded-lg border p-4 shadow-sm hover:shadow-md transition cursor-pointer bg-white"
    @click="openDetail"
  >
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 class="text-lg font-semibold">{{ room.title }}</h3>
        <p class="text-gray-600 text-sm">{{ room.address }}</p>
        <div class="mt-2 flex flex-wrap gap-2">
          <span v-for="t in room.tags" :key="t" class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
            #{{ t }}
          </span>
        </div>
      </div>
      <div class="text-right min-w-[100px]">
        <div class="text-xl font-bold">${{ room.price }}</div>
        <div class="text-gray-500 text-sm">{{ room.area }} м²</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
