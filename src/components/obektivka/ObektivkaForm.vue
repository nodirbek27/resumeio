<script setup lang="ts">
import { ref } from 'vue'
import type { ObektivkaFormData, Qarindosh } from '@/utils/obektivkaStorage'

interface Props {
  modelValue: ObektivkaFormData
}

interface Emits {
  (e: 'update:modelValue', value: ObektivkaFormData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const fileInputRef = ref<HTMLInputElement | null>(null)

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file && file.size <= 1024 * 1024) {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      emit('update:modelValue', {
        ...props.modelValue,
        rasm: base64,
      })
    }
    reader.readAsDataURL(file)
  } else {
    alert('Fayl 1MB dan oshmasligi kerak')
  }
}

const updateField = (field: keyof ObektivkaFormData, value: string | null) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value,
  })
}

const updateQarindosh = (index: number, field: keyof Qarindosh, value: string) => {
  const updatedQarindoshlar = [...props.modelValue.qarindoshlar]
  updatedQarindoshlar[index] = {
    ...updatedQarindoshlar[index],
    [field]: value,
  }
  emit('update:modelValue', {
    ...props.modelValue,
    qarindoshlar: updatedQarindoshlar,
  })
}

const addQarindosh = () => {
  const newQarindosh: Qarindosh = {
    qarindoshligi: '',
    fio: '',
    tugilganYiliJoyi: '',
    ishJoyiVaLavozimi: '',
    yashashJoyi: '',
  }
  emit('update:modelValue', {
    ...props.modelValue,
    qarindoshlar: [...props.modelValue.qarindoshlar, newQarindosh],
  })
}

const removeQarindosh = (index: number) => {
  const updatedQarindoshlar = props.modelValue.qarindoshlar.filter((_, i) => i !== index)
  emit('update:modelValue', {
    ...props.modelValue,
    qarindoshlar: updatedQarindoshlar,
  })
}

const fileName = props.modelValue.rasm ? 'Rasm tanlandi ✓' : 'Rasm tanlang (3x4)'

