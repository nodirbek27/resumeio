import type { ApiResponse } from '@/types/common'
import type { ProductGroups, ProductGroupsPayload } from '@/types/prodcts/productGroups'

const mockProductGroups: ProductGroups[] = [
  {
    id: 1,
    title: 'Elektronika',
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
    is_collaboration: false,
    key: 'electronics'
  },
  {
    id: 2,
    title: 'Maishiy texnika',
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
    is_collaboration: false,
    key: 'appliances'
  }
]

export const productGroups = {
  get: async (payload: ProductGroupsPayload): Promise<ApiResponse<ProductGroups>> => {
    let list = [...mockProductGroups]
    if (payload.search) {
      list = list.filter(item => item.title.toLowerCase().includes(payload.search.toLowerCase()))
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
    }
  }
}
