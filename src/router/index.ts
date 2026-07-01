import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const SITE_URL = 'https://resumeio.uz'

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
        meta: {
          title: '',
          seoTitle: 'ResumeIO — CV va Obektivka yasash | Bepul',
          description:
            "O'zbekistonda rasmiy obektivka (ma'lumotnoma) va CV (rezyume) yaratish. Word va PDF formatida yuklab oling. Bepul, ro'yxatdan o'tish shart emas.",
          canonical: `${SITE_URL}/`,
        },
      },
      {
        path: 'resume',
        name: 'resume',
        component: () => import('@/pages/ResumePage.vue'),
        meta: {
          title: 'menu.resume',
          seoTitle: "CV (Rezyume) Yasash — ResumeIO | Bepul va Onlayn",
          description:
            "Professional CV (rezyume) yarating. Bir nechta zamonaviy shablon, real-time preview. PDF va Word formatida yuklab oling. Bepul.",
          canonical: `${SITE_URL}/resume`,
        },
      },
      {
        path: 'cover-letter',
        name: 'coverLetter',
        component: () => import('@/pages/CoverLetterPage.vue'),
        meta: {
          title: 'menu.coverLetter',
          seoTitle: "Cover Letter (Motivatsion Xat) Yasash — ResumeIO",
          description:
            "Professional cover letter (motivatsion xat) yarating. PDF va Word formatida yuklab oling. Bepul onlayn vosita.",
          canonical: `${SITE_URL}/cover-letter`,
        },
      },
      {
        path: 'obektivka',
        name: 'obektivka',
        component: () => import('@/pages/ObektivkaPage.vue'),
        meta: {
          title: 'menu.obektivka',
          seoTitle: "Obektivka (Ma'lumotnoma) Yasash — ResumeIO | Rasmiy Shakl",
          description:
            "O'zbekiston davlat va xususiy tashkilotlari uchun rasmiy obektivka (ma'lumotnoma) yaratish. A4 format, rasmiy standart. Word va PDF yuklab oling. Bepul.",
          canonical: `${SITE_URL}/obektivka`,
        },
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

// Har sahifada title va meta description yangilanadi
router.afterEach((to) => {
  const meta = to.meta as Record<string, string>

  // Title
  document.title = meta.seoTitle || 'ResumeIO'

  // Description
  setMeta('name', 'description', meta.description || '')

  // OG tags
  setMeta('property', 'og:title', meta.seoTitle || 'ResumeIO')
  setMeta('property', 'og:description', meta.description || '')
  setMeta('property', 'og:url', meta.canonical || SITE_URL)

  // Twitter
  setMeta('name', 'twitter:title', meta.seoTitle || 'ResumeIO')
  setMeta('name', 'twitter:description', meta.description || '')

  // Canonical
  setCanonical(meta.canonical || SITE_URL)
})

function setMeta(attr: string, key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default router
