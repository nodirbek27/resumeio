import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'main',
    component: () => import('@/layouts/MainPage.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/HomeView.vue'),
        meta: { title: '' },
      },
      {
        path: 'obektivka',
        name: 'obektivka',
        component: () => import('@/pages/ObektivkaPage.vue'),
        meta: { title: 'menu.obektivka' },
      },
      {
        path: 'resume',
        name: 'resume',
        component: () => import('@/pages/ResumePage.vue'),
        meta: { title: 'menu.resume' },
      },
      {
        path: 'cover-letter',
        name: 'coverLetter',
        component: () => import('@/pages/CoverLetterPage.vue'),
        meta: { title: 'menu.coverLetter' },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    name: 'ErrorPage',
    component: () => import('@/layouts/ErrorPage.vue'),
  },
]

export const menus =
  routes.find(r => r.name === 'main')?.children || []

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
