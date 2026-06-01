<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <q-page class="home-page">

    <!-- HERO -->
    <div class="q-pa-xl text-center">
      <h2 class="text-weight-bold q-mb-sm">
        {{ t('home.welcome_message') }}
      </h2>
      <p class="text-grey-7 text-subtitle1 q-mb-lg">
        {{ t('home.subtitle') }}
      </p>

      <div class="row justify-center q-gutter-md">
        <q-btn
          color="primary"
          icon="mdi-file-account-outline"
          :label="t('home.create_resume')"
          unelevated
          rounded
          to="/resume"
        />
        <q-btn
          outline
          color="primary"
          icon="mdi-email-edit-outline"
          :label="t('home.create_cover_letter')"
          rounded
          to="/cover-letter"
        />
      </div>
    </div>

    <!-- FEATURES -->
    <div class="features q-mt-xl">
      <div class="row q-col-gutter-lg">

        <div class="col-12 col-sm-6 col-md-4">
          <q-card class="feature-card">
            <q-card-section>
              <q-icon name="mdi-file-document-edit-outline" size="48px" color="primary" />
              <h6 class="q-mt-md">{{ t('home.feature.resume_title') }}</h6>
              <p class="text-grey-7">
                {{ t('home.feature.resume_desc') }}
              </p>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <q-card class="feature-card">
            <q-card-section>
              <q-icon name="mdi-briefcase-outline" size="48px" color="primary" />
              <h6 class="q-mt-md">{{ t('home.feature.jobs_title') }}</h6>
              <p class="text-grey-7">
                {{ t('home.feature.jobs_desc') }}
              </p>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <q-card class="feature-card">
            <q-card-section>
              <q-icon name="mdi-earth" size="48px" color="primary" />
              <h6 class="q-mt-md">{{ t('home.feature.global_title') }}</h6>
              <p class="text-grey-7">
                {{ t('home.feature.global_desc') }}
              </p>
            </q-card-section>
          </q-card>
        </div>

      </div>
    </div>

  </q-page>
</template>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  border-radius: 16px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}
</style>
