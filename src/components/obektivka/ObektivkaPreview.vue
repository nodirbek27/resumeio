<script setup lang="ts">
import type { ObektivkaFormData } from '@/utils/obektivkaStorage'

interface Props {
  modelValue: ObektivkaFormData
}
defineProps<Props>()

const yoq = "yo'q"

const formatBirthDate = (date: string): string => {
  if (!date) return ''
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
}

const fullName = (data: ObektivkaFormData): string =>
  [data.familiya, data.ism, data.sharif].filter(Boolean).join(' ')

const mehnatStr = (dan: string, gacha: string): string => {
  if (!dan && !gacha) return ''
  return `${dan || '?'}-${gacha || '?'} yy.-`
}
</script>

<template>
  <div class="preview-root">

    <!-- ══════════════ SAHIFA 1 ══════════════ -->
    <div class="ob-page obektivka-pdf-page">

      <h1 class="ob-main-title">MA'LUMOTNOMA</h1>

      <!-- Ism + Rasm -->
      <div class="name-photo-block">
        <div class="name-pos-col">
          <p class="ob-fullname">{{ fullName(modelValue) || '________________________________' }}</p>
          <p v-if="modelValue.joriyLavozimToliq || modelValue.joriyLavozimSanasi" class="ob-position">
            <strong>{{ modelValue.joriyLavozimSanasi }}{{ modelValue.joriyLavozimSanasi ? ':' : '' }}</strong><br v-if="modelValue.joriyLavozimSanasi" />
            {{ modelValue.joriyLavozimToliq }}
          </p>
        </div>
        <div class="photo-box">
          <img v-if="modelValue.rasm" :src="modelValue.rasm" class="ob-photo" />
          <div v-else class="ob-photo-placeholder">3×4<br/>rasm</div>
        </div>
      </div>

      <!-- Maydonlar bloki -->
      <div class="fields-block">

        <!-- Row 1: Tug'ilgan yili / joyi -->
        <div class="f-row">
          <div class="f-cell">
            <div class="f-label">Tug'ilgan yili:</div>
            <div class="f-value">{{ formatBirthDate(modelValue.tugilganSana) || '_________________' }}</div>
          </div>
          <div class="f-cell">
            <div class="f-label">Tug'ilgan joyi:</div>
            <div class="f-value">{{ modelValue.tugilganJoyi || '_________________' }}</div>
          </div>
        </div>

        <!-- Row 2: Millati / Partiyaviyligi -->
        <div class="f-row">
          <div class="f-cell">
            <div class="f-label">Millati:</div>
            <div class="f-value">{{ modelValue.millati || '_________________' }}</div>
          </div>
          <div class="f-cell">
            <div class="f-label">Partiyaviyligi:</div>
            <div class="f-value">{{ modelValue.partiyaviyligi || yoq }}</div>
          </div>
        </div>

        <!-- Row 3: Ma'lumoti / Tamomlagan -->
        <div class="f-row">
          <div class="f-cell">
            <div class="f-label">Ma'lumoti:</div>
            <div class="f-value">{{ modelValue.malumoti || '_________________' }}</div>
          </div>
          <div class="f-cell">
            <div class="f-label">Tamomlagan:</div>
            <div class="f-value">{{ modelValue.tamomlagan || '_________________' }}</div>
          </div>
        </div>

        <!-- Row 4: Mutaxassisligi — inline label + value -->
        <div class="f-row-inline">
          <span class="f-label">Ma'lumoti bo'yicha mutaxassisligi:</span>
          <span class="f-value-inline">{{ modelValue.malumotiMutaxassisligi || '_________________' }}</span>
        </div>

        <!-- Row 5: Ilmiy daraja / unvon -->
        <div class="f-row">
          <div class="f-cell">
            <div class="f-label">Ilmiy darajasi:</div>
            <div class="f-value">{{ modelValue.ilmiyDarajasi || yoq }}</div>
          </div>
          <div class="f-cell">
            <div class="f-label">Ilmiy unvoni:</div>
            <div class="f-value">{{ modelValue.ilmiyUnvoni || yoq }}</div>
          </div>
        </div>

        <!-- Row 6: Chet tillari / Harbiy unvon -->
        <div class="f-row">
          <div class="f-cell">
            <div class="f-label">Qaysi chet tillarini biladi:</div>
            <div class="f-value">{{ modelValue.qaysiChetTillarini || '_________________' }}</div>
          </div>
          <div class="f-cell">
            <div class="f-label">Harbiy (maxsus) unvoni:</div>
            <div class="f-value">{{ modelValue.harbiyUnvoni || yoq }}</div>
          </div>
        </div>

        <!-- Row 7: Davlat mukofotlari — full width, label then value below -->
        <div class="f-row-full">
          <div class="f-label">Davlat mukofotlari bilan taqdirlanganmi (qanaqa):</div>
          <div class="f-value">{{ modelValue.davlatMukofotlari || yoq }}</div>
        </div>

        <!-- Row 8: Xalq deputati — full width -->
        <div class="f-row-full">
          <div class="f-label">Xalq deputatlari, respublika, viloyat, shahar va tuman Kengashi deputatimi yoki boshqa saylanadigan organlarning a'zosimi (to'liq ko'rsatilishi lozim):</div>
          <div class="f-value">{{ modelValue.xalqDeputatlari || yoq }}</div>
        </div>

      </div>

      <!-- Mehnat faoliyati -->
      <div class="mehnat-block">
        <h2 class="mehnat-heading">MEHNAT FAOLIYATI</h2>
        <div v-if="modelValue.mehnatFaoliyatiRoyxat && modelValue.mehnatFaoliyatiRoyxat.length">
          <p v-for="(item, i) in modelValue.mehnatFaoliyatiRoyxat" :key="i" class="mehnat-item">
            <strong>{{ mehnatStr(item.dan, item.gacha) }}</strong> {{ item.lavozim }}
          </p>
        </div>
        <p v-else class="mehnat-empty">—</p>
      </div>

    </div>

    <!-- ══════════════ SAHIFA 2 ══════════════ -->
    <div class="ob-page obektivka-pdf-page">

      <div class="page2-heading">
        <p>{{ fullName(modelValue) || '___________________________' }}ning yaqin qarindoshlari haqida</p>
        <p><strong>MA'LUMOT</strong></p>
      </div>

      <table class="rel-table">
        <thead>
          <tr>
            <th>Qarin-<br/>doshligi</th>
            <th>Familiyasi, ismi<br/>va otasining ismi</th>
            <th>Tug'ilgan kuni,<br/>oyi, yili va joyi</th>
            <th>Ish joyi va lavozimi</th>
            <th>Turar joyi</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="modelValue.qarindoshlar && modelValue.qarindoshlar.length">
            <tr v-for="(q, i) in modelValue.qarindoshlar" :key="i">
              <td class="td-c bold-c">{{ q.qarindoshligi || '' }}</td>
              <td class="td-c">{{ q.fio || '' }}</td>
              <td class="td-c">{{ q.tugilganYiliJoyi || '' }}</td>
              <td class="td-c">{{ q.ishJoyiVaLavozimi || '' }}</td>
              <td class="td-c">{{ q.yashashJoyi || '' }}</td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="n in 7" :key="n" class="empty-tr">
              <td></td><td></td><td></td><td></td><td></td>
            </tr>
          </template>
        </tbody>
      </table>

      <p class="phone-line">
        <strong>Telefon raqami:</strong>
        {{ modelValue.telefon || '________________________________' }}
      </p>

    </div>
  </div>
