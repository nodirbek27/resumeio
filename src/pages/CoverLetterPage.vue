<script setup lang="ts">
import { reactive, ref, onMounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

const { locale } = useI18n()
const $q = useQuasar()

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

// Tilga qarab standart sana formatlash
const getLocalizedDate = () => {
  const localeMap: Record<string, string> = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-US' }
  return new Date().toLocaleDateString(localeMap[locale.value] || 'uz-UZ', {
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
const mobileTab = ref<'form' | 'preview'>('form')

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
})

watch(
  () => formData,
  (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
  },
  { deep: true }
)

const clearAll = () => {
  const confirmMsg: Record<string, string> = {
    uz: "Haqiqatan ham barcha ma'lumotlarni o'chirmoqchisiz?",
    ru: "Вы действительно хотите удалить все данные?",
    en: "Are you sure you want to clear all data?",
  }
  if (confirm(confirmMsg[locale.value] || confirmMsg.uz)) {
    Object.assign(formData, { ...defaultLetter, date: getLocalizedDate() })
    localStorage.removeItem(STORAGE_KEY)
  }
}

// Rol sarlavhalari har bir tilda
const roleLabels = computed(() => {
  const labels: Record<string, Record<string, string>> = {
    uz: {
      developer: 'IT Dasturchi / Dasturiy Muhandis',
      manager: 'Loyiha Menejeri (Project Manager)',
      designer: 'UI/UX Dizayner',
      sales: 'Savdo Menejeri (Sales Representative)',
    },
    ru: {
      developer: 'IT Разработчик / Программист',
      manager: 'Менеджер проектов (Project Manager)',
      designer: 'UI/UX Дизайнер',
      sales: 'Менеджер по продажам (Sales Representative)',
    },
    en: {
      developer: 'IT Developer / Software Engineer',
      manager: 'Project Manager',
      designer: 'UI/UX Designer',
      sales: 'Sales Representative',
    },
  }
  return labels[locale.value] || labels.uz
})

// Matn generatsiyasi – joriy tilga qarab
const generateLetter = () => {
  const name = formData.senderName || 'Alisher Qodirov'
  const title = formData.senderTitle || roleLabels.value[selectedRole.value]
  const company = formData.companyName || '...'
  const lang = locale.value

  type RoleKey = 'developer' | 'manager' | 'designer' | 'sales'
  const role = selectedRole.value as RoleKey

  const templates: Record<string, Record<RoleKey, { subject: string; salutation: string; body: string; signOff: string }>> = {
    uz: {
      developer: {
        subject: `${title} lavozimiga ariza`,
        salutation: `Hurmatli ${formData.recipientName || 'Kadrlar bo\'limi vakillari'},`,
        body: `Sizning "${company}" kompaniyangizda e'lon qilingan "${title}" vakansiyasiga katta qiziqish bilan ariza topshiryapman. Men dasturlash sohasida professional bilim va loyihalarni muvaffaqiyatli amalga oshirish ko'nikmalariga egaman.\n\nMen asosan Vue.js, React, TypeScript hamda zamonaviy veb-standartlar bilan ishlayman. Faoliyatim davomida foydalanuvchilar uchun qulay, tezkor va interaktiv ilovalarni yaratishga e'tibor qaratganman. Loyihalarda jamoaviy ishlash, kod sifatini oshirish va to'g'ri arxitektura qurish bo'yicha yetarli tajribam bor.\n\nArizam va rezyumemni ko'rib chiqishga vaqt ajratganingiz uchun minnatdorchilik bildiraman. Tez orada suhbatlashish imkoniga ega bo'laman deb umid qilaman.`,
        signOff: `Samimiyat bilan,\n${name}`,
      },
      manager: {
        subject: `Loyiha Menejeri lavozimiga ariza`,
        salutation: `Hurmatli ${formData.recipientName || 'Kadrlar bo\'limi vakillari'},`,
        body: `"${company}" kompaniyangizda ochiq bo'lgan Loyiha Menejeri lavozimi uchun o'z nomzodimni taklif qilmoqchiman. Men loyihalarni rejalashtirish, jamoalarni boshqarish va belgilangan muddat hamda byudjet doirasida sifatli natijalarga erishish bo'yicha tajribaga egaman.\n\nAgile va Scrum metodologiyalaridan unumli foydalanaman, jamoa a'zolari o'rtasida samarali muloqotni yo'lga qo'yaman. Mijozlar talablarini tushunish, ularni texnik topshiriqlarga aylantirish va jamoani umumiy maqsad sari ilhomlantirish mening kuchli tomonimdir.\n\nArizam va rezyumemni o'rganib chiqishga vaqt ajratganingiz uchun rahmat.`,
        signOff: `Hurmat bilan,\n${name}`,
      },
      designer: {
        subject: `UI/UX Dizayner lavozimiga ariza`,
        salutation: `Hurmatli ${formData.recipientName || 'Kadrlar bo\'limi vakillari'},`,
        body: `"${company}" kompaniyangiz dizayn jamoasiga UI/UX Dizayner sifatida qo'shilish niyatidaman. Foydalanuvchilar ehtiyojlarini o'rganish, wireframe va interfeys yaratishda 3 yillik tajribaga egaman.\n\nFigma va Adobe CC vositalaridan mukammal foydalanaman. Foydalanuvchi yo'lini soddalashtirish orqali mahsulot konversiyasini oshirishga intilaman. Kreativ yondashuvim jamoangizdagi mahsulotlarni yanada jozibador qiladi deb ishonaman.\n\nPortfolio va arizamni ko'rib chiqqanligingiz uchun rahmat.`,
        signOff: `Ijodiy salom bilan,\n${name}`,
      },
      sales: {
        subject: `Savdo Menejeri lavozimiga ariza`,
        salutation: `Hurmatli ${formData.recipientName || 'Kadrlar bo\'limi vakillari'},`,
        body: `"${company}" kompaniyangiz tomonidan e'lon qilingan Savdo Menejeri lavozimiga qiziqish bildirib yozmoqdaman. Men mijozlar bilan aloqa o'rnatish, muzokaralar olib borish va savdo hajmini oshirish bo'yicha faol ko'nikmalarga egaman.\n\nCRM tizimlari bilan ishlash, bozor tahlili va e'tirozlar bilan samarali ishlash bo'yicha tajribam bor. Jamoangizda yangi bozorlarni egallashda va savdo rejasini bajarishda ishtirok etishdan mamnun bo'laman.\n\nVaqtingiz uchun tashakkur.`,
        signOff: `Samimiyat bilan,\n${name}`,
      },
    },
    ru: {
      developer: {
        subject: `Заявка на должность ${title}`,
        salutation: `Уважаемый(ая) ${formData.recipientName || 'Менеджер по персоналу'},`,
        body: `С большим интересом подаю заявку на вакансию "${title}" в компании "${company}". Обладаю профессиональными знаниями в области разработки программного обеспечения и успешным опытом реализации проектов.\n\nСпециализируюсь на Vue.js, React, TypeScript и современных веб-стандартах. В своей деятельности уделяю особое внимание созданию удобных, быстрых и интерактивных приложений. Имею достаточный опыт командной работы, повышения качества кода и правильного построения архитектуры.\n\nБлагодарю за время, уделённое рассмотрению моей заявки. Надеюсь на возможность пообщаться в ближайшее время.`,
        signOff: `С уважением,\n${name}`,
      },
      manager: {
        subject: `Заявка на должность Менеджера проектов`,
        salutation: `Уважаемый(ая) ${formData.recipientName || 'Менеджер по персоналу'},`,
        body: `Предлагаю свою кандидатуру на должность Менеджера проектов в компании "${company}". Имею опыт в планировании проектов, управлении командами и достижении качественных результатов в установленные сроки и бюджет.\n\nАктивно использую методологии Agile и Scrum, выстраиваю эффективную коммуникацию внутри команды. Понимание требований клиентов и преобразование их в технические задачи — моя сильная сторона.\n\nБлагодарю за рассмотрение моей заявки.`,
        signOff: `С уважением,\n${name}`,
      },
      designer: {
        subject: `Заявка на должность UI/UX дизайнера`,
        salutation: `Уважаемый(ая) ${formData.recipientName || 'Менеджер по персоналу'},`,
        body: `Хочу присоединиться к дизайн-команде компании "${company}" в качестве UI/UX дизайнера. Имею 3-летний опыт изучения потребностей пользователей, создания wireframe и красивых, понятных интерфейсов.\n\nМастерски владею Figma и Adobe CC. Стремлюсь повысить конверсию продукта за счёт упрощения пользовательского пути. Мой творческий подход и чувство эстетики сделают продукты команды ещё более привлекательными.\n\nБлагодарю за рассмотрение портфолио и заявки.`,
        signOff: `С творческим приветом,\n${name}`,
      },
      sales: {
        subject: `Заявка на должность менеджера по продажам`,
        salutation: `Уважаемый(ая) ${formData.recipientName || 'Менеджер по персоналу'},`,
        body: `Пишу в связи с интересом к должности менеджера по продажам в компании "${company}". Обладаю активными навыками установления контактов с клиентами, ведения переговоров и увеличения объёма продаж.\n\nИмею опыт работы с CRM-системами, анализа рынка и эффективной работы с возражениями. Буду рад участвовать в завоевании новых рынков и выполнении плана продаж в вашей команде.\n\nБлагодарю за уделённое время.`,
        signOff: `С уважением,\n${name}`,
      },
    },
    en: {
      developer: {
        subject: `Application for ${title} Position`,
        salutation: `Dear ${formData.recipientName || 'Hiring Manager'},`,
        body: `I am writing to express my strong interest in the "${title}" position at "${company}". I bring professional expertise in software development and a proven track record of successfully delivering projects.\n\nI specialize in Vue.js, React, TypeScript, and modern web standards. Throughout my career, I have focused on building user-friendly, high-performance, and interactive applications. I have solid experience in teamwork, code quality improvement, and sound architectural design.\n\nThank you for taking the time to review my application. I look forward to the opportunity to discuss how my skills align with your needs.`,
        signOff: `Sincerely,\n${name}`,
      },
      manager: {
        subject: `Application for Project Manager Position`,
        salutation: `Dear ${formData.recipientName || 'Hiring Manager'},`,
        body: `I am excited to apply for the Project Manager position at "${company}". I have extensive experience in project planning, team leadership, and delivering quality results within defined timelines and budgets.\n\nI actively apply Agile and Scrum methodologies and build effective communication within teams. Understanding client requirements and translating them into actionable tasks is one of my core strengths.\n\nThank you for considering my application. I look forward to discussing how I can contribute to your team.`,
        signOff: `Best regards,\n${name}`,
      },
      designer: {
        subject: `Application for UI/UX Designer Position`,
        salutation: `Dear ${formData.recipientName || 'Hiring Manager'},`,
        body: `I am writing to express my interest in joining the design team at "${company}" as a UI/UX Designer. I have 3 years of experience in user research, wireframing, and creating beautiful, intuitive interfaces.\n\nI am proficient in Figma and Adobe CC, and I consistently aim to improve product conversion by simplifying the user journey. My creative approach and eye for aesthetics will make your team's products even more compelling.\n\nThank you for reviewing my portfolio and application.`,
        signOff: `Creatively yours,\n${name}`,
      },
      sales: {
        subject: `Application for Sales Representative Position`,
        salutation: `Dear ${formData.recipientName || 'Hiring Manager'},`,
        body: `I am writing to express my interest in the Sales Representative position at "${company}". I possess strong skills in client relationship building, negotiations, and increasing sales volume.\n\nI have experience with CRM systems, market analysis, and handling objections effectively. I would be excited to contribute to expanding new markets and exceeding sales targets at your company.\n\nThank you for your time and consideration.`,
        signOff: `Sincerely,\n${name}`,
      },
    },
  }

  const tpl = templates[lang]?.[role] || templates.uz[role]
  formData.subject = tpl.subject
  formData.salutation = tpl.salutation
  formData.bodyText = tpl.body
  formData.signOff = tpl.signOff
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
    const name = formData.senderName ? formData.senderName.replace(/\s+/g, '_') : 'Letter'
    pdf.save(`${name}_Cover_Letter.pdf`)
  } catch (err) {
    console.error(err)
    alert("PDF yaratishda xatolik yuz berdi")
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
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Muqova Xati Yaratuvchi</h1>
          <p class="text-slate-500 mt-1">Ish beruvchilar uchun professional muqova xatlari (Cover Letters) tayyorlang</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <button @click="clearAll" class="px-4 py-2.5 bg-red-50 text-red-700 font-semibold rounded-xl hover:bg-red-100 transition flex items-center gap-2 text-sm shadow-sm">
            <q-icon name="mdi-trash-can-outline" size="18px" />
            {{ locale === 'ru' ? 'Очистить' : locale === 'en' ? 'Clear All' : 'Tozalash' }}
          </button>
          <button @click="downloadPDF" :disabled="isExporting" class="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400 transition flex items-center gap-2 text-sm shadow-md">
            <q-icon v-if="isExporting" name="mdi-loading" class="animate-spin" size="18px" />
            <q-icon v-else name="mdi-download" size="18px" />
            {{ locale === 'ru' ? 'Скачать PDF' : locale === 'en' ? 'Download PDF' : 'PDF Yuklash' }}
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
          <q-icon name="mdi-pencil-outline" size="16px" /> To'ldirish
        </button>
        <button
          @click="mobileTab = 'preview'"
          :class="mobileTab === 'preview' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'"
          class="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition"
        >
          <q-icon name="mdi-eye-outline" size="16px" /> Ko'rish
        </button>
      </div>

      <!-- Main Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        <!-- Left: Form Editor -->
        <div class="space-y-6" :class="{ 'hidden': $q.screen.lt.lg && mobileTab !== 'form' }">

          <!-- Template Selection -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-2 h-6 bg-indigo-600 rounded-full inline-block"></span>
              Shablon Dizayni
            </h3>
            <div class="grid grid-cols-3 gap-3">
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
            </div>
          </div>

          <!-- Automated Text Generator -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span class="w-2 h-6 bg-indigo-600 rounded-full inline-block"></span>
              Avtomatik Matn Generator (Namuna)
            </h3>
            <p class="text-xs text-slate-500 mb-4">Sohangizni tanlang va namunaviy professional matnni tezkor kiriting:</p>
            <div class="flex items-center gap-3">
              <select v-model="selectedRole" class="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm text-slate-700">
                <option v-for="(label, key) in roleLabels" :key="key" :value="key">{{ label }}</option>
              </select>
              <button @click="generateLetter" class="px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 text-sm transition flex items-center gap-1.5 shadow-md">
                <q-icon name="mdi-text-box-plus-outline" size="18px" />
                Yaratish
              </button>
            </div>
          </div>

          <!-- Sender Details -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-2 h-6 bg-indigo-600 rounded-full inline-block"></span>
              Yuboruvchi (Siz)
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">To'liq F.I.O.</label>
                <input v-model="formData.senderName" type="text" placeholder="Ism Familiya" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Kasb / Unvon</label>
                <input v-model="formData.senderTitle" type="text" placeholder="Masalan: Senior Vue Developer" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">E-pochta</label>
                <input v-model="formData.senderEmail" type="email" placeholder="example@email.com" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Telefon</label>
                <input v-model="formData.senderPhone" type="text" placeholder="+998 90 123 45 67" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Manzil</label>
                <input v-model="formData.senderAddress" type="text" placeholder="Toshkent, O'zbekiston" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Portfolio / Veb-sayt</label>
                <input v-model="formData.senderWebsite" type="text" placeholder="github.com/username" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
            </div>
          </div>

          <!-- Recipient & Subject Details -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-2 h-6 bg-indigo-600 rounded-full inline-block"></span>
              Qabul Qiluvchi (Kompaniya)
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Sana</label>
                <input v-model="formData.date" type="text" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Hiring Manager / Mas'ul F.I.O.</label>
                <input v-model="formData.recipientName" type="text" placeholder="Masalan: Nodir Safarov" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mas'ul lavozimi</label>
                <input v-model="formData.recipientTitle" type="text" placeholder="Masalan: CTO" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Kompaniya nomi</label>
                <input v-model="formData.companyName" type="text" placeholder="Kompaniya MChJ" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Kompaniya manzili</label>
                <input v-model="formData.companyAddress" type="text" placeholder="Kompaniya manzili" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Xat Mavzusi (Subject Line)</label>
                <input v-model="formData.subject" type="text" placeholder="Masalan: Senior Frontend Developer lavozimiga ariza" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
            </div>
          </div>

          <!-- Letter Contents -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-2 h-6 bg-indigo-600 rounded-full inline-block"></span>
              Xat Matni
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Murojaat / Salomlashish (Salutation)</label>
                <input v-model="formData.salutation" type="text" placeholder="Masalan: Hurmatli Nodir aka," class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Asosiy matn (Letter Body)</label>
                <textarea v-model="formData.bodyText" rows="10" placeholder="Kompaniyaga nima sababdan ariza topshirayotganingiz, yutuqlaringiz va maqsadlaringiz..." class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800"></textarea>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Xulosa / Yakun (Sign-off)</label>
                <textarea v-model="formData.signOff" rows="2" placeholder="Hurmat bilan,\nIsmingiz" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm text-slate-800"></textarea>
              </div>
            </div>
          </div>

        </div>

        <!-- Right: Live Preview -->
        <div class="lg:sticky lg:top-8 space-y-4" :class="{ 'hidden': $q.screen.lt.lg && mobileTab !== 'preview' }">
          <div class="flex items-center justify-between px-2">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Jonli Cover Letter Preview</span>
            <span class="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-semibold">Format A4 (210mm)</span>
          </div>

          <!-- A4 Canvas -->
          <div class="bg-white shadow-xl border border-slate-200 overflow-hidden w-full text-slate-800" style="aspect-ratio: 1 / 1.414;" ref="previewRef">
            
            <!-- TEMPLATE 1: Modern Minimalist -->
            <div v-if="activeTemplate === 'modern'" class="h-full grid grid-cols-12 bg-white" style="font-family: 'Inter', sans-serif;">
              <!-- Sidebar -->
              <div class="col-span-4 bg-slate-900 text-slate-100 p-6 flex flex-col justify-between h-full">
                <div class="space-y-6">
                  <div>
                    <h3 class="text-sm font-extrabold text-white leading-tight break-words">{{ formData.senderName || 'Ismingiz' }}</h3>
                    <p class="text-[11px] text-indigo-400 font-semibold tracking-wide mt-1">{{ formData.senderTitle }}</p>
                  </div>
                  
                  <div class="space-y-4 pt-4 border-t border-slate-800">
                    <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kontakt</h4>
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
                    <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wide">Mavzu: {{ formData.subject || 'Kasbga Ariza' }}</h2>
                  </div>

                  <!-- Salutation -->
                  <p class="text-xs font-bold text-slate-800 mb-4">{{ formData.salutation }}</p>

                  <!-- Letter Body -->
                  <div class="text-xs text-slate-600 leading-relaxed space-y-4 whitespace-pre-wrap text-justify">
                    {{ formData.bodyText || 'Xat matnini yozing...' }}
                  </div>

                  <!-- Sign-off -->
                  <div class="mt-8 text-xs text-slate-700 whitespace-pre-wrap">
                    {{ formData.signOff }}
                  </div>
                </div>

                <div class="text-[10px] text-slate-400 text-right">
                  PDF formatda chop etildi
                </div>
              </div>
            </div>

            <!-- TEMPLATE 2: Classic Professional -->
            <div v-else-if="activeTemplate === 'classic'" class="h-full p-10 flex flex-col justify-between bg-white text-slate-800" style="font-family: 'Georgia', serif;">
              <div>
                <!-- Top Header -->
                <div class="text-center pb-4 border-b border-slate-800 mb-6 font-sans">
                  <h2 class="text-2xl font-bold tracking-wide text-slate-900">{{ formData.senderName || 'Ismingiz' }}</h2>
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
                  <h3 class="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1 font-sans">Mavzu: {{ formData.subject }}</h3>
                </div>

                <!-- Salutation -->
                <p class="text-xs font-bold mb-4 font-sans text-slate-900">{{ formData.salutation }}</p>

                <!-- Letter Body -->
                <div class="text-xs text-slate-700 leading-relaxed text-justify whitespace-pre-wrap space-y-4">
                  {{ formData.bodyText || 'Xat matnini kiriting...' }}
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
                      <h2 class="text-2xl font-black tracking-wide">{{ formData.senderName || 'Ismingiz' }}</h2>
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
                    <p class="text-[10px] uppercase font-bold text-indigo-700 tracking-wider mb-1">Maktub yuborilmoqda:</p>
                    <strong class="text-slate-800 text-sm block">{{ formData.recipientName }}</strong>
                    <span class="block">{{ formData.recipientTitle }}</span>
                    <span class="font-semibold block mt-0.5 text-slate-700">{{ formData.companyName }}</span>
                    <span class="text-[11px]">{{ formData.companyAddress }}</span>
                  </div>

                  <!-- Subject -->
                  <h3 class="text-xs font-extrabold text-indigo-800 uppercase tracking-widest mb-3">Mavzu: {{ formData.subject }}</h3>

                  <!-- Salutation -->
                  <p class="text-xs font-bold text-slate-800 mb-3">{{ formData.salutation }}</p>

                  <!-- Letter Body -->
                  <div class="text-xs text-slate-600 leading-relaxed text-justify whitespace-pre-wrap">
                    {{ formData.bodyText || 'Xat matnini yozing...' }}
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
</style>
