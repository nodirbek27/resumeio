import { ref } from 'vue'
import { defineStore } from 'pinia'
import { auth } from '@/services/auth.service'
import type { UserCredentials } from '@/types/auth'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const router = useRouter()
  const isAuthenticated = ref<boolean>(!!token.value)

  async function login(payload: UserCredentials) {
    try {
      token.value = await auth.login(payload)
      localStorage.setItem('token', token.value ?? '')

      if (token.value) {
        isAuthenticated.value = true
        router.push('/')
      }
    } catch (e) {
      throw e
    }
  }

  return { login, isAuthenticated }
})
