<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Reveal from '@/components/RevealSection.vue'

const stats = [
  { value: '9', label: 'Resume templates' },
  { value: '5', label: 'Cover letter styles' },
  { value: '100%', label: 'Free forever' },
  { value: '0', label: 'Account needed' },
]

const benefits = [
  {
    icon: 'mdi-shield-lock-outline',
    title: 'Your data stays private',
    desc: 'Everything is saved in your browser only. Nothing is uploaded to any server.',
  },
  {
    icon: 'mdi-lightning-bolt-outline',
    title: 'Real-time preview',
    desc: 'Watch your document update live as you type — no waiting, no refreshing.',
  },
  {
    icon: 'mdi-palette-outline',
    title: 'Multiple templates',
    desc: 'Modern, Classic, Creative and more. Switch anytime without losing your data.',
  },
  {
    icon: 'mdi-file-pdf-box',
    title: 'One-click PDF export',
    desc: 'Download a crisp, print-ready PDF instantly. No watermarks, no limits.',
  },
]

const faqs = [
  {
    q: 'Is ResumeIO really free to use?',
    a: 'Yes. Building a resume or cover letter, previewing it live, and exporting it as a PDF is completely free — no account, no hidden paywall, no watermark.',
  },
  {
    q: 'Is my personal information stored anywhere?',
    a: "No. Everything you type is saved in your browser's local storage only. Nothing is uploaded to a server, so your data never leaves your device.",
  },
  {
    q: 'What file formats can I download?',
    a: 'You can export both your resume and cover letter as a print-ready PDF with a single click.',
  },
  {
    q: 'Can I switch templates without losing my data?',
    a: 'Yes. Your information is kept separate from the template design, so you can switch between Modern, Classic, Creative and other styles anytime without re-entering anything.',
  },
]

const openFaq = ref<number | null>(0)

const FAQ_JSONLD_ID = 'seo-jsonld-faq'

onMounted(() => {
  let el = document.getElementById(FAQ_JSONLD_ID) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = FAQ_JSONLD_ID
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  })
})

onUnmounted(() => {
  document.getElementById(FAQ_JSONLD_ID)?.remove()
})
</script>