const triggerFileInput = () => {
  fileInputRef.value?.click()
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Ma'lumotlarni kiriting</h2>

    <!-- Personal Info Section -->
    <div class="space-y-6">
      <!-- Full Name -->
      <div class="border-b pb-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-700">Shaxsiy ma'lumot</h3>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Familiya <span class="text-red-500">*</span>
            </label>
            <input :value="modelValue.familiya"
              @input="updateField('familiya', ($event.target as HTMLInputElement).value)" type="text"
              placeholder="Misol: Abdullayev"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ism <span class="text-red-500">*</span>
            </label>
            <input :value="modelValue.ism" @input="updateField('ism', ($event.target as HTMLInputElement).value)"
              type="text" placeholder="Misol: Botir"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Sharif <span class="text-red-500">*</span>
            </label>
            <input :value="modelValue.sharif" @input="updateField('sharif', ($event.target as HTMLInputElement).value)"
              type="text" placeholder="Misol: Bahodirovich"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <!-- Photo Upload -->
      <div class="border-b pb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Rasm (3x4) <span class="text-red-500">*</span>
        </label>
        <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
        <button @click="triggerFileInput" type="button"
          class="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 transition flex items-center justify-center gap-2 hover:bg-blue-50">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span :class="{ 'text-green-600 font-medium': modelValue.rasm }">{{ fileName }}</span>
        </button>
        <p class="text-xs text-gray-500 mt-2">Format: .jpg, .jpeg, .png | Maks: 1MB</p>
      </div>

      <!-- Current Position -->
      <div class="border-b pb-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-700">Joriy lavozim</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Joriy lavozim sanasi <span class="text-red-500">*</span>
            </label>
            <input :value="modelValue.joriyLavozimSanasi"
              @input="updateField('joriyLavozimSanasi', ($event.target as HTMLInputElement).value)" type="text"
              placeholder="Misol: 2010 yil 06 sentabrdan"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Joriy lavozim to'liq <span class="text-red-500">*</span>
            </label>
            <input :value="modelValue.joriyLavozimToliq"
              @input="updateField('joriyLavozimToliq', ($event.target as HTMLInputElement).value)" type="text"
              placeholder="Misol: O'zbekistan Milliy universiteti mudiri"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <!-- Birth Info -->
      <div class="border-b pb-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-700">Tug'ilgan ma'lumot</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tug'ilgan sana <span class="text-red-500">*</span>
            </label>
            <input :value="modelValue.tugilganSana"
              @input="updateField('tugilganSana', ($event.target as HTMLInputElement).value)" type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tug'ilgan joyi <span class="text-red-500">*</span>
            </label>
            <input :value="modelValue.tugilganJoyi"
              @input="updateField('tugilganJoyi', ($event.target as HTMLInputElement).value)" type="text"
              placeholder="Misol: Qashqadaryo viloyati"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <!-- Education Info -->
      <div class="border-b pb-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-700">Ta'lim ma'lumot</h3>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Millati <span class="text-red-500">*</span>
            </label>
            <input :value="modelValue.millati"
              @input="updateField('millati', ($event.target as HTMLInputElement).value)" type="text"
              placeholder="Misol: o'zbek"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ma'lumoti <span class="text-red-500">*</span>
            </label>
            <select :value="modelValue.malumoti"
              @change="updateField('malumoti', ($event.target as HTMLSelectElement).value)"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Tanlang</option>
              <option value="Oliy">Oliy</option>
              <option value="O'rta maxsus">O'rta maxsus</option>
              <option value="O'rta">O'rta</option>
            </select>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tamomlagan</label>
            <input :value="modelValue.tamomlagan"
              @input="updateField('tamomlagan', ($event.target as HTMLInputElement).value)" type="text"
              placeholder="Misol: 1997 yil Toshkent davlat universiteti"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ma'lumoti bo'yicha mutaxassisligi</label>
            <input :value="modelValue.malumotiMutaxassisligi" @input="
              updateField('malumotiMutaxassisligi', ($event.target as HTMLInputElement).value)
              " type="text" placeholder="Misol: falsafa"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <!-- Scientific Info -->
      <div class="border-b pb-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-700">Ilmiy ma'lumot</h3>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ilmiy darajasi</label>
            <input :value="modelValue.ilmiyDarajasi"
              @input="updateField('ilmiyDarajasi', ($event.target as HTMLInputElement).value)" type="text"
              placeholder="Misol: yo'q"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ilmiy unvoni</label>
            <input :value="modelValue.ilmiyUnvoni"
              @input="updateField('ilmiyUnvoni', ($event.target as HTMLInputElement).value)" type="text"
              placeholder="Misol: yo'q"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="border-b pb-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-700">Qo'shimcha ma'lumot</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Partiyaviyligi</label>
            <input :value="modelValue.partiyaviyligi"
              @input="updateField('partiyaviyligi', ($event.target as HTMLInputElement).value)" type="text"
              placeholder="Misol: O'zbekiston Xalq demokratik partiyasi a'zosi"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Qaysi chet tillarini biladi</label>
            <input :value="modelValue.qaysiChetTillarini"
              @input="updateField('qaysiChetTillarini', ($event.target as HTMLInputElement).value)" type="text"
              placeholder="Til qo'shish"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Davlat mukofotlari bilan taqdirlanganmi</label>
            <input :value="modelValue.davlatMukofotlari"
              @input="updateField('davlatMukofotlari', ($event.target as HTMLInputElement).value)" type="text"
              placeholder="Ma'lumot kiriting"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Xalq deputatlari respublika, viloyat, shahar va
              tuman Kengashi deputatimi</label>
            <input :value="modelValue.xalqDeputatlari"
              @input="updateField('xalqDeputatlari', ($event.target as HTMLInputElement).value)" type="text"
              placeholder="Ma'lumot kiriting"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <!-- Work Activity -->
      <div class="border-b pb-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-700">Mehnat faoliyati</h3>
        <textarea :value="modelValue.mehnatFaoliyati"
          @input="updateField('mehnatFaoliyati', ($event.target as HTMLTextAreaElement).value)"
          placeholder="Mehnat faoliyatingizni batafsil boshqarib yozing" rows="6"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <!-- Relatives Section -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-700">Qarindoshlari haqida ma'lumot</h3>
          <button @click="addQarindosh" type="button"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Qo'shish
          </button>
        </div>

        <div v-for="(qarindosh, index) in modelValue.qarindoshlar" :key="index"
          class="border rounded-lg p-4 mb-4 bg-gray-50">
          <div class="flex justify-between items-center mb-4">
            <h4 class="font-semibold text-gray-700">{{ index + 1 }}. Qarindosh</h4>
            <button @click="removeQarindosh(index)" type="button" class="text-red-500 hover:text-red-700 transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-3">
            <select :value="qarindosh.qarindoshligi" @change="
              updateQarindosh(index, 'qarindoshligi', ($event.target as HTMLSelectElement).value)
              "
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Qarindoshligi</option>
              <option value="Otasi">Otasi</option>
              <option value="Onasi">Onasi</option>
              <option value="Ukasi">Ukasi</option>
              <option value="Singlisi">Singlisi</option>
              <option value="Turmush o'rtog'i">Turmush o'rtog'i</option>
              <option value="O'g'li">O'g'li</option>
              <option value="Qizi">Qizi</option>
            </select>

            <input :value="qarindosh.fio"
              @input="updateQarindosh(index, 'fio', ($event.target as HTMLInputElement).value)" type="text"
              placeholder="F.I.O."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

            <input :value="qarindosh.tugilganYiliJoyi" @input="
              updateQarindosh(
                index,
                'tugilganYiliJoyi',
                ($event.target as HTMLInputElement).value,
              )
              " type="text" placeholder="Tug'ilgan yili va joyi"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

            <input :value="qarindosh.ishJoyiVaLavozimi" @input="
              updateQarindosh(
                index,
                'ishJoyiVaLavozimi',
                ($event.target as HTMLInputElement).value,
              )
              " type="text" placeholder="Ish joyi va lavozimi"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

            <input :value="qarindosh.yashashJoyi" @input="
              updateQarindosh(index, 'yashashJoyi', ($event.target as HTMLInputElement).value)
              " type="text" placeholder="Yashash joyi"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
