<script setup lang="ts">
import type { ObektivkaFormData } from '@/utils/obektivkaStorage'

interface Props {
  modelValue: ObektivkaFormData
}

defineProps<Props>()

const formatDate = (date: string): string => {
  if (!date) return '—'
  const d = new Date(date)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}
</script>

<template>
  <div class="space-y-6">
    <!-- PAGE 1: Personal Info & Education -->
    <div class="bg-white shadow-lg p-8 border border-gray-300 w-full obektivka-pdf-page"
      style="width: 210mm; height: auto; margin: 0 auto; page-break-after: always">
      <!-- Header -->
      <div class="text-center mb-8 border-b-2 border-gray-400 pb-6">
        <h1 class="text-xl font-bold">МА'ЛУМОТНОМА</h1>
        <p class="text-xs text-gray-600 mt-1">(14 шрифт)</p>
      </div>

      <!-- Full Name & Photo -->
      <div class="flex justify-between items-start mb-8">
        <div class="flex-1 pr-4">
          <h2 class="text-lg font-bold text-center mb-2">
            {{ modelValue.familiya.toUpperCase() }} {{ modelValue.ism.toUpperCase() }}
            {{ modelValue.sharif.toUpperCase() }}
          </h2>
          <p class="text-xs text-center text-gray-600">(14 шрифт)</p>
        </div>
        <div v-if="modelValue.rasm" class="flex-shrink-0">
          <img :src="modelValue.rasm" alt="Profile" class="w-28 h-36 object-cover border-2 border-gray-400" />
        </div>
        <div v-else class="flex-shrink-0">
          <div
            class="w-28 h-36 bg-gray-200 border-2 border-gray-400 flex items-center justify-center text-xs text-gray-500">
            Rasm yo'q
          </div>
        </div>
      </div>

      <!-- Main Info Grid (2 columns) -->
      <div class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm mb-8">
        <div>
          <p class="font-bold text-gray-800">Tugilgan sana:</p>
          <p class="text-gray-700">{{ formatDate(modelValue.tugilganSana) }}</p>
        </div>
        <div>
          <p class="font-bold text-gray-800">Tugilgan joyi:</p>
          <p class="text-gray-700">{{ modelValue.tugilganJoyi || '—' }}</p>
        </div>

        <div>
          <p class="font-bold text-gray-800">Millati:</p>
          <p class="text-gray-700">{{ modelValue.millati || '—' }}</p>
        </div>
        <div>
          <p class="font-bold text-gray-800">Partiyaviyligi:</p>
          <p class="text-gray-700">{{ modelValue.partiyaviyligi || '—' }}</p>
        </div>

        <div>
          <p class="font-bold text-gray-800">Ma'lumoti:</p>
          <p class="text-gray-700">{{ modelValue.malumoti || '—' }}</p>
        </div>
        <div>
          <p class="font-bold text-gray-800">Tamomlagan:</p>
          <p class="text-gray-700">{{ modelValue.tamomlagan || '—' }}</p>
        </div>

        <div>
          <p class="font-bold text-gray-800">Mutaxassisligi:</p>
          <p class="text-gray-700">{{ modelValue.malumotiMutaxassisligi || '—' }}</p>
        </div>
        <div>
          <p class="font-bold text-gray-800">Ilmiy darajasi:</p>
          <p class="text-gray-700">{{ modelValue.ilmiyDarajasi || '—' }}</p>
        </div>

        <div>
          <p class="font-bold text-gray-800">Ilmiy unvoni:</p>
          <p class="text-gray-700">{{ modelValue.ilmiyUnvoni || '—' }}</p>
        </div>
        <div>
          <p class="font-bold text-gray-800">Chet tillari:</p>
          <p class="text-gray-700">{{ modelValue.qaysiChetTillarini || '—' }}</p>
        </div>
      </div>

      <!-- Current Position -->
      <div v-if="modelValue.joriyLavozimToliq" class="mb-6 border-t border-gray-300 pt-4">
        <p class="text-sm mb-2">
          <strong>Joriy lavozim:</strong> {{ modelValue.joriyLavozimToliq }}
        </p>
        <p class="text-sm"><strong>Sana:</strong> {{ modelValue.joriyLavozimSanasi }}</p>
      </div>

      <!-- Awards & Recognition -->
      <div v-if="modelValue.davlatMukofotlari || modelValue.xalqDeputatlari" class="border-t border-gray-300 pt-4">
        <div v-if="modelValue.davlatMukofotlari" class="text-sm mb-2">
          <p><strong>Davlat mukofotlari:</strong> {{ modelValue.davlatMukofotlari }}</p>
        </div>
        <div v-if="modelValue.xalqDeputatlari" class="text-sm">
          <p><strong>Deputat maqomi:</strong> {{ modelValue.xalqDeputatlari }}</p>
        </div>
      </div>
    </div>

    <!-- PAGE 2: Work Activity & Relatives -->
    <div class="bg-white shadow-lg p-8 border border-gray-300 w-full obektivka-pdf-page"
      style="width: 210mm; height: auto; margin: 0 auto">
      <!-- Header -->
      <div class="text-center mb-6 border-b-2 border-gray-400 pb-4">
        <h1 class="text-lg font-bold">MEHNAT FAOLIYATI VA QARINDOSHLARI HAQIDA MA'LUMOT</h1>
        <p class="text-xs text-gray-600 mt-1">
          {{ modelValue.familiya.toUpperCase() }} {{ modelValue.ism.toUpperCase() }}
          {{ modelValue.sharif.toUpperCase() }}
        </p>
      </div>

      <!-- Work Activity -->
      <div v-if="modelValue.mehnatFaoliyati" class="mb-8">
        <h3 class="font-bold text-gray-800 mb-3 text-base">MEHNAT FAOLIYATI (14 шрифт)</h3>
        <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {{ modelValue.mehnatFaoliyati }}
        </p>
      </div>

      <!-- Relatives Table -->
      <div v-if="modelValue.qarindoshlar.length > 0">
        <h3 class="font-bold text-gray-800 mb-3 text-base">
          QARINDOSHLARI HAQIDA MA'LUMOT (12 шрифт)
        </h3>
        <table class="w-full border-collapse border border-gray-600 text-xs">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-600 p-2 text-left font-bold">Qarindoshligi</th>
              <th class="border border-gray-600 p-2 text-left font-bold">F.I.O.</th>
              <th class="border border-gray-600 p-2 text-left font-bold">Tugilgan yili va joyi</th>
              <th class="border border-gray-600 p-2 text-left font-bold">Ish joyi va lavozimi</th>
              <th class="border border-gray-600 p-2 text-left font-bold">Yashash joyi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(q, i) in modelValue.qarindoshlar" :key="i">
              <td class="border border-gray-600 p-2">{{ q.qarindoshligi }}</td>
              <td class="border border-gray-600 p-2">{{ q.fio }}</td>
              <td class="border border-gray-600 p-2">{{ q.tugilganYiliJoyi }}</td>
              <td class="border border-gray-600 p-2">{{ q.ishJoyiVaLavozimi }}</td>
              <td class="border border-gray-600 p-2">{{ q.yashashJoyi }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="mt-12 border-t border-gray-300 pt-6 text-sm">
        <p class="text-gray-700 mb-6">
          <strong>Imzo:</strong> _________________________ (tavsif) _________________ (sana)
        </p>
        <p class="text-gray-700">
          <strong>Muassasa pechat'i:</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  * {
    margin: 0;
    padding: 0;
  }
}
</style>