<template>
  <q-page class="home-page">

    <!-- ═══════════════════════════════════ HERO ═══════════════════════════════════ -->
    <Reveal>
    <section class="hero">
      <div class="hero-left">
        <div class="hero-badge">
          <q-icon name="mdi-star-four-points" size="13px" />
          <span>Free &middot; No sign-up &middot; Instant PDF</span>
        </div>

        <h1 class="hero-title">Create your professional documents</h1>
        <p class="hero-subtitle">Resume and Cover Letter — ready to download as PDF, all in one place.</p>

        <q-btn
          color="primary"
          icon="mdi-file-account-outline"
          label="Create Resume"
          unelevated
          rounded
          to="/resume"
          class="hero-main-btn"
        />

        <div class="hero-sec-links">
          <router-link to="/cover-letter" class="sec-link">
            <q-icon name="mdi-email-edit-outline" size="15px" />
            Create Cover Letter
          </router-link>
        </div>

        <div class="hero-trust">
          <span class="trust-item">
            <q-icon name="mdi-check-circle" color="primary" size="15px" />
            No registration
          </span>
          <span class="trust-item">
            <q-icon name="mdi-check-circle" color="primary" size="15px" />
            Data stays on device
          </span>
          <span class="trust-item">
            <q-icon name="mdi-check-circle" color="primary" size="15px" />
            Free forever
          </span>
        </div>
      </div>

      <!-- Mini resume + cover letter mockup -->
      <div class="hero-right" aria-hidden="true">
        <div class="resume-mock">
          <div class="rm-sidebar">
            <div class="rm-avatar">
              <q-icon name="mdi-account" size="20px" />
            </div>
            <div class="rm-line w70 mt10"></div>
            <div class="rm-line w50 op60 mt4"></div>
            <div class="rm-divider mt12"></div>
            <div class="rm-label mt10"></div>
            <div class="rm-line w80 mt8"></div>
            <div class="rm-line w65 op70 mt5"></div>
            <div class="rm-line w55 op50 mt5"></div>
            <div class="rm-divider mt12"></div>
            <div class="rm-label mt10"></div>
            <div class="rm-tags mt8">
              <div class="rm-tag"></div>
              <div class="rm-tag w2"></div>
              <div class="rm-tag"></div>
              <div class="rm-tag w2"></div>
              <div class="rm-tag w3"></div>
            </div>
          </div>
          <div class="rm-main">
            <div class="rm-name">Sophia Bennett</div>
            <div class="rm-jobtitle mt5">Product Designer</div>
            <div class="rm-section-label mt14"></div>
            <div class="rm-line w100 mt8 dark"></div>
            <div class="rm-line w100 op70 mt5 dark"></div>
            <div class="rm-line w70 op50 mt5 dark"></div>
            <div class="rm-section-label mt14"></div>
            <div class="rm-exp mt8">
              <div>
                <div class="rm-line w60 dark"></div>
                <div class="rm-line w45 op60 mt4 dark"></div>
              </div>
              <div class="rm-date"></div>
            </div>
            <div class="rm-line w100 op40 mt6 dark"></div>
            <div class="rm-line w90 op30 mt4 dark"></div>
            <div class="rm-section-label mt14"></div>
            <div class="rm-exp mt8">
              <div>
                <div class="rm-line w55 dark"></div>
                <div class="rm-line w40 op60 mt4 dark"></div>
              </div>
              <div class="rm-date"></div>
            </div>
          </div>
        </div>

        <!-- Floating cover letter mini card -->
        <div class="cover-mock">
          <div class="cm-header"></div>
          <div class="cm-line w80 mt6"></div>
          <div class="cm-line w60 op70 mt4"></div>
          <div class="cm-divider mt6"></div>
          <div class="cm-line w90 mt6"></div>
          <div class="cm-line w85 op80 mt4"></div>
          <div class="cm-line w50 op60 mt4"></div>
        </div>
      </div>
    </section>
    </Reveal>

    <!-- ═══════════════════════════════════ STATS ═══════════════════════════════════ -->
    <Reveal :delay="80">
    <div class="stats-bar">
      <div v-for="s in stats" :key="s.label" class="stat-item">
        <span class="stat-value">{{ s.value }}</span>
        <span class="stat-label">{{ s.label }}</span>
      </div>
    </div>
    </Reveal>

    <!-- ═══════════════════════════════════ DOCUMENT TYPES ═══════════════════════════════════ -->
    <Reveal>
    <section class="docs-section">
      <div class="section-head">
        <h2>Everything you need, one place</h2>
        <p>Everything a job seeker needs — built and exported in minutes.</p>
      </div>

      <div class="docs-grid">

        <!-- Resume -->
        <div class="doc-card">
          <div class="doc-preview doc-preview--resume">
            <div class="dp-sidebar">
              <div class="dp-avatar"></div>
              <div class="dp-line w70 mt8"></div>
              <div class="dp-line w50 op60 mt4"></div>
              <div class="dp-divider mt10"></div>
              <div class="dp-tag mt8"></div>
              <div class="dp-tag mt4 w2"></div>
              <div class="dp-tag mt4"></div>
            </div>
            <div class="dp-main">
              <div class="dp-name"></div>
              <div class="dp-title mt4"></div>
              <div class="dp-section mt10"></div>
              <div class="dp-line w100 mt6"></div>
              <div class="dp-line w90 op70 mt4"></div>
              <div class="dp-line w60 op50 mt4"></div>
              <div class="dp-section mt10"></div>
              <div class="dp-line w80 mt6"></div>
              <div class="dp-line w70 op60 mt4"></div>
            </div>
          </div>
          <div class="doc-info">
            <h3>Professional Resume</h3>
            <p>Create modern resumes that match international standards.</p>
            <router-link to="/resume" class="doc-cta doc-cta--primary">
              Create Resume
              <q-icon name="mdi-arrow-right" size="16px" />
            </router-link>
          </div>
        </div>

        <!-- Cover Letter -->
        <div class="doc-card">
          <div class="doc-preview doc-preview--cover">
            <div class="dp-cover-top">
              <div>
                <div class="dp-name"></div>
                <div class="dp-title mt4"></div>
              </div>
            </div>
            <div class="dp-cover-body">
              <div class="dp-section mt10"></div>
              <div class="dp-line w90 mt6"></div>
              <div class="dp-line w100 op80 mt4"></div>
              <div class="dp-line w70 op60 mt4"></div>
              <div class="dp-spacer mt10"></div>
              <div class="dp-line w95 mt6"></div>
              <div class="dp-line w80 op70 mt4"></div>
              <div class="dp-line w60 op50 mt4"></div>
            </div>
          </div>
          <div class="doc-info">
            <h3>Cover Letter</h3>
            <p>Write a cover letter that impresses recruiters.</p>
            <router-link to="/cover-letter" class="doc-cta doc-cta--cover">
              Create Cover Letter
              <q-icon name="mdi-arrow-right" size="16px" />
            </router-link>
          </div>
        </div>

      </div>
    </section>
    </Reveal>

    <!-- ═══════════════════════════════════ HOW IT WORKS ═══════════════════════════════════ -->
    <Reveal>
    <section class="steps-section">
      <h2 class="steps-title">How it works</h2>
      <div class="steps-row">
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-icon-wrap">
            <q-icon name="mdi-palette-swatch-outline" size="24px" color="primary" />
          </div>
          <p class="step-label">Choose a template</p>
        </div>
        <div class="step-arrow">&rarr;</div>
        <div class="step">
          <div class="step-num">2</div>
          <div class="step-icon-wrap">
            <q-icon name="mdi-pencil-outline" size="24px" color="primary" />
          </div>
          <p class="step-label">Fill in your details</p>
        </div>
        <div class="step-arrow">&rarr;</div>
        <div class="step">
          <div class="step-num">3</div>
          <div class="step-icon-wrap">
            <q-icon name="mdi-download-outline" size="24px" color="primary" />
          </div>
          <p class="step-label">Download as PDF</p>
        </div>
      </div>
    </section>
    </Reveal>

    <!-- ═══════════════════════════════════ BENEFITS ═══════════════════════════════════ -->
    <Reveal>
    <section class="benefits-section">
      <div class="section-head">
        <h2>Why ResumeIO</h2>
        <p>Built to be fast, private, and genuinely useful.</p>
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
    </section>
    </Reveal>

    <!-- ═══════════════════════════════════ FAQ ═══════════════════════════════════ -->
    <Reveal>
    <section class="faq-section">
      <div class="section-head">
        <h2>Frequently asked questions</h2>
        <p>Everything you need to know about ResumeIO.</p>
      </div>

      <div class="faq-list">
        <div
          v-for="(item, i) in faqs"
          :key="item.q"
          class="faq-item"
          :class="{ 'faq-item--open': openFaq === i }"
        >
          <h3 class="faq-q-wrap">
            <button
              type="button"
              class="faq-question"
              :aria-expanded="openFaq === i"
              :aria-controls="`faq-panel-${i}`"
              @click="openFaq = openFaq === i ? null : i"
            >
              <span>{{ item.q }}</span>
              <q-icon name="mdi-chevron-down" size="22px" class="faq-chevron" />
            </button>
          </h3>
          <q-slide-transition>
            <div v-show="openFaq === i" :id="`faq-panel-${i}`">
              <p class="faq-answer">{{ item.a }}</p>
            </div>
          </q-slide-transition>
        </div>
      </div>
    </section>
    </Reveal>

    <!-- ═══════════════════════════════════ FINAL CTA ═══════════════════════════════════ -->
    <Reveal>
    <section class="cta-section">
      <div class="cta-inner">
        <h2>Ready to land your next job?</h2>
        <p>Build your resume and cover letter — free, fast, no account needed.</p>
        <div class="cta-buttons">
          <q-btn
            color="white"
            text-color="primary"
            label="Build Resume"
            unelevated
            rounded
            to="/resume"
            class="cta-btn"
          />
          <q-btn
            outline
            color="white"
            label="Write Cover Letter"
            rounded
            to="/cover-letter"
            class="cta-btn-out"
          />
        </div>
      </div>
    </section>
    </Reveal>

  </q-page>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.home-page {
  font-family: 'Inter', sans-serif;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px 80px;
}

