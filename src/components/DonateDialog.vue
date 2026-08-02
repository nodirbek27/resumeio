<script setup lang="ts">
interface Props {
  modelValue: boolean
}
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const BUY_ME_A_COFFEE_URL = 'https://buymeacoffee.com/nodirjon09a'

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

      <q-btn
        icon="mdi-coffee"
        label="Buy Me a Coffee"
        :href="BUY_ME_A_COFFEE_URL"
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
        outline
        rounded
        unelevated
        class="coffee-btn"
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

.coffee-btn {
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
