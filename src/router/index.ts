import { createRouter, createWebHistory } from 'vue-router'
import RoomsListView from '@/views/RoomsListView.vue'
import RoomDetailView from '@/views/RoomDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: RoomsListView,
    },
    {
      path: '/rooms/:id',
      name: 'room-detail',
      component: RoomDetailView,
      props: true,
    },
  ],
})

export default router
