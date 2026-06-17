<script setup lang="ts">
import { reactive, ref, onMounted, watch, computed } from 'vue'
import { useQuasar } from 'quasar'
import DonateDialog from '@/components/DonateDialog.vue'

const $q = useQuasar()
const mobileTab = ref<'form' | 'preview'>('form')
const showDonateDialog = ref(false)

// Color helpers for accent theming
function hexToRgb(hex: string) {
  const clean = hex.replace('#', '')
  const bigint = parseInt(clean, 16)
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 }
}
function tint(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex)
  const nr = Math.round(r + (255 - r) * amount)
  const ng = Math.round(g + (255 - g) * amount)
  const nb = Math.round(b + (255 - b) * amount)
  return `rgb(${nr}, ${ng}, ${nb})`
}
function shade(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex)
  const nr = Math.round(r * (1 + amount))
  const ng = Math.round(g * (1 + amount))
  const nb = Math.round(b * (1 + amount))
  return `rgb(${Math.max(0, nr)}, ${Math.max(0, ng)}, ${Math.max(0, nb)})`
}

const accentSwatches = ['#4f46e5', '#2563eb', '#0d9488', '#16a34a', '#d97706', '#dc2626', '#db2777', '#475569']

interface Experience {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

interface Education {
  school: string
  degree: string
  startDate: string
  endDate: string
  description: string
}

interface ResumeData {
  fullname: string
  title: string
  photo: string | null
  email: string
  phone: string
  address: string
  website: string
  summary: string
  skills: string
  languages: string
  experience: Experience[]
  education: Education[]
  accentColor: string
}

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
  summary: 'Senior Frontend Developer with 5+ years of experience. Specialist in Vue.js, React, TypeScript and modern web technologies. Focused on building high-quality, fast interfaces.',
  skills: 'JavaScript, TypeScript, Vue 3, React, Pinia, Tailwind CSS, Quasar, Webpack, Vite, Git, REST API',
  languages: 'English (native), Spanish (fluent), French (intermediate)',
  experience: [
    {
      company: 'Digital Solutions LLC',
      position: 'Senior Frontend Developer',
      startDate: '2023-01',
      endDate: 'Present',
      description: 'Developed and optimized a large-scale ERP system using Vue 3 and TypeScript. Reduced load time by 40% and built a design system from scratch.'
    },
    {
      company: 'Soft Innovation',
      position: 'Mid Web Developer',
      startDate: '2021-02',
      endDate: '2022-12',
      description: 'Successfully delivered 10+ e-commerce sites and SaaS projects using React and Redux.'
    }
  ],
  education: [
    {
      school: 'State University of Technology',
      degree: 'Computer Engineering (Bachelor)',
      startDate: '2017',
      endDate: '2021',
      description: 'In-depth study of computer science and programming fundamentals.'
    }
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
})

