<script setup lang="ts">
import { useCommonStore } from './stores/common'

const store = useCommonStore()

document.body.style.setProperty('--q-primary', store.currentTheme)
</script>

<template>
  <RouterView />
</template>
