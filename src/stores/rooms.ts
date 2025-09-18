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
  const lower = input.toLowerCase().trim()
  const noDiacritics = lower.normalize('NFD').replace(/\p{Diacritic}+/gu, '')
  const noPunct = noDiacritics.replace(/[^\p{L}\p{N}\s]+/gu, ' ')
  const collapsed = noPunct.replace(/\s+/g, ' ').trim()
  return collapsed
}

const mockRooms: Room[] = [
  {
    id: '1',
    name: 'Студія в центрі',
    description: 'Затишна студія в центрі міста.',
    price: 500,
    location: 'вул. Хрещатик, 10',
    geometry: { type: 'Point', coordinates: [30.5258517, 50.4518422] },
  },
  {
    id: '2',
    name: 'Двокімнатна біля парку',
    description: 'Світла квартира поруч із парком.',
    price: 700,
    location: 'вул. Володимирська, 5',
    geometry: { type: 'Point', coordinates: [30.5181696, 50.4569858] },
  },
  {
    id: '3',
    name: 'Лофт з видом',
    description: 'Стильний лофт із панорамними вікнами.',
    price: 900,
    location: 'вул. Мечнікова, 6',
    geometry: { type: 'Point', coordinates: [30.5287834, 50.4370896] },
  },
  {
    id: '4',
    name: 'Затишна однокімнатна',
    description: 'Ідеально для однієї людини.',
    price: 450,
    location: "проспект Бандери, 34",
    geometry: { type: 'Point', coordinates: [30.5192386, 50.4869644] },
  },
  {
    id: '5',
    name: 'Квартира біля метро',
    description: '5 хвилин до метро.',
    price: 650,
    location: 'просп. Перемоги, 21',
    geometry: { type: 'Point', coordinates: [30.4718579, 50.4490644] },
  },
  {
    id: '6',
    name: 'Сімейна трикімнатна',
    description: 'Тихий двір і дитячий майданчик.',
    price: 950,
    location: 'вул. Паньківська, 8',
    geometry: { type: 'Point', coordinates: [30.5036075, 50.4398523] },
  },
  {
    id: '7',
    name: 'Апартаменти на набережній',
    description: 'Вид на річку та набережну.',
    price: 1200,
    location: 'Набережне шосе, 18',
    geometry: { type: 'Point', coordinates: [30.5667457, 50.4295851] },
  },
  {
    id: '8',
    name: 'Міський лофт',
    description: 'Високі стелі, індустріальний стиль.',
    price: 880,
    location: 'вул. Драгоманова, 3',
    geometry: { type: 'Point', coordinates: [30.637396, 50.4159183] },
  },
  {
    id: '9',
    name: 'Студія біля парку',
    description: 'Поруч великий парк для прогулянок.',
    price: 520,
    location: 'вул. Прирічна, 12',
    geometry: { type: 'Point', coordinates: [30.7161095, 50.1488655] },
  },
  {
    id: '10',
    name: 'Мінімалізм і світло',
    description: 'Світла квартира в стилі мінімалізм.',
    price: 760,
    location: 'вул. Сонячна, 11',
    geometry: { type: 'Point', coordinates: [30.4246318, 50.4690027] },
  },
  {
    id: '11',
    name: 'Будинок біля лісу',
    description: 'Тихе місце на околиці міста.',
    price: 630,
    location: 'вул. Автозаводська, 8',
    geometry: { type: 'Point', coordinates: [30.4581089, 50.5069668] },
  },
  {
    id: '12',
    name: 'Двокімнатна біля університету',
    description: 'Чудово для студентів.',
    price: 680,
    location: 'просп. Науки, 12',
    geometry: { type: 'Point', coordinates: [30.5258838, 50.3893565] },
  },
  {
    id: '13',
    name: 'Пентхаус із терасою',
    description: 'Панорамний вид, власна тераса.',
    price: 2000,
    location: 'вул. Панорамна, 1',
    geometry: { type: 'Point', coordinates: [30.5391096, 50.3817286] },
  },
  {
    id: '14',
    name: 'Студія економ',
    description: 'Невелика студія з базовим ремонтом.',
    price: 380,
    location: 'вул. Зоологічна, 3',
    geometry: { type: 'Point', coordinates: [30.4598076, 50.4552785] },
  },
  {
    id: '15',
    name: 'Квартира в новобудові',
    description: 'Новий будинок, сучасне планування.',
    price: 1100,
    location: 'вул. Сверстюка, 4',
    geometry: { type: 'Point', coordinates: [30.6021083, 50.4472839] },
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
