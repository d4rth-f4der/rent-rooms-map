import { defineStore } from 'pinia'

export type Room = {
  id: string
  name: string
  description: string
  price: number
  location: string
  geometry: GeoJSON.Point
}

export type Filters = {
  query: string
  page: number
  perPage: number
}

const mockRooms: Room[] = [
  {
    id: '1',
    name: 'Студия в центре',
    description: 'Уютная студия в центре города.',
    price: 500,
    location: 'ул. Центральная, 10',
    geometry: {
      type: 'Point',
      coordinates: [30.5234, 50.4501],
    },
  },
  {
    id: '2',
    name: '2-комнатная у парка',
    description: 'Светлая квартира рядом с парком.',
    price: 700,
    location: 'пр-т Свободы, 5',
    geometry: {
      type: 'Point',
      coordinates: [30.5239, 50.4512],
    },
  },
  {
    id: '3',
    name: 'Лофт с видом',
    description: 'Стильный лофт с панорамными окнами.',
    price: 900,
    location: 'наб. Речная, 3',
    geometry: {
      type: 'Point',
      coordinates: [30.5205, 50.4489],
    },
  },
]

export const useRoomsStore = defineStore('rooms', {
  state: () => ({
    rooms: [] as Room[],
    filters: {
      query: '',
      page: 1,
      perPage: 6,
    } as Filters,
  }),
  getters: {
    validatedQuery: (state) => state.filters.query.trim(),
    filteredRooms(state): Room[] {
      const q = this.validatedQuery.toLowerCase()
      if (!q || q.length < 2) return state.rooms
      return state.rooms.filter((r) =>
        [r.name, r.location, r.description]
          .join(' ')
          .toLowerCase()
          .includes(q)
      )
    },
    totalPages(): number {
      return Math.max(1, Math.ceil(this.filteredRooms.length / this.filters.perPage))
    },
    paginatedRooms(): Room[] {
      const start = (this.filters.page - 1) * this.filters.perPage
      return this.filteredRooms.slice(start, start + this.filters.perPage)
    },
    getById: (state) => (id: string) => state.rooms.find((r) => r.id === id),
  },
  actions: {
    loadMockData() {
      if (this.rooms.length === 0) {
        this.rooms = mockRooms
      }
    },
    setQuery(q: string) {
      this.filters.query = q
      this.filters.page = 1
    },
    setPage(p: number) {
      const page = Math.min(Math.max(1, p), this.totalPages)
      this.filters.page = page
    },
    setPerPage(n: number) {
      this.filters.perPage = Math.max(1, n)
      this.filters.page = 1
    },
    resetFilters() {
      this.filters = { query: '', page: 1, perPage: 6 }
    },
  },
})