/* ─── HERO ─────────────────────────────────────────────────────────────────── */
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  align-items: center;
  padding: 72px 0 64px;
}

.hero-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(var(--q-primary-rgb, 35,159,85), 0.08);
  color: var(--q-primary);
  border: 1px solid rgba(var(--q-primary-rgb, 35,159,85), 0.2);
  border-radius: 999px;
  padding: 4px 14px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 22px;
}

.hero-title {
  font-size: clamp(1.9rem, 4.5vw, 2.9rem);
  font-weight: 900;
  color: #0f172a;
  line-height: 1.18;
  margin: 0 0 16px;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.75;
  margin: 0 0 32px;
  max-width: 440px;
}

.hero-main-btn {
  font-size: 15px !important;
  font-weight: 700 !important;
  padding: 13px 32px !important;
  box-shadow: 0 4px 16px rgba(var(--q-primary-rgb, 35,159,85), 0.35) !important;
  margin-bottom: 18px;
}

.hero-sec-links {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}

.sec-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13.5px;
  font-weight: 600;
  color: #475569;
  text-decoration: none;
  transition: color 0.2s;
}
.sec-link:hover { color: var(--q-primary); }

.hero-trust {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  color: #64748b;
  font-weight: 500;
}

/* ─── RESUME MOCKUP ────────────────────────────────────────────────────────── */
.hero-right {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.resume-mock {
  display: flex;
  width: 320px;
  height: 230px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.08);
  position: relative;
  z-index: 2;
}

