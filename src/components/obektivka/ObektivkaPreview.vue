<script setup lang="ts">
import type { ObektivkaFormData } from '@/utils/obektivkaStorage'

interface Props {
  modelValue: ObektivkaFormData
}

defineProps<Props>()

const yoq = "yo'q"

const formatBirthDate = (date: string): string => {
  if (!date) return ''
  try {
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    return `${day}.${month}.${d.getFullYear()}-yil`
  } catch {
    return date
  }
}

const fullName = (data: ObektivkaFormData): string =>
  [data.familiya, data.ism, data.sharif].filter(Boolean).join(' ')

const mehnatStr = (dan: string, gacha: string): string => {
  if (!dan && !gacha) return ''
  const from = dan || '?'
  const to = gacha || 'h.v.'
  const isHV = /h\.v\.?|hozirgi/i.test(to)
  return isHV ? `${from}-${to}-` : `${from}-${to} yy.-`
}
</script>

<template>
  <div class="ob-doc">

    <!-- ══════════════════════════ 1-SAHIFA ══════════════════════════ -->
    <div class="ob-page obektivka-pdf-page">

      <!-- Asosiy sarlavha -->
      <h1 class="ob-main-title">MA'LUMOTNOMA</h1>

      <!-- F.I.Sh + Rasm bloki -->
      <div class="ob-topblock">
        <div class="ob-name-col">
          <!-- To'liq ism (katta harf, bold) -->
          <p class="ob-fullname">
            {{ fullName(modelValue) || '______________________________________' }}
          </p>
          <!-- Joriy lavozim -->
          <p
            v-if="modelValue.joriyLavozimSanasi || modelValue.joriyLavozimToliq"
            class="ob-current-pos"
          >
            <span v-if="modelValue.joriyLavozimSanasi"
              >{{ modelValue.joriyLavozimSanasi }}:</span
            ><br v-if="modelValue.joriyLavozimSanasi" />
            <strong v-if="modelValue.joriyLavozimToliq">{{
              modelValue.joriyLavozimToliq
            }}</strong>
          </p>
        </div>

        <!-- 3×4 rasm -->
        <div class="ob-photo-box">
          <img
            v-if="modelValue.rasm"
            :src="modelValue.rasm"
            alt="Xodim rasmi"
            class="ob-photo"
          />
          <div v-else class="ob-photo-ph">3×4<br />rasm</div>
        </div>
      </div>

      <!-- ── Shaxsiy ma'lumotlar jadvali (ko'rinmas border) ── -->
      <table class="ob-info-tbl">
        <colgroup>
          <col style="width: 50%" />
          <col style="width: 50%" />
        </colgroup>
        <tbody>
          <!-- 1 -->
          <tr>
            <td>
              <b class="fl">Tug'ilgan yili:</b><br />
              <span class="fv">{{
                formatBirthDate(modelValue.tugilganSana) || '_______________'
              }}</span>
            </td>
            <td>
              <b class="fl">Tug'ilgan joyi:</b><br />
              <span class="fv">{{ modelValue.tugilganJoyi || '_______________' }}</span>
            </td>
          </tr>
          <!-- 2 -->
          <tr>
            <td>
              <b class="fl">Millati:</b><br />
              <span class="fv">{{ modelValue.millati || '_______________' }}</span>
            </td>
            <td>
              <b class="fl">Partiyaviyligi:</b><br />
              <span class="fv">{{ modelValue.partiyaviyligi || yoq }}</span>
            </td>
          </tr>
          <!-- 3 -->
          <tr>
            <td>
              <b class="fl">Ma'lumoti:</b><br />
              <span class="fv">{{ modelValue.malumoti || '_______________' }}</span>
            </td>
            <td>
              <b class="fl">Tamomlagan:</b><br />
              <span class="fv">{{ modelValue.tamomlagan || '_______________' }}</span>
            </td>
          </tr>
          <!-- 4 — inline, to'liq kenglik -->
          <tr>
            <td colspan="2" class="td-inline">
              <b class="fl">Ma'lumoti bo'yicha mutaxassisligi:</b>
              <span class="fv fv-gap">{{
                modelValue.malumotiMutaxassisligi || '_______________'
              }}</span>
            </td>
          </tr>
          <!-- 5 -->
          <tr>
            <td>
              <b class="fl">Ilmiy darajasi:</b><br />
              <span class="fv">{{ modelValue.ilmiyDarajasi || yoq }}</span>
            </td>
            <td>
              <b class="fl">Ilmiy unvoni:</b><br />
              <span class="fv">{{ modelValue.ilmiyUnvoni || yoq }}</span>
            </td>
          </tr>
          <!-- 6 — to'liq kenglik -->
          <tr>
            <td colspan="2">
              <b class="fl">Qaysi chet tillarini biladi:</b><br />
              <span class="fv">{{ modelValue.qaysiChetTillarini || '_______________' }}</span>
            </td>
          </tr>
          <!-- 7 — to'liq kenglik -->
          <tr>
            <td colspan="2">
              <b class="fl">Davlat mukofotlari bilan taqdirlanganmi (qaysilar):</b><br />
              <span class="fv">{{ modelValue.davlatMukofotlari || yoq }}</span>
            </td>
          </tr>
          <!-- 8 — to'liq kenglik -->
          <tr class="tr-last">
            <td colspan="2">
              <b class="fl"
                >Xalq deputatlari, respublika, viloyat, shahar va tuman Kengashlari
                a'zosimi yoki yo'qmi (to'liq ko'rsatilishi lozim):</b
              ><br />
              <span class="fv">{{ modelValue.xalqDeputatlari || yoq }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- ── MEHNAT FAOLIYATI ── -->
      <h2 class="ob-section-h">MEHNAT FAOLIYATI</h2>

      <table
        v-if="modelValue.mehnatFaoliyatiRoyxat && modelValue.mehnatFaoliyatiRoyxat.length"
        class="ob-work-tbl"
      >
        <colgroup>
          <col style="width: 24%" />
          <col style="width: 76%" />
        </colgroup>
        <tbody>
          <tr
            v-for="(item, i) in modelValue.mehnatFaoliyatiRoyxat"
            :key="i"
            class="work-row"
          >
            <td class="work-period">{{ mehnatStr(item.dan, item.gacha) }}</td>
            <td class="work-pos">{{ item.lavozim }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="ob-dash">—</p>
    </div>

    <!-- ══════════════════════════ 2-SAHIFA ══════════════════════════ -->
    <div class="ob-page obektivka-pdf-page">

      <!-- Sarlavha -->
      <p class="ob-p2-line1">
        {{ fullName(modelValue) || '___________________________' }}ning yaqin qarindoshlari
        haqida
      </p>
      <p class="ob-p2-line2">MA'LUMOT</p>

      <!-- Qarindoshlar jadvali (ko'rinadigan border) -->
      <table class="ob-rel-tbl">
        <thead>
          <tr>
            <th>Yaqin<br />qarindoshlari</th>
            <th>Familiyasi, ismi<br />va otasining ismi</th>
            <th>Tug'ilgan yili<br />va joyi</th>
            <th>Ish joyi va<br />lavozimi</th>
            <th>Turar joyi</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="modelValue.qarindoshlar && modelValue.qarindoshlar.length">
            <tr v-for="(q, i) in modelValue.qarindoshlar" :key="i">
              <td class="td-rel-name">{{ q.qarindoshligi }}</td>
              <td>{{ q.fio }}</td>
              <td>{{ q.tugilganYiliJoyi }}</td>
              <td>{{ q.ishJoyiVaLavozimi }}</td>
              <td>{{ q.yashashJoyi }}</td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="n in 9" :key="n" class="tr-empty">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </template>
        </tbody>
      </table>

      <!-- Telefon -->
      <p class="ob-phone">
        <b>Telefon raqami:</b>
        {{ modelValue.telefon || '___________________________' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* ══════════════════════════════════════════════════
   ASOSIY KONTEYNER
══════════════════════════════════════════════════ */
.ob-doc {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ══════════════════════════════════════════════════
   A4 SAHIFA
   Yuqori: 2cm | Pastdan: 2cm | Chapdan: 3cm | O'ngdan: 1.5cm
══════════════════════════════════════════════════ */
.ob-page {
  background: #ffffff;
  font-family: 'Times New Roman', Times, serif;
  font-size: 12pt;
  color: #000000;
  line-height: 1.2;

  width: 210mm;
  min-height: 297mm;
  padding: 2cm 1.5cm 2cm 3cm;
  box-sizing: border-box;
  margin: 0 auto;

  /* Preview ko'rinishi */
  border: 1px solid #bbbbbb;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
}

/* ══════════════════════════════════════════════════
   ASOSIY SARLAVHA  "MA'LUMOTNOMA"
══════════════════════════════════════════════════ */
.ob-main-title {
  font-family: 'Times New Roman', Times, serif;
  font-size: 14pt;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0 0 5mm 0;
  line-height: 1.25;
}

/* ══════════════════════════════════════════════════
   F.I.SH + RASM BLOKI
══════════════════════════════════════════════════ */
.ob-topblock {
  display: flex;
  align-items: flex-start;
  gap: 5mm;
  margin-bottom: 4mm;
}

.ob-name-col {
  flex: 1;
  min-width: 0;
}

/* To'liq ism: KATTA HARF, bold */
.ob-fullname {
  font-family: 'Times New Roman', Times, serif;
  font-size: 13pt;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
  margin: 0 0 2mm 0;
  line-height: 1.25;
  word-break: break-word;
}

/* Joriy lavozim va sana */
.ob-current-pos {
  font-size: 12pt;
  font-weight: normal;
  line-height: 1.25;
  margin: 0;
  text-align: left;
}

/* ── 3×4 Rasm ──────────────────── */
.ob-photo-box {
  flex-shrink: 0;
  width: 3cm;
  height: 4cm;
  border: 1px solid #000000;
  border-radius: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
}

.ob-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
  border-radius: 0;
}

.ob-photo-ph {
  font-size: 9pt;
  color: #aaaaaa;
  text-align: center;
  line-height: 1.5;
}

/* ══════════════════════════════════════════════════
   SHAXSIY MA'LUMOTLAR JADVALI (chegarasiz)
══════════════════════════════════════════════════ */
.ob-info-tbl {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 3mm;
  font-size: 12pt;
  table-layout: fixed;
}

.ob-info-tbl td {
  border: none;
  border-bottom: 0.5pt solid #bbbbbb;
  padding: 3px 2px 5px 0;
  vertical-align: top;
  line-height: 1.25;
  word-break: break-word;
  text-align: left !important;
  position: static !important;
}

/* Oxirgi qatorda pastki border yo'q */
.ob-info-tbl .tr-last td {
  border-bottom: none;
}

/* Label (so'roq) — bold, biroz kichikroq */
.fl {
  font-family: 'Times New Roman', Times, serif;
  font-size: 11pt;
  font-weight: bold;
  line-height: 1.3;
}

/* Qiymat (javob) */
.fv {
  font-family: 'Times New Roman', Times, serif;
  font-size: 12pt;
  font-weight: normal;
  line-height: 1.25;
}

/* Inline: label + value bir qatorda */
.td-inline {
  vertical-align: top;
}

.fv-gap {
  margin-left: 4px;
}

/* ══════════════════════════════════════════════════
   MEHNAT FAOLIYATI
══════════════════════════════════════════════════ */
.ob-section-h {
  font-family: 'Times New Roman', Times, serif;
  font-size: 13pt;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  text-decoration: underline;
  letter-spacing: 1px;
  margin: 15px 0 15px 0;
  line-height: 1.25;
}

.ob-work-tbl {
  width: 100%;
  border-collapse: collapse;
  font-size: 12pt;
  table-layout: fixed;
}

.ob-work-tbl td {
  border: none;
  padding: 1.5px 0;
  vertical-align: top;
  line-height: 1.25;
  text-align: left !important;
  position: static !important;
}

/* Sana ustuni */
.work-period {
  font-weight: bold;
  white-space: nowrap;
  padding-right: 3mm;
  vertical-align: top;
}

/* Lavozim ustuni */
.work-pos {
  font-weight: normal;
  word-break: break-word;
}

.work-row {
  page-break-inside: avoid;
  break-inside: avoid;
}

.ob-dash {
  font-size: 12pt;
  color: #666;
  margin: 1mm 0;
}

/* ══════════════════════════════════════════════════
   2-SAHIFA
══════════════════════════════════════════════════ */
.ob-p2-line1 {
  font-family: 'Times New Roman', Times, serif;
  font-size: 13pt;
  font-weight: normal;
  text-align: center;
  margin: 0;
  line-height: 1.5;
}

.ob-p2-line2 {
  font-family: 'Times New Roman', Times, serif;
  font-size: 14pt;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  margin: 0 0 6mm 0;
  line-height: 1.4;
}

/* ══════════════════════════════════════════════════
   QARINDOSHLAR JADVALI (ko'rinadigan border)
══════════════════════════════════════════════════ */
.ob-rel-tbl {
  width: 100%;
  border-collapse: collapse;
  font-size: 10.5pt;
  line-height: 1.25;
  table-layout: fixed;
}

.ob-rel-tbl th {
  border: 1px solid #000000;
  padding: 5px 4px;
  text-align: center;
  font-weight: bold;
  vertical-align: middle;
  font-size: 10pt;
  background: #ffffff;
  line-height: 1.3;
  word-break: break-word;
}

.ob-rel-tbl td {
  border: 1px solid #000000;
  padding: 5px 4px;
  text-align: left !important;
  position: static !important;
  vertical-align: top;
  word-break: break-word;
}

/* Qarindoshligi ustuni: bold, markazlashtirilgan */
.td-rel-name {
  font-weight: bold;
  text-align: center;
  vertical-align: middle;
}

.tr-empty td {
  height: 24px;
}

/* Telefon */
.ob-phone {
  margin-top: 5mm;
  font-size: 12pt;
  line-height: 1.4;
}

/* ══════════════════════════════════════════════════
   CHOP ETISH — @media print
══════════════════════════════════════════════════ */
@media print {
  @page {
    size: A4 portrait;
    margin: 2cm 1.5cm 2cm 3cm;
  }

  .ob-doc {
    gap: 0;
  }

  .ob-page {
    box-shadow: none;
    border: none;
    width: 100%;
    min-height: auto;
    padding: 0;
    page-break-after: always;
    break-after: page;
  }

  .ob-page:last-child {
    page-break-after: auto;
    break-after: auto;
  }

  /* Jadvallar o'rtasidan bo'linmasin */
  .ob-info-tbl,
  .ob-work-tbl,
  .ob-rel-tbl {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .ob-topblock,
  .ob-section-h,
  .work-row {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  tr {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}
</style>
