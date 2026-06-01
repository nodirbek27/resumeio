// LocalStorage utilities for Obektivka
export interface Qarindosh {
  qarindoshligi: string
  fio: string
  tugilganYiliJoyi: string
  ishJoyiVaLavozimi: string
  yashashJoyi: string
}

export interface ObektivkaFormData {
  familiya: string
  ism: string
  sharif: string
  rasm: string | null // Base64 encoded
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
  qaysiChetTillarini: string
  davlatMukofotlari: string
  xalqDeputatlari: string
  mehnatFaoliyati: string
  qarindoshlar: Qarindosh[]
}

const STORAGE_KEY = 'obektivka_data'

export const obektivkaStorage = {
  // Save data to localStorage
  save(data: ObektivkaFormData): void {
    try {
      const json = JSON.stringify(data)
      localStorage.setItem(STORAGE_KEY, json)
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  },

  // Load data from localStorage
  load(): ObektivkaFormData | null {
    try {
      const json = localStorage.getItem(STORAGE_KEY)
      if (!json) return null
      return JSON.parse(json) as ObektivkaFormData
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      return null
    }
  },

  // Clear data from localStorage
  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  },

  // Check if data exists
  exists(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null
  },
}
