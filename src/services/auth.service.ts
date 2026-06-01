import type { UserCredentials } from '@/types/auth'

export const auth = {
  login: async (payload: UserCredentials): Promise<string | null> => {
    // Frontend mock authentication
    return 'mock-token-12345'
  },
}
