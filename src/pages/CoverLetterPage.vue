<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import DonateDialog from '@/components/DonateDialog.vue'

const $q = useQuasar()
const showDonateDialog = ref(false)
// Matches Tailwind's `lg` breakpoint (1024px) used for the grid-cols layout switch
const isCompactLayout = computed(() => $q.screen.width < 1024)

interface CoverLetterData {
  senderName: string
  senderTitle: string
  senderEmail: string
  senderPhone: string
  senderAddress: string
  senderWebsite: string
  date: string
  recipientName: string
  recipientTitle: string
  companyName: string
  companyAddress: string
  subject: string
  salutation: string
  bodyText: string
  signOff: string
}

const STORAGE_KEY = 'cover_letter_builder_data'

const getLocalizedDate = () => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

const defaultLetter: CoverLetterData = {
  senderName: '',
  senderTitle: '',
  senderEmail: '',
  senderPhone: '',
  senderAddress: '',
  senderWebsite: '',
  date: getLocalizedDate(),
  recipientName: '',
  recipientTitle: '',
  companyName: '',
  companyAddress: '',
  subject: '',
  salutation: '',
  bodyText: '',
  signOff: '',
}

const formData = reactive<CoverLetterData>({ ...defaultLetter })
const activeTemplate = ref<string>('modern')
const previewRef = ref<HTMLDivElement | null>(null)
const isExporting = ref<boolean>(false)
const selectedRole = ref<string>('developer')
const showPreviewMobile = ref(false)

