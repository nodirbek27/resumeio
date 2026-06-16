<script setup lang="ts">
import type { ObektivkaFormData } from '@/utils/obektivkaStorage'

interface Props {
  modelValue: ObektivkaFormData
}

defineProps<Props>()

const yoq = "yo'q"

const formatBirthDate = (date: string): string => {
  if (!date) return '_______________'
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
}

const fullName = (data: ObektivkaFormData): string => {
  return [data.familiya, data.ism, data.sharif].filter(Boolean).join(' ') || '_______________'
}

const mehnatStr = (dan: string, gacha: string): string => {
  if (!dan && !gacha) return ''
  return `${dan || '?'}-${gacha || '?'} yy.-`
}
</script>

<template>
  <div class="preview-wrap">

    <!-- ══════════════════════════════
         SAHIFA 1
    ═══════════════════════════════ -->
    <div class="ob-page obektivka-pdf-page">

      <!-- Sarlavha -->
      <h1 class="ob-title">MA'LUMOTNOMA</h1>

      <!-- Ism + rasm row -->
      <div class="top-row">
        <div class="top-left">
          <!-- To'liq ismi -->
          <p class="person-name">{{ fullName(modelValue) }}</p>

          <!-- Joriy lavozim -->
          <div v-if="modelValue.joriyLavozimToliq" class="current-pos">
            <span class="pos-date">{{ modelValue.joriyLavozimSanasi }}{{ modelValue.joriyLavozimSanasi ? ':' : '' }}</span>
            {{ modelValue.joriyLavozimToliq }}
          </div>
        </div>

        <!-- Rasm -->
        <div class="top-photo">
          <img v-if="modelValue.rasm" :src="modelValue.rasm" alt="Rasm" class="photo-img" />
          <div v-else class="photo-empty">
            <span>3×4</span>
          </div>
        </div>
      </div>

      <!-- 2-ustunli maydonlar -->
      <div class="fields-grid">

        <!-- Tug'ilgan yili / joyi -->
        <div class="field-cell">
          <span class="fl">Tug'ilgan yili:</span>
          <span class="fv">{{ formatBirthDate(modelValue.tugilganSana) }}</span>
        </div>
        <div class="field-cell">
          <span class="fl">Tug'ilgan joyi:</span>
          <span class="fv">{{ modelValue.tugilganJoyi || '_______________' }}</span>
        </div>

        <!-- Millati / Partiyaviyligi -->
        <div class="field-cell">
          <span class="fl">Millati:</span>
          <span class="fv">{{ modelValue.millati || '_______________' }}</span>
        </div>
        <div class="field-cell">
          <span class="fl">Partiyaviyligi:</span>
          <span class="fv">{{ modelValue.partiyaviyligi || yoq }}</span>
        </div>

        <!-- Ma'lumoti / Tamomlagan -->
        <div class="field-cell">
          <span class="fl">Ma'lumoti:</span>
          <span class="fv">{{ modelValue.malumoti || '_______________' }}</span>
        </div>
        <div class="field-cell">
          <span class="fl">Tamomlagan:</span>
          <span class="fv">{{ modelValue.tamomlagan || '_______________' }}</span>
        </div>

        <!-- Mutaxassisligi (to'liq kenglik) -->
        <div class="field-cell full">
          <span class="fl">Ma'lumoti bo'yicha mutaxassisligi:</span>
          <span class="fv">{{ modelValue.malumotiMutaxassisligi || '_______________' }}</span>
        </div>

        <!-- Ilmiy daraja / unvon -->
        <div class="field-cell">
          <span class="fl">Ilmiy darajasi:</span>
          <span class="fv">{{ modelValue.ilmiyDarajasi || yoq }}</span>
        </div>
        <div class="field-cell">
          <span class="fl">Ilmiy unvoni:</span>
          <span class="fv">{{ modelValue.ilmiyUnvoni || yoq }}</span>
        </div>

        <!-- Chet tillari / Harbiy unvon -->
        <div class="field-cell">
          <span class="fl">Qaysi chet tillarini biladi:</span>
          <span class="fv">{{ modelValue.qaysiChetTillarini || '_______________' }}</span>
        </div>
        <div class="field-cell">
          <span class="fl">Harbiy (maxsus) unvoni:</span>
          <span class="fv">{{ modelValue.harbiyUnvoni || yoq }}</span>
        </div>

        <!-- Davlat mukofotlari (to'liq kenglik) -->
        <div class="field-cell full">
          <span class="fl">Davlat mukofotlari bilan taqdirlanganmi (qanaqa):</span>
          <span class="fv block-fv">{{ modelValue.davlatMukofotlari || yoq }}</span>
        </div>

        <!-- Xalq deputati (to'liq kenglik) -->
        <div class="field-cell full">
          <span class="fl">Xalq deputatlari, respublika, viloyat, shahar va tuman Kengashi deputatimi yoki boshqa saylanadigan organlarning a'zosimi (to'liq ko'rsatilishi lozim):</span>
          <span class="fv block-fv">{{ modelValue.xalqDeputatlari || yoq }}</span>
        </div>

      </div>

      <!-- Mehnat faoliyati -->
      <div class="mehnat-section">
        <h2 class="mehnat-title">MEHNAT FAOLIYATI</h2>

        <div v-if="modelValue.mehnatFaoliyatiRoyxat && modelValue.mehnatFaoliyatiRoyxat.length > 0">
          <p
            v-for="(item, i) in modelValue.mehnatFaoliyatiRoyxat"
            :key="i"
            class="mehnat-line"
          >
            <span class="mehnat-years">{{ mehnatStr(item.dan, item.gacha) }}</span>
            {{ item.lavozim }}
          </p>
        </div>
        <p v-else class="mehnat-empty">Mehnat faoliyati qo'shilmagan</p>
      </div>

    </div>

    <!-- ══════════════════════════════
         SAHIFA 2 — Qarindoshlar
    ═══════════════════════════════ -->
    <div class="ob-page obektivka-pdf-page">

      <!-- Sarlavha -->
      <div class="page2-title">
        <p>{{ fullName(modelValue) }}ning yaqin qarindoshlari haqida</p>
        <p>MA'LUMOT</p>
      </div>

      <!-- Qarindoshlar jadvali -->
      <table class="rel-table">
        <thead>
          <tr>
            <th class="th-rel">Qarin-<br />doshligi</th>
            <th class="th-fio">Familiyasi, ismi<br />va otasining ismi</th>
            <th class="th-birth">Tug'ilgan kuni,<br />oyi, yili va joyi</th>
            <th class="th-work">Ish joyi va lavozimi</th>
            <th class="th-addr">Turar joyi</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="modelValue.qarindoshlar && modelValue.qarindoshlar.length > 0">
            <tr v-for="(q, i) in modelValue.qarindoshlar" :key="i">
              <td class="td-center bold-td">{{ q.qarindoshligi || '—' }}</td>
              <td class="td-center">{{ q.fio || '—' }}</td>
              <td class="td-center">{{ q.tugilganYiliJoyi || '—' }}</td>
              <td class="td-center">{{ q.ishJoyiVaLavozimi || '—' }}</td>
              <td class="td-center">{{ q.yashashJoyi || '—' }}</td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="n in 6" :key="n" class="empty-row">
              <td></td><td></td><td></td><td></td><td></td>
            </tr>
          </template>
        </tbody>
      </table>

      <!-- Telefon -->
      <div class="phone-row" v-if="modelValue.telefon">
        <span class="phone-label">Telefon raqami:</span>
        <strong>{{ modelValue.telefon }}</strong>
      </div>
      <div class="phone-row" v-else>
        <span class="phone-label">Telefon raqami:</span>
        <span class="phone-line">___________________________</span>
      </div>

    </div>
  </div>
</template>

<style scoped>
.preview-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Sahifa ─────────────────────── */
.ob-page {
  background: white;
  padding: 18mm 18mm 14mm;
  border: 1px solid #d0d0d0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.07);
  font-family: 'Times New Roman', Times, serif;
  font-size: 11pt;
  color: #000;
  width: 100%;
  max-width: 210mm;
  margin: 0 auto;
  box-sizing: border-box;
}

/* ── Sarlavha ──────────────────── */
.ob-title {
  text-align: center;
  font-size: 14pt;
  font-weight: 900;
  letter-spacing: 2px;
  margin: 0 0 6mm;
}

/* ── TOP ROW: Ism + Rasm ─────── */
.top-row {
  display: flex;
  gap: 5mm;
  align-items: flex-start;
  margin-bottom: 4mm;
}

.top-left {
  flex: 1;
}

.person-name {
  font-size: 13pt;
  font-weight: 900;
  text-align: center;
  margin: 0 0 3mm;
}

.current-pos {
  font-size: 10.5pt;
  line-height: 1.5;
  text-align: justify;
}

.pos-date {
  font-weight: 700;
}

.top-photo {
  flex-shrink: 0;
}

.photo-img {
  width: 28mm;
  height: 37mm;
  object-fit: cover;
  border: 1px solid #555;
  display: block;
}

.photo-empty {
  width: 28mm;
  height: 37mm;
  border: 1px dashed #bbb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9pt;
  color: #bbb;
}

/* ── Maydonlar grid ─────────────── */
.fields-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 6mm;
  row-gap: 0;
  margin-bottom: 5mm;
}

.field-cell {
  display: flex;
  flex-direction: column;
  padding: 2px 0 4px;
}

.field-cell.full {
  grid-column: 1 / -1;
}

.fl {
  font-size: 9.5pt;
  font-weight: 700;
  color: #111;
  line-height: 1.3;
}

.fv {
  font-size: 10.5pt;
  color: #111;
  line-height: 1.4;
}

.block-fv {
  display: block;
}

/* ── Mehnat faoliyati ────────────── */
.mehnat-section {
  margin-top: 5mm;
}

.mehnat-title {
  text-align: center;
  font-size: 12pt;
  font-weight: 900;
  text-decoration: underline;
  letter-spacing: 1px;
  margin: 0 0 3mm;
}

.mehnat-line {
  font-size: 10pt;
  line-height: 1.6;
  margin: 0 0 1mm;
  text-align: justify;
}

.mehnat-years {
  font-weight: 700;
  margin-right: 2px;
}

.mehnat-empty {
  font-size: 9.5pt;
  color: #aaa;
  font-style: italic;
}

/* ── Sahifa 2 ─────────────────── */
.page2-title {
  text-align: center;
  font-size: 12pt;
  font-weight: 900;
  margin-bottom: 5mm;
  line-height: 1.6;
}

.rel-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9.5pt;
}

.rel-table th,
.rel-table td {
  border: 1px solid #555;
  padding: 4px 5px;
  vertical-align: top;
}

.rel-table th {
  background: white;
  font-weight: 700;
  text-align: center;
  font-size: 9pt;
  line-height: 1.3;
}

.th-rel  { width: 10%; }
.th-fio  { width: 20%; }
.th-birth{ width: 18%; }
.th-work { width: 28%; }
.th-addr { width: 24%; }

.td-center {
  text-align: center;
  font-size: 9.5pt;
  vertical-align: middle;
}

.bold-td {
  font-weight: 700;
}

.empty-row td {
  height: 22px;
}

/* ── Telefon ──────────────────── */
.phone-row {
  margin-top: 5mm;
  font-size: 10pt;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.phone-label {
  font-weight: 700;
}

.phone-line {
  color: #999;
}

@media print {
  .ob-page {
    box-shadow: none;
    border: none;
    page-break-after: always;
    margin: 0;
  }
}
</style>
