<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'
import type { Room } from '@/stores/rooms'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const props = defineProps<{ rooms: Room[] }>()
const emit = defineEmits<{ (e: 'select', id: string): void }>()

const container = ref<HTMLDivElement | null>(null)
let map: maplibregl.Map | null = null
const markers: maplibregl.Marker[] = []

const coords = computed(() => props.rooms.map(r => r.geometry.coordinates))

function clearMarkers() {
  markers.forEach(m => m.remove())
  markers.length = 0
}

function addMarkers() {
  if (!map) return
  clearMarkers()
  for (const r of props.rooms) {
    const marker = new maplibregl.Marker()
      .setLngLat(r.geometry.coordinates as [number, number])
      .setPopup(new maplibregl.Popup({ offset: 16 }).setText(r.name))
      .addTo(map)
    marker.getElement().addEventListener('click', () => emit('select', r.id))
    markers.push(marker)
  }
}

function fitToMarkers() {
  if (!map || props.rooms.length === 0) return
  const bounds = new maplibregl.LngLatBounds()
  props.rooms.forEach(r => bounds.extend(r.geometry.coordinates as [number, number]))
  try {
    map.fitBounds(bounds, { padding: 40, maxZoom: 15, duration: 300 })
  } catch {}
}

onMounted(() => {
  if (!container.value) return
  map = new maplibregl.Map({
    container: container.value,
    style: 'https://demotiles.maplibre.org/style.json',
    center: (props.rooms[0]?.geometry.coordinates as [number, number]) ?? [30.5234, 50.4501],
    zoom: 12,
  })
  map.addControl(new maplibregl.NavigationControl(), 'top-right')
  map.on('load', () => {
    addMarkers()
    fitToMarkers()
  })
})

onBeforeUnmount(() => {
  clearMarkers()
  map?.remove()
  map = null
})

watch(coords, () => {
  if (!map) return
  addMarkers()
  fitToMarkers()
})
</script>

<template>
  <div ref="container" class="w-full h-full rounded-lg overflow-hidden border"></div>
</template>

<style scoped>
:global(.maplibregl-ctrl)
{ font-size: 12px; }
</style>
