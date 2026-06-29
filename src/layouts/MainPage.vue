<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { menus } from '@/router'
import { useCommonStore } from '@/stores/common'

const $q = useQuasar()
const { t } = useI18n()

const store = useCommonStore()

const navMenus = menus.filter(m => m.meta?.title)

const menuIconMap: Record<string, string> = {
  resume: 'mdi-file-account-outline',
  coverLetter: 'mdi-email-edit-outline',
  obektivka: 'mdi-card-account-details-outline',
}

function getMenuIcon(name: string | symbol | null | undefined): string {
  return menuIconMap[String(name ?? '')] ?? ''
}

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
          <q-btn v-if="isMobile" flat dense round icon="mdi-menu" color="dark" class="q-mr-sm" @click="drawer = !drawer" />

          <!-- Logo -->
          <RouterLink to="/" class="logo">
            <span class="logo-icon">R</span>
            ResumeIO
          </RouterLink>

          <q-space />

          <!-- Desktop menu -->
          <div v-if="!isMobile" class="row items-center q-ml-md">
            <RouterLink v-for="menu in navMenus" :key="menu.name" :to="{ name: menu.name as string }"
              class="menu-link q-mx-xs" active-class="active-menu">
              <q-icon :name="getMenuIcon(menu.name)" size="15px" class="menu-link-icon" />
              {{ t(menu.meta?.title as string) }}
            </RouterLink>
          </div>

          <q-space />

          <!-- Theme picker -->
          <BaseBtn v-if="!isMobile" padding="sm" outline rounded icon="mdi-palette-outline" color="dark">
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
    <q-drawer v-model="drawer" side="left" overlay bordered behavior="mobile" :width="260">
      <div class="drawer-inner">

        <!-- Drawer header -->
        <div class="drawer-header">
          <div class="drawer-logo">
            <span class="logo-icon">R</span>
            ResumeIO
          </div>
          <q-btn flat dense round icon="mdi-close" size="sm" @click="drawer = false" />
        </div>

        <!-- Nav items -->
        <nav class="drawer-nav">
          <RouterLink
            v-for="menu in navMenus"
            :key="menu.name"
            :to="{ name: menu.name as string }"
            class="drawer-link"
            active-class="drawer-link--active"
            @click="drawer = false"
          >
            <q-icon :name="getMenuIcon(menu.name)" size="20px" />
            {{ t(menu.meta?.title as string) }}
          </RouterLink>
        </nav>

        <div class="drawer-divider"></div>

        <!-- Theme colors -->
        <div class="drawer-section">
          <p class="drawer-section-label">Color theme</p>
          <div class="drawer-colors">
            <div class="color" style="background:#239f55" @click="changeTheme('#239f55')" title="Green" />
            <div class="color" style="background:#3f3a72" @click="changeTheme('#3f3a72')" title="Dark Blue" />
            <div class="color" style="background:#6a224f" @click="changeTheme('#6a224f')" title="Maroon" />
            <div class="color" style="background:#193779" @click="changeTheme('#193779')" title="Blue" />
            <div class="color" style="background:#c0392b" @click="changeTheme('#c0392b')" title="Red" />
            <div class="color" style="background:#7f8c8d" @click="changeTheme('#7f8c8d')" title="Gray" />
          </div>
        </div>

      </div>
    </q-drawer>

    <!-- ================= PAGE ================= -->
    <q-page-container>
      <q-page padding>
        <RouterView />
      </q-page>
    </q-page-container>

    <!-- ================= FOOTER ================= -->
    <q-footer class="app-footer">
      <div class="footer-inner">
        <div class="footer-left">
          <RouterLink to="/" class="footer-logo">
            <span class="footer-logo-icon">R</span>
            ResumeIO
          </RouterLink>
          <p class="footer-tagline">
            <q-icon name="mdi-shield-lock-outline" size="13px" />
            Your data never leaves your device
          </p>
        </div>

        <nav class="footer-links">
          <RouterLink v-for="menu in menus" :key="menu.name" :to="{ name: menu.name as string }" class="footer-link">
            {{ t(menu.meta?.title as string) }}
          </RouterLink>
        </nav>

        <p class="footer-copy">&copy; {{ new Date().getFullYear() }} ResumeIO &middot; Free forever</p>
      </div>
    </q-footer>

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
  padding: 6px 13px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.menu-link-icon {
  opacity: 0.7;
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

.active-menu .menu-link-icon {
  opacity: 1;
}

/* DRAWER */
.drawer-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 12px;
  border-bottom: 1px solid #f1f5f9;
}

.drawer-logo {
  font-weight: 800;
  font-size: 16px;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 10px;
}

.drawer-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 12px;
  border-radius: 10px;
  transition: background 0.15s, color 0.15s;
}

.drawer-link:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.drawer-link--active {
  background: rgba(var(--q-primary-rgb, 35,159,85), 0.1);
  color: var(--q-primary) !important;
  font-weight: 600;
}

.drawer-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 4px 16px;
}

.drawer-section {
  padding: 12px 16px;
}

.drawer-section-label {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 10px;
}

.drawer-colors {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* FOOTER */
.app-footer {
  background: #fff !important;
  border-top: 1px solid #e8edf3;
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-logo {
  text-decoration: none;
  font-weight: 800;
  font-size: 15px;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 6px;
}

.footer-logo-icon {
  width: 22px;
  height: 22px;
  background: var(--q-primary);
  color: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 900;
  flex-shrink: 0;
}

.footer-tagline {
  font-size: 11.5px;
  color: #94a3b8;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-link {
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  padding: 5px 10px;
  border-radius: 7px;
  transition: background 0.15s, color 0.15s;
}

.footer-link:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.footer-copy {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
  white-space: nowrap;
}

@media (max-width: 600px) {
  .footer-inner {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 18px 16px;
    gap: 12px;
  }

  .footer-left { align-items: center; }
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
