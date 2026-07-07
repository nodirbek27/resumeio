<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import ObektivkaForm from '@/components/obektivka/ObektivkaForm.vue'
import ObektivkaPreview from '@/components/obektivka/ObektivkaPreview.vue'
import ObektivkaExport from '@/components/obektivka/ObektivkaExport.vue'
import type { ObektivkaFormData } from '@/utils/obektivkaStorage'
import { obektivkaStorage } from '@/utils/obektivkaStorage'

const $q = useQuasar()
const isMobile = $q.screen.lt.md
const showPreviewDialog = ref(false)

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
  harbiyUnvoni: '',
  qaysiChetTillarini: '',
  davlatMukofotlari: '',
  xalqDeputatlari: '',
  telefon: '',
  mehnatFaoliyatiRoyxat: [],
  qarindoshlar: [],
}

const formData = ref<ObektivkaFormData>({ ...defaultFormData })
const previewRef = ref<HTMLDivElement | null>(null)

// Mobile preview scale
const A4_PX = (210 / 25.4) * 96 // ~794px
const mobileScale = ref(1)

const updateScale = () => {
  mobileScale.value = Math.min(1, (window.innerWidth - 32) / A4_PX)
}

const mobileOuterStyle = computed(() => {
  const a4H = (297 / 25.4) * 96 // ~1122px per page
  return { height: `${(a4H * 2 + 24) * mobileScale.value}px`, position: 'relative' as const }
})

const mobileInnerStyle = computed(() => ({
  transform: `scale(${mobileScale.value})`,
  transformOrigin: 'top left',
  width: '210mm',
  position: 'absolute' as const,
}))

onMounted(() => {
  const savedData = obektivkaStorage.load()
  if (savedData) {
    formData.value = savedData
  }
  updateScale()
  window.addEventListener('resize', updateScale)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScale)
})

watch(
  formData,
  (newData) => {
    obektivkaStorage.save(newData)
  },
  { deep: true },
)

const clearAllData = () => {
  if (confirm("Haqiqatan ham barcha ma'lumotlarni o'chirmoqchisiz?")) {
    formData.value = { ...defaultFormData, mehnatFaoliyatiRoyxat: [], qarindoshlar: [] }
    obektivkaStorage.clear()
  }
}
</script>

<template>
  <div class="obektivka-page-wrap">
    <div class="obektivka-container">

      <!-- Header -->
      <div class="obektivka-topbar">
        <div>
          <h1 class="obektivka-heading">Obyektivka (MA'LUMOTNOMA)</h1>
          <p class="obektivka-sub">Ma'lumotlarni to'ldiring va yuklab oling</p>
        </div>
        <div class="obektivka-actions">
          <ObektivkaExport :formData="formData" :previewRef="previewRef" />
          <button @click="clearAllData" type="button" class="clear-btn">
            <q-icon name="mdi-trash-can-outline" size="18px" />
            O'chirish
          </button>
        </div>
      </div>

      <!-- Main layout -->
      <div class="obektivka-grid">

        <!-- LEFT: Preview (desktop) -->
        <div ref="previewRef" class="preview-col">
          <ObektivkaPreview v-model="formData" />
        </div>

        <!-- RIGHT: Form -->
        <div class="form-col">
          <ObektivkaForm v-model="formData" />
        </div>

      </div>

      <!-- Mobile preview button -->
      <q-btn
        v-if="$q.screen.lt.md"
        color="primary"
        icon="mdi-eye-outline"
        label="Ko'rish"
        unelevated
        rounded
        class="mobile-preview-btn"
        @click="showPreviewDialog = true"
      />

    </div>

    <!-- Mobile Preview Dialog -->
    <q-dialog v-model="showPreviewDialog" maximized>
      <q-card>
        <q-bar class="dialog-bar">
          <q-icon name="mdi-file-document-outline" />
          <span class="q-ml-sm">Obektivka Preview</span>
          <q-space />
          <q-btn dense flat icon="mdi-close" v-close-popup />
        </q-bar>
        <q-card-section class="q-pa-sm" style="overflow-y: auto; max-height: calc(100vh - 50px)">
          <div :style="mobileOuterStyle">
            <div :style="mobileInnerStyle">
              <ObektivkaPreview v-model="formData" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>
.obektivka-page-wrap {
  min-height: 100vh;
  background: #f1f5f9;
  padding: 16px;
}

.obektivka-container {
  max-width: 1200px;
  margin: 0 auto;
}

.obektivka-topbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  background: white;
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.obektivka-heading {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 4px;
}

.obektivka-sub {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

.obektivka-actions {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  align-items: center;
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}

.clear-btn:hover {
  background: #fecaca;
}

.obektivka-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

.preview-col {
  position: sticky;
  top: 16px;
}

.form-col {
  /* form scrollable */
}

.mobile-preview-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
}

.dialog-bar {
  background: var(--q-primary);
  color: white;
  font-weight: 600;
}

@media (max-width: 768px) {
  .obektivka-grid {
    grid-template-columns: 1fr;
  }

  .preview-col {
    position: fixed;
    left: -9999px;
    top: 0;
    width: 210mm;
    pointer-events: none;
    z-index: -1;
  }

  .obektivka-page-wrap {
    padding-bottom: 80px;
  }
}

@media print {
  body {
    background: white;
  }
}
</style>
