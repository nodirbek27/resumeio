<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ObektivkaFormData, Qarindosh, MehnatFaoliyati } from '@/utils/obektivkaStorage'

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
      emit('update:modelValue', { ...props.modelValue, rasm: reader.result as string })
    }
    reader.readAsDataURL(file)
  } else {
    alert('Fayl 1MB dan oshmasligi kerak')
  }
}

const updateField = (field: keyof ObektivkaFormData, value: string | null) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

// Qarindosh
const updateQarindosh = (index: number, field: keyof Qarindosh, value: string) => {
  const list = [...props.modelValue.qarindoshlar]
  list[index] = { ...list[index], [field]: value }
  emit('update:modelValue', { ...props.modelValue, qarindoshlar: list })
}
const addQarindosh = () => {
  const item: Qarindosh = { qarindoshligi: '', fio: '', tugilganYiliJoyi: '', ishJoyiVaLavozimi: '', yashashJoyi: '' }
  emit('update:modelValue', { ...props.modelValue, qarindoshlar: [...props.modelValue.qarindoshlar, item] })
}
const removeQarindosh = (index: number) => {
  emit('update:modelValue', {
    ...props.modelValue,
    qarindoshlar: props.modelValue.qarindoshlar.filter((_, i) => i !== index),
  })
}

// Mehnat faoliyati
const updateMehnat = (index: number, field: keyof MehnatFaoliyati, value: string) => {
  const list = [...props.modelValue.mehnatFaoliyatiRoyxat]
  list[index] = { ...list[index], [field]: value }
  emit('update:modelValue', { ...props.modelValue, mehnatFaoliyatiRoyxat: list })
}
const addMehnat = () => {
  const item: MehnatFaoliyati = { dan: '', gacha: '', lavozim: '' }
  emit('update:modelValue', {
    ...props.modelValue,
    mehnatFaoliyatiRoyxat: [...props.modelValue.mehnatFaoliyatiRoyxat, item],
  })
}
const removeMehnat = (index: number) => {
  emit('update:modelValue', {
    ...props.modelValue,
    mehnatFaoliyatiRoyxat: props.modelValue.mehnatFaoliyatiRoyxat.filter((_, i) => i !== index),
  })
}

const photoLabel = computed(() => props.modelValue.rasm ? 'Rasm tanlandi ✓' : 'Rasm tanlang (3x4)')
</script>

