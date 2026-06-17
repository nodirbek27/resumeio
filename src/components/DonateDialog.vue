<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'

interface Props {
  modelValue: boolean
}
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const $q = useQuasar()

const CARD_NUMBER = '4231 2000 8021 2037'

const copied = ref(false)

const copyCard = async () => {
  try {
    await navigator.clipboard.writeText(CARD_NUMBER.replace(/\s/g, ''))
    copied.value = true
    $q.notify({ type: 'positive', message: 'Card number copied', position: 'top', timeout: 1500 })
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    $q.notify({ type: 'negative', message: 'Could not copy', position: 'top' })
  }
}

const close = () => emit('update:modelValue', false)

const proceedDownload = () => {
  emit('confirm')
  close()
}
</script>

<template>
  <q-dialog :model-value="modelValue" @update:model-value="(v) => emit('update:modelValue', v)">
    <q-card class="donate-card">

      <q-btn flat round dense icon="mdi-close" class="close-btn" @click="close" />

      <div class="donate-header">
        <div class="donate-icon">
          <q-icon name="mdi-heart" size="22px" color="white" />
        </div>
        <h3 class="donate-title">Enjoying ResumeIO?</h3>
        <p class="donate-sub">This tool is free. If it helped you, consider supporting its development.</p>
      </div>

      <div class="card-visual">
        <div class="card-visual-top">
          <q-icon name="mdi-credit-card-outline" size="20px" />
          <span class="card-brand">VISA</span>
        </div>
        <p class="card-number">{{ CARD_NUMBER }}</p>
      </div>

      <q-btn
        :icon="copied ? 'mdi-check' : 'mdi-content-copy'"
        :label="copied ? 'Copied!' : 'Copy card number'"
        :color="copied ? 'positive' : 'primary'"
        outline
        rounded
        unelevated
        class="copy-btn"
        @click="copyCard"
      />

      <q-separator class="q-my-md" />

      <q-btn
        color="primary"
        icon="mdi-download"
        label="Download"
        unelevated
        rounded
        class="download-btn"
        @click="proceedDownload"
      />

    </q-card>
  </q-dialog>
</template>

<style scoped>
.donate-card {
  width: 380px;
  max-width: 90vw;
  border-radius: 20px;
  padding: 28px 24px 20px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  color: #94a3b8;
}

.donate-header {
  text-align: center;
  margin-bottom: 20px;
}

.donate-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f87171, #ef4444);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.donate-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 6px;
}

.donate-sub {
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

.card-visual {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  padding: 20px;
  color: white;
  margin-bottom: 14px;
  position: relative;
  overflow: hidden;
}

.card-visual::after {
  content: '';
  position: absolute;
  width: 140px;
  height: 140px;
  background: rgba(255,255,255,0.05);
  border-radius: 50%;
  top: -60px;
  right: -40px;
}

.card-visual-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.card-brand {
  font-style: italic;
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: 1px;
}

.card-number {
  font-family: 'Courier New', monospace;
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 2px;
  margin: 0;
}

.copy-btn {
  width: 100%;
  font-weight: 600 !important;
  font-size: 13px !important;
}

.download-btn {
  width: 100%;
  font-weight: 700 !important;
  font-size: 14px !important;
  padding: 10px 0 !important;
}
</style>