// Fixed "real" preview size, scaled down visually to fit any screen width
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

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      Object.assign(formData, parsed)
    } catch (e) {
      console.error('Error parsing cover letter data', e)
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

watch(showPreviewMobile, async () => {
  await nextTick()
  updatePreviewScale()
})

watch(
  () => formData,
  (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
  },
  { deep: true }
)

const clearAll = () => {
  if (confirm('Are you sure you want to clear all data?')) {
    Object.assign(formData, { ...defaultLetter, date: getLocalizedDate() })
    localStorage.removeItem(STORAGE_KEY)
  }
}

const roleLabels: Record<string, string> = {
  developer: 'IT Developer / Software Engineer',
  manager: 'Project Manager',
  designer: 'UI/UX Designer',
  sales: 'Sales Representative',
  marketing: 'Marketing Specialist',
  hr: 'HR Manager',
  accountant: 'Accountant / Finance Specialist',
  support: 'Customer Support Specialist',
  teacher: 'Teacher / Educator',
  data_analyst: 'Data Analyst',
  admin: 'Administrative Assistant',
  nurse: 'Nurse / Healthcare Professional',
}

type RoleKey =
  | 'developer'
  | 'manager'
  | 'designer'
  | 'sales'
  | 'marketing'
  | 'hr'
  | 'accountant'
  | 'support'
  | 'teacher'
  | 'data_analyst'
  | 'admin'
  | 'nurse'

const templates: Record<RoleKey, (title: string, company: string, recipient: string, name: string) => { subject: string; salutation: string; body: string; signOff: string }> = {
  developer: (title, company, recipient, name) => ({
    subject: `Application for ${title} Position`,
    salutation: `Dear ${recipient || 'Hiring Manager'},`,
    body: `I am writing to express my strong interest in the "${title}" position at "${company}". I bring professional expertise in software development and a proven track record of successfully delivering projects.\n\nI specialize in Vue.js, React, TypeScript, and modern web standards. Throughout my career, I have focused on building user-friendly, high-performance, and interactive applications. I have solid experience in teamwork, code quality improvement, and sound architectural design.\n\nThank you for taking the time to review my application. I look forward to the opportunity to discuss how my skills align with your needs.`,
    signOff: `Sincerely,\n${name}`,
  }),
  manager: (_title, company, recipient, name) => ({
    subject: `Application for Project Manager Position`,
    salutation: `Dear ${recipient || 'Hiring Manager'},`,
    body: `I am excited to apply for the Project Manager position at "${company}". I have extensive experience in project planning, team leadership, and delivering quality results within defined timelines and budgets.\n\nI actively apply Agile and Scrum methodologies and build effective communication within teams. Understanding client requirements and translating them into actionable tasks is one of my core strengths.\n\nThank you for considering my application. I look forward to discussing how I can contribute to your team.`,
    signOff: `Best regards,\n${name}`,
  }),
  designer: (_title, company, recipient, name) => ({
    subject: `Application for UI/UX Designer Position`,
    salutation: `Dear ${recipient || 'Hiring Manager'},`,
    body: `I am writing to express my interest in joining the design team at "${company}" as a UI/UX Designer. I have 3 years of experience in user research, wireframing, and creating beautiful, intuitive interfaces.\n\nI am proficient in Figma and Adobe CC, and I consistently aim to improve product conversion by simplifying the user journey. My creative approach and eye for aesthetics will make your team's products even more compelling.\n\nThank you for reviewing my portfolio and application.`,
    signOff: `Creatively yours,\n${name}`,
  }),
  sales: (_title, company, recipient, name) => ({
    subject: `Application for Sales Representative Position`,
    salutation: `Dear ${recipient || 'Hiring Manager'},`,
    body: `I am writing to express my interest in the Sales Representative position at "${company}". I possess strong skills in client relationship building, negotiations, and increasing sales volume.\n\nI have experience with CRM systems, market analysis, and handling objections effectively. I would be excited to contribute to expanding new markets and exceeding sales targets at your company.\n\nThank you for your time and consideration.`,
    signOff: `Sincerely,\n${name}`,
  }),
  marketing: (_title, company, recipient, name) => ({
    subject: `Application for Marketing Specialist Position`,
    salutation: `Dear ${recipient || 'Hiring Manager'},`,
    body: `I am writing to apply for the Marketing Specialist position at "${company}". I have hands-on experience planning and executing digital campaigns, growing social media engagement, and analyzing performance metrics to drive results.\n\nI am skilled in content strategy, SEO/SEM, and marketing analytics tools, and I enjoy turning data into actionable insights that improve brand visibility and conversion rates.\n\nThank you for considering my application. I would welcome the opportunity to bring fresh ideas to your marketing team.`,
    signOff: `Best regards,\n${name}`,
  }),
  hr: (_title, company, recipient, name) => ({
    subject: `Application for HR Manager Position`,
    salutation: `Dear ${recipient || 'Hiring Manager'},`,
    body: `I am excited to apply for the HR Manager position at "${company}". I have experience managing the full recruitment cycle, employee onboarding, performance reviews, and fostering a positive workplace culture.\n\nI am skilled in conflict resolution, policy development, and HR information systems, and I take pride in building strong relationships between staff and management.\n\nThank you for your time and consideration. I look forward to discussing how I can support your team.`,
    signOff: `Sincerely,\n${name}`,
  }),
  accountant: (_title, company, recipient, name) => ({
    subject: `Application for Accountant / Finance Specialist Position`,
    salutation: `Dear ${recipient || 'Hiring Manager'},`,
    body: `I am writing to apply for the Accountant position at "${company}". I have solid experience in financial reporting, budgeting, reconciliations, and ensuring compliance with accounting standards.\n\nI am proficient in accounting software and Excel, with a strong attention to detail and a track record of identifying cost-saving opportunities.\n\nThank you for reviewing my application. I look forward to the possibility of contributing to your finance team.`,
    signOff: `Best regards,\n${name}`,
  }),
  support: (_title, company, recipient, name) => ({
    subject: `Application for Customer Support Specialist Position`,
    salutation: `Dear ${recipient || 'Hiring Manager'},`,
    body: `I am interested in the Customer Support Specialist position at "${company}". I have experience resolving customer inquiries across phone, email, and chat channels while maintaining high satisfaction scores.\n\nI am patient, detail-oriented, and skilled at de-escalating difficult situations while finding practical solutions for customers.\n\nThank you for considering my application. I would be glad to bring my customer-first approach to your support team.`,
    signOff: `Sincerely,\n${name}`,
  }),
  teacher: (_title, company, recipient, name) => ({
    subject: `Application for Teaching Position`,
    salutation: `Dear ${recipient || 'Hiring Committee'},`,
    body: `I am writing to apply for the teaching position at "${company}". I am passionate about creating engaging lesson plans, supporting diverse learning styles, and fostering a positive classroom environment.\n\nI have experience using both traditional and digital teaching tools to track student progress and adapt instruction to individual needs.\n\nThank you for considering my application. I would welcome the opportunity to contribute to your students' growth.`,
    signOff: `Warm regards,\n${name}`,
  }),
  data_analyst: (_title, company, recipient, name) => ({
    subject: `Application for Data Analyst Position`,
    salutation: `Dear ${recipient || 'Hiring Manager'},`,
    body: `I am excited to apply for the Data Analyst position at "${company}". I have experience cleaning, analyzing, and visualizing large datasets to uncover actionable business insights.\n\nI am proficient in SQL, Python, and BI tools such as Power BI or Tableau, and I enjoy translating complex data into clear recommendations for stakeholders.\n\nThank you for your time and consideration. I look forward to discussing how my analytical skills can support your team.`,
    signOff: `Best regards,\n${name}`,
  }),
  admin: (_title, company, recipient, name) => ({
    subject: `Application for Administrative Assistant Position`,
    salutation: `Dear ${recipient || 'Hiring Manager'},`,
    body: `I am writing to apply for the Administrative Assistant position at "${company}". I have experience managing schedules, correspondence, and office operations to keep teams running smoothly.\n\nI am highly organized, proficient in office software, and skilled at handling multiple priorities while maintaining attention to detail.\n\nThank you for considering my application. I would be glad to bring my organizational skills to your office.`,
    signOff: `Sincerely,\n${name}`,
  }),
  nurse: (_title, company, recipient, name) => ({
    subject: `Application for Nursing Position`,
    salutation: `Dear ${recipient || 'Hiring Manager'},`,
    body: `I am writing to apply for the nursing position at "${company}". I am a compassionate and detail-oriented healthcare professional with experience providing patient care, administering treatments, and collaborating with medical teams.\n\nI am committed to patient safety, clear communication with families, and maintaining accurate medical records.\n\nThank you for considering my application. I look forward to the opportunity to contribute to your care team.`,
    signOff: `Warm regards,\n${name}`,
  }),
}

const generateLetter = () => {
  const name = formData.senderName || 'John Smith'
  const title = formData.senderTitle || roleLabels[selectedRole.value]
  const company = formData.companyName || '...'
  const role = selectedRole.value as RoleKey

  const tpl = templates[role](title, company, formData.recipientName, name)
  formData.subject = tpl.subject
  formData.salutation = tpl.salutation
  formData.bodyText = tpl.body
  formData.signOff = tpl.signOff
}

// PDF Export
const downloadPDF = async () => {
  const savedScale = previewScale.value
  try {
    isExporting.value = true
    const html2Canvas = (await import('html2canvas')).default
    const { jsPDF } = await import('jspdf')

    const element = previewRef.value
    if (!element) return

    previewScale.value = 1
    await nextTick()

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
    const name = formData.senderName ? formData.senderName.replace(/\s+/g, '_') : 'Letter'
    pdf.save(`${name}_Cover_Letter.pdf`)
  } catch (err) {
    console.error(err)
    alert('An error occurred while generating the PDF')
  } finally {
    previewScale.value = savedScale
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
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Cover Letter Builder</h1>
          <p class="text-slate-500 mt-1">Write professional cover letters for employers</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
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

      <!-- Main Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        <!-- Left: Form Editor -->
        <div class="space-y-6">

          <!-- Template Selection -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-2 h-6 bg-indigo-600 rounded-full inline-block"></span>
              Choose Template
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                @click="activeTemplate = 'modern'"
                :class="[activeTemplate === 'modern' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50']"
                class="px-2 py-3 border-2 rounded-xl text-center text-xs sm:text-sm transition"
              >
                Modern Minimalist
              </button>
              <button
                @click="activeTemplate = 'classic'"
                :class="[activeTemplate === 'classic' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50']"
                class="px-2 py-3 border-2 rounded-xl text-center text-xs sm:text-sm transition"
              >
                Classic Professional
              </button>
              <button
                @click="activeTemplate = 'creative'"
                :class="[activeTemplate === 'creative' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50']"
                class="px-2 py-3 border-2 rounded-xl text-center text-xs sm:text-sm transition col-span-2 sm:col-span-1"
              >
                Creative Accent
              </button>
            </div>
          </div>

          <!-- Automated Text Generator -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span class="w-2 h-6 bg-indigo-600 rounded-full inline-block"></span>
              Auto Text Generator (Sample)
            </h3>
            <p class="text-xs text-slate-500 mb-4">Choose your field and quickly insert sample professional text:</p>
            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
              <select v-model="selectedRole" class="w-full sm:flex-1 sm:min-w-0 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm text-slate-700">
                <option v-for="(label, key) in roleLabels" :key="key" :value="key">{{ label }}</option>
              </select>
              <button @click="generateLetter" class="w-full sm:w-auto justify-center px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 text-sm transition flex items-center gap-1.5 shadow-md">
                <q-icon name="mdi-text-box-plus-outline" size="18px" />
                Generate
              </button>
            </div>
          </div>

          <!-- Sender Details -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-2 h-6 bg-indigo-600 rounded-full inline-block"></span>
              Sender (You)
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
                <input v-model="formData.senderName" type="text" placeholder="First Last" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Job Title</label>
                <input v-model="formData.senderTitle" type="text" placeholder="e.g. Senior Vue Developer" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email</label>
                <input v-model="formData.senderEmail" type="email" placeholder="example@email.com" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Phone</label>
                <input v-model="formData.senderPhone" type="text" placeholder="+1 555 123 4567" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Address</label>
                <input v-model="formData.senderAddress" type="text" placeholder="New York, USA" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Portfolio / Website</label>
                <input v-model="formData.senderWebsite" type="text" placeholder="github.com/username" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
            </div>
          </div>

          <!-- Recipient & Subject Details -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-2 h-6 bg-indigo-600 rounded-full inline-block"></span>
              Recipient (Company)
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Date</label>
                <input v-model="formData.date" type="text" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Hiring Manager Name</label>
                <input v-model="formData.recipientName" type="text" placeholder="e.g. Jane Doe" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Recipient's Title</label>
                <input v-model="formData.recipientTitle" type="text" placeholder="e.g. CTO" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Company Name</label>
                <input v-model="formData.companyName" type="text" placeholder="Company Inc." class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Company Address</label>
                <input v-model="formData.companyAddress" type="text" placeholder="Company address" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Subject Line</label>
                <input v-model="formData.subject" type="text" placeholder="e.g. Application for Senior Frontend Developer" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
            </div>
          </div>

          <!-- Letter Contents -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-2 h-6 bg-indigo-600 rounded-full inline-block"></span>
              Letter Text
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Salutation</label>
                <input v-model="formData.salutation" type="text" placeholder="e.g. Dear Mr. Doe," class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Letter Body</label>
                <textarea v-model="formData.bodyText" rows="10" placeholder="Why you're applying, your achievements and goals..." class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800"></textarea>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Sign-off</label>
                <textarea v-model="formData.signOff" rows="2" placeholder="Sincerely,&#10;Your Name" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800"></textarea>
              </div>
            </div>
          </div>

        </div>

        <!-- Right: Live Preview -->
        <div
          class="space-y-4"
          :class="isCompactLayout
            ? (showPreviewMobile ? 'mobile-preview-overlay' : 'hidden')
            : 'lg:sticky lg:top-8'"
        >
          <!-- Mobile overlay top bar with a clear Back button -->
          <div v-if="isCompactLayout && showPreviewMobile" class="preview-overlay-bar">
            <button type="button" class="back-btn" @click="showPreviewMobile = false">
              <q-icon name="mdi-arrow-left" size="20px" />
              <span>Back</span>
            </button>
            <span class="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-semibold">A4 Format (210mm)</span>
          </div>

          <div v-else class="flex items-center justify-between px-2">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Cover Letter Preview</span>
            <span class="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-semibold">A4 Format (210mm)</span>
          </div>

          <!-- A4 Canvas: rendered at a fixed "real" size, then visually scaled
               to fit the column width — looks identical on mobile and desktop -->
          <div ref="previewWrapRef" class="w-full" :style="{ height: (PREVIEW_HEIGHT * previewScale) + 'px' }">
            <div
              class="bg-white shadow-xl border border-slate-200 overflow-hidden text-slate-800"
              :style="{
                width: PREVIEW_WIDTH + 'px',
                height: PREVIEW_HEIGHT + 'px',
                transform: 'scale(' + previewScale + ')',
                transformOrigin: 'top left',
              }"
              ref="previewRef"
            >

            <!-- TEMPLATE 1: Modern Minimalist -->
            <div v-if="activeTemplate === 'modern'" class="h-full grid grid-cols-12 bg-white" style="font-family: 'Inter', sans-serif;">
              <!-- Sidebar -->
              <div class="col-span-4 bg-slate-900 text-slate-100 p-6 flex flex-col justify-between h-full">
                <div class="space-y-6">
                  <div>
                    <h3 class="text-sm font-extrabold text-white leading-tight break-words">{{ formData.senderName || 'Your Name' }}</h3>
                    <p class="text-[11px] text-indigo-400 font-semibold tracking-wide mt-1">{{ formData.senderTitle }}</p>
                  </div>

                  <div class="space-y-4 pt-4 border-t border-slate-800">
                    <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact</h4>
                    <ul class="space-y-3 text-xs text-slate-300">
                      <li v-if="formData.senderPhone" class="flex gap-2">
                        <q-icon name="mdi-phone" class="text-indigo-400" size="14px" />
                        <span class="break-all">{{ formData.senderPhone }}</span>
                      </li>
                      <li v-if="formData.senderEmail" class="flex gap-2">
                        <q-icon name="mdi-email" class="text-indigo-400" size="14px" />
                        <span class="break-all">{{ formData.senderEmail }}</span>
                      </li>
                      <li v-if="formData.senderAddress" class="flex gap-2">
                        <q-icon name="mdi-map-marker" class="text-indigo-400" size="14px" />
                        <span>{{ formData.senderAddress }}</span>
                      </li>
                      <li v-if="formData.senderWebsite" class="flex gap-2">
                        <q-icon name="mdi-web" class="text-indigo-400" size="14px" />
                        <span class="break-all">{{ formData.senderWebsite }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="text-[10px] text-slate-600 text-center">
                  Modern Minimalist
                </div>
              </div>

              <!-- Main Content -->
              <div class="col-span-8 p-8 flex flex-col justify-between h-full bg-slate-50/20">
                <div>
                  <div class="text-right text-[10px] font-semibold text-slate-400 font-mono">
                    {{ formData.date }}
                  </div>

                  <!-- Recipient details block -->
                  <div class="mb-6 text-xs text-slate-600 space-y-1 mt-4">
                    <p class="font-bold text-slate-800 text-sm">{{ formData.recipientName }}</p>
                    <p>{{ formData.recipientTitle }}</p>
                    <p class="font-semibold text-slate-700">{{ formData.companyName }}</p>
                    <p>{{ formData.companyAddress }}</p>
                  </div>

                  <!-- Subject Line -->
                  <div class="mb-6 border-b border-slate-200 pb-2">
                    <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wide">Subject: {{ formData.subject || 'Job Application' }}</h2>
                  </div>

                  <!-- Salutation -->
                  <p class="text-xs font-bold text-slate-800 mb-4">{{ formData.salutation }}</p>

                  <!-- Letter Body -->
                  <div class="text-xs text-slate-600 leading-relaxed space-y-4 whitespace-pre-wrap text-justify">
                    {{ formData.bodyText || 'Write your letter text here...' }}
                  </div>

                  <!-- Sign-off -->
                  <div class="mt-8 text-xs text-slate-700 whitespace-pre-wrap">
                    {{ formData.signOff }}
                  </div>
                </div>

                <div class="text-[10px] text-slate-400 text-right">
                  Generated as PDF
                </div>
              </div>
            </div>

            <!-- TEMPLATE 2: Classic Professional -->
            <div v-else-if="activeTemplate === 'classic'" class="h-full p-10 flex flex-col justify-between bg-white text-slate-800" style="font-family: 'Georgia', serif;">
              <div>
                <!-- Top Header -->
                <div class="text-center pb-4 border-b border-slate-800 mb-6 font-sans">
                  <h2 class="text-2xl font-bold tracking-wide text-slate-900">{{ formData.senderName || 'Your Name' }}</h2>
                  <p class="text-[10px] font-bold text-indigo-700 uppercase tracking-widest mt-1">{{ formData.senderTitle }}</p>
                  <div class="flex flex-wrap justify-center gap-x-4 text-[10px] text-slate-500 mt-2 font-mono">
                    <span v-if="formData.senderEmail">{{ formData.senderEmail }}</span>
                    <span v-if="formData.senderPhone">{{ formData.senderPhone }}</span>
                    <span v-if="formData.senderWebsite">{{ formData.senderWebsite }}</span>
                  </div>
                </div>

                <!-- Date & Recipient Details -->
                <div class="flex justify-between items-start text-xs mb-6 font-sans">
                  <div class="space-y-0.5 text-slate-600">
                    <strong class="text-slate-800">{{ formData.recipientName }}</strong>
                    <p>{{ formData.recipientTitle }}</p>
                    <p class="font-semibold">{{ formData.companyName }}</p>
                    <p class="text-[11px] text-slate-500">{{ formData.companyAddress }}</p>
                  </div>
                  <div class="text-slate-500 font-mono text-[11px]">
                    {{ formData.date }}
                  </div>
                </div>

                <!-- Subject Line -->
                <div class="mb-4">
                  <h3 class="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1 font-sans">Subject: {{ formData.subject }}</h3>
                </div>

                <!-- Salutation -->
                <p class="text-xs font-bold mb-4 font-sans text-slate-900">{{ formData.salutation }}</p>

                <!-- Letter Body -->
                <div class="text-xs text-slate-700 leading-relaxed text-justify whitespace-pre-wrap space-y-4">
                  {{ formData.bodyText || 'Enter your letter text...' }}
                </div>

                <!-- Sign off -->
                <div class="mt-8 text-xs text-slate-800 font-sans whitespace-pre-wrap">
                  {{ formData.signOff }}
                </div>
              </div>

              <div class="text-[10px] text-slate-400 text-center font-sans">
                Professional Classic Template
              </div>
            </div>

            <!-- TEMPLATE 3: Creative Accent -->
            <div v-else class="h-full flex flex-col justify-between bg-white text-slate-800" style="font-family: 'Outfit', sans-serif;">
              <div>
                <!-- Top Accent Banner -->
                <div class="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white p-6">
                  <div class="flex justify-between items-start">
                    <div>
                      <h2 class="text-2xl font-black tracking-wide">{{ formData.senderName || 'Your Name' }}</h2>
                      <p class="text-xs font-semibold text-indigo-200 tracking-wider mt-1">{{ formData.senderTitle }}</p>
                    </div>
                    <div class="text-right text-[10px] font-mono text-indigo-100">
                      {{ formData.date }}
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-x-4 text-[10px] text-indigo-100 mt-4 font-mono">
                    <span v-if="formData.senderPhone"><q-icon name="mdi-phone" /> {{ formData.senderPhone }}</span>
                    <span v-if="formData.senderEmail"><q-icon name="mdi-email" /> {{ formData.senderEmail }}</span>
                    <span v-if="formData.senderWebsite"><q-icon name="mdi-web" /> {{ formData.senderWebsite }}</span>
                  </div>
                </div>

                <!-- Main Content -->
                <div class="p-6">
                  <!-- Recipient Block -->
                  <div class="p-3 bg-slate-50 border border-slate-100 rounded-xl mb-5 text-xs text-slate-600">
                    <p class="text-[10px] uppercase font-bold text-indigo-700 tracking-wider mb-1">Sending to:</p>
                    <strong class="text-slate-800 text-sm block">{{ formData.recipientName }}</strong>
                    <span class="block">{{ formData.recipientTitle }}</span>
                    <span class="font-semibold block mt-0.5 text-slate-700">{{ formData.companyName }}</span>
                    <span class="text-[11px]">{{ formData.companyAddress }}</span>
                  </div>

                  <!-- Subject -->
                  <h3 class="text-xs font-extrabold text-indigo-800 uppercase tracking-widest mb-3">Subject: {{ formData.subject }}</h3>

                  <!-- Salutation -->
                  <p class="text-xs font-bold text-slate-800 mb-3">{{ formData.salutation }}</p>

                  <!-- Letter Body -->
                  <div class="text-xs text-slate-600 leading-relaxed text-justify whitespace-pre-wrap">
                    {{ formData.bodyText || 'Write your letter text here...' }}
                  </div>

                  <!-- Sign-off -->
                  <div class="mt-6 text-xs text-slate-700 whitespace-pre-wrap">
                    {{ formData.signOff }}
                  </div>
                </div>
              </div>

              <div class="text-[10px] text-slate-400 text-center pb-4">
                Creative Accent Template
              </div>
            </div>

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