.rm-sidebar {
  width: 36%;
  background: #1e293b;
  padding: 16px 12px;
  flex-shrink: 0;
}

.rm-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.65);
  margin: 0 auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rm-main {
  flex: 1;
  background: #ffffff;
  padding: 16px 14px;
}

/* Shared line/element helpers */
.rm-line {
  height: 5px;
  border-radius: 3px;
  background: rgba(255,255,255,0.25);
}
.rm-line.dark { background: rgba(15,23,42,0.12); }
.rm-divider {
  height: 1px;
  background: rgba(255,255,255,0.1);
}
.rm-label {
  width: 40%;
  height: 4px;
  border-radius: 2px;
  background: rgba(var(--q-primary-rgb, 35,159,85), 0.5);
}
.rm-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.rm-tag {
  height: 12px;
  width: 28px;
  border-radius: 4px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.15);
}
.rm-tag.w2 { width: 36px; }
.rm-tag.w3 { width: 44px; }
.rm-name {
  font-size: 11px;
  font-weight: 800;
  line-height: 1.2;
  color: rgba(15,23,42,0.85);
  white-space: nowrap;
}
.rm-jobtitle {
  font-size: 7.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--q-primary);
  opacity: 0.85;
  white-space: nowrap;
}
.rm-section-label {
  height: 4px;
  width: 35%;
  border-radius: 2px;
  background: rgba(15,23,42,0.2);
}
.rm-exp { display: flex; justify-content: space-between; align-items: flex-start; }
.rm-date { width: 30%; height: 4px; border-radius: 2px; background: rgba(var(--q-primary-rgb,35,159,85),0.4); }

/* Width helpers */
.w100 { width: 100%; }
.w90  { width: 90%;  }
.w80  { width: 80%;  }
.w70  { width: 70%;  }
.w65  { width: 65%;  }
.w60  { width: 60%;  }
.w55  { width: 55%;  }
.w50  { width: 50%;  }
.w45  { width: 45%;  }
.w40  { width: 40%;  }

/* Opacity helpers */
.op70 { opacity: 0.7; }
.op60 { opacity: 0.6; }
.op50 { opacity: 0.5; }
.op40 { opacity: 0.4; }
.op30 { opacity: 0.3; }

/* Margin helpers */
.mt4  { margin-top: 4px;  }
.mt5  { margin-top: 5px;  }
.mt6  { margin-top: 6px;  }
.mt8  { margin-top: 8px;  }
.mt10 { margin-top: 10px; }
.mt12 { margin-top: 12px; }
.mt14 { margin-top: 14px; }

/* Cover letter floating card */
.cover-mock {
  position: absolute;
  bottom: -28px;
  right: -24px;
  width: 140px;
  background: #fff;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.07);
  z-index: 3;
}
.cm-header { height: 7px; width: 80%; border-radius: 4px; background: #0f172a; }
.cm-line { height: 4px; border-radius: 2px; background: rgba(15,23,42,0.12); }
.cm-line.w80 { width: 80%; }
.cm-line.w60 { width: 60%; }
.cm-line.w90 { width: 90%; }
.cm-line.w85 { width: 85%; }
.cm-line.w50 { width: 50%; }
.cm-line.op70 { opacity: 0.7; }
.cm-line.op80 { opacity: 0.8; }
.cm-line.op60 { opacity: 0.6; }
.cm-divider { height: 1px; background: #e2e8f0; }
.cm-line.mt6 { margin-top: 6px; }
.cm-line.mt4 { margin-top: 4px; }
.cm-divider.mt6 { margin-top: 6px; }

/* ─── STATS BAR ─────────────────────────────────────────────────────────────── */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(0,0,0,0.05);
  margin-bottom: 64px;
}

.stat-item {
  text-align: center;
  padding: 28px 16px;
  border-right: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: background-color 0.3s ease;
}
.stat-item:hover {
  background: rgba(var(--q-primary-rgb, 35, 159, 85), 0.04);
}
.stat-item:last-child { border-right: none; }

.stat-value {
  font-size: 2rem;
  font-weight: 900;
  color: var(--q-primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 500;
}

/* ─── SECTION HEAD (shared) ─────────────────────────────────────────────────── */
.section-head {
  text-align: center;
  margin-bottom: 40px;
}
.section-head h2 {
  font-size: 1.65rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 8px;
  letter-spacing: -0.01em;
}
.section-head p {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
}

/* ─── DOCUMENT TYPES ────────────────────────────────────────────────────────── */
.docs-section {
  padding-bottom: 64px;
}

.docs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 760px;
  margin: 0 auto;
}

.doc-card {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: default;
}
.doc-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.09);
}

