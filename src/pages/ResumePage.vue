<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import DonateDialog from '@/components/DonateDialog.vue'
import TemplatePickerCarousel from '@/components/TemplatePickerCarousel.vue'
import ResumeTemplateRender from '@/components/ResumeTemplateRender.vue'
import { tint, shade } from '@/utils/colorTint'
import type { ResumeData } from '@/types/resume'

const resumeTemplates = [
  { id: 'modern', label: 'Modern Minimalist' },
  { id: 'classic', label: 'Classic Professional' },
  { id: 'creative', label: 'Creative Accent' },
  { id: 'minimal', label: 'Minimal Lines' },
  { id: 'sidebar-right', label: 'Sidebar Right' },
  { id: 'timeline', label: 'Elegant Timeline' },
  { id: 'bold-header', label: 'Bold Header' },
  { id: 'executive-photo', label: 'Executive Photo' },
  { id: 'professional-icons', label: 'Professional Icons' },
]

const $q = useQuasar()
const showPreviewMobile = ref(false)
const showDonateDialog = ref(false)
// Matches Tailwind's `lg` breakpoint (1024px) used for the grid-cols layout switch
const isCompactLayout = computed(() => $q.screen.width < 1024)

const accentSwatches = [
  '#4f46e5',
  '#2563eb',
  '#0d9488',
  '#16a34a',
  '#d97706',
  '#dc2626',
  '#db2777',
  '#475569',
]

const STORAGE_KEY = 'resume_builder_data'

const defaultResume: ResumeData = {
  fullname: '',
  title: '',
  photo: null,
  email: '',
  phone: '',
  address: '',
  website: '',
  summary: '',
  skills: '',
  languages: '',
  experience: [],
  education: [],
  accentColor: '#4f46e5',
}

const demoResume: ResumeData = {
  fullname: 'John Smith',
  title: 'Senior Frontend Developer',
  photo: null,
  email: 'john.smith@email.com',
  phone: '+1 555 123 4567',
  address: 'New York, NY',
  website: 'johnsmith.dev',
  summary:
    'Senior Frontend Developer with 5+ years of experience. Specialist in Vue.js, React, TypeScript and modern web technologies. Focused on building high-quality, fast interfaces.',
  skills:
    'JavaScript, TypeScript, Vue 3, React, Pinia, Tailwind CSS, Quasar, Webpack, Vite, Git, REST API',
  languages: 'English (native), Spanish (fluent), French (intermediate)',
  experience: [
    {
      company: 'Digital Solutions LLC',
      position: 'Senior Frontend Developer',
      startDate: '2023-01',
      endDate: 'Present',
      description:
        'Developed and optimized a large-scale ERP system using Vue 3 and TypeScript. Reduced load time by 40% and built a design system from scratch.',
    },
    {
      company: 'Soft Innovation',
      position: 'Mid Web Developer',
      startDate: '2021-02',
      endDate: '2022-12',
      description:
        'Successfully delivered 10+ e-commerce sites and SaaS projects using React and Redux.',
    },
  ],
  education: [
    {
      school: 'State University of Technology',
      degree: 'Computer Engineering (Bachelor)',
      startDate: '2017',
      endDate: '2021',
      description: 'In-depth study of computer science and programming fundamentals.',
    },
  ],
  accentColor: '#4f46e5',
}

const formData = reactive<ResumeData>({ ...defaultResume })
const activeTemplate = ref<string>('modern') // modern, classic, creative, minimal, sidebar-right
const previewRef = ref<HTMLDivElement | null>(null)
const isExporting = ref<boolean>(false)

const accentSoft = computed(() => tint(formData.accentColor, 0.9))
const accentSoft2 = computed(() => tint(formData.accentColor, 0.82))
const accentDark = computed(() => shade(formData.accentColor, -0.35))
const accentVars = computed(() => ({
  '--accent': formData.accentColor,
  '--accent-soft': accentSoft.value,
  '--accent-soft2': accentSoft2.value,
  '--accent-dark': accentDark.value,
}))

// Fixed "real" preview size (looks identical to desktop everywhere),
// scaled down visually with CSS transform to fit any screen width.
const PREVIEW_WIDTH = 700
const PREVIEW_HEIGHT = Math.round(PREVIEW_WIDTH * 1.414)
const previewWrapRef = ref<HTMLDivElement | null>(null)
const previewScale = ref(1)
let resizeObserver: ResizeObserver | null = null

