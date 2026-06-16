<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { menus } from '@/router'
import { useCommonStore } from '@/stores/common'
import type { Locales } from '@/types/common'

const $q = useQuasar()
const { t } = useI18n()

const store = useCommonStore()

/* =======================
  Responsive
======================= */
const isMobile = computed(() => $q.screen.lt.sm)
const drawer = ref(false)

/* =======================
  Language
======================= */
const language = computed<Locales>({
  get: () => store.currentLocale,
  set: (locale) => {
    store.setLocale(locale)
    window.location.reload()
  },
})

/* =======================
  Language label for display
======================= */
const languageLabel = computed(() => {
  const found = store.languages.find(l => l.locale === language.value)
  return found?.label || language.value.toUpperCase()
})

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
  <q-layout view="lHh Lpr lff" container style="height: 100vh" class="bg-grey-2">

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
            Resumeio
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

          <!-- Language Switcher -->
          <BaseBtn v-if="!isMobile" outline icon="mdi-translate" :label="languageLabel">
            <q-menu>
              <q-list>
                <q-item
                  v-for="item in store.languages"
                  :key="item.locale"
                  clickable
                  @click="language = item.locale"
                  :class="language === item.locale ? 'bg-primary text-white' : ''"
                >
                  <q-item-section>{{ item.label }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </BaseBtn>

          <!-- Theme picker -->
          <BaseBtn v-if="!isMobile" class="q-ml-sm" padding="sm" outline rounded icon="mdi-palette-outline">
            <q-menu>
              <q-list style="min-width: 180px" class="q-pa-sm">
                <q-item-label header class="text-caption">Rang Tanlash</q-item-label>
                <div class="row justify-evenly q-pa-sm q-gutter-sm">
                  <div class="color" style="background:#239f55" @click="changeTheme('#239f55')" title="Yashil" />
                  <div class="color" style="background:#3f3a72" @click="changeTheme('#3f3a72')" title="To'q ko'k" />
                  <div class="color" style="background:#6a224f" @click="changeTheme('#6a224f')" title="Qoʻngʻir-qizil" />
                  <div class="color" style="background:#193779" @click="changeTheme('#193779')" title="Ko'k" />
                  <div class="color" style="background:#c0392b" @click="changeTheme('#c0392b')" title="Qizil" />
                  <div class="color" style="background:#7f8c8d" @click="changeTheme('#7f8c8d')" title="Kulrang" />
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

        <!-- Language in mobile drawer -->
        <q-item-label header class="text-caption">🌐 Til / Язык / Language</q-item-label>
        <q-item
          v-for="item in store.languages"
          :key="item.locale"
          clickable
          v-ripple
          @click="language = item.locale; drawer = false"
          :class="language === item.locale ? 'bg-primary text-white' : ''"
        >
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <!-- Theme colors in mobile drawer -->
        <q-item-label header class="text-caption">🎨 Rang</q-item-label>
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
/* HEADER */
.main-header {
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.header-transparent {
  background: transparent;
  box-shadow: none;
}

.header-scrolled {
  background: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
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
  font-weight: bold;
  font-size: 20px;
  color: black;
}

/* MENU */
.menu-link {
  text-decoration: none;
  color: black;
  padding: 6px 14px;
  border-radius: 8px;
  transition: all 0.25s ease;
}

.menu-link:hover {
  background: rgba(0, 0, 0, 0.06);
}

.active-menu {
  background: var(--q-primary);
  color: white;
  font-style: italic;
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