/* Document preview area */
.doc-preview {
  height: 160px;
  padding: 16px;
  display: flex;
  gap: 10px;
  position: relative;
  overflow: hidden;
}

.doc-preview--resume {
  background: linear-gradient(135deg, #f8faff 0%, #eef2ff 100%);
}
.doc-preview--cover {
  background: linear-gradient(135deg, #faf8ff 0%, #f3e8ff 100%);
  flex-direction: column;
}

/* Shared preview elements */
.dp-sidebar {
  width: 35%;
  background: #1e293b;
  border-radius: 8px;
  padding: 10px 8px;
  flex-shrink: 0;
}
.dp-main { flex: 1; padding: 4px 0; }
.dp-avatar {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  margin: 0 auto;
}
.dp-name { height: 6px; width: 65%; border-radius: 3px; background: rgba(15,23,42,0.7); }
.dp-title { height: 4px; width: 45%; border-radius: 2px; }
.doc-preview--resume .dp-title { background: rgba(var(--q-primary-rgb,35,159,85),0.5); }
.doc-preview--cover .dp-title { background: rgba(124,58,237,0.45); }

.dp-line { height: 4px; border-radius: 2px; background: rgba(15,23,42,0.12); }
.dp-line.w100 { width: 100%; }
.dp-line.w90  { width: 90%; }
.dp-line.w80  { width: 80%; }
.dp-line.w70  { width: 70%; }
.dp-line.w60  { width: 60%; }
.dp-line.w50  { width: 50%; }
.dp-line.op80 { opacity: 0.8; }
.dp-line.op70 { opacity: 0.7; }
.dp-line.op60 { opacity: 0.6; }
.dp-line.op50 { opacity: 0.5; }
.dp-line.mt6  { margin-top: 6px; }
.dp-line.mt8  { margin-top: 8px; }
.dp-line.mt4  { margin-top: 4px; }
.dp-section { height: 3px; width: 40%; border-radius: 2px; background: rgba(15,23,42,0.2); }
.dp-divider { height: 1px; background: rgba(255,255,255,0.1); }
.dp-label { height: 3px; width: 50%; border-radius: 2px; background: rgba(15,23,42,0.18); }
.dp-tag { height: 10px; width: 24px; border-radius: 3px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); }
.dp-tag.w2 { width: 32px; }
.dp-spacer { height: 4px; }

/* Cover letter preview specific */
.dp-cover-top {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(124,58,237,0.15);
}
.dp-cover-body { flex: 1; }

/* margin helpers for dp */
.dp-avatar.mt10, .mt10 { margin-top: 10px; }
.mt8 { margin-top: 8px; }
.mt4 { margin-top: 4px; }

/* Doc info section */
.doc-info {
  padding: 20px 22px 22px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.doc-info h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}
.doc-info p {
  font-size: 0.84rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.doc-cta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13.5px;
  font-weight: 700;
  text-decoration: none;
  margin-top: 4px;
  transition: gap 0.2s;
}
.doc-cta:hover { gap: 8px; }
.doc-cta--primary   { color: var(--q-primary); }
.doc-cta--cover     { color: #7c3aed; }

/* ─── HOW IT WORKS ───────────────────────────────────────────────────────────── */
.steps-section {
  background: #f8fafc;
  border-radius: 24px;
  padding: 44px 32px;
  text-align: center;
  margin-bottom: 64px;
}

.steps-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 32px;
  letter-spacing: -0.01em;
}

.steps-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-width: 100px;
}

