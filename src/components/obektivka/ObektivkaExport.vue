<script setup lang="ts">
import type { ObektivkaFormData } from '@/utils/obektivkaStorage'

interface Props {
  formData: ObektivkaFormData
  previewRef: HTMLDivElement | null
}

const props = defineProps<Props>()

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
      const canvas = await html2Canvas(page as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
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

const downloadJSON = (formData: ObektivkaFormData) => {
  try {
    const json = JSON.stringify(formData, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${formData.familiya}_${formData.ism}_obektivka.json`
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('JSON download error:', error)
    alert('JSON yuklab olishda xatolik yuz berdi')
  }
}
</script>

<template>
  <div class="flex gap-3">
    <button @click="downloadPDF" type="button"
      class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium shadow-md">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-6-4m6 4l6-4" />
      </svg>
      PDF yuklab olish
    </button>

    <button @click="downloadJSON(formData)" type="button"
      class="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-medium shadow-md">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-6-4m6 4l6-4" />
      </svg>
      Word yuklab olish
    </button>
  </div>
</template>

<style scoped></style>