// Auto-save on change
watch(
  () => formData,
  (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
  },
  { deep: true }
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
  formData.experience.push({ company: '', position: '', startDate: '', endDate: '', description: '' })
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
  try {
    isExporting.value = true
    const html2Canvas = (await import('html2canvas')).default
    const { jsPDF } = await import('jspdf')

    const element = previewRef.value
    if (!element) return

    const canvas = await html2Canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
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
    isExporting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto">

      <!-- Top Action Bar -->
      <div class="bg-white rounded-2xl shadow-sm p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-100">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Resume Builder</h1>
          <p class="text-slate-500 mt-1">Fill in professional templates and download your resume as PDF</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <button @click="loadDemo" class="px-4 py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-100 transition flex items-center gap-2 text-sm shadow-sm">
            <q-icon name="mdi-lightning-bolt" size="18px" />
            Load Sample
          </button>
          <button @click="clearAll" class="px-4 py-2.5 bg-red-50 text-red-700 font-semibold rounded-xl hover:bg-red-100 transition flex items-center gap-2 text-sm shadow-sm">
            <q-icon name="mdi-trash-can-outline" size="18px" />
            Clear All
          </button>
          <button @click="showDonateDialog = true" :disabled="isExporting" class="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400 transition flex items-center gap-2 text-sm shadow-md">
            <q-icon v-if="isExporting" name="mdi-loading" class="animate-spin" size="18px" />
            <q-icon v-else name="mdi-download" size="18px" />
            Download PDF
          </button>
        </div>
      </div>

      <!-- Mobile Tab Switcher -->
      <div v-if="$q.screen.lt.lg" class="flex gap-2 mb-4">
        <button
          @click="mobileTab = 'form'"
          :class="mobileTab === 'form' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'"
          class="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition"
        >
          <q-icon name="mdi-pencil-outline" size="16px" /> Fill In
        </button>
        <button
          @click="mobileTab = 'preview'"
          :class="mobileTab === 'preview' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'"
          class="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition"
        >
          <q-icon name="mdi-eye-outline" size="16px" /> Preview
        </button>
      </div>

      <!-- Main Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        <!-- Left: Forms -->
        <div class="space-y-6" :class="{ 'hidden': $q.screen.lt.lg && mobileTab !== 'form' }">

          <!-- Template Selection Card -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-2 h-6 bg-indigo-600 rounded-full inline-block"></span>
              Choose Template
            </h3>
            <div class="grid grid-cols-3 gap-3 mb-6">
              <button
                @click="activeTemplate = 'modern'"
                :class="[activeTemplate === 'modern' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50']"
                class="px-3 py-3 border-2 rounded-xl text-center text-sm transition"
              >
                Modern Minimalist
              </button>
              <button
                @click="activeTemplate = 'classic'"
                :class="[activeTemplate === 'classic' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50']"
                class="px-3 py-3 border-2 rounded-xl text-center text-sm transition"
              >
                Classic Professional
              </button>
              <button
                @click="activeTemplate = 'creative'"
                :class="[activeTemplate === 'creative' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50']"
                class="px-3 py-3 border-2 rounded-xl text-center text-sm transition"
              >
                Creative Accent
              </button>
              <button
                @click="activeTemplate = 'minimal'"
                :class="[activeTemplate === 'minimal' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50']"
                class="px-3 py-3 border-2 rounded-xl text-center text-sm transition"
              >
                Minimal Lines
              </button>
              <button
                @click="activeTemplate = 'sidebar-right'"
                :class="[activeTemplate === 'sidebar-right' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50']"
                class="px-3 py-3 border-2 rounded-xl text-center text-sm transition"
              >
                Sidebar Right
              </button>
            </div>

            <!-- Accent Color Picker -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Accent Color</label>
              <div class="flex items-center gap-2.5 flex-wrap">
                <button
                  v-for="color in accentSwatches"
                  :key="color"
                  type="button"
                  @click="formData.accentColor = color"
                  class="w-8 h-8 rounded-full border-2 transition flex items-center justify-center"
                  :style="{ background: color, borderColor: formData.accentColor === color ? '#1e293b' : 'transparent' }"
                >
                  <q-icon v-if="formData.accentColor === color" name="mdi-check" color="white" size="16px" />
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
                <div @click="triggerPhotoUpload" class="w-20 h-20 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/20 transition overflow-hidden relative group">
                  <img v-if="formData.photo" :src="formData.photo" class="w-full h-full object-cover" />
                  <div v-else class="text-center text-slate-400">
                    <q-icon name="mdi-camera-outline" size="24px" />
                    <span class="text-[10px] block mt-0.5">Photo 3x4</span>
                  </div>
                  <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onPhotoSelected" />
                </div>
                <div v-if="formData.photo" class="space-y-1">
                  <span class="text-sm font-semibold text-slate-700">Profile photo uploaded</span>
                  <button @click="removePhoto" class="block text-xs font-semibold text-red-600 hover:text-red-700">Remove photo</button>
                </div>
                <div v-else class="text-xs text-slate-500">
                  This photo will appear in the relevant spot on your resume (max: 1MB).
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
                <input v-model="formData.fullname" type="text" placeholder="e.g. John Smith" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Job Title</label>
                <input v-model="formData.title" type="text" placeholder="e.g. Senior Frontend Developer" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email</label>
                <input v-model="formData.email" type="email" placeholder="example@email.com" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Phone Number</label>
                <input v-model="formData.phone" type="text" placeholder="+1 555 123 4567" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Address</label>
                <input v-model="formData.address" type="text" placeholder="New York, USA" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Website / Portfolio</label>
                <input v-model="formData.website" type="text" placeholder="github.com/profile" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Summary</label>
                <textarea v-model="formData.summary" rows="3" placeholder="A short overview of your background, experience and goals..." class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm text-slate-800"></textarea>
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
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Professional Skills (comma-separated)</label>
                <input v-model="formData.skills" type="text" placeholder="HTML, CSS, JavaScript, Vue" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Languages (comma-separated)</label>
                <input v-model="formData.languages" type="text" placeholder="English, Spanish, French" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm text-slate-800" />
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
              <button @click="addExperience" class="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 text-xs transition flex items-center gap-1">
                <q-icon name="mdi-plus" size="14px" /> Add
              </button>
            </div>

            <div v-if="formData.experience.length === 0" class="text-center py-6 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl text-sm">
              No work experience added
            </div>

            <div v-for="(exp, index) in formData.experience" :key="index" class="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4 relative">
              <button @click="removeExperience(index)" class="absolute top-3 right-3 text-red-500 hover:text-red-700 transition">
                <q-icon name="mdi-close" size="18px" />
              </button>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Company / Organization</label>
                  <input v-model="exp.company" type="text" placeholder="e.g. Soft LLC" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Position</label>
                  <input v-model="exp.position" type="text" placeholder="e.g. Frontend Developer" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Start Date</label>
                  <input v-model="exp.startDate" type="text" placeholder="e.g. 2021-06" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">End Date (or Present)</label>
                  <input v-model="exp.endDate" type="text" placeholder="e.g. Present" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500" />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Responsibilities & Achievements</label>
                  <textarea v-model="exp.description" rows="2" placeholder="Project highlights, what you accomplished..." class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"></textarea>
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
              <button @click="addEducation" class="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 text-xs transition flex items-center gap-1">
                <q-icon name="mdi-plus" size="14px" /> Add
              </button>
            </div>

            <div v-if="formData.education.length === 0" class="text-center py-6 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl text-sm">
              No education added
            </div>

            <div v-for="(edu, index) in formData.education" :key="index" class="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4 relative">
              <button @click="removeEducation(index)" class="absolute top-3 right-3 text-red-500 hover:text-red-700 transition">
                <q-icon name="mdi-close" size="18px" />
              </button>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">School / University</label>
                  <input v-model="edu.school" type="text" placeholder="e.g. MIT" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Degree</label>
                  <input v-model="edu.degree" type="text" placeholder="e.g. Software Engineering (BSc)" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Start Year</label>
                  <input v-model="edu.startDate" type="text" placeholder="e.g. 2017" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">End Year (or In Progress)</label>
                  <input v-model="edu.endDate" type="text" placeholder="e.g. 2021" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500" />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Additional Info (Optional)</label>
                  <textarea v-model="edu.description" rows="2" placeholder="Coursework, certificates..." class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500"></textarea>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Right: Live Preview -->
        <div class="lg:sticky lg:top-8 space-y-4" :class="{ 'hidden': $q.screen.lt.lg && mobileTab !== 'preview' }">
          <div class="flex items-center justify-between px-2">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Resume Preview</span>
            <span class="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-semibold">A4 Format (210mm)</span>
          </div>

          <!-- A4 Template Wrapper -->
          <div
            class="accent-scope bg-white shadow-xl border border-slate-200 overflow-hidden w-full"
            :style="{ aspectRatio: '1 / 1.414', '--accent': formData.accentColor, '--accent-soft': accentSoft, '--accent-soft2': accentSoft2, '--accent-dark': accentDark }"
            ref="previewRef"
          >

            <!-- TEMPLATE 1: Modern Minimalist -->
            <div v-if="activeTemplate === 'modern'" class="h-full grid grid-cols-12 text-slate-800 bg-white" style="font-family: 'Inter', sans-serif;">
              <!-- Sidebar -->
              <div class="col-span-4 bg-slate-900 text-slate-100 p-6 flex flex-col justify-between h-full">
                <div>
                  <!-- Profile Photo -->
                  <div class="flex justify-center mb-6">
                    <img v-if="formData.photo" :src="formData.photo" class="w-24 h-24 rounded-full object-cover border-2 border-slate-700 shadow-md" />
                    <div v-else class="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-400 text-xs">
                      No Photo
                    </div>
                  </div>

                  <!-- Contact details -->
                  <h4 class="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 pb-1 border-b border-slate-800">Contact</h4>
                  <ul class="space-y-3.5 text-xs text-slate-300">
                    <li v-if="formData.phone" class="flex items-start gap-2">
                      <q-icon name="mdi-phone" class="text-indigo-400 mt-0.5" size="14px" />
                      <span class="break-all">{{ formData.phone }}</span>
                    </li>
                    <li v-if="formData.email" class="flex items-start gap-2">
                      <q-icon name="mdi-email" class="text-indigo-400 mt-0.5" size="14px" />
                      <span class="break-all">{{ formData.email }}</span>
                    </li>
                    <li v-if="formData.address" class="flex items-start gap-2">
                      <q-icon name="mdi-map-marker" class="text-indigo-400 mt-0.5" size="14px" />
                      <span>{{ formData.address }}</span>
                    </li>
                    <li v-if="formData.website" class="flex items-start gap-2">
                      <q-icon name="mdi-web" class="text-indigo-400 mt-0.5" size="14px" />
                      <span class="break-all">{{ formData.website }}</span>
                    </li>
                  </ul>

                  <!-- Skills details -->
                  <h4 class="text-xs font-bold uppercase tracking-widest text-indigo-400 mt-8 mb-3 pb-1 border-b border-slate-800">Skills</h4>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="skill in formData.skills.split(',').map(s => s.trim()).filter(Boolean)" :key="skill" class="text-[10px] bg-slate-800 text-slate-200 px-2 py-0.5 rounded font-mono">
                      {{ skill }}
                    </span>
                    <span v-if="!formData.skills" class="text-xs text-slate-500 italic">Not provided</span>
                  </div>

                  <!-- Languages details -->
                  <h4 class="text-xs font-bold uppercase tracking-widest text-indigo-400 mt-8 mb-3 pb-1 border-b border-slate-800">Languages</h4>
                  <p class="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{{ formData.languages || 'Not provided' }}</p>
                </div>

                <div class="text-[10px] text-slate-600 text-center border-t border-slate-800 pt-3">
                  Modern Minimalist
                </div>
              </div>

              <!-- Main Content -->
              <div class="col-span-8 p-8 flex flex-col justify-between h-full bg-slate-50/30">
                <div>
                  <!-- Header Name / Title -->
                  <div class="mb-6">
                    <h2 class="text-3xl font-extrabold text-slate-900 leading-tight">{{ formData.fullname || 'Enter Full Name' }}</h2>
                    <p class="text-sm font-bold text-indigo-600 uppercase tracking-wider mt-1">{{ formData.title || 'Job Title' }}</p>
                  </div>

                  <!-- Summary Section -->
                  <div v-if="formData.summary" class="mb-6">
                    <p class="text-xs text-slate-600 leading-relaxed italic">{{ formData.summary }}</p>
                  </div>

                  <!-- Experience Section -->
                  <div class="mb-6">
                    <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-1">Experience</h3>
                    <div class="space-y-4">
                      <div v-for="(exp, idx) in formData.experience" :key="idx" class="text-xs">
                        <div class="flex justify-between items-start">
                          <div>
                            <h4 class="font-bold text-slate-800 text-sm">{{ exp.position }}</h4>
                            <p class="text-slate-600 font-semibold">{{ exp.company }}</p>
                          </div>
                          <span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{{ exp.startDate }} - {{ exp.endDate }}</span>
                        </div>
                        <p class="text-slate-500 mt-1 text-[11px] leading-relaxed whitespace-pre-wrap">{{ exp.description }}</p>
                      </div>
                      <p v-if="formData.experience.length === 0" class="text-xs text-slate-400 italic">No experience added</p>
                    </div>
                  </div>

                  <!-- Education Section -->
                  <div>
                    <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-1">Education</h3>
                    <div class="space-y-4">
                      <div v-for="(edu, idx) in formData.education" :key="idx" class="text-xs">
                        <div class="flex justify-between items-start">
                          <div>
                            <h4 class="font-bold text-slate-800 text-sm">{{ edu.degree }}</h4>
                            <p class="text-slate-600 font-semibold">{{ edu.school }}</p>
                          </div>
                          <span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{{ edu.startDate }} - {{ edu.endDate }}</span>
                        </div>
                        <p v-if="edu.description" class="text-slate-500 mt-1 text-[11px] leading-relaxed whitespace-pre-wrap">{{ edu.description }}</p>
                      </div>
                      <p v-if="formData.education.length === 0" class="text-xs text-slate-400 italic">No education added</p>
                    </div>
                  </div>
                </div>

                <div class="text-[10px] text-slate-400 text-right">
                  Generated as PDF
                </div>
              </div>
            </div>

            <!-- TEMPLATE 2: Classic Professional -->
            <div v-else-if="activeTemplate === 'classic'" class="h-full p-8 flex flex-col justify-between text-slate-800 bg-white" style="font-family: 'Georgia', serif;">
              <div>
                <!-- Top Centered Header -->
                <div class="text-center pb-4 border-b-2 border-slate-800 mb-6">
                  <h2 class="text-3xl font-extrabold tracking-wide text-slate-900">{{ formData.fullname || 'Enter Full Name' }}</h2>
                  <p class="text-xs font-bold uppercase tracking-widest text-indigo-700 mt-1.5" style="font-family: sans-serif;">{{ formData.title || 'Job Title' }}</p>

                  <!-- Contact line -->
                  <div class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500 mt-3 font-sans">
                    <span v-if="formData.email"><q-icon name="mdi-email" /> {{ formData.email }}</span>
                    <span v-if="formData.phone"><q-icon name="mdi-phone" /> {{ formData.phone }}</span>
                    <span v-if="formData.address"><q-icon name="mdi-map-marker" /> {{ formData.address }}</span>
                    <span v-if="formData.website"><q-icon name="mdi-web" /> {{ formData.website }}</span>
                  </div>
                </div>

                <!-- Professional Summary -->
                <div v-if="formData.summary" class="mb-6">
                  <h3 class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-2 font-sans border-b border-slate-200 pb-1">Summary</h3>
                  <p class="text-xs text-slate-700 leading-relaxed text-justify">{{ formData.summary }}</p>
                </div>

                <!-- Experience Section -->
                <div class="mb-6">
                  <h3 class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-3 font-sans border-b border-slate-200 pb-1">Experience</h3>
                  <div class="space-y-4">
                    <div v-for="(exp, idx) in formData.experience" :key="idx" class="text-xs">
                      <div class="flex justify-between items-baseline font-sans">
                        <div class="flex gap-2">
                          <strong class="text-slate-900 text-sm font-serif">{{ exp.position }}</strong>
                          <span class="text-slate-500">|</span>
                          <span class="text-slate-700 font-medium">{{ exp.company }}</span>
                        </div>
                        <span class="text-[10px] text-slate-600 font-semibold">{{ exp.startDate }} — {{ exp.endDate }}</span>
                      </div>
                      <p class="text-slate-600 mt-1.5 text-[11px] leading-relaxed text-justify whitespace-pre-wrap">{{ exp.description }}</p>
                    </div>
                    <p v-if="formData.experience.length === 0" class="text-xs text-slate-400 italic font-sans">No experience added</p>
                  </div>
                </div>

                <!-- Education Section -->
                <div class="mb-6">
                  <h3 class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-3 font-sans border-b border-slate-200 pb-1">Education</h3>
                  <div class="space-y-3">
                    <div v-for="(edu, idx) in formData.education" :key="idx" class="text-xs">
                      <div class="flex justify-between items-baseline font-sans">
                        <div class="flex gap-2">
                          <strong class="text-slate-900 text-sm font-serif">{{ edu.degree }}</strong>
                          <span class="text-slate-500">|</span>
                          <span class="text-slate-700 font-medium">{{ edu.school }}</span>
                        </div>
                        <span class="text-[10px] text-slate-600 font-semibold">{{ edu.startDate }} — {{ edu.endDate }}</span>
                      </div>
                      <p v-if="edu.description" class="text-slate-600 mt-1 text-[11px] leading-relaxed whitespace-pre-wrap">{{ edu.description }}</p>
                    </div>
                    <p v-if="formData.education.length === 0" class="text-xs text-slate-400 italic font-sans">No education added</p>
                  </div>
                </div>

                <!-- Grid of Skills and Languages -->
                <div class="grid grid-cols-2 gap-6">
                  <div>
                    <h3 class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-2 font-sans border-b border-slate-200 pb-1">Skills</h3>
                    <p class="text-xs text-slate-700 leading-relaxed font-sans">{{ formData.skills || 'Not provided' }}</p>
                  </div>
                  <div>
                    <h3 class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-2 font-sans border-b border-slate-200 pb-1">Languages</h3>
                    <p class="text-xs text-slate-700 leading-relaxed font-sans">{{ formData.languages || 'Not provided' }}</p>
                  </div>
                </div>
              </div>

              <div class="text-[10px] text-slate-400 text-center font-sans">
                Professional Classic Template
              </div>
            </div>

            <!-- TEMPLATE 3: Creative Accent -->
            <div v-else-if="activeTemplate === 'creative'" class="h-full flex flex-col justify-between text-slate-800 bg-white" style="font-family: 'Outfit', sans-serif;">
              <div>
                <!-- Colorful top banner header -->
                <div class="text-white p-6 relative" :style="{ background: 'linear-gradient(to right, ' + formData.accentColor + ', ' + accentDark + ')' }">
                  <div class="flex justify-between items-start gap-4">
                    <div>
                      <h2 class="text-2xl font-black tracking-wide">{{ formData.fullname || 'Enter Full Name' }}</h2>
                      <p class="text-xs font-semibold text-indigo-200 uppercase tracking-widest mt-1">{{ formData.title || 'Job Title' }}</p>

                      <!-- Contact details small grid -->
                      <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-indigo-100 mt-4 font-mono">
                        <span v-if="formData.email" class="truncate"><q-icon name="mdi-email" /> {{ formData.email }}</span>
                        <span v-if="formData.phone"><q-icon name="mdi-phone" /> {{ formData.phone }}</span>
                        <span v-if="formData.address"><q-icon name="mdi-map-marker" /> {{ formData.address }}</span>
                        <span v-if="formData.website" class="truncate"><q-icon name="mdi-web" /> {{ formData.website }}</span>
                      </div>
                    </div>

                    <!-- Small round image -->
                    <div v-if="formData.photo" class="w-16 h-16 rounded-full border-2 border-indigo-500 overflow-hidden flex-shrink-0 bg-slate-900 shadow-md">
                      <img :src="formData.photo" class="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <!-- Main content in columns -->
                <div class="p-6 grid grid-cols-12 gap-6">

                  <!-- Left side -->
                  <div class="col-span-8 space-y-5">

                    <!-- Summary -->
                    <div v-if="formData.summary">
                      <h3 class="text-xs font-extrabold uppercase tracking-widest text-indigo-800 mb-2">Profile</h3>
                      <p class="text-xs text-slate-600 leading-relaxed text-justify">{{ formData.summary }}</p>
                    </div>

                    <!-- Experience -->
                    <div>
                      <h3 class="text-xs font-extrabold uppercase tracking-widest text-indigo-800 mb-2">Experience</h3>
                      <div class="space-y-4">
                        <div v-for="(exp, idx) in formData.experience" :key="idx" class="text-xs relative pl-4 border-l-2 border-indigo-100">
                          <!-- Bullet dot -->
                          <span class="w-2 h-2 rounded-full bg-indigo-600 absolute -left-[5px] top-1"></span>
                          <div class="flex justify-between items-start font-semibold">
                            <h4 class="text-slate-800 font-bold">{{ exp.position }}</h4>
                            <span class="text-[9px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{{ exp.startDate }} - {{ exp.endDate }}</span>
                          </div>
                          <p class="text-slate-500 font-medium text-[10px] mt-0.5">{{ exp.company }}</p>
                          <p class="text-slate-600 mt-1 text-[11px] leading-relaxed whitespace-pre-wrap">{{ exp.description }}</p>
                        </div>
                        <p v-if="formData.experience.length === 0" class="text-xs text-slate-400 italic">No experience added</p>
                      </div>
                    </div>
                  </div>

                  <!-- Right side -->
                  <div class="col-span-4 space-y-5">

                    <!-- Education -->
                    <div>
                      <h3 class="text-xs font-extrabold uppercase tracking-widest text-indigo-800 mb-2">Education</h3>
                      <div class="space-y-3">
                        <div v-for="(edu, idx) in formData.education" :key="idx" class="text-[11px]">
                          <strong class="text-slate-800 block text-xs">{{ edu.degree }}</strong>
                          <span class="text-slate-500 block text-[10px]">{{ edu.school }}</span>
                          <span class="text-[9px] font-mono text-slate-400 block">{{ edu.startDate }} - {{ edu.endDate }}</span>
                        </div>
                        <p v-if="formData.education.length === 0" class="text-xs text-slate-400 italic">No education added</p>
                      </div>
                    </div>

                    <!-- Skills -->
                    <div>
                      <h3 class="text-xs font-extrabold uppercase tracking-widest text-indigo-800 mb-2">Skills</h3>
                      <div class="flex flex-wrap gap-1.5">
                        <span v-for="skill in formData.skills.split(',').map(s => s.trim()).filter(Boolean)" :key="skill" class="text-[10px] bg-slate-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                          {{ skill }}
                        </span>
                        <span v-if="!formData.skills" class="text-xs text-slate-400 italic">Not provided</span>
                      </div>
                    </div>

                    <!-- Languages -->
                    <div>
                      <h3 class="text-xs font-extrabold uppercase tracking-widest text-indigo-800 mb-2">Languages</h3>
                      <p class="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{{ formData.languages || 'Not provided' }}</p>
                    </div>

                  </div>
                </div>
              </div>

              <div class="text-[10px] text-slate-400 text-center pb-4">
                Creative Accent Template
              </div>
            </div>

            <!-- TEMPLATE 4: Minimal Lines -->
            <div v-else-if="activeTemplate === 'minimal'" class="h-full p-10 flex flex-col justify-between bg-white text-slate-800" style="font-family: 'Inter', sans-serif;">
              <div>
                <div class="flex items-center gap-4 mb-6 pb-4" :style="{ borderBottom: '2px solid ' + formData.accentColor }">
                  <img v-if="formData.photo" :src="formData.photo" class="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  <div>
                    <h2 class="text-2xl font-extrabold text-slate-900 leading-tight">{{ formData.fullname || 'Enter Full Name' }}</h2>
                    <p class="text-xs font-semibold uppercase tracking-wider mt-1" :style="{ color: formData.accentColor }">{{ formData.title || 'Job Title' }}</p>
                  </div>
                </div>

                <div class="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500 mb-6 font-mono">
                  <span v-if="formData.email"><q-icon name="mdi-email" size="12px" /> {{ formData.email }}</span>
                  <span v-if="formData.phone"><q-icon name="mdi-phone" size="12px" /> {{ formData.phone }}</span>
                  <span v-if="formData.address"><q-icon name="mdi-map-marker" size="12px" /> {{ formData.address }}</span>
                  <span v-if="formData.website"><q-icon name="mdi-web" size="12px" /> {{ formData.website }}</span>
                </div>

                <p v-if="formData.summary" class="text-xs text-slate-600 leading-relaxed mb-6">{{ formData.summary }}</p>

                <div class="mb-6">
                  <h3 class="text-[11px] font-bold uppercase tracking-widest mb-2" :style="{ color: formData.accentColor }">Experience</h3>
                  <div class="space-y-3">
                    <div v-for="(exp, idx) in formData.experience" :key="idx" class="text-xs">
                      <div class="flex justify-between font-semibold text-slate-800">
                        <span>{{ exp.position }} — {{ exp.company }}</span>
                        <span class="text-[10px] text-slate-400 font-medium">{{ exp.startDate }} - {{ exp.endDate }}</span>
                      </div>
                      <p class="text-slate-500 text-[11px] mt-0.5 leading-relaxed whitespace-pre-wrap">{{ exp.description }}</p>
                    </div>
                    <p v-if="formData.experience.length === 0" class="text-xs text-slate-400 italic">No experience added</p>
                  </div>
                </div>

                <div class="mb-6">
                  <h3 class="text-[11px] font-bold uppercase tracking-widest mb-2" :style="{ color: formData.accentColor }">Education</h3>
                  <div class="space-y-2">
                    <div v-for="(edu, idx) in formData.education" :key="idx" class="text-xs flex justify-between">
                      <span class="font-semibold text-slate-800">{{ edu.degree }}<span v-if="edu.school">, {{ edu.school }}</span></span>
                      <span class="text-[10px] text-slate-400 font-medium">{{ edu.startDate }} - {{ edu.endDate }}</span>
                    </div>
                    <p v-if="formData.education.length === 0" class="text-xs text-slate-400 italic">No education added</p>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-6">
                  <div>
                    <h3 class="text-[11px] font-bold uppercase tracking-widest mb-2" :style="{ color: formData.accentColor }">Skills</h3>
                    <p class="text-xs text-slate-600 leading-relaxed">{{ formData.skills || 'Not provided' }}</p>
                  </div>
                  <div>
                    <h3 class="text-[11px] font-bold uppercase tracking-widest mb-2" :style="{ color: formData.accentColor }">Languages</h3>
                    <p class="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{{ formData.languages || 'Not provided' }}</p>
                  </div>
                </div>
              </div>

              <div class="text-[10px] text-slate-400 text-center pt-4">
                Minimal Lines Template
              </div>
            </div>

            <!-- TEMPLATE 5: Sidebar Right -->
            <div v-else class="h-full grid grid-cols-12 text-slate-800 bg-white" style="font-family: 'Inter', sans-serif;">
              <!-- Main Content (left) -->
              <div class="col-span-8 p-8 flex flex-col justify-between h-full">
                <div>
                  <h2 class="text-3xl font-extrabold text-slate-900 leading-tight">{{ formData.fullname || 'Enter Full Name' }}</h2>
                  <p class="text-sm font-bold uppercase tracking-wider mt-1" :style="{ color: formData.accentColor }">{{ formData.title || 'Job Title' }}</p>

                  <p v-if="formData.summary" class="text-xs text-slate-600 leading-relaxed italic mt-4 mb-6">{{ formData.summary }}</p>

                  <div class="mb-6">
                    <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-1">Experience</h3>
                    <div class="space-y-4">
                      <div v-for="(exp, idx) in formData.experience" :key="idx" class="text-xs">
                        <div class="flex justify-between items-start">
                          <div>
                            <h4 class="font-bold text-slate-800 text-sm">{{ exp.position }}</h4>
                            <p class="text-slate-600 font-semibold">{{ exp.company }}</p>
                          </div>
                          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" :style="{ color: formData.accentColor, background: accentSoft }">{{ exp.startDate }} - {{ exp.endDate }}</span>
                        </div>
                        <p class="text-slate-500 mt-1 text-[11px] leading-relaxed whitespace-pre-wrap">{{ exp.description }}</p>
                      </div>
                      <p v-if="formData.experience.length === 0" class="text-xs text-slate-400 italic">No experience added</p>
                    </div>
                  </div>

                  <div>
                    <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-1">Education</h3>
                    <div class="space-y-4">
                      <div v-for="(edu, idx) in formData.education" :key="idx" class="text-xs">
                        <div class="flex justify-between items-start">
                          <div>
                            <h4 class="font-bold text-slate-800 text-sm">{{ edu.degree }}</h4>
                            <p class="text-slate-600 font-semibold">{{ edu.school }}</p>
                          </div>
                          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" :style="{ color: formData.accentColor, background: accentSoft }">{{ edu.startDate }} - {{ edu.endDate }}</span>
                        </div>
                        <p v-if="edu.description" class="text-slate-500 mt-1 text-[11px] leading-relaxed whitespace-pre-wrap">{{ edu.description }}</p>
                      </div>
                      <p v-if="formData.education.length === 0" class="text-xs text-slate-400 italic">No education added</p>
                    </div>
                  </div>
                </div>

                <div class="text-[10px] text-slate-400 text-right">
                  Generated as PDF
                </div>
              </div>

              <!-- Sidebar (right) -->
              <div class="col-span-4 p-6 flex flex-col justify-between h-full" :style="{ background: formData.accentColor }">
                <div class="text-white">
                  <div class="flex justify-center mb-6">
                    <img v-if="formData.photo" :src="formData.photo" class="w-24 h-24 rounded-full object-cover border-2 border-white/40 shadow-md" />
                    <div v-else class="w-24 h-24 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center text-white/60 text-xs">
                      No Photo
                    </div>
                  </div>

                  <h4 class="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b border-white/20">Contact</h4>
                  <ul class="space-y-3.5 text-xs text-white/90">
                    <li v-if="formData.phone" class="flex items-start gap-2">
                      <q-icon name="mdi-phone" class="mt-0.5" size="14px" />
                      <span class="break-all">{{ formData.phone }}</span>
                    </li>
                    <li v-if="formData.email" class="flex items-start gap-2">
                      <q-icon name="mdi-email" class="mt-0.5" size="14px" />
                      <span class="break-all">{{ formData.email }}</span>
                    </li>
                    <li v-if="formData.address" class="flex items-start gap-2">
                      <q-icon name="mdi-map-marker" class="mt-0.5" size="14px" />
                      <span>{{ formData.address }}</span>
                    </li>
                    <li v-if="formData.website" class="flex items-start gap-2">
                      <q-icon name="mdi-web" class="mt-0.5" size="14px" />
                      <span class="break-all">{{ formData.website }}</span>
                    </li>
                  </ul>

                  <h4 class="text-xs font-bold uppercase tracking-widest mt-8 mb-3 pb-1 border-b border-white/20">Skills</h4>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="skill in formData.skills.split(',').map(s => s.trim()).filter(Boolean)" :key="skill" class="text-[10px] bg-white/15 text-white px-2 py-0.5 rounded font-mono">
                      {{ skill }}
                    </span>
                    <span v-if="!formData.skills" class="text-xs text-white/50 italic">Not provided</span>
                  </div>

                  <h4 class="text-xs font-bold uppercase tracking-widest mt-8 mb-3 pb-1 border-b border-white/20">Languages</h4>
                  <p class="text-xs text-white/90 leading-relaxed whitespace-pre-line">{{ formData.languages || 'Not provided' }}</p>
                </div>

                <div class="text-[10px] text-white/50 text-center border-t border-white/20 pt-3">
                  Sidebar Right
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>

  </div>

  <DonateDialog v-model="showDonateDialog" @confirm="downloadPDF" />
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Outfit:wght@400;600;800;900&family=Georgia&display=swap');

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Accent color theming for the live preview only */
.accent-scope .text-indigo-400,
.accent-scope .text-indigo-600,
.accent-scope .text-indigo-700,
.accent-scope .text-indigo-800,
.accent-scope .text-indigo-900 {
  color: var(--accent) !important;
}

.accent-scope .text-indigo-100,
.accent-scope .text-indigo-200 {
  color: var(--accent-soft2) !important;
}

.accent-scope .bg-indigo-600,
.accent-scope .bg-indigo-700 {
  background-color: var(--accent) !important;
}

.accent-scope .bg-indigo-50 {
  background-color: var(--accent-soft) !important;
}

.accent-scope .bg-indigo-100 {
  background-color: var(--accent-soft2) !important;
}

.accent-scope .border-indigo-100,
.accent-scope .border-indigo-500,
.accent-scope .border-indigo-600 {
  border-color: var(--accent) !important;
}
</style>
