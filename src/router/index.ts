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
          seoTitle: 'ResumeIO — Free Online Resume, CV & Cover Letter Builder',
          description:
            'Build a professional resume, CV, and cover letter online for free. Choose from multiple templates, preview in real time, and download as PDF or Word instantly.',
          canonical: `${SITE_URL}/`,
        },
      },
      {
        path: 'resume',
        name: 'resume',
        component: () => import('@/pages/ResumePage.vue'),
        meta: {
          title: 'menu.resume',
          seoTitle: 'Resume Builder — Create a Professional CV Online | ResumeIO',
          description:
            'Build a professional resume (CV) online with modern templates and a real-time preview. Download as PDF or Word for free — no sign-up required.',
          canonical: `${SITE_URL}/resume`,
        },
      },
      {
        path: 'cover-letter',
        name: 'coverLetter',
        component: () => import('@/pages/CoverLetterPage.vue'),
        meta: {
          title: 'menu.coverLetter',
          seoTitle: 'Cover Letter Builder — Write a Professional Cover Letter Online | ResumeIO',
          description:
            'Create a professional cover letter online in minutes with modern templates. Download as PDF or Word for free — no sign-up required.',
          canonical: `${SITE_URL}/cover-letter`,
        },
      },
      {
        path: 'obektivka',
        name: 'obektivka',
        component: () => import('@/pages/ObektivkaPage.vue'),
        meta: {
          title: 'menu.obektivka',
          seoTitle: 'Obektivka (Official Reference Letter) Maker — ResumeIO',
          description:
            'Create an official Obektivka reference letter for Uzbekistan government and private institutions. A4 format, official standard. Download as Word or PDF for free.',
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
