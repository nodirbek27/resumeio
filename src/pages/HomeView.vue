<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <q-page class="home-page">

    <!-- HERO -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">
          <q-icon name="mdi-file-document-multiple-outline" size="16px" />
          <span>Resume · Cover Letter · Obektivka</span>
        </div>
        <h1 class="hero-title">{{ t('home.welcome_message') }}</h1>
        <p class="hero-subtitle">{{ t('home.subtitle') }}</p>

        <div class="hero-buttons">
          <q-btn
            color="primary"
            icon="mdi-file-account-outline"
            :label="t('home.create_resume')"
            unelevated
            rounded
            to="/resume"
            class="hero-btn-primary"
          />
          <q-btn
            outline
            color="primary"
            icon="mdi-email-edit-outline"
            :label="t('home.create_cover_letter')"
            rounded
            to="/cover-letter"
            class="hero-btn-outline"
          />
          <q-btn
            outline
            color="primary"
            icon="mdi-card-account-details-outline"
            :label="t('home.create_obektivka')"
            rounded
            to="/obektivka"
            class="hero-btn-outline"
          />
        </div>
      </div>

      <!-- Decorative background shapes -->
      <div class="hero-shape hero-shape-1"></div>
      <div class="hero-shape hero-shape-2"></div>
    </div>

    <!-- FEATURES -->
    <div class="features-section">
      <div class="features-grid">

        <q-card class="feature-card" flat bordered>
          <q-card-section class="feature-card-inner">
            <div class="feature-icon-wrap feature-icon-resume">
              <q-icon name="mdi-file-document-edit-outline" size="28px" color="primary" />
            </div>
            <h3 class="feature-title">{{ t('home.feature.resume_title') }}</h3>
            <p class="feature-desc">{{ t('home.feature.resume_desc') }}</p>
            <q-btn flat color="primary" :label="t('home.create_resume')" icon-right="mdi-arrow-right" to="/resume" class="feature-link" />
          </q-card-section>
        </q-card>

        <q-card class="feature-card" flat bordered>
          <q-card-section class="feature-card-inner">
            <div class="feature-icon-wrap feature-icon-cover">
              <q-icon name="mdi-email-edit-outline" size="28px" color="secondary" />
            </div>
            <h3 class="feature-title">{{ t('home.feature.cover_letter_title') }}</h3>
            <p class="feature-desc">{{ t('home.feature.cover_letter_desc') }}</p>
            <q-btn flat color="secondary" :label="t('home.create_cover_letter')" icon-right="mdi-arrow-right" to="/cover-letter" class="feature-link" />
          </q-card-section>
        </q-card>

        <q-card class="feature-card" flat bordered>
          <q-card-section class="feature-card-inner">
            <div class="feature-icon-wrap feature-icon-obektivka">
              <q-icon name="mdi-card-account-details-outline" size="28px" color="orange-8" />
            </div>
            <h3 class="feature-title">{{ t('home.feature.obektivka_title') }}</h3>
            <p class="feature-desc">{{ t('home.feature.obektivka_desc') }}</p>
            <q-btn flat color="orange-8" :label="t('home.create_obektivka')" icon-right="mdi-arrow-right" to="/obektivka" class="feature-link" />
          </q-card-section>
        </q-card>

      </div>
    </div>

    <!-- HOW IT WORKS -->
    <div class="steps-section">
      <h2 class="steps-title">Qanday ishlaydi?</h2>
      <div class="steps-grid">
        <div class="step-item">
          <div class="step-num">1</div>
          <p class="step-text">Shablon tanlang</p>
        </div>
        <div class="step-divider"></div>
        <div class="step-item">
          <div class="step-num">2</div>
          <p class="step-text">Ma'lumotlarni to'ldiring</p>
        </div>
        <div class="step-divider"></div>
        <div class="step-item">
          <div class="step-num">3</div>
          <p class="step-text">PDF yuklab oling</p>
        </div>
      </div>
    </div>

  </q-page>
</template>

<style scoped>
.home-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px 64px;
}

/* HERO */
.hero-section {
  position: relative;
  text-align: center;
  padding: 64px 16px 56px;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(var(--q-primary-rgb, 35, 159, 85), 0.08);
  color: var(--q-primary);
  border: 1px solid rgba(var(--q-primary-rgb, 35, 159, 85), 0.2);
  border-radius: 999px;
  padding: 4px 14px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 20px;
}

.hero-title {
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  font-weight: 800;
  color: #1a1a2e;
  line-height: 1.2;
  margin: 0 0 16px;
}

.hero-subtitle {
  font-size: 1rem;
  color: #64748b;
  max-width: 520px;
  margin: 0 auto 36px;
  line-height: 1.7;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.hero-btn-primary {
  padding: 10px 24px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
}

.hero-btn-outline {
  padding: 10px 24px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
}

.hero-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.06;
  background: var(--q-primary);
  pointer-events: none;
}

.hero-shape-1 {
  width: 400px;
  height: 400px;
  top: -150px;
  right: -100px;
}

.hero-shape-2 {
  width: 250px;
  height: 250px;
  bottom: -80px;
  left: -60px;
}

/* FEATURES */
.features-section {
  padding: 0 0 48px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.feature-card {
  border-radius: 16px !important;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  cursor: default;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08) !important;
}

.feature-card-inner {
  padding: 28px !important;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feature-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.feature-icon-resume {
  background: rgba(var(--q-primary-rgb, 35, 159, 85), 0.1);
}

.feature-icon-cover {
  background: rgba(103, 58, 183, 0.08);
}

.feature-icon-obektivka {
  background: rgba(245, 124, 0, 0.1);
}

.feature-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.feature-desc {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.feature-link {
  align-self: flex-start;
  padding: 0 !important;
  font-size: 13px !important;
  font-weight: 600 !important;
}

/* STEPS */
.steps-section {
  background: #f8fafc;
  border-radius: 20px;
  padding: 40px 32px;
  text-align: center;
}

.steps-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 28px;
}

.steps-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.step-num {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--q-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
}

.step-text {
  font-size: 0.85rem;
  color: #475569;
  font-weight: 500;
  margin: 0;
  max-width: 100px;
  line-height: 1.4;
}

.step-divider {
  width: 50px;
  height: 2px;
  background: #e2e8f0;
  align-self: center;
  flex-shrink: 0;
}

@media (max-width: 600px) {
  .hero-section {
    padding: 40px 8px 36px;
  }

  .step-divider {
    display: none;
  }

  .steps-grid {
    flex-direction: column;
  }
}
</style>
