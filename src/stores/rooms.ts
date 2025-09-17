import { defineStore } from 'pinia'

export type Room = {
  id: string
  title: string
  address: string
  price: number
  area: number
  coords: [number, number] // [lng, lat]
  tags?: string[]
  description?: string
}

export type Filters = {
  query: string
  page: number
  perPage: number
}

const mockRooms: Room[] = [
  {
    id: '1',
    title: 'Студия в центре',
    address: 'ул. Центральная, 10',
    price: 500,
    area: 25,
    coords: [30.5234, 50.4501],
    tags: ['центр', 'студия'],
    description: 'Уютная студия в центре города.'
  },
  {
    id: '2',
    title: '2-комнатная у парка',
    address: 'пр-т Свободы, 5',
    price: 700,
    area: 48,
    coords: [30.5239, 50.4512],
    tags: ['парк', 'семья'],
    description: 'Светлая квартира рядом с парком.'
  },
  {
    id: '3',
    title: 'Лофт с видом',
    address: 'наб. Речная, 3',
    price: 900,
    area: 60,
    coords: [30.5205, 50.4489],
    tags: ['лофт', 'вид'],
    description: 'Стильный лофт с панорамными окнами.'
  }
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
        [r.title, r.address, ...(r.tags ?? [])]
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
