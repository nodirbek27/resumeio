import type { ApiResponse } from '@/types/common'
import type { Users, UsersBean, UsersPayload } from '@/types/settings/users'

const STORAGE_KEY = 'mock_settings_users'

function getStoredUsers(): Users[] {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) {
    try {
      return JSON.parse(data)
    } catch {
      // fallback
    }
  }
  const defaultUsers: Users[] = [
    {
      id: 1,
      fullname: 'Jafarbek Tursunov',
      username: 'Jafarbek',
      phone: '992226660',
      active: true,
      collaboration: false,
      consultant: { id: 1, full_name: 'Consultant 1', user_id: 1 },
      last_login: '2026-06-01 09:44',
      organization: { id: 1, organization: 'Ishonch Bosh Ofis (Toshkent)' },
      organization_id: 1,
      position: { id: 1 },
      position_id: 1,
      staff: { id: 1, fio: 'Jafarbek Tursunov' },
      staff_id: 1,
      territory: { id: 1, title: 'Toshkent shahar' },
      territory_id: 1,
    },
    {
      id: 2,
      fullname: 'Nodirbek Alimov',
      username: 'nodirbek',
      phone: '998887766',
      active: true,
      collaboration: true,
      consultant: { id: 2, full_name: 'Consultant 2', user_id: 2 },
      last_login: '2026-06-01 09:00',
      organization: { id: 2, organization: 'Ishonch Chilonzor Filiali' },
      organization_id: 2,
      position: { id: 2 },
      position_id: 2,
      staff: { id: 2, fio: 'Nodirbek Alimov' },
      staff_id: 2,
      territory: { id: 1, title: 'Toshkent shahar' },
      territory_id: 1,
    }
  ]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers))
  return defaultUsers
}

function saveUsers(users: Users[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export const users = {
  get: async (payload?: UsersPayload) => {
    let list = getStoredUsers()
    if (payload?.search) {
      const searchLower = payload.search.toLowerCase()
      list = list.filter(u => u.fullname.toLowerCase().includes(searchLower) || u.username.toLowerCase().includes(searchLower))
    }
    if (payload?.organization_id) {
      list = list.filter(u => u.organization_id === payload.organization_id)
    }
    if (payload?.active !== null && payload?.active !== undefined) {
      list = list.filter(u => u.active === payload.active)
    }

    return {
      data: list,
      links: {},
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        links: [{ url: null, label: '1', active: true }],
        path: '',
        per_page: 10,
        to: list.length,
        total: list.length,
      }
    } as ApiResponse<Users>
  },
  fetchGeneratedLoginPassword: async (userId: number | null) => {
    return {
      login: 'user_' + (userId || Math.floor(Math.random() * 1000)),
      password: Math.random().toString(36).substring(2, 8).toUpperCase()
    }
  },
  createUser: async (payload: UsersBean) => {
    const list = getStoredUsers()

    if (payload.id) {
      const index = list.findIndex(u => u.id === payload.id)
      if (index !== -1) {
        list[index] = {
          ...list[index],
          phone: payload.phone,
          username: payload.username,
          organization_id: payload.organization_id || 1,
          position_id: payload.position_id || 1,
          active: true,
        }
      }
    } else {
      const newId = list.length ? Math.max(...list.map(u => u.id)) + 1 : 1
      const newUser: Users = {
        id: newId,
        fullname: payload.username,
        username: payload.username,
        phone: payload.phone,
        active: true,
        collaboration: payload.collaboration,
        consultant: { id: newId, full_name: 'Consultant ' + newId, user_id: newId },
        last_login: '—',
        organization: { id: payload.organization_id || 1, organization: 'Organization ' + payload.organization_id },
        organization_id: payload.organization_id || 1,
        position: { id: payload.position_id || 1 },
        position_id: payload.position_id || 1,
        staff: { id: payload.staff_id || 1, fio: payload.username },
        staff_id: payload.staff_id || 1,
        territory: { id: payload.territory_id || 1, title: 'Territory ' + payload.territory_id },
        territory_id: payload.territory_id || 1,
      }
      list.push(newUser)
    }
    saveUsers(list)
    return { success: true }
  },
}