const updatePreviewScale = () => {
  if (!previewWrapRef.value) return
  const w = previewWrapRef.value.clientWidth
  if (w > 0) previewScale.value = w / PREVIEW_WIDTH
}

// Load saved data
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      Object.assign(formData, parsed)
    } catch (e) {
      console.error('Error parsing resume data', e)
    }
  }

  updatePreviewScale()
  if (previewWrapRef.value) {
    resizeObserver = new ResizeObserver(() => updatePreviewScale())
    resizeObserver.observe(previewWrapRef.value)
  }
  window.addEventListener('resize', updatePreviewScale)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', updatePreviewScale)
})

// Recalculate when opening the mobile preview overlay (element becomes visible)
watch(showPreviewMobile, async () => {
  await nextTick()
  updatePreviewScale()
})

// Auto-save on change
watch(
  () => formData,
  (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
  },
  { deep: true },
)

const loadDemo = () => {
  Object.assign(formData, demoResume)
}

const clearAll = () => {
  if (confirm('Are you sure you want to clear all data?')) {
    Object.assign(formData, defaultResume)
    localStorage.removeItem(STORAGE_KEY)
  }
}

// Add/Remove experience
const addExperience = () => {
  formData.experience.push({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
  })
}
const removeExperience = (index: number) => {
  formData.experience.splice(index, 1)
}

// Add/Remove education
const addEducation = () => {
  formData.education.push({ school: '', degree: '', startDate: '', endDate: '', description: '' })
}
const removeEducation = (index: number) => {
  formData.education.splice(index, 1)
}

