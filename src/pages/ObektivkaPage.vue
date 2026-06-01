<script setup lang="ts">
import { reactive, ref, onMounted, watch } from 'vue'
import ObektivkaForm from '@/components/obektivka/ObektivkaForm.vue'
import ObektivkaPreview from '@/components/obektivka/ObektivkaPreview.vue'
import ObektivkaExport from '@/components/obektivka/ObektivkaExport.vue'
import type { ObektivkaFormData } from '@/utils/obektivkaStorage'
import { obektivkaStorage } from '@/utils/obektivkaStorage'

// Default form data
const defaultFormData: ObektivkaFormData = {
  familiya: '',
  ism: '',
  sharif: '',
  rasm: null,
  joriyLavozimSanasi: '',
  joriyLavozimToliq: '',
  tugilganSana: '',
  tugilganJoyi: '',
  millati: '',
  malumoti: '',
  partiyaviyligi: '',
  tamomlagan: '',
  malumotiMutaxassisligi: '',
  ilmiyDarajasi: '',
  ilmiyUnvoni: '',
  qaysiChetTillarini: '',
  davlatMukofotlari: '',
  xalqDeputatlari: '',
  mehnatFaoliyati: '',
  qarindoshlar: [],
}

// Form Data
const formData = reactive<ObektivkaFormData>(defaultFormData)
const previewRef = ref<HTMLDivElement | null>(null)

// Load data on mount
onMounted(() => {
  const savedData = obektivkaStorage.load()
  if (savedData) {
    Object.assign(formData, savedData)
  }
})

// Auto-save on change
watch(
  () => formData,
  (newData) => {
    obektivkaStorage.save(newData)
  },
  { deep: true },
)

// Clear all data
const clearAllData = () => {
  if (confirm("Haqiqatan ham barcha ma'lumotlarni o'chirmoqchisiz?")) {
    Object.assign(formData, defaultFormData)
    obektivkaStorage.clear()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Obektivka (MA'LUMOTNOMA)</h1>
        <p class="text-gray-600">Professional CV qilish va PDF formatda yuklash uchun platforma</p>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <ObektivkaExport :formData="formData" :previewRef="previewRef" />
        <button @click="clearAllData" type="button"
          class="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 font-medium shadow-md">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Barcha ma'lumotni o'chirish
        </button>
      </div>

      <!-- Main Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- LEFT: Preview -->
        <div ref="previewRef" class="order-first lg:order-first">
          <ObektivkaPreview v-model="formData" />
        </div>

        <!-- RIGHT: Form -->
        <div class="lg:sticky lg:top-6 lg:h-fit order-last lg:order-last">
          <ObektivkaForm v-model="formData" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  body {
    background: white;
  }
}
</style>
