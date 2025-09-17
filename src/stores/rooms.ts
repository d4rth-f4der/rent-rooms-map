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

export const MIN_QUERY_LEN = 2

function normalizeText(input: string): string {
  // Lowercase, trim, collapse spaces, remove punctuation and diacritics
  const lower = input.toLowerCase().trim()
  const noDiacritics = lower.normalize('NFD').replace(/\p{Diacritic}+/gu, '')
  const noPunct = noDiacritics.replace(/[^\p{L}\p{N}\s]+/gu, ' ')
  const collapsed = noPunct.replace(/\s+/g, ' ').trim()
  return collapsed
}

const mockRooms: Room[] = [
  {
    id: '1',
    name: 'Студия в центре',
    description: 'Уютная студия в центре города.',
    price: 500,
    location: 'ул. Центральная, 10',
    geometry: { type: 'Point', coordinates: [30.5234, 50.4501] },
  },
  {
    id: '2',
    name: '2-комнатная у парка',
    description: 'Светлая квартира рядом с парком.',
    price: 700,
    location: 'пр-т Свободы, 5',
    geometry: { type: 'Point', coordinates: [30.5239, 50.4512] },
  },
  {
    id: '3',
    name: 'Лофт с видом',
    description: 'Стильный лофт с панорамными окнами.',
    price: 900,
    location: 'наб. Речная, 3',
    geometry: { type: 'Point', coordinates: [30.5205, 50.4489] },
  },
  {
    id: '4',
    name: 'Уютная однушка',
    description: 'Идеально для одного человека.',
    price: 450,
    location: 'ул. Зелёная, 14',
    geometry: { type: 'Point', coordinates: [30.527, 50.452] },
  },
  {
    id: '5',
    name: 'Квартира у метро',
    description: '5 минут до метро.',
    price: 650,
    location: 'пр-т Победы, 21',
    geometry: { type: 'Point', coordinates: [30.529, 50.447] },
  },
  {
    id: '6',
    name: 'Семейная 3-комнатная',
    description: 'Тихий двор и детская площадка.',
    price: 950,
    location: 'ул. Дружбы, 8',
    geometry: { type: 'Point', coordinates: [30.515, 50.455] },
  },
  {
    id: '7',
    name: 'Апартаменты на набережной',
    description: 'Вид на реку и набережную.',
    price: 1200,
    location: 'Набережная, 18',
    geometry: { type: 'Point', coordinates: [30.535, 50.449] },
  },
  {
    id: '8',
    name: 'Городской лофт',
    description: 'Высокие потолки, индустриальный стиль.',
    price: 880,
    location: 'ул. Заводская, 2',
    geometry: { type: 'Point', coordinates: [30.517, 50.446] },
  },
  {
    id: '9',
    name: 'Квартира-студия у парка',
    description: 'Рядом большой парк для прогулок.',
    price: 520,
    location: 'ул. Парковая, 3',
    geometry: { type: 'Point', coordinates: [30.512, 50.4525] },
  },
  {
    id: '10',
    name: 'Минимализм и свет',
    description: 'Светлая квартира в стиле минимализм.',
    price: 760,
    location: 'ул. Солнечная, 11',
    geometry: { type: 'Point', coordinates: [30.5405, 50.451] },
  },
  {
    id: '11',
    name: 'Дом у леса',
    description: 'Тихое место на окраине города.',
    price: 630,
    location: 'ул. Лесная, 7',
    geometry: { type: 'Point', coordinates: [30.505, 50.444] },
  },
  {
    id: '12',
    name: 'Двушка у университета',
    description: 'Отлично для студентов.',
    price: 680,
    location: 'пр-т Научный, 12',
    geometry: { type: 'Point', coordinates: [30.549, 50.455] },
  },
  {
    id: '13',
    name: 'Пентхаус с террасой',
    description: 'Панорамный вид, собственная терраса.',
    price: 2000,
    location: 'ул. Панорамная, 1',
    geometry: { type: 'Point', coordinates: [30.552, 50.448] },
  },
  {
    id: '14',
    name: 'Студия эконом',
    description: 'Небольшая студия с базовым ремонтом.',
    price: 380,
    location: 'ул. Рабочая, 16',
    geometry: { type: 'Point', coordinates: [30.500, 50.450] },
  },
  {
    id: '15',
    name: 'Квартира в новостройке',
    description: 'Новый дом, современная планировка.',
    price: 1100,
    location: 'ул. Новая, 4',
    geometry: { type: 'Point', coordinates: [30.546, 50.446] },
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
    queryTooShort(): boolean {
      const q = this.validatedQuery
      return q.length > 0 && q.length < MIN_QUERY_LEN
    },
    normalizedQuery(): string {
      return normalizeText(this.validatedQuery)
    },
    filteredRooms(state): Room[] {
      const q = this.normalizedQuery
      if (!q || q.length < MIN_QUERY_LEN) return state.rooms
      return state.rooms.filter((r) =>
        normalizeText([r.name, r.location, r.description].join(' ')).includes(q)
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