<template>
  <div class="form-card">
    <h2 class="form-title">Ma'lumotlarni kiriting</h2>

    <!-- ── Shaxsiy ma'lumot ─────────────────────── -->
    <section class="form-section">
      <h3 class="section-title">1. Shaxsiy ma'lumot</h3>

      <div class="grid-3">
        <div class="field">
          <label class="label">Familiya <span class="req">*</span></label>
          <input :value="modelValue.familiya"
            @input="updateField('familiya', ($event.target as HTMLInputElement).value)"
            type="text" placeholder="Abdullayev" class="inp" />
        </div>
        <div class="field">
          <label class="label">Ism <span class="req">*</span></label>
          <input :value="modelValue.ism"
            @input="updateField('ism', ($event.target as HTMLInputElement).value)"
            type="text" placeholder="Botir" class="inp" />
        </div>
        <div class="field">
          <label class="label">Sharif <span class="req">*</span></label>
          <input :value="modelValue.sharif"
            @input="updateField('sharif', ($event.target as HTMLInputElement).value)"
            type="text" placeholder="Bahodirovich" class="inp" />
        </div>
      </div>

      <!-- Photo upload -->
      <div class="field mt-2">
        <label class="label">Rasm (3×4) <span class="req">*</span></label>
        <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
        <button @click="fileInputRef?.click()" type="button" class="photo-btn"
          :class="{ 'photo-btn--done': modelValue.rasm }">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>{{ photoLabel }}</span>
        </button>
        <p class="hint">Format: .jpg, .png | Maks: 1MB</p>
      </div>

      <div class="grid-2 mt-2">
        <div class="field">
          <label class="label">Tug'ilgan sana <span class="req">*</span></label>
          <input :value="modelValue.tugilganSana"
            @input="updateField('tugilganSana', ($event.target as HTMLInputElement).value)"
            type="date" class="inp" />
        </div>
        <div class="field">
          <label class="label">Tug'ilgan joyi <span class="req">*</span></label>
          <input :value="modelValue.tugilganJoyi"
            @input="updateField('tugilganJoyi', ($event.target as HTMLInputElement).value)"
            type="text" placeholder="Qashqadaryo viloyati, Shahrisabz tumani" class="inp" />
        </div>
      </div>

      <div class="grid-2 mt-2">
        <div class="field">
          <label class="label">Millati <span class="req">*</span></label>
          <input :value="modelValue.millati"
            @input="updateField('millati', ($event.target as HTMLInputElement).value)"
            type="text" placeholder="o'zbek" class="inp" />
        </div>
        <div class="field">
          <label class="label">Partiyaviyligi</label>
          <input :value="modelValue.partiyaviyligi"
            @input="updateField('partiyaviyligi', ($event.target as HTMLInputElement).value)"
            type="text" placeholder="Partiyasiz" class="inp" />
        </div>
      </div>
    </section>

    <!-- ── Ta'lim ─────────────────────────────── -->
    <section class="form-section">
      <h3 class="section-title">2. Ta'lim</h3>

      <div class="grid-2">
        <div class="field">
          <label class="label">Ma'lumoti <span class="req">*</span></label>
          <select :value="modelValue.malumoti"
            @change="updateField('malumoti', ($event.target as HTMLSelectElement).value)"
            class="inp">
            <option value="">Tanlang</option>
            <option value="Oliy">Oliy</option>
            <option value="O'rta maxsus">O'rta maxsus</option>
            <option value="O'rta">O'rta</option>
          </select>
        </div>
        <div class="field">
          <label class="label">Ma'lumoti bo'yicha mutaxassisligi</label>
          <input :value="modelValue.malumotiMutaxassisligi"
            @input="updateField('malumotiMutaxassisligi', ($event.target as HTMLInputElement).value)"
            type="text" placeholder="Falsafa" class="inp" />
        </div>
      </div>

      <div class="field mt-2">
        <label class="label">Qaysi o'quv yurtini tamomlagan (yil va nomi)</label>
        <input :value="modelValue.tamomlagan"
          @input="updateField('tamomlagan', ($event.target as HTMLInputElement).value)"
          type="text" placeholder="1997 yilda Toshkent davlat universiteti" class="inp" />
      </div>

      <div class="grid-2 mt-2">
        <div class="field">
          <label class="label">Ilmiy darajasi</label>
          <input :value="modelValue.ilmiyDarajasi"
            @input="updateField('ilmiyDarajasi', ($event.target as HTMLInputElement).value)"
            type="text" placeholder="Yo'q" class="inp" />
        </div>
        <div class="field">
          <label class="label">Ilmiy unvoni</label>
          <input :value="modelValue.ilmiyUnvoni"
            @input="updateField('ilmiyUnvoni', ($event.target as HTMLInputElement).value)"
            type="text" placeholder="Yo'q" class="inp" />
        </div>
      </div>
    </section>

    <!-- ── Qo'shimcha ──────────────────────────── -->
    <section class="form-section">
      <h3 class="section-title">3. Qo'shimcha ma'lumot</h3>

      <div class="grid-2">
        <div class="field">
          <label class="label">Qaysi chet tillarini biladi</label>
          <input :value="modelValue.qaysiChetTillarini"
            @input="updateField('qaysiChetTillarini', ($event.target as HTMLInputElement).value)"
            type="text" placeholder="Rus tili (erkin), Ingliz tili (o'rta)" class="inp" />
        </div>
        <div class="field">
          <label class="label">Harbiy (maxsus) unvoni</label>
          <input :value="modelValue.harbiyUnvoni"
            @input="updateField('harbiyUnvoni', ($event.target as HTMLInputElement).value)"
            type="text" placeholder="yo'q" class="inp" />
        </div>
      </div>

      <div class="field mt-2">
        <label class="label">Davlat mukofotlari bilan taqdirlanganmi (qanaqa)</label>
        <input :value="modelValue.davlatMukofotlari"
          @input="updateField('davlatMukofotlari', ($event.target as HTMLInputElement).value)"
          type="text" placeholder="yo'q" class="inp" />
      </div>

      <div class="field mt-2">
        <label class="label">Xalq deputatlari Kengashi deputatimi yoki boshqa saylanadigan organlar a'zosimi</label>
        <input :value="modelValue.xalqDeputatlari"
          @input="updateField('xalqDeputatlari', ($event.target as HTMLInputElement).value)"
          type="text" placeholder="yo'q" class="inp" />
      </div>

      <div class="field mt-2">
        <label class="label">Telefon raqami</label>
        <input :value="modelValue.telefon"
          @input="updateField('telefon', ($event.target as HTMLInputElement).value)"
          type="text" placeholder="+998 (90) 123-45-67" class="inp" />
      </div>
    </section>

    <!-- ── Joriy lavozim ───────────────────────── -->
    <section class="form-section">
      <h3 class="section-title">4. Joriy lavozim</h3>

      <div class="field">
        <label class="label">Joriy lavozimi (to'liq)</label>
        <input :value="modelValue.joriyLavozimToliq"
          @input="updateField('joriyLavozimToliq', ($event.target as HTMLInputElement).value)"
          type="text" placeholder="O'zbekiston Milliy universiteti rektori" class="inp" />
      </div>
      <div class="field mt-2">
        <label class="label">Lavozimga tayinlangan sana</label>
        <input :value="modelValue.joriyLavozimSanasi"
          @input="updateField('joriyLavozimSanasi', ($event.target as HTMLInputElement).value)"
          type="text" placeholder="2010 yil 6 sentabrdan" class="inp" />
      </div>
    </section>

    <!-- ── Mehnat faoliyati ────────────────────── -->
    <section class="form-section">
      <div class="section-header">
        <h3 class="section-title">5. Mehnat faoliyati</h3>
        <button @click="addMehnat" type="button" class="add-btn">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Qo'shish
        </button>
      </div>
      <p class="hint mb-2">Yangi ish joyini qo'shing. "Gacha" maydoniga <strong>h.v.</strong> (hozirgi vaqt) yozing.</p>

      <div v-if="modelValue.mehnatFaoliyatiRoyxat.length === 0" class="empty-state">
        Mehnat faoliyati qo'shilmagan. "Qo'shish" tugmasini bosing.
      </div>

      <div v-for="(item, index) in modelValue.mehnatFaoliyatiRoyxat" :key="index" class="mehnat-item">
        <div class="mehnat-item-header">
          <span class="mehnat-num">{{ index + 1 }}</span>
          <button @click="removeMehnat(index)" type="button" class="remove-btn">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="grid-2 mt-1">
          <div class="field">
            <label class="label">Dan (boshlanish)</label>
            <input :value="item.dan"
              @input="updateMehnat(index, 'dan', ($event.target as HTMLInputElement).value)"
              type="text" placeholder="2010 yil mart" class="inp" />
          </div>
          <div class="field">
            <label class="label">Gacha (tugash)</label>
            <input :value="item.gacha"
              @input="updateMehnat(index, 'gacha', ($event.target as HTMLInputElement).value)"
              type="text" placeholder="2015 yil iyun yoki h.v." class="inp" />
          </div>
        </div>
        <div class="field mt-1">
          <label class="label">Ish joyi, lavozimi va tashkilot nomi</label>
          <input :value="item.lavozim"
            @input="updateMehnat(index, 'lavozim', ($event.target as HTMLInputElement).value)"
            type="text" placeholder="O'qituvchi, Toshkent davlat universiteti" class="inp" />
        </div>
      </div>
    </section>

    <!-- ── Qarindoshlar ───────────────────────── -->
    <section class="form-section" style="border-bottom: none;">
      <div class="section-header">
        <h3 class="section-title">6. Yaqin qarindoshlari</h3>
        <button @click="addQarindosh" type="button" class="add-btn">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Qo'shish
        </button>
      </div>

      <div v-if="modelValue.qarindoshlar.length === 0" class="empty-state">
        Qarindosh qo'shilmagan. "Qo'shish" tugmasini bosing.
      </div>

      <div v-for="(q, index) in modelValue.qarindoshlar" :key="index" class="qarindosh-item">
        <div class="mehnat-item-header">
          <span class="mehnat-num">{{ index + 1 }}. Qarindosh</span>
          <button @click="removeQarindosh(index)" type="button" class="remove-btn">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="grid-2 mt-1">
          <div class="field">
            <label class="label">Qarindoshligi</label>
            <select :value="q.qarindoshligi"
              @change="updateQarindosh(index, 'qarindoshligi', ($event.target as HTMLSelectElement).value)"
              class="inp">
              <option value="">Tanlang</option>
              <option value="Otasi">Otasi</option>
              <option value="Onasi">Onasi</option>
              <option value="Turmush o'rtog'i">Turmush o'rtog'i</option>
              <option value="Turmush o'rtog'ining otasi">Turmush o'rtog'ining otasi</option>
              <option value="Turmush o'rtog'ining onasi">Turmush o'rtog'ining onasi</option>
              <option value="Akasi">Akasi</option>
              <option value="Ukasi">Ukasi</option>
              <option value="Opasi">Opasi</option>
              <option value="Singlisi">Singlisi</option>
              <option value="O'g'li">O'g'li</option>
              <option value="Qizi">Qizi</option>
            </select>
          </div>
          <div class="field">
            <label class="label">F.I.Sh.</label>
            <input :value="q.fio"
              @input="updateQarindosh(index, 'fio', ($event.target as HTMLInputElement).value)"
              type="text" placeholder="Abdullayev Ali Bahodirovich" class="inp" />
          </div>
        </div>
        <div class="grid-2 mt-1">
          <div class="field">
            <label class="label">Tug'ilgan yili va joyi</label>
            <input :value="q.tugilganYiliJoyi"
              @input="updateQarindosh(index, 'tugilganYiliJoyi', ($event.target as HTMLInputElement).value)"
              type="text" placeholder="1955 yil, Toshkent" class="inp" />
          </div>
          <div class="field">
            <label class="label">Yashash joyi</label>
            <input :value="q.yashashJoyi"
              @input="updateQarindosh(index, 'yashashJoyi', ($event.target as HTMLInputElement).value)"
              type="text" placeholder="Toshkent sh., Chilonzor t." class="inp" />
          </div>
        </div>
        <div class="field mt-1">
          <label class="label">Ish joyi va lavozimi</label>
          <input :value="q.ishJoyiVaLavozimi"
            @input="updateQarindosh(index, 'ishJoyiVaLavozimi', ($event.target as HTMLInputElement).value)"
            type="text" placeholder="Pensioner yoki O'qituvchi, 15-maktab" class="inp" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.form-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  padding: 24px;
}