</template>

<style scoped>
/* ── Root ─────────────────────── */
.preview-root {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Sahifa ──────────────────── */
.ob-page {
  background: #fff;
  font-family: 'Times New Roman', Times, serif;
  font-size: 11pt;
  color: #000;
  padding: 16mm 18mm 14mm;
  box-sizing: border-box;
  width: 100%;
  max-width: 210mm;
  margin: 0 auto;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

/* ── Sarlavha ─────────────────── */
.ob-main-title {
  text-align: center;
  font-size: 15pt;
  font-weight: 900;
  letter-spacing: 2px;
  margin: 0 0 5mm;
  font-family: 'Times New Roman', Times, serif;
}

/* ── Ism + rasm ───────────────── */
.name-photo-block {
  display: flex;
  align-items: flex-start;
  gap: 5mm;
  margin-bottom: 4mm;
}

.name-pos-col {
  flex: 1;
}

.ob-fullname {
  font-size: 13pt;
  font-weight: 900;
  text-align: center;
  margin: 0 0 2mm;
  line-height: 1.3;
}

.ob-position {
  font-size: 10.5pt;
  line-height: 1.55;
  text-align: left;
  margin: 0;
}

.photo-box {
  flex-shrink: 0;
}

.ob-photo {
  width: 28mm;
  height: 37mm;
  object-fit: cover;
  border: 1px solid #666;
  display: block;
}

.ob-photo-placeholder {
  width: 28mm;
  height: 37mm;
  border: 1px dashed #bbb;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 9pt;
  color: #bbb;
  line-height: 1.4;
}

/* ── Maydonlar ────────────────── */
.fields-block {
  margin-bottom: 4mm;
}

/* 2-ustunli qator */
.f-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 6mm;
  border-bottom: 1px solid #ddd;
  padding: 2px 0 4px;
}

/* Har bir katak: label ustida, value pastda */
.f-cell {
  min-height: 10mm;
}

.f-label {
  font-weight: 700;
  font-size: 9.5pt;
  line-height: 1.3;
}

.f-value {
  font-size: 10.5pt;
  line-height: 1.4;
}

/* Inline: label — value bir qatorda */
.f-row-inline {
  display: flex;
  gap: 4mm;
  align-items: baseline;
  border-bottom: 1px solid #ddd;
  padding: 2px 0 4px;
}

.f-value-inline {
  font-size: 10.5pt;
}

/* Full-width qator */
.f-row-full {
  border-bottom: 1px solid #ddd;
  padding: 2px 0 4px;
}

/* ── Mehnat faoliyati ─────────── */
.mehnat-block {
  margin-top: 4mm;
}

.mehnat-heading {
  text-align: center;
  font-size: 12pt;
  font-weight: 900;
  text-decoration: underline;
  letter-spacing: 1px;
  margin: 0 0 3mm;
  font-family: 'Times New Roman', Times, serif;
}

.mehnat-item {
  font-size: 10pt;
  line-height: 1.6;
  margin: 0 0 1mm;
  text-align: justify;
}

.mehnat-empty {
  font-size: 10pt;
  color: #888;
}

/* ── Sahifa 2 ─────────────────── */
.page2-heading {
  text-align: center;
  font-size: 12pt;
  line-height: 1.7;
  margin-bottom: 5mm;
}

/* ── Qarindoshlar jadvali ─────── */
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
  font-weight: 700;
  text-align: center;
  font-size: 9pt;
  line-height: 1.35;
  background: #fff;
}

.td-c {
  text-align: center;
  vertical-align: middle;
}

.bold-c {
  font-weight: 700;
}

.empty-tr td {
  height: 20px;
}

/* ── Telefon ──────────────────── */
.phone-line {
  margin-top: 5mm;
  font-size: 10.5pt;
}

@media print {
  .ob-page {
    box-shadow: none;
    border: none;
    page-break-after: always;
    padding: 12mm 18mm 10mm;
  }
}
</style>
