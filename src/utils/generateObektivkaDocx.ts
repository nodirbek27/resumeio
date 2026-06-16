import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from 'docx'
import { saveAs } from 'file-saver'
import type { ObektivkaFormData } from '@/utils/obektivkaStorage'

const line = () =>
  new Paragraph({
    text: '',
  })

const boldText = (label: string, value: string | null | undefined) =>
  new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun({ text: value || '-' }),
    ],
  })

export async function generateObektivkaDocx(data: ObektivkaFormData) {
  const fullName = `${data.familiya} ${data.ism} ${data.sharif}`

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // ================= TITLE =================
          new Paragraph({
            text: "O'B'EKTIVKA",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),

          new Paragraph({
            text: fullName.toUpperCase(),
            alignment: AlignmentType.CENTER,
          }),

          line(),

          // ================= PHOTO INFO =================
          boldText('Rasm', data.rasm ? 'Mavjud' : 'Yo‘q'),

          line(),

          // ================= PERSONAL INFO =================
          new Paragraph({
            text: '1. SHAXSIY MA’LUMOTLAR',
            heading: HeadingLevel.HEADING_2,
          }),

          boldText('Tug‘ilgan sana', data.tugilganSana),
          boldText('Tug‘ilgan joyi', data.tugilganJoyi),
          boldText('Millati', data.millati),
          boldText('Partiyaviyligi', data.partiyaviyligi),
          boldText('Telefon', data.telefon),

          line(),

          // ================= EDUCATION =================
          new Paragraph({
            text: '2. TA’LIM',
            heading: HeadingLevel.HEADING_2,
          }),

          boldText('Ma’lumoti', data.malumoti),
          boldText('Mutaxassisligi', data.malumotiMutaxassisligi),
          boldText('Tamomlagan', data.tamomlagan),
          boldText('Ilmiy daraja', data.ilmiyDarajasi),
          boldText('Ilmiy unvon', data.ilmiyUnvoni),

          line(),

          // ================= CURRENT POSITION =================
          new Paragraph({
            text: '3. JORIY LAVOZIM',
            heading: HeadingLevel.HEADING_2,
          }),

          boldText('Lavozim', data.joriyLavozimToliq),
          boldText('Tayinlangan sana', data.joriyLavozimSanasi),

          line(),

          // ================= ADDITIONAL =================
          new Paragraph({
            text: '4. QO‘SHIMCHA MA’LUMOTLAR',
            heading: HeadingLevel.HEADING_2,
          }),

          boldText('Chet tillari', data.qaysiChetTillarini),
          boldText('Harbiy unvon', data.harbiyUnvoni),
          boldText('Davlat mukofotlari', data.davlatMukofotlari),
          boldText('Deputatlik', data.xalqDeputatlari),

          line(),

          // ================= WORK EXPERIENCE =================
          new Paragraph({
            text: '5. MEHNAT FAOLIYATI',
            heading: HeadingLevel.HEADING_2,
          }),

          ...(data.mehnatFaoliyatiRoyxat.length
            ? data.mehnatFaoliyatiRoyxat.map((item, i) => {
                return new Paragraph({
                  children: [
                    new TextRun({
                      text: `${i + 1}. `,
                      bold: true,
                    }),
                    new TextRun({
                      text: `${item.dan} - ${item.gacha} | ${item.lavozim}`,
                    }),
                  ],
                })
              })
            : [
                new Paragraph({
                  text: 'Ma’lumot mavjud emas',
                }),
              ]),

          line(),

          // ================= RELATIVES =================
          new Paragraph({
            text: '6. YAQIN QARINDOSHLAR',
            heading: HeadingLevel.HEADING_2,
          }),

          ...(data.qarindoshlar.length
            ? data.qarindoshlar.map((q, i) => {
                return new Paragraph({
                  children: [
                    new TextRun({ text: `${i + 1}. `, bold: true }),
                    new TextRun({
                      text: `${q.qarindoshligi} - ${q.fio} | ${q.tugilganYiliJoyi} | ${q.yashashJoyi} | ${q.ishJoyiVaLavozimi}`,
                    }),
                  ],
                })
              })
            : [
                new Paragraph({
                  text: 'Ma’lumot mavjud emas',
                }),
              ]),
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)

  saveAs(blob, `${fullName || 'obektivka'}.docx`)
}