.form-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 20px;
}

.form-section {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 12px;
}

.section-header .section-title {
  margin: 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.req {
  color: #ef4444;
}

.inp {
  padding: 8px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  color: #1e293b;
  background: #f8fafc;
  outline: none;
  transition: border-color 0.15s;
}

.inp:focus {
  border-color: var(--q-primary, #239f55);
  background: white;
}

.hint {
  font-size: 11px;
  color: #94a3b8;
  margin: 2px 0 0;
}

.photo-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: #64748b;
  transition: border-color 0.15s, background 0.15s;
}

.photo-btn:hover {
  border-color: var(--q-primary, #239f55);
  background: #f0fdf4;
}

.photo-btn--done {
  border-color: #22c55e;
  color: #16a34a;
}

.hidden {
  display: none;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}

.mt-1 { margin-top: 8px; }
.mt-2 { margin-top: 12px; }
.mb-2 { margin-bottom: 8px; }

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: var(--q-primary, #239f55);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.add-btn:hover {
  opacity: 0.85;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #ef4444;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.15s;
}

.remove-btn:hover {
  background: #fee2e2;
}

.mehnat-item,
.qarindosh-item {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 10px;
  background: #f8fafc;
}

.mehnat-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mehnat-num {
  font-size: 12px;
  font-weight: 700;
  color: #475569;
}

.empty-state {
  text-align: center;
  padding: 16px;
  color: #94a3b8;
  font-size: 13px;
  border: 1px dashed #e2e8f0;
  border-radius: 8px;
}

@media (max-width: 480px) {
  .grid-2,
  .grid-3 {
    grid-template-columns: 1fr;
  }
}
</style>
