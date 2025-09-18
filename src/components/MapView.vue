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
let didInitialFit = false
let readyTimer: ReturnType<typeof setTimeout> | null = null
const isReady = ref(false)

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
      .setPopup(new maplibregl.Popup({ offset: 16, closeButton: false }).setHTML(`<strong>${r.name}</strong><br/>${r.location}`))
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

function fitToMarkers(duration = 300) {
  if (!map || props.rooms.length === 0) return
  const bounds = new maplibregl.LngLatBounds()
  props.rooms.forEach(r => bounds.extend(r.geometry.coordinates as [number, number]))
  try {
    map.fitBounds(bounds, { padding: 40, maxZoom: 15, duration })
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
    // Instant initial fit to avoid visible jump
    fitToMarkers(0)
    didInitialFit = true
    // Nudge map to recalc layout after styles/fonts load
    setTimeout(() => map?.resize(), 0)
    // Mark ready early on first render for quicker reveal; also keep a short fallback
    map?.once('render', () => { isReady.value = true })
    readyTimer = setTimeout(() => { isReady.value = true }, 100)
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
  if (readyTimer) {
    clearTimeout(readyTimer)
    readyTimer = null
  }
})

watch(coords, () => {
  if (!map) return
  addMarkers()
  // animate after initial load only
  fitToMarkers(didInitialFit ? 300 : 0)
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
  <div class="w-full h-full rounded-lg overflow-hidden border bg-gray-100">
    <div class="h-full transition-opacity duration-400" :class="{ 'opacity-0': !isReady, 'opacity-100': isReady }">
      <div ref="container" class="w-full h-full"></div>
    </div>
  </div>
</template>

<style scoped>
:global(.maplibregl-ctrl)
{ font-size: 12px; }

/* Hide the default close (x) on popups */
:global(.maplibregl-popup-close-button)
{ display: none !important; }

/* Make popup content padding a bit tighter vertically */
:global(.maplibregl-popup-content)
{ padding: 6px 10px; line-height: 1.25; }
</style>