.step-num {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--q-primary);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(var(--q-primary-rgb, 35,159,85), 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-label {
  font-size: 0.84rem;
  color: #475569;
  font-weight: 600;
  margin: 0;
  max-width: 90px;
  line-height: 1.4;
}

.step-arrow {
  font-size: 20px;
  color: #cbd5e1;
  font-weight: 300;
  margin-bottom: 10px;
}

/* ─── BENEFITS ───────────────────────────────────────────────────────────────── */
.benefits-section {
  padding-bottom: 64px;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px 40px;
}

.benefit-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.benefit-icon {
  width: 46px;
  height: 46px;
  border-radius: 13px;
  background: rgba(var(--q-primary-rgb, 35,159,85), 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}
.benefit-item:hover .benefit-icon {
  transform: scale(1.1);
}

.benefit-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 5px;
}

.benefit-desc {
  font-size: 0.84rem;
  color: #64748b;
  line-height: 1.65;
  margin: 0;
}

/* ─── FAQ ────────────────────────────────────────────────────────────────────── */
.faq-section {
  padding-bottom: 64px;
}

.faq-list {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.faq-item--open {
  border-color: rgba(var(--q-primary-rgb, 35, 159, 85), 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.faq-q-wrap {
  margin: 0;
}

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 20px 24px;
  text-align: left;
  font: inherit;
  font-size: 0.98rem;
  font-weight: 700;
  color: #0f172a;
  transition: color 0.3s ease;
}

.faq-item--open .faq-question {
  color: var(--q-primary);
}

.faq-chevron {
  flex-shrink: 0;
  color: #94a3b8;
  transition: transform 0.3s ease, color 0.3s ease;
}

.faq-item--open .faq-chevron {
  transform: rotate(180deg);
  color: var(--q-primary);
}

.faq-answer {
  margin: 0;
  padding: 0 24px 20px;
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.7;
}

/* ─── FINAL CTA ──────────────────────────────────────────────────────────────── */
.cta-section {
  background: linear-gradient(135deg, var(--q-primary) 0%, #1a1a2e 100%);
  border-radius: 28px;
  padding: 64px 24px;
  text-align: center;
}

.cta-inner {
  max-width: 500px;
  margin: 0 auto;
}

.cta-inner h2 {
  font-size: 1.75rem;
  font-weight: 900;
  color: #fff;
  margin: 0 0 12px;
  letter-spacing: -0.02em;
}

.cta-inner p {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.8);
  line-height: 1.7;
  margin: 0 0 32px;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.cta-btn {
  font-size: 14px !important;
  font-weight: 700 !important;
  padding: 12px 28px !important;
  background: #fff !important;
  color: var(--q-primary) !important;
}

.cta-btn-out {
  font-size: 14px !important;
  font-weight: 700 !important;
  padding: 12px 28px !important;
  color: #fff !important;
  border-color: rgba(255,255,255,0.5) !important;
}
.cta-btn-out:hover {
  background: rgba(255,255,255,0.1) !important;
}

/* ─── RESPONSIVE ────────────────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .docs-grid {
    grid-template-columns: 1fr;
    max-width: 440px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .home-page { padding: 0 16px 64px; }

  .hero {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 48px 0 48px;
    text-align: center;
  }

  .hero-left {
    align-items: center;
  }

  .hero-subtitle { margin: 0 auto 28px; }

  .hero-sec-links { justify-content: center; }

  .hero-trust { justify-content: center; }

  .hero-main-btn {
    width: 100%;
    max-width: 320px;
  }

  .hero-right {
    justify-content: center;
  }

  .resume-mock {
    width: 280px;
    height: 200px;
  }

  .cover-mock {
    bottom: -20px;
    right: 0px;
    width: 120px;
  }

  .stats-bar {
    grid-template-columns: repeat(2, 1fr);
    margin-bottom: 48px;
  }

  .stat-item {
    border-right: none;
    border-bottom: 1px solid #f1f5f9;
    padding: 20px 12px;
  }
  .stat-item:nth-child(2n) { border-right: none; }
  .stat-item:nth-last-child(-n+2) { border-bottom: none; }

  .benefits-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .step-arrow { display: none; }

  .steps-row {
    flex-direction: column;
    gap: 24px;
  }

  .step { flex-direction: row; gap: 14px; text-align: left; min-width: unset; }
  .step-label { max-width: none; }

  .cta-section { padding: 44px 20px; border-radius: 20px; }

  .cta-buttons { flex-direction: column; align-items: center; }
  .cta-btn, .cta-btn-out { width: 100%; max-width: 280px; }
}

@media (max-width: 480px) {
  .hero-title { font-size: 1.7rem; }
  .resume-mock { width: 240px; height: 170px; }
  .cover-mock { width: 100px; right: 4px; }
  .docs-grid { max-width: 100%; }
}
</style>
