<script setup lang="ts">
import { ref } from 'vue'
import type { ObektivkaFormData } from '@/utils/obektivkaStorage'
import DonateDialog from '@/components/DonateDialog.vue'

interface Props {
  formData: ObektivkaFormData
  previewRef: HTMLDivElement | null
}

const props = defineProps<Props>()

const showDonateDialog = ref(false)
const pendingAction = ref<'pdf' | 'word' | null>(null)

const downloadPDF = async () => {
  try {
    // Dynamically import html2canvas and jsPDF
    const html2Canvas = (await import('html2canvas')).default
    const { jsPDF } = await import('jspdf')

    if (!props.previewRef) {
      alert('Preview topilmadi')
      return
    }

    // Get all page elements
    const pages = props.previewRef.querySelectorAll('.obektivka-pdf-page')

    if (pages.length === 0) {
      alert('Sahifalar topilmadi')
      return
    }

    const pdf = new jsPDF('p', 'mm', 'a4')
    let isFirstPage = true

    for (const page of Array.from(pages)) {
      const el = page as HTMLElement
      const rect = el.getBoundingClientRect()
      const canvas = await html2Canvas(el, {
        scale: window.devicePixelRatio > 1 ? 1.5 : 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        scrollX: -rect.left,
        scrollY: -rect.top,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      if (!isFirstPage) {
        pdf.addPage()
      }

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      isFirstPage = false
    }

    // Save PDF
    const fileName = `${props.formData.familiya}_${props.formData.ism}_Obektivka.pdf`
    pdf.save(fileName)
  } catch (error) {
    console.error('PDF generation error:', error)
    alert('PDF yaratishda xatolik yuz berdi')
  }
}

const downloadWord = async () => {
  const { generateObektivkaDocx } = await import('@/utils/generateObektivkaDocx')
  await generateObektivkaDocx(props.formData)
}

const requestPdf = () => {
  pendingAction.value = 'pdf'
  showDonateDialog.value = true
}

const requestWord = () => {
  pendingAction.value = 'word'
  showDonateDialog.value = true
}

const onConfirmDownload = () => {
  if (pendingAction.value === 'pdf') downloadPDF()
  else if (pendingAction.value === 'word') downloadWord()
  pendingAction.value = null
}
</script>

<template>
  <div class="download-actions">
    <!-- PDF BUTTON -->
    <button @click="requestPdf" type="button" class="btn btn-pdf">
      <svg class="icon" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-6-4m6 4l6-4" />
      </svg>
      <span>PDF yuklash</span>
    </button>

    <!-- WORD BUTTON -->
    <button @click="requestWord" type="button" class="btn btn-word">
      <svg class="icon" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-6-4m6 4l6-4" />
      </svg>
      <span>Word yuklash</span>
    </button>
  </div>

  <DonateDialog v-model="showDonateDialog" @confirm="onConfirmDownload" />
</template>

<style scoped>
.download-actions {
  display: contents;
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  border: none;
  font-size: 13px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  user-select: none;
}

.icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.btn-pdf {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
}

.btn-pdf:hover {
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
  transform: translateY(-1px);
}

.btn-word {
  background: linear-gradient(135deg, #16a34a, #15803d);
}

.btn-word:hover {
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4);
  transform: translateY(-1px);
}

.btn:active {
  transform: scale(0.97);
}

/* mobile */
@media (max-width: 480px) {
  .download-actions {
    flex-direction: column;
  }
}
</style>
