import type { ApiResponse, Branches, Positions, Staffs, Territories, User } from '@/types/common'

// Mock database arrays
const mockBranches: Branches[] = [
  { id: 1, organization: "Ishonch Bosh Ofis (Toshkent)", territory: { id: 1, title: 'Toshkent' }, territory_id: 1 },
  { id: 2, organization: "Ishonch Chilonzor Filiali", territory: { id: 1, title: 'Toshkent' }, territory_id: 1 },
  { id: 3, organization: "Ishonch Yunusobod Filiali", territory: { id: 1, title: 'Toshkent' }, territory_id: 1 },
  { id: 4, organization: "Ishonch Samarqand Filiali", territory: { id: 2, title: 'Samarqand' }, territory_id: 2 },
  { id: 5, organization: "Ishonch Farg'ona Filiali", territory: { id: 3, title: "Farg'ona" }, territory_id: 3 },
]

const mockUser: User[] = [
  {
    id: 1,
    fullname: 'Jafarbek',
    username: 'Jafarbek',
    phone: '(99) 222-66-60',
    position: 'Bosh Administrator',
    position_id: 1,
    active: true,
    office: true,
    organization: 'Ishonch Bosh Ofis',
    organization_id: 1,
    organization_myid: true,
    organization_print_name: 'Ishonch Do\'konlar Tarmog\'i',
    organization_questionnaire: true,
    favorite_pages: [],
    last_login: '2026-06-01 09:44',
    rules: {},
    settings: null,
    practice_day: { id: 1, date: '2026-06-01' },
    practice_month: {
      id: 1,
      year: 2026,
      month: 6,
      started: '2026-06-01',
      finished: null,
      organization_id: 1
    }
  }
]

const mockTerritories: Territories[] = [
  { id: 1, title: 'Toshkent shahar', active: true },
  { id: 2, title: 'Samarqand viloyati', active: true },
  { id: 3, title: 'Farg\'ona viloyati', active: true },
  { id: 4, title: 'Andijon viloyati', active: true },
]

const mockPositions: Positions[] = [
  { id: 1, position: 'Bosh Administrator' },
  { id: 2, position: 'Dasturchi' },
  { id: 3, position: 'Menejer' },
  { id: 4, position: 'Kassir' },
]

const mockStaffs: Staffs[] = [
  { id: 1, fio: 'Jafarbek Tursunov', telephone_number: '992226660', user: 'Jafarbek', user_position: { id: 2, position: 'Dasturchi' }, user_position_id: 2 },
  { id: 2, fio: 'Nodirbek Alimov', telephone_number: '998887766', user: null, user_position: { id: 3, position: 'Menejer' }, user_position_id: 3 },
  { id: 3, fio: 'Sardor Karimov', telephone_number: '901112233', user: null, user_position: { id: 4, position: 'Kassir' }, user_position_id: 4 },
]

function makeApiResponse<T>(data: T[]): ApiResponse<T> {
  return {
    data,
    links: {},
    meta: {
      current_page: 1,
      from: 1,
      last_page: 1,
      links: [{ url: null, label: '1', active: true }],
      path: '',
      per_page: 10,
      to: data.length,
      total: data.length,
    }
  }
}

export const common = {
  fetchBranches: async () => {
    return makeApiResponse(mockBranches)
  },
  fetchUser: async () => {
    return makeApiResponse(mockUser)
  },
  fetchTerritories: async () => {
    return makeApiResponse(mockTerritories)
  },
  fetchPositions: async () => {
    return makeApiResponse(mockPositions)
  },
  fetchStaffs: async () => {
    return makeApiResponse(mockStaffs)
  },
}
