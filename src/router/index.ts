import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HistoryView from '../views/HistoryView.vue'
import HomeView from '../views/HomeView.vue'
import MaterialsView from '../views/MaterialsView.vue'
import MaterialView from '../views/MaterialView.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/materials',
    name: 'materials',
    component: MaterialsView,
  },
  {
    path: '/materials/:materialId',
    name: 'material',
    component: MaterialView,
  },
  {
    path: '/history',
    name: 'history',
    component: HistoryView,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
