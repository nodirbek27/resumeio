// LocalStorage utilities for Obektivka
export interface Qarindosh {
  qarindoshligi: string
  fio: string
  tugilganYiliJoyi: string
  ishJoyiVaLavozimi: string
  yashashJoyi: string
}

export interface MehnatFaoliyati {
  dan: string     // e.g. "2010 yil mart"
  gacha: string   // e.g. "2015 yil iyun" or "h.v."
  lavozim: string // e.g. "O'qituvchi, Toshkent davlat universiteti"
}

export interface ObektivkaFormData {
  familiya: string
  ism: string
  sharif: string
  rasm: string | null
  joriyLavozimSanasi: string
  joriyLavozimToliq: string
  tugilganSana: string
  tugilganJoyi: string
  millati: string
  malumoti: string
  partiyaviyligi: string
  tamomlagan: string
  malumotiMutaxassisligi: string
  ilmiyDarajasi: string
  ilmiyUnvoni: string
  harbiyUnvoni: string
  qaysiChetTillarini: string
  davlatMukofotlari: string
  xalqDeputatlari: string
  telefon: string
  mehnatFaoliyatiRoyxat: MehnatFaoliyati[]
  qarindoshlar: Qarindosh[]
}

const STORAGE_KEY = 'obektivka_data'

export const obektivkaStorage = {
  save(data: ObektivkaFormData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  },

  load(): ObektivkaFormData | null {
    try {
      const json = localStorage.getItem(STORAGE_KEY)
      if (!json) return null
      const parsed = JSON.parse(json) as Partial<ObektivkaFormData> & { mehnatFaoliyati?: string }
      // Migrate old string field to new array format
      if (!parsed.mehnatFaoliyatiRoyxat) {
        parsed.mehnatFaoliyatiRoyxat = []
      }
      return parsed as ObektivkaFormData
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      return null
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  },

  exists(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null
  },
}