// Image upload helper
const fileInput = ref<HTMLInputElement | null>(null)
const triggerPhotoUpload = () => {
  fileInput.value?.click()
}
const onPhotoSelected = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    if (file.size > 1024 * 1024) {
      alert('Photo size must be under 1MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      formData.photo = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}
const removePhoto = () => {
  formData.photo = null
}

// PDF Export
const downloadPDF = async () => {
  const savedScale = previewScale.value
  const wasPreviewOpen = showPreviewMobile.value
  try {
    isExporting.value = true

    // On mobile the preview is hidden (display:none) until opened — html2canvas
    // can't capture a hidden element, so make sure it's visible first.
    if (isCompactLayout.value && !wasPreviewOpen) {
      showPreviewMobile.value = true
      await nextTick()
    }

    const html2Canvas = (await import('html2canvas')).default
    const { jsPDF } = await import('jspdf')

    const element = previewRef.value
    if (!element) return

    // Render at full (unscaled) resolution for a crisp, correctly proportioned PDF
    previewScale.value = 1
    await nextTick()
    await nextTick()

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready
    }

    const canvas = await html2Canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    const name = formData.fullname ? formData.fullname.replace(/\s+/g, '_') : 'Resume'
    pdf.save(`${name}_Resume.pdf`)
  } catch (err) {
    console.error(err)
    alert('An error occurred while generating the PDF')
  } finally {
    if (isCompactLayout.value && !wasPreviewOpen) {
      showPreviewMobile.value = false
    }
    previewScale.value = savedScale
    isExporting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Top Action Bar -->
      <div
        class="bg-white rounded-2xl shadow-sm p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-100"
      >
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Resume Builder
          </h1>
          <p class="text-slate-500 mt-1">
            Fill in professional templates and download your resume as PDF
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="loadDemo"
            class="px-4 py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-100 transition flex items-center gap-2 text-sm shadow-sm"
          >
            <q-icon name="mdi-lightning-bolt" size="18px" />
            Load Sample
          </button>
          <button
            @click="clearAll"
            class="px-4 py-2.5 bg-red-50 text-red-700 font-semibold rounded-xl hover:bg-red-100 transition flex items-center gap-2 text-sm shadow-sm"
          >
            <q-icon name="mdi-trash-can-outline" size="18px" />
            Clear All
          </button>
          <button
            @click="showDonateDialog = true"
            :disabled="isExporting"
            class="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400 transition flex items-center gap-2 text-sm shadow-md"
          >
            <q-icon v-if="isExporting" name="mdi-loading" class="animate-spin" size="18px" />
            <q-icon v-else name="mdi-download" size="18px" />
            Download PDF
          </button>
        </div>
      </div>

      <!-- Main Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <!-- Left: Forms -->
        <div class="space-y-6">
          <!-- Template Selection Card -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-2 h-6 bg-indigo-600 rounded-full inline-block"></span>
              Choose Template
            </h3>
            <!-- Mobile: stacked card carousel with live preview thumbnails -->
            <TemplatePickerCarousel
              v-if="isCompactLayout"
              v-model="activeTemplate"
              :templates="resumeTemplates"
              class="mb-6"
            >
              <template #thumb="{ id }">
                <div class="accent-scope h-full" :style="accentVars">
                  <ResumeTemplateRender :template="id" :data="formData" />
                </div>
              </template>
            </TemplatePickerCarousel>

            <!-- Desktop/tablet: original button grid -->
            <div v-else class="grid grid-cols-3 gap-3 mb-6">
              <button
                @click="activeTemplate = 'modern'"
                :class="[
                  activeTemplate === 'modern'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                ]"
                class="px-2 py-3 border-2 rounded-xl text-center text-xs sm:text-sm transition"
              >
                Modern Minimalist
              </button>
              <button
                @click="activeTemplate = 'classic'"
                :class="[
                  activeTemplate === 'classic'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                ]"
                class="px-2 py-3 border-2 rounded-xl text-center text-xs sm:text-sm transition"
              >
                Classic Professional
              </button>
              <button
                @click="activeTemplate = 'creative'"
                :class="[
                  activeTemplate === 'creative'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                ]"
                class="px-2 py-3 border-2 rounded-xl text-center text-xs sm:text-sm transition"
              >
                Creative Accent
              </button>
              <button
                @click="activeTemplate = 'minimal'"
                :class="[
                  activeTemplate === 'minimal'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                ]"
                class="px-2 py-3 border-2 rounded-xl text-center text-xs sm:text-sm transition"
              >
                Minimal Lines
              </button>
              <button
                @click="activeTemplate = 'sidebar-right'"
                :class="[
                  activeTemplate === 'sidebar-right'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                ]"
                class="px-2 py-3 border-2 rounded-xl text-center text-xs sm:text-sm transition"
              >
                Sidebar Right
              </button>
              <button
                @click="activeTemplate = 'timeline'"
                :class="[
                  activeTemplate === 'timeline'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                ]"
                class="px-2 py-3 border-2 rounded-xl text-center text-xs sm:text-sm transition"
              >
                Elegant Timeline
              </button>
              <button
                @click="activeTemplate = 'bold-header'"
                :class="[
                  activeTemplate === 'bold-header'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                ]"
                class="px-2 py-3 border-2 rounded-xl text-center text-xs sm:text-sm transition"
              >
                Bold Header
              </button>
              <button
                @click="activeTemplate = 'executive-photo'"
                :class="[
                  activeTemplate === 'executive-photo'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                ]"
                class="px-2 py-3 border-2 rounded-xl text-center text-xs sm:text-sm transition"
              >
                Executive Photo
              </button>
              <button
                @click="activeTemplate = 'professional-icons'"
                :class="[
                  activeTemplate === 'professional-icons'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                ]"
                class="px-2 py-3 border-2 rounded-xl text-center text-xs sm:text-sm transition"
              >
                Professional Icons
              </button>
            </div>

            <!-- Accent Color Picker -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >Accent Color</label
              >
              <div class="flex items-center gap-2.5 flex-wrap">
                <button
                  v-for="color in accentSwatches"
                  :key="color"
                  type="button"
                  @click="formData.accentColor = color"
                  class="w-8 h-8 rounded-full border-2 transition flex items-center justify-center"
                  :style="{
                    background: color,
                    borderColor: formData.accentColor === color ? '#1e293b' : 'transparent',
                  }"
                >
                  <q-icon
                    v-if="formData.accentColor === color"
                    name="mdi-check"
                    color="white"
                    size="16px"
                  />
                </button>
                <input
                  v-model="formData.accentColor"
                  type="color"
                  class="w-8 h-8 rounded-full border-2 border-slate-200 cursor-pointer bg-transparent p-0"
                  title="Custom color"
                />
              </div>
            </div>
          </div>

          <!-- General Information -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-2 h-6 bg-indigo-600 rounded-full inline-block"></span>
              Personal Information
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2 flex items-center gap-4 border-b border-slate-100 pb-4">
                <div
                  @click="triggerPhotoUpload"
                  class="w-20 h-20 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/20 transition overflow-hidden relative group"
                >
                  <img
                    v-if="formData.photo"
                    :src="formData.photo"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="text-center text-slate-400">
                    <q-icon name="mdi-camera-outline" size="24px" />
                    <span class="text-[10px] block mt-0.5">Photo 3x4</span>
                  </div>
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="onPhotoSelected"
                  />
                </div>
                <div v-if="formData.photo" class="space-y-1">
                  <span class="text-sm font-semibold text-slate-700">Profile photo uploaded</span>
                  <button
                    @click="removePhoto"
                    class="block text-xs font-semibold text-red-600 hover:text-red-700"
                  >
                    Remove photo
                  </button>
                </div>
                <div v-else class="text-xs text-slate-500">
                  This photo will appear in the relevant spot on your resume (max: 1MB).
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                  >Full Name</label
                >
                <input
                  v-model="formData.fullname"
                  type="text"
                  placeholder="e.g. John Smith"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm text-slate-800"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                  >Job Title</label
                >
                <input
                  v-model="formData.title"
                  type="text"
                  placeholder="e.g. Senior Frontend Developer"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm text-slate-800"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                  >Email</label
                >
                <input
                  v-model="formData.email"
                  type="email"
                  placeholder="example@email.com"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm text-slate-800"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                  >Phone Number</label
                >
                <input
                  v-model="formData.phone"
                  type="text"
                  placeholder="+1 555 123 4567"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm text-slate-800"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                  >Address</label
                >
                <input
                  v-model="formData.address"
                  type="text"
                  placeholder="New York, USA"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm text-slate-800"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                  >Website / Portfolio</label
                >
                <input
                  v-model="formData.website"
                  type="text"
                  placeholder="github.com/profile"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm text-slate-800"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                  >Summary</label
                >
                <textarea
                  v-model="formData.summary"
                  rows="3"
                  placeholder="A short overview of your background, experience and goals..."
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm text-slate-800"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Skills and Languages -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-2 h-6 bg-indigo-600 rounded-full inline-block"></span>
              Skills & Languages
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                  >Professional Skills (comma-separated)</label
                >
                <input
                  v-model="formData.skills"
                  type="text"
                  placeholder="HTML, CSS, JavaScript, Vue"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm text-slate-800"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                  >Languages (comma-separated)</label
                >
                <input
                  v-model="formData.languages"
                  type="text"
                  placeholder="English, Spanish, French"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm text-slate-800"
                />
              </div>
            </div>
          </div>

          <!-- Experience Section -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span class="w-2 h-6 bg-indigo-600 rounded-full inline-block"></span>
                Work Experience
              </h3>
              <button
                @click="addExperience"
                class="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 text-xs transition flex items-center gap-1"
              >
                <q-icon name="mdi-plus" size="14px" /> Add
              </button>
            </div>

            <div
              v-if="formData.experience.length === 0"
              class="text-center py-6 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl text-sm"
            >
              No work experience added
            </div>

            <div
              v-for="(exp, index) in formData.experience"
              :key="index"
              class="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4 relative"
            >
              <button
                @click="removeExperience(index)"
                class="absolute top-3 right-3 text-red-500 hover:text-red-700 transition"
              >
                <q-icon name="mdi-close" size="18px" />
              </button>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div>
                  <label
                    class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1"
                    >Company / Organization</label
                  >
                  <input
                    v-model="exp.company"
                    type="text"
                    placeholder="e.g. Soft LLC"
                    class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1"
                    >Position</label
                  >
                  <input
                    v-model="exp.position"
                    type="text"
                    placeholder="e.g. Frontend Developer"
                    class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1"
                    >Start Date</label
                  >
                  <input
                    v-model="exp.startDate"
                    type="text"
                    placeholder="e.g. 2021-06"
                    class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1"
                    >End Date (or Present)</label
                  >
                  <input
                    v-model="exp.endDate"
                    type="text"
                    placeholder="e.g. Present"
                    class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div class="md:col-span-2">
                  <label
                    class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1"
                    >Responsibilities & Achievements</label
                  >
                  <textarea
                    v-model="exp.description"
                    rows="2"
                    placeholder="Project highlights, what you accomplished..."
                    class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Education Section -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span class="w-2 h-6 bg-indigo-600 rounded-full inline-block"></span>
                Education
              </h3>
              <button
                @click="addEducation"
                class="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 text-xs transition flex items-center gap-1"
              >
                <q-icon name="mdi-plus" size="14px" /> Add
              </button>
            </div>

            <div
              v-if="formData.education.length === 0"
              class="text-center py-6 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl text-sm"
            >
              No education added
            </div>

            <div
              v-for="(edu, index) in formData.education"
              :key="index"
              class="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4 relative"
            >
              <button
                @click="removeEducation(index)"
                class="absolute top-3 right-3 text-red-500 hover:text-red-700 transition"
              >
                <q-icon name="mdi-close" size="18px" />
              </button>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div>
                  <label
                    class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1"
                    >School / University</label
                  >
                  <input
                    v-model="edu.school"
                    type="text"
                    placeholder="e.g. MIT"
                    class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1"
                    >Degree</label
                  >
                  <input
                    v-model="edu.degree"
                    type="text"
                    placeholder="e.g. Software Engineering (BSc)"
                    class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1"
                    >Start Year</label
                  >
                  <input
                    v-model="edu.startDate"
                    type="text"
                    placeholder="e.g. 2017"
                    class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1"
                    >End Year (or In Progress)</label
                  >
                  <input
                    v-model="edu.endDate"
                    type="text"
                    placeholder="e.g. 2021"
                    class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div class="md:col-span-2">
                  <label
                    class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1"
                    >Additional Info (Optional)</label
                  >
                  <textarea
                    v-model="edu.description"
                    rows="2"
                    placeholder="Coursework, certificates..."
                    class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Live Preview -->
        <div
          class="space-y-4"
          :class="
            isCompactLayout
              ? showPreviewMobile
                ? 'mobile-preview-overlay'
                : 'hidden'
              : 'lg:sticky lg:top-8'
          "
        >
          <!-- Mobile overlay top bar with a clear Back button -->
          <div v-if="isCompactLayout && showPreviewMobile" class="preview-overlay-bar">
            <button type="button" class="back-btn" @click="showPreviewMobile = false">
              <q-icon name="mdi-arrow-left" size="20px" />
              <span>Back</span>
            </button>
            <span
              class="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-semibold"
              >A4 Format (210mm)</span
            >
          </div>

          <div v-else class="flex items-center justify-between px-2">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider"
              >Live Resume Preview</span
            >
            <span
              class="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-semibold"
              >A4 Format (210mm)</span
            >
          </div>

          <!-- A4 Template Wrapper: rendered at a fixed "real" size, then visually
               scaled to fit the column width — looks identical on mobile and desktop -->
          <div
            ref="previewWrapRef"
            class="w-full"
            :style="{ height: PREVIEW_HEIGHT * previewScale + 'px' }"
          >
            <div
              class="accent-scope bg-white shadow-xl border border-slate-200 overflow-hidden"
              :style="[
                {
                  width: PREVIEW_WIDTH + 'px',
                  height: PREVIEW_HEIGHT + 'px',
                  transform: 'scale(' + previewScale + ')',
                  transformOrigin: 'top left',
                },
                accentVars,
              ]"
              ref="previewRef"
            >
              <ResumeTemplateRender :template="activeTemplate" :data="formData" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile floating preview button -->
    <q-btn
      v-if="isCompactLayout && !showPreviewMobile"
      color="indigo-6"
      icon="mdi-eye-outline"
      label="Preview"
      unelevated
      rounded
      class="mobile-preview-fab"
      @click="showPreviewMobile = true"
    />
  </div>

  <DonateDialog v-model="showDonateDialog" @confirm="downloadPDF" />
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Outfit:wght@400;600;800;900&family=Georgia&display=swap');

.animate-spin {
  animation: spin 1s linear infinite;
}

.mobile-preview-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 5000;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  padding: 12px 20px !important;
  font-weight: 700 !important;
}

.mobile-preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 5001;
  background: #f8fafc;
  overflow-y: auto;
  padding: 0 16px 16px;
}

.preview-overlay-bar {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  padding: 12px 0;
  margin: 0 -16px;
  padding-left: 16px;
  padding-right: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 6px 10px 6px 4px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  cursor: pointer;
  transition: background 0.15s;
}

.back-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
