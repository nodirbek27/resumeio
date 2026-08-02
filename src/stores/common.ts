import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCommonStore = defineStore('common', () => {
  const currentTheme = ref<string>(localStorage.getItem('theme') || '#239f55')

  function changeTheme(color: string) {
    localStorage.setItem('theme', color)
    currentTheme.value = color
  }

  return {
    currentTheme,
    changeTheme,
  }
})
