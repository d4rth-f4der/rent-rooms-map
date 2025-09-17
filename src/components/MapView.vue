<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, computed, nextTick } from 'vue'
import type { Room } from '@/stores/rooms'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const props = defineProps<{ rooms: Room[]; hoveredId?: string | null }>()
const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'hover-marker', id: string | null): void
}>()

const container = ref<HTMLDivElement | null>(null)
let map: maplibregl.Map | null = null
const markers: maplibregl.Marker[] = []
const markerById: Record<string, maplibregl.Marker> = {}
const internalHoveredId = ref<string | null>(null)
let ro: ResizeObserver | null = null
let resizeHandler: (() => void) | null = null

const coords = computed(() => props.rooms.map(r => r.geometry.coordinates))

function clearMarkers() {
  markers.forEach(m => m.remove())
  markers.length = 0
  Object.keys(markerById).forEach(k => delete markerById[k])
}

function addMarkers() {
  if (!map) return
  clearMarkers()
  for (const r of props.rooms) {
    const marker = new maplibregl.Marker()
      .setLngLat(r.geometry.coordinates as [number, number])
      .setPopup(new maplibregl.Popup({ offset: 16 }).setHTML(`<strong>${r.name}</strong><br/>${r.location}`))
      .addTo(map)

    const el = marker.getElement()
    // Show pointer on hover over the marker element
    el.style.cursor = 'pointer'
    // Slight color shift towards blue and more vivid on hover using Tailwind filters
    el.classList.add(
      'filter',
      'transition',
      'duration-150',
      'hover:brightness-115',
      'hover:saturate-160',
      'hover:contrast-120',
      'hover:hue-rotate-30',
    )
    el.addEventListener('mouseenter', () => {
      if (map) map.getCanvas().style.cursor = 'pointer'
      // Track internal hover and open popup
      internalHoveredId.value = r.id
      updatePopups()
      emit('hover-marker', r.id)
    })
    el.addEventListener('mouseleave', () => {
      if (map) map.getCanvas().style.cursor = ''
      // Clear internal hover only if leaving this marker
      if (internalHoveredId.value === r.id) internalHoveredId.value = null
      updatePopups()
      emit('hover-marker', null)
    })
    el.addEventListener('click', () => {
      emit('hover-marker', r.id)
      emit('select', r.id)
    })
    markers.push(marker)
    markerById[r.id] = marker
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

onMounted(async () => {
  if (!container.value) return
  // Ensure DOM has laid out before initializing map
  await nextTick()
  map = new maplibregl.Map({
    container: container.value,
    style: {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
        },
      },
      layers: [
        {
          id: 'osm',
          type: 'raster',
          source: 'osm',
        },
      ],
    },
    center: (props.rooms[0]?.geometry.coordinates as [number, number]) ?? [30.5234, 50.4501],
    zoom: 12,
  })
  map.addControl(new maplibregl.NavigationControl(), 'top-right')
  map.on('load', () => {
    addMarkers()
    fitToMarkers()
    // Nudge map to recalc layout after styles/fonts load
    setTimeout(() => map?.resize(), 0)
  })

  // Resize handling: window resize and container size changes
  const resizeMap = () => {
    try { map?.resize() } catch {}
  }
  resizeHandler = resizeMap
  window.addEventListener('resize', resizeHandler)
  ro = new ResizeObserver(() => resizeHandler && resizeHandler())
  ro.observe(container.value)
})

onBeforeUnmount(() => {
  clearMarkers()
  map?.remove()
  map = null
  if (ro) {
    ro.disconnect()
    ro = null
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
})

watch(coords, () => {
  if (!map) return
  addMarkers()
  fitToMarkers()
})

// Helper to sync popups based on effective hover (list or marker)
function updatePopups() {
  const effectiveId = props.hoveredId ?? internalHoveredId.value
  for (const m of markers) {
    const p = m.getPopup()
    if (p && p.isOpen()) p.remove()
  }
  if (!effectiveId) return
  const m = markerById[effectiveId]
  if (m) {
    const p = m.getPopup()
    if (p) m.togglePopup()
  }
}

// React to list hover changes
watch(
  () => props.hoveredId,
  () => {
    updatePopups()
  }
)
</script>

<template>
  <div ref="container" class="w-full h-full rounded-lg overflow-hidden border"></div>
</template>

<style scoped>
:global(.maplibregl-ctrl)
{ font-size: 12px; }
</style>
