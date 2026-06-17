<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { menus } from '@/router'
import { useCommonStore } from '@/stores/common'

const $q = useQuasar()
const { t } = useI18n()

const store = useCommonStore()

/* =======================
  Responsive
======================= */
const isMobile = computed(() => $q.screen.lt.sm)
const drawer = ref(false)

/* =======================
  Theme
======================= */
const changeTheme = (color: string) => {
  document.body.style.setProperty('--q-primary', color)
  store.chengeTheme(color)
}

/* =======================
  Header scroll effect
======================= */
const isScrolled = ref(false)

const onScroll = () => {
  isScrolled.value = window.scrollY > 0
}

onMounted(async () => {
  window.addEventListener('scroll', onScroll)
  await nextTick()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <q-layout view="lHh Lpr lff" container style="height: 100vh" class="app-bg">

    <!-- ================= HEADER ================= -->
    <q-header :class="[
      'main-header',
      isScrolled ? 'header-scrolled' : 'header-transparent'
    ]">
      <q-toolbar class="header-inner">

        <!-- HEADER CONTAINER -->
        <div class="header-container">

          <!-- Mobile menu -->
          <q-btn v-if="isMobile" flat dense round icon="mdi-menu" class="q-mr-sm" @click="drawer = !drawer" />

          <!-- Logo -->
          <RouterLink to="/" class="logo">
            <span class="logo-icon">R</span>
            ResumeIO
          </RouterLink>

          <q-space />

          <!-- Desktop menu -->
          <div v-if="!isMobile" class="row items-center q-ml-md">
            <RouterLink v-for="menu in menus" :key="menu.name" :to="{ name: menu.name as string }"
              class="menu-link q-mx-xs" active-class="active-menu">
              {{ t(menu.meta?.title as string) }}
            </RouterLink>
          </div>

          <q-space />

          <!-- Theme picker -->
          <BaseBtn v-if="!isMobile" padding="sm" outline rounded icon="mdi-palette-outline">
            <q-menu>
              <q-list style="min-width: 180px" class="q-pa-sm">
                <q-item-label header class="text-caption">Choose color</q-item-label>
                <div class="row justify-evenly q-pa-sm q-gutter-sm">
                  <div class="color" style="background:#239f55" @click="changeTheme('#239f55')" title="Green" />
                  <div class="color" style="background:#3f3a72" @click="changeTheme('#3f3a72')" title="Dark blue" />
                  <div class="color" style="background:#6a224f" @click="changeTheme('#6a224f')" title="Maroon" />
                  <div class="color" style="background:#193779" @click="changeTheme('#193779')" title="Blue" />
                  <div class="color" style="background:#c0392b" @click="changeTheme('#c0392b')" title="Red" />
                  <div class="color" style="background:#7f8c8d" @click="changeTheme('#7f8c8d')" title="Gray" />
                </div>
              </q-list>
            </q-menu>
          </BaseBtn>

        </div>
      </q-toolbar>
    </q-header>

    <!-- ================= DRAWER (MOBILE) ================= -->
    <q-drawer v-model="drawer" side="left" overlay bordered behavior="mobile">
      <q-list padding>

        <q-item-label header>Menu</q-item-label>

        <q-item v-for="menu in menus" :key="menu.name" clickable v-ripple
          @click="$router.push({ name: menu.name as string }); drawer = false">
          <q-item-section>
            {{ t(menu.meta?.title as string) }}
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <!-- Theme colors in mobile drawer -->
        <q-item-label header class="text-caption">Color theme</q-item-label>
        <div class="row justify-evenly q-pa-sm q-gutter-sm q-mb-sm">
          <div class="color" style="background:#239f55" @click="changeTheme('#239f55')" />
          <div class="color" style="background:#3f3a72" @click="changeTheme('#3f3a72')" />
          <div class="color" style="background:#6a224f" @click="changeTheme('#6a224f')" />
          <div class="color" style="background:#193779" @click="changeTheme('#193779')" />
          <div class="color" style="background:#c0392b" @click="changeTheme('#c0392b')" />
          <div class="color" style="background:#7f8c8d" @click="changeTheme('#7f8c8d')" />
        </div>

      </q-list>
    </q-drawer>

    <!-- ================= PAGE ================= -->
    <q-page-container>
      <q-page padding>
        <RouterView />
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<style scoped>
/* APP BG */
:global(.app-bg) {
  background: #f8fafc !important;
}

/* HEADER */
.main-header {
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.header-transparent {
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: none;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}

.header-scrolled {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 1px 16px rgba(0, 0, 0, 0.07);
  border-bottom: 1px solid rgba(0,0,0,0.08);
}

/* TOOLBAR */
.header-inner {
  padding: 0;
  min-height: 64px;
}

/* CONTAINER */
.header-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  align-items: center;
}

/* LOGO */
.logo {
  text-decoration: none;
  font-weight: 800;
  font-size: 18px;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.3px;
}

.logo-icon {
  width: 30px;
  height: 30px;
  background: var(--q-primary);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 900;
  flex-shrink: 0;
}

/* MENU */
.menu-link {
  text-decoration: none;
  color: #475569;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.menu-link:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #1e293b;
}

.active-menu {
  background: var(--q-primary);
  color: white !important;
  font-weight: 600;
}

/* THEME COLORS */
.color {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #ccc;
  transition: transform 0.15s ease;
}

.color:hover {
  transform: scale(1.2);
}
</style>
