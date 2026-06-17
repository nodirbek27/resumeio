<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const stats = [
  { value: '3', label: 'Document types' },
  { value: '9', label: 'Templates' },
  { value: '100%', label: 'Free to use' },
  { value: '0', label: 'Sign-up required' },
]

const benefits = [
  {
    icon: 'mdi-shield-check-outline',
    title: 'Private by design',
    desc: 'Everything is saved locally in your browser — your data never leaves your device.',
  },
  {
    icon: 'mdi-flash-outline',
    title: 'Fast & simple',
    desc: 'Fill in a clean form on the left and watch your document update instantly on the right.',
  },
  {
    icon: 'mdi-palette-swatch-outline',
    title: 'Multiple templates',
    desc: 'Pick from Modern, Classic or Creative styles and switch anytime without losing data.',
  },
  {
    icon: 'mdi-file-pdf-box',
    title: 'One-click PDF export',
    desc: 'Download a print-ready, high-resolution PDF in a single click — no watermarks.',
  },
]
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

        <!-- Trust row -->
        <div class="hero-trust">
          <span class="trust-item"><q-icon name="mdi-check-circle" color="primary" size="16px" /> No registration</span>
          <span class="trust-item"><q-icon name="mdi-check-circle" color="primary" size="16px" /> Data stays in your browser</span>
          <span class="trust-item"><q-icon name="mdi-check-circle" color="primary" size="16px" /> Free forever</span>
        </div>
      </div>

      <!-- Decorative background shapes -->
      <div class="hero-shape hero-shape-1"></div>
      <div class="hero-shape hero-shape-2"></div>
    </div>

    <!-- STATS -->
    <div class="stats-section">
      <div v-for="s in stats" :key="s.label" class="stat-item">
        <p class="stat-value">{{ s.value }}</p>
        <p class="stat-label">{{ s.label }}</p>
      </div>
    </div>

    <!-- FEATURES -->
    <div class="features-section">
      <div class="section-heading">
        <h2 class="section-title">What you can build</h2>
        <p class="section-subtitle">Three document types, all editable and exportable in seconds.</p>
      </div>

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

    <!-- WHY CHOOSE US -->
    <div class="benefits-section">
      <div class="section-heading">
        <h2 class="section-title">Why use ResumeIO</h2>
        <p class="section-subtitle">Built to be fast, private, and genuinely useful.</p>
      </div>

      <div class="benefits-grid">
        <div v-for="b in benefits" :key="b.title" class="benefit-item">
          <div class="benefit-icon">
            <q-icon :name="b.icon" size="22px" color="primary" />
          </div>
          <div>
            <h4 class="benefit-title">{{ b.title }}</h4>
            <p class="benefit-desc">{{ b.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- HOW IT WORKS -->
    <div class="steps-section">
      <h2 class="steps-title">How it works</h2>
      <div class="steps-grid">
        <div class="step-item">
          <div class="step-num">1</div>
          <p class="step-text">Choose a template</p>
        </div>
        <div class="step-divider"></div>
        <div class="step-item">
          <div class="step-num">2</div>
          <p class="step-text">Fill in your details</p>
        </div>
        <div class="step-divider"></div>
        <div class="step-item">
          <div class="step-num">3</div>
          <p class="step-text">Download as PDF</p>
        </div>
      </div>
    </div>

    <!-- FINAL CTA -->
    <div class="cta-section">
      <div class="cta-content">
        <h2 class="cta-title">Ready to get started?</h2>
        <p class="cta-subtitle">Create your first document in under two minutes — no account needed.</p>
        <q-btn
          color="primary"
          icon="mdi-rocket-launch-outline"
          label="Create Resume Now"
          unelevated
          rounded
          to="/resume"
          class="cta-btn"
        />
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
  padding: 64px 16px 40px;
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

.hero-trust {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 18px;
  margin-top: 28px;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: #64748b;
  font-weight: 500;
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

/* STATS */
.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  background: #ffffff;
  border: 1px solid #eef2f6;
  border-radius: 18px;
  padding: 28px 16px;
  margin: 8px 0 56px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--q-primary);
  margin: 0;
}

.stat-label {
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 500;
  margin: 4px 0 0;
}

/* SECTION HEADING (shared) */
.section-heading {
  text-align: center;
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a2e;
  margin: 0 0 8px;
}

.section-subtitle {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
}

/* FEATURES */
.features-section {
  padding: 0 0 56px;
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

/* BENEFITS */
.benefits-section {
  padding: 0 0 56px;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 28px;
}

.benefit-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.benefit-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(var(--q-primary-rgb, 35, 159, 85), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.benefit-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px;
}

.benefit-desc {
  font-size: 0.83rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

/* STEPS */
.steps-section {
  background: #f8fafc;
  border-radius: 20px;
  padding: 40px 32px;
  text-align: center;
  margin-bottom: 56px;
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

/* FINAL CTA */
.cta-section {
  background: linear-gradient(135deg, var(--q-primary) 0%, #1a1a2e 100%);
  border-radius: 24px;
  padding: 56px 24px;
  text-align: center;
}

.cta-content {
  max-width: 480px;
  margin: 0 auto;
}

.cta-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: white;
  margin: 0 0 10px;
}

.cta-subtitle {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.85);
  margin: 0 0 28px;
  line-height: 1.6;
}

.cta-btn {
  background: white !important;
  color: var(--q-primary) !important;
  padding: 12px 28px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
}

@media (max-width: 600px) {
  .hero-section {
    padding: 40px 8px 32px;
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .step-divider {
    display: none;
  }

  .steps-grid {
    flex-direction: column;
  }

  .cta-section {
    padding: 40px 20px;
  }
}
</style>
