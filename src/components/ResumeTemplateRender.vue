<script setup lang="ts">
import { computed } from 'vue'
import { shade } from '@/utils/colorTint'
import type { ResumeData } from '@/types/resume'

const props = defineProps<{
  template: string
  data: ResumeData
}>()

const accentDark = computed(() => shade(props.data.accentColor, -0.35))
</script>

<template>
  <!-- TEMPLATE 1: Modern Minimalist -->
  <div
    v-if="template === 'modern'"
    class="h-full grid grid-cols-12 text-slate-800 bg-white"
    style="font-family: 'Inter', sans-serif"
  >
    <!-- Sidebar -->
    <div class="col-span-4 bg-slate-900 text-slate-100 p-6 flex flex-col justify-between h-full">
      <div>
        <!-- Profile Photo -->
        <div class="flex justify-center mb-6">
          <img
            v-if="data.photo"
            :src="data.photo"
            class="w-24 h-24 rounded-full object-cover border-2 border-slate-700 shadow-md"
          />
          <div
            v-else
            class="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-400 text-xs"
          >
            No Photo
          </div>
        </div>

        <!-- Contact details -->
        <h4
          class="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 pb-1 border-b border-slate-800"
        >
          Contact
        </h4>
        <ul class="space-y-3.5 text-xs text-slate-300">
          <li v-if="data.phone" class="flex items-start gap-2">
            <q-icon name="mdi-phone" class="text-indigo-400 mt-0.5" size="14px" />
            <span class="break-all">{{ data.phone }}</span>
          </li>
          <li v-if="data.email" class="flex items-start gap-2">
            <q-icon name="mdi-email" class="text-indigo-400 mt-0.5" size="14px" />
            <span class="break-all">{{ data.email }}</span>
          </li>
          <li v-if="data.address" class="flex items-start gap-2">
            <q-icon name="mdi-map-marker" class="text-indigo-400 mt-0.5" size="14px" />
            <span>{{ data.address }}</span>
          </li>
          <li v-if="data.website" class="flex items-start gap-2">
            <q-icon name="mdi-web" class="text-indigo-400 mt-0.5" size="14px" />
            <span class="break-all">{{ data.website }}</span>
          </li>
        </ul>

        <!-- Skills details -->
        <h4
          class="text-xs font-bold uppercase tracking-widest text-indigo-400 mt-8 mb-3 pb-1 border-b border-slate-800"
        >
          Skills
        </h4>
        <div class="flex flex-wrap gap-x-3 gap-y-1.5">
          <span
            v-for="skill in data.skills
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)"
            :key="skill"
            class="text-[10px] text-slate-300 font-mono"
          >&#8226; {{ skill }}</span>
          <span v-if="!data.skills" class="text-xs text-slate-500 italic">Not provided</span>
        </div>

        <!-- Languages details -->
        <h4
          class="text-xs font-bold uppercase tracking-widest text-indigo-400 mt-8 mb-3 pb-1 border-b border-slate-800"
        >
          Languages
        </h4>
        <p class="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
          {{ data.languages || 'Not provided' }}
        </p>
      </div>

      <div class="text-[10px] text-slate-600 text-center border-t border-slate-800 pt-3">
        Modern Minimalist
      </div>
    </div>

    <!-- Main Content -->
    <div class="col-span-8 p-8 flex flex-col justify-between h-full bg-slate-50/30">
      <div>
        <!-- Header Name / Title -->
        <div class="mb-6">
          <h2 class="text-3xl font-extrabold text-slate-900 leading-tight">
            {{ data.fullname || 'Enter Full Name' }}
          </h2>
          <p class="text-sm font-bold text-indigo-600 uppercase tracking-wider mt-1">
            {{ data.title || 'Job Title' }}
          </p>
        </div>

        <!-- Summary Section -->
        <div v-if="data.summary" class="mb-6">
          <p class="text-xs text-slate-600 leading-relaxed italic">
            {{ data.summary }}
          </p>
        </div>

        <!-- Experience Section -->
        <div class="mb-6">
          <h3
            class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-2"
          >
            Experience
          </h3>
          <div class="space-y-4">
            <div v-for="(exp, idx) in data.experience" :key="idx" class="text-xs">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-bold text-slate-800 text-sm">{{ exp.position }}</h4>
                  <p class="text-slate-600 font-semibold">{{ exp.company }}</p>
                </div>
                <span class="text-[10px] font-bold text-indigo-600"
                  >{{ exp.startDate }} - {{ exp.endDate }}</span
                >
              </div>
              <p class="text-slate-500 mt-1 text-[11px] leading-relaxed whitespace-pre-wrap">
                {{ exp.description }}
              </p>
            </div>
            <p v-if="data.experience.length === 0" class="text-xs text-slate-400 italic">
              No experience added
            </p>
          </div>
        </div>

        <!-- Education Section -->
        <div>
          <h3
            class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-2"
          >
            Education
          </h3>
          <div class="space-y-4">
            <div v-for="(edu, idx) in data.education" :key="idx" class="text-xs">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-bold text-slate-800 text-sm">{{ edu.degree }}</h4>
                  <p class="text-slate-600 font-semibold">{{ edu.school }}</p>
                </div>
                <span class="text-[10px] font-bold text-indigo-600"
                  >{{ edu.startDate }} - {{ edu.endDate }}</span
                >
              </div>
              <p
                v-if="edu.description"
                class="text-slate-500 mt-1 text-[11px] leading-relaxed whitespace-pre-wrap"
              >
                {{ edu.description }}
              </p>
            </div>
            <p v-if="data.education.length === 0" class="text-xs text-slate-400 italic">
              No education added
            </p>
          </div>
        </div>
      </div>

      <div class="text-[10px] text-slate-400 text-right">Generated as PDF</div>
    </div>
  </div>

  <!-- TEMPLATE 2: Classic Professional -->
  <div
    v-else-if="template === 'classic'"
    class="h-full p-8 flex flex-col justify-between text-slate-800 bg-white"
    style="font-family: 'Georgia', serif"
  >
    <div>
      <!-- Top Centered Header -->
      <div class="text-center pb-4 border-b-2 border-slate-800 mb-6">
        <h2 class="text-3xl font-extrabold tracking-wide text-slate-900">
          {{ data.fullname || 'Enter Full Name' }}
        </h2>
        <p
          class="text-xs font-bold uppercase tracking-widest text-indigo-700 mt-1.5"
          style="font-family: sans-serif"
        >
          {{ data.title || 'Job Title' }}
        </p>

        <!-- Contact line -->
        <div
          class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500 mt-3 font-sans"
        >
          <span v-if="data.email"><q-icon name="mdi-email" /> {{ data.email }}</span>
          <span v-if="data.phone"><q-icon name="mdi-phone" /> {{ data.phone }}</span>
          <span v-if="data.address"><q-icon name="mdi-map-marker" /> {{ data.address }}</span>
          <span v-if="data.website"><q-icon name="mdi-web" /> {{ data.website }}</span>
        </div>
      </div>

      <!-- Professional Summary -->
      <div v-if="data.summary" class="mb-6">
        <h3
          class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-2 font-sans border-b border-slate-200 pb-2"
        >
          Summary
        </h3>
        <p class="text-xs text-slate-700 leading-relaxed text-justify">
          {{ data.summary }}
        </p>
      </div>

      <!-- Experience Section -->
      <div class="mb-6">
        <h3
          class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-3 font-sans border-b border-slate-200 pb-2"
        >
          Experience
        </h3>
        <div class="space-y-4">
          <div v-for="(exp, idx) in data.experience" :key="idx" class="text-xs">
            <div class="flex justify-between items-baseline font-sans">
              <div class="flex gap-2">
                <strong class="text-slate-900 text-sm font-serif">{{ exp.position }}</strong>
                <span class="text-slate-500">|</span>
                <span class="text-slate-700 font-medium">{{ exp.company }}</span>
              </div>
              <span class="text-[10px] text-slate-600 font-semibold"
                >{{ exp.startDate }} — {{ exp.endDate }}</span
              >
            </div>
            <p
              class="text-slate-600 mt-1.5 text-[11px] leading-relaxed text-justify whitespace-pre-wrap"
            >
              {{ exp.description }}
            </p>
          </div>
          <p v-if="data.experience.length === 0" class="text-xs text-slate-400 italic font-sans">
            No experience added
          </p>
        </div>
      </div>

      <!-- Education Section -->
      <div class="mb-6">
        <h3
          class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-3 font-sans border-b border-slate-200 pb-2"
        >
          Education
        </h3>
        <div class="space-y-3">
          <div v-for="(edu, idx) in data.education" :key="idx" class="text-xs">
            <div class="flex justify-between items-baseline font-sans">
              <div class="flex gap-2">
                <strong class="text-slate-900 text-sm font-serif">{{ edu.degree }}</strong>
                <span class="text-slate-500">|</span>
                <span class="text-slate-700 font-medium">{{ edu.school }}</span>
              </div>
              <span class="text-[10px] text-slate-600 font-semibold"
                >{{ edu.startDate }} — {{ edu.endDate }}</span
              >
            </div>
            <p
              v-if="edu.description"
              class="text-slate-600 mt-1 text-[11px] leading-relaxed whitespace-pre-wrap"
            >
              {{ edu.description }}
            </p>
          </div>
          <p v-if="data.education.length === 0" class="text-xs text-slate-400 italic font-sans">
            No education added
          </p>
        </div>
      </div>

      <!-- Grid of Skills and Languages -->
      <div class="grid grid-cols-2 gap-6">
        <div>
          <h3
            class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-2 font-sans border-b border-slate-200 pb-2"
          >
            Skills
          </h3>
          <p class="text-xs text-slate-700 leading-relaxed font-sans">
            {{ data.skills || 'Not provided' }}
          </p>
        </div>
        <div>
          <h3
            class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-2 font-sans border-b border-slate-200 pb-2"
          >
            Languages
          </h3>
          <p class="text-xs text-slate-700 leading-relaxed font-sans">
            {{ data.languages || 'Not provided' }}
          </p>
        </div>
      </div>
    </div>

    <div class="text-[10px] text-slate-400 text-center font-sans">
      Professional Classic Template
    </div>
  </div>

  <!-- TEMPLATE 3: Creative Accent -->
  <div
    v-else-if="template === 'creative'"
    class="h-full flex flex-col justify-between text-slate-800 bg-white"
    style="font-family: 'Outfit', sans-serif"
  >
    <div>
      <!-- Colorful top banner header -->
      <div
        class="text-white p-6 relative"
        :style="{
          background: 'linear-gradient(to right, ' + data.accentColor + ', ' + accentDark + ')',
        }"
      >
        <div class="flex justify-between items-start gap-4">
          <div>
            <h2 class="text-2xl font-black tracking-wide">
              {{ data.fullname || 'Enter Full Name' }}
            </h2>
            <p class="text-xs font-semibold text-indigo-200 uppercase tracking-widest mt-1">
              {{ data.title || 'Job Title' }}
            </p>

            <!-- Contact details small grid -->
            <div
              class="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-indigo-100 mt-4 font-mono"
            >
              <span v-if="data.email"><q-icon name="mdi-email" /> {{ data.email }}</span>
              <span v-if="data.phone"><q-icon name="mdi-phone" /> {{ data.phone }}</span>
              <span v-if="data.address"><q-icon name="mdi-map-marker" /> {{ data.address }}</span>
              <span v-if="data.website"><q-icon name="mdi-web" /> {{ data.website }}</span>
            </div>
          </div>

          <!-- Small round image -->
          <div
            v-if="data.photo"
            class="w-16 h-16 rounded-full border-2 border-indigo-500 overflow-hidden flex-shrink-0 bg-slate-900 shadow-md"
          >
            <img :src="data.photo" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <!-- Main content in columns -->
      <div class="p-6 grid grid-cols-12 gap-6">
        <!-- Left side -->
        <div class="col-span-8 space-y-5">
          <!-- Summary -->
          <div v-if="data.summary">
            <h3 class="text-xs font-extrabold uppercase tracking-widest text-indigo-800 mb-2">
              Profile
            </h3>
            <p class="text-xs text-slate-600 leading-relaxed text-justify">
              {{ data.summary }}
            </p>
          </div>

          <!-- Experience -->
          <div>
            <h3 class="text-xs font-extrabold uppercase tracking-widest text-indigo-800 mb-2">
              Experience
            </h3>
            <div class="space-y-4">
              <div
                v-for="(exp, idx) in data.experience"
                :key="idx"
                class="text-xs relative pl-4 border-l-2 border-indigo-100"
              >
                <!-- Bullet dot -->
                <span class="w-2 h-2 rounded-full bg-indigo-600 absolute -left-[5px] top-1"></span>
                <div class="font-semibold">
                  <h4 class="text-slate-800 font-bold">{{ exp.position }}</h4>
                  <div class="text-[9px] text-indigo-600 mt-0.5">
                    {{ exp.startDate }} - {{ exp.endDate }}
                  </div>
                </div>
                <p class="text-slate-500 font-medium text-[10px] mt-0.5">
                  {{ exp.company }}
                </p>
                <p class="text-slate-600 mt-1 text-[11px] leading-relaxed whitespace-pre-wrap">
                  {{ exp.description }}
                </p>
              </div>
              <p v-if="data.experience.length === 0" class="text-xs text-slate-400 italic">
                No experience added
              </p>
            </div>
          </div>
        </div>

        <!-- Right side -->
        <div class="col-span-4 space-y-5">
          <!-- Education -->
          <div>
            <h3 class="text-xs font-extrabold uppercase tracking-widest text-indigo-800 mb-2">
              Education
            </h3>
            <div class="space-y-3">
              <div v-for="(edu, idx) in data.education" :key="idx" class="text-[11px]">
                <strong class="text-slate-800 block text-xs">{{ edu.degree }}</strong>
                <span class="text-slate-500 block text-[10px]">{{ edu.school }}</span>
                <span class="text-[9px] font-mono text-slate-400 block"
                  >{{ edu.startDate }} - {{ edu.endDate }}</span
                >
              </div>
              <p v-if="data.education.length === 0" class="text-xs text-slate-400 italic">
                No education added
              </p>
            </div>
          </div>

          <!-- Skills -->
          <div>
            <h3 class="text-xs font-extrabold uppercase tracking-widest text-indigo-800 mb-2">
              Skills
            </h3>
            <div class="flex flex-wrap gap-x-3 gap-y-1.5">
              <span
                v-for="skill in data.skills
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)"
                :key="skill"
                class="text-[10px] text-indigo-700 font-bold"
              >&#8226; {{ skill }}</span>
              <span v-if="!data.skills" class="text-xs text-slate-400 italic">Not provided</span>
            </div>
          </div>

          <!-- Languages -->
          <div>
            <h3 class="text-xs font-extrabold uppercase tracking-widest text-indigo-800 mb-2">
              Languages
            </h3>
            <p class="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {{ data.languages || 'Not provided' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="text-[10px] text-slate-400 text-center pb-4">Creative Accent Template</div>
  </div>

  <!-- TEMPLATE 4: Minimal Lines -->
  <div
    v-else-if="template === 'minimal'"
    class="h-full p-10 flex flex-col justify-between bg-white text-slate-800"
    style="font-family: 'Inter', sans-serif"
  >
    <div>
      <div
        class="flex items-center gap-4 mb-6 pb-4"
        :style="{ borderBottom: '2px solid ' + data.accentColor }"
      >
        <img
          v-if="data.photo"
          :src="data.photo"
          class="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        />
        <div>
          <h2 class="text-2xl font-extrabold text-slate-900 leading-tight">
            {{ data.fullname || 'Enter Full Name' }}
          </h2>
          <p
            class="text-xs font-semibold uppercase tracking-wider mt-1"
            :style="{ color: data.accentColor }"
          >
            {{ data.title || 'Job Title' }}
          </p>
        </div>
      </div>

      <div class="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500 mb-6 font-mono">
        <span v-if="data.email"><q-icon name="mdi-email" size="12px" /> {{ data.email }}</span>
        <span v-if="data.phone"><q-icon name="mdi-phone" size="12px" /> {{ data.phone }}</span>
        <span v-if="data.address"
          ><q-icon name="mdi-map-marker" size="12px" /> {{ data.address }}</span
        >
        <span v-if="data.website"><q-icon name="mdi-web" size="12px" /> {{ data.website }}</span>
      </div>

      <p v-if="data.summary" class="text-xs text-slate-600 leading-relaxed mb-6">
        {{ data.summary }}
      </p>

      <div class="mb-6">
        <h3
          class="text-[11px] font-bold uppercase tracking-widest mb-2"
          :style="{ color: data.accentColor }"
        >
          Experience
        </h3>
        <div class="space-y-3">
          <div v-for="(exp, idx) in data.experience" :key="idx" class="text-xs">
            <div class="flex justify-between font-semibold text-slate-800">
              <span>{{ exp.position }} — {{ exp.company }}</span>
              <span class="text-[10px] text-slate-400 font-medium"
                >{{ exp.startDate }} - {{ exp.endDate }}</span
              >
            </div>
            <p class="text-slate-500 text-[11px] mt-0.5 leading-relaxed whitespace-pre-wrap">
              {{ exp.description }}
            </p>
          </div>
          <p v-if="data.experience.length === 0" class="text-xs text-slate-400 italic">
            No experience added
          </p>
        </div>
      </div>

      <div class="mb-6">
        <h3
          class="text-[11px] font-bold uppercase tracking-widest mb-2"
          :style="{ color: data.accentColor }"
        >
          Education
        </h3>
        <div class="space-y-2">
          <div v-for="(edu, idx) in data.education" :key="idx" class="text-xs flex justify-between">
            <span class="font-semibold text-slate-800"
              >{{ edu.degree }}<span v-if="edu.school">, {{ edu.school }}</span></span
            >
            <span class="text-[10px] text-slate-400 font-medium"
              >{{ edu.startDate }} - {{ edu.endDate }}</span
            >
          </div>
          <p v-if="data.education.length === 0" class="text-xs text-slate-400 italic">
            No education added
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div>
          <h3
            class="text-[11px] font-bold uppercase tracking-widest mb-2"
            :style="{ color: data.accentColor }"
          >
            Skills
          </h3>
          <p class="text-xs text-slate-600 leading-relaxed">
            {{ data.skills || 'Not provided' }}
          </p>
        </div>
        <div>
          <h3
            class="text-[11px] font-bold uppercase tracking-widest mb-2"
            :style="{ color: data.accentColor }"
          >
            Languages
          </h3>
          <p class="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
            {{ data.languages || 'Not provided' }}
          </p>
        </div>
      </div>
    </div>

    <div class="text-[10px] text-slate-400 text-center pt-4">Minimal Lines Template</div>
  </div>

  <!-- TEMPLATE 5: Sidebar Right -->
  <div
    v-else-if="template === 'sidebar-right'"
    class="h-full grid grid-cols-12 text-slate-800 bg-white"
    style="font-family: 'Inter', sans-serif"
  >
    <!-- Main Content (left) -->
    <div class="col-span-8 p-8 flex flex-col justify-between h-full">
      <div>
        <h2 class="text-3xl font-extrabold text-slate-900 leading-tight">
          {{ data.fullname || 'Enter Full Name' }}
        </h2>
        <p
          class="text-sm font-bold uppercase tracking-wider mt-1"
          :style="{ color: data.accentColor }"
        >
          {{ data.title || 'Job Title' }}
        </p>

        <p v-if="data.summary" class="text-xs text-slate-600 leading-relaxed italic mt-4 mb-6">
          {{ data.summary }}
        </p>

        <div class="mb-6">
          <h3
            class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-1"
          >
            Experience
          </h3>
          <div class="space-y-4">
            <div v-for="(exp, idx) in data.experience" :key="idx" class="text-xs">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-bold text-slate-800 text-sm">{{ exp.position }}</h4>
                  <p class="text-slate-600 font-semibold">{{ exp.company }}</p>
                </div>
                <span class="text-[10px] font-bold" :style="{ color: data.accentColor }"
                  >{{ exp.startDate }} - {{ exp.endDate }}</span
                >
              </div>
              <p class="text-slate-500 mt-1 text-[11px] leading-relaxed whitespace-pre-wrap">
                {{ exp.description }}
              </p>
            </div>
            <p v-if="data.experience.length === 0" class="text-xs text-slate-400 italic">
              No experience added
            </p>
          </div>
        </div>

        <div>
          <h3
            class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-1"
          >
            Education
          </h3>
          <div class="space-y-4">
            <div v-for="(edu, idx) in data.education" :key="idx" class="text-xs">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-bold text-slate-800 text-sm">{{ edu.degree }}</h4>
                  <p class="text-slate-600 font-semibold">{{ edu.school }}</p>
                </div>
                <span class="text-[10px] font-bold" :style="{ color: data.accentColor }"
                  >{{ edu.startDate }} - {{ edu.endDate }}</span
                >
              </div>
              <p
                v-if="edu.description"
                class="text-slate-500 mt-1 text-[11px] leading-relaxed whitespace-pre-wrap"
              >
                {{ edu.description }}
              </p>
            </div>
            <p v-if="data.education.length === 0" class="text-xs text-slate-400 italic">
              No education added
            </p>
          </div>
        </div>
      </div>

      <div class="text-[10px] text-slate-400 text-right">Generated as PDF</div>
    </div>

    <!-- Sidebar (right) -->
    <div
      class="col-span-4 p-6 flex flex-col justify-between h-full"
      :style="{ background: data.accentColor }"
    >
      <div class="text-white">
        <div class="flex justify-center mb-6">
          <img
            v-if="data.photo"
            :src="data.photo"
            class="w-24 h-24 rounded-full object-cover border-2 border-white/40 shadow-md"
          />
          <div
            v-else
            class="w-24 h-24 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center text-white/60 text-xs"
          >
            No Photo
          </div>
        </div>

        <h4
          class="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b border-white/20"
        >
          Contact
        </h4>
        <ul class="space-y-3.5 text-xs text-white/90">
          <li v-if="data.phone" class="flex items-start gap-2">
            <q-icon name="mdi-phone" class="mt-0.5" size="14px" />
            <span class="break-all">{{ data.phone }}</span>
          </li>
          <li v-if="data.email" class="flex items-start gap-2">
            <q-icon name="mdi-email" class="mt-0.5" size="14px" />
            <span class="break-all">{{ data.email }}</span>
          </li>
          <li v-if="data.address" class="flex items-start gap-2">
            <q-icon name="mdi-map-marker" class="mt-0.5" size="14px" />
            <span>{{ data.address }}</span>
          </li>
          <li v-if="data.website" class="flex items-start gap-2">
            <q-icon name="mdi-web" class="mt-0.5" size="14px" />
            <span class="break-all">{{ data.website }}</span>
          </li>
        </ul>

        <h4
          class="text-xs font-bold uppercase tracking-widest mt-8 mb-3 pb-1 border-b border-white/20"
        >
          Skills
        </h4>
        <div class="flex flex-wrap gap-x-3 gap-y-1.5">
          <span
            v-for="skill in data.skills
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)"
            :key="skill"
            class="text-[10px] text-white font-mono"
          >&#8226; {{ skill }}</span>
          <span v-if="!data.skills" class="text-xs text-white/50 italic">Not provided</span>
        </div>

        <h4
          class="text-xs font-bold uppercase tracking-widest mt-8 mb-3 pb-1 border-b border-white/20"
        >
          Languages
        </h4>
        <p class="text-xs text-white/90 leading-relaxed whitespace-pre-line">
          {{ data.languages || 'Not provided' }}
        </p>
      </div>

      <div class="text-[10px] text-white/50 text-center border-t border-white/20 pt-3">
        Sidebar Right
      </div>
    </div>
  </div>

  <!-- TEMPLATE 6: Elegant Timeline -->
  <div
    v-else-if="template === 'timeline'"
    class="h-full p-10 flex flex-col justify-between bg-white text-slate-800"
    style="font-family: 'Inter', sans-serif"
  >
    <div>
      <!-- Centered header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">
          {{ data.fullname || 'Enter Full Name' }}
        </h2>
        <p
          class="text-xs font-bold uppercase tracking-[0.2em] mt-2"
          :style="{ color: data.accentColor }"
        >
          {{ data.title || 'Job Title' }}
        </p>
        <div class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500 mt-4">
          <span v-if="data.email"><q-icon name="mdi-email" size="12px" /> {{ data.email }}</span>
          <span v-if="data.phone"><q-icon name="mdi-phone" size="12px" /> {{ data.phone }}</span>
          <span v-if="data.address"
            ><q-icon name="mdi-map-marker" size="12px" /> {{ data.address }}</span
          >
          <span v-if="data.website"><q-icon name="mdi-web" size="12px" /> {{ data.website }}</span>
        </div>
      </div>

      <p
        v-if="data.summary"
        class="text-xs text-slate-600 leading-relaxed text-center italic mb-8 px-6"
      >
        {{ data.summary }}
      </p>

      <!-- Experience timeline -->
      <div class="mb-8">
        <h3 class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-4 text-center">
          Experience
        </h3>
        <div class="relative pl-6 border-l-2 border-slate-100 space-y-6">
          <div v-for="(exp, idx) in data.experience" :key="idx" class="relative text-xs">
            <span
              class="absolute -left-[30px] top-0.5 w-3 h-3 rounded-full border-2 border-white"
              :style="{ background: data.accentColor }"
            ></span>
            <div class="flex justify-between items-baseline">
              <h4 class="font-bold text-slate-900 text-sm">{{ exp.position }}</h4>
              <span class="text-[10px] font-semibold text-slate-400"
                >{{ exp.startDate }} - {{ exp.endDate }}</span
              >
            </div>
            <p class="text-slate-600 font-semibold text-[11px]">{{ exp.company }}</p>
            <p class="text-slate-500 mt-1 text-[11px] leading-relaxed whitespace-pre-wrap">
              {{ exp.description }}
            </p>
          </div>
          <p v-if="data.experience.length === 0" class="text-xs text-slate-400 italic">
            No experience added
          </p>
        </div>
      </div>

      <!-- Education timeline -->
      <div class="mb-8">
        <h3 class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-4 text-center">
          Education
        </h3>
        <div class="relative pl-6 border-l-2 border-slate-100 space-y-6">
          <div v-for="(edu, idx) in data.education" :key="idx" class="relative text-xs">
            <span
              class="absolute -left-[30px] top-0.5 w-3 h-3 rounded-full border-2 border-white"
              :style="{ background: data.accentColor }"
            ></span>
            <div class="flex justify-between items-baseline">
              <h4 class="font-bold text-slate-900 text-sm">{{ edu.degree }}</h4>
              <span class="text-[10px] font-semibold text-slate-400"
                >{{ edu.startDate }} - {{ edu.endDate }}</span
              >
            </div>
            <p class="text-slate-600 font-semibold text-[11px]">{{ edu.school }}</p>
            <p
              v-if="edu.description"
              class="text-slate-500 mt-1 text-[11px] leading-relaxed whitespace-pre-wrap"
            >
              {{ edu.description }}
            </p>
          </div>
          <p v-if="data.education.length === 0" class="text-xs text-slate-400 italic">
            No education added
          </p>
        </div>
      </div>

      <!-- Skills & Languages -->
      <div class="grid grid-cols-2 gap-6">
        <div>
          <h3 class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-2 text-center">
            Skills
          </h3>
          <div class="flex flex-wrap justify-center gap-1.5">
            <span
              v-for="skill in data.skills
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)"
              :key="skill"
              class="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
              :style="{ borderColor: data.accentColor, color: data.accentColor }"
              >{{ skill }}</span
            >
            <span v-if="!data.skills" class="text-xs text-slate-400 italic">Not provided</span>
          </div>
        </div>
        <div>
          <h3 class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-2 text-center">
            Languages
          </h3>
          <p class="text-xs text-slate-600 leading-relaxed text-center whitespace-pre-line">
            {{ data.languages || 'Not provided' }}
          </p>
        </div>
      </div>
    </div>

    <div class="text-[10px] text-slate-400 text-center pt-6">Elegant Timeline Template</div>
  </div>

  <!-- TEMPLATE 7: Bold Header -->
  <div
    v-else-if="template === 'bold-header'"
    class="h-full flex flex-col justify-between bg-white text-slate-800"
    style="font-family: 'Outfit', sans-serif"
  >
    <div>
      <!-- Solid bold header banner -->
      <div class="p-8 text-white" :style="{ background: data.accentColor }">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-3xl font-black uppercase tracking-wide leading-none">
              {{ data.fullname || 'Enter Full Name' }}
            </h2>
            <p class="text-xs font-bold uppercase tracking-[0.25em] text-white/80 mt-2">
              {{ data.title || 'Job Title' }}
            </p>
          </div>
          <img
            v-if="data.photo"
            :src="data.photo"
            class="w-20 h-20 rounded-2xl object-cover border-2 border-white/50 shadow-md flex-shrink-0"
          />
        </div>
        <div class="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-white/90 mt-5 font-mono">
          <span v-if="data.email"><q-icon name="mdi-email" size="13px" /> {{ data.email }}</span>
          <span v-if="data.phone"><q-icon name="mdi-phone" size="13px" /> {{ data.phone }}</span>
          <span v-if="data.address"
            ><q-icon name="mdi-map-marker" size="13px" /> {{ data.address }}</span
          >
          <span v-if="data.website"><q-icon name="mdi-web" size="13px" /> {{ data.website }}</span>
        </div>
      </div>

      <!-- Body: sidebar + main -->
      <div class="grid grid-cols-12 gap-6 p-8">
        <!-- Sidebar (left) -->
        <div class="col-span-4 space-y-6">
          <div>
            <h3 class="text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-sm" :style="{ background: data.accentColor }"></span>
              Skills
            </h3>
            <div class="flex flex-col gap-1.5">
              <span
                v-for="skill in data.skills
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)"
                :key="skill"
                class="text-[11px] font-semibold text-slate-700"
                >{{ skill }}</span
              >
              <span v-if="!data.skills" class="text-xs text-slate-400 italic">Not provided</span>
            </div>
          </div>
          <div>
            <h3 class="text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-sm" :style="{ background: data.accentColor }"></span>
              Languages
            </h3>
            <p class="text-[11px] text-slate-700 leading-relaxed whitespace-pre-line">
              {{ data.languages || 'Not provided' }}
            </p>
          </div>
          <div>
            <h3 class="text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-sm" :style="{ background: data.accentColor }"></span>
              Education
            </h3>
            <div class="space-y-3">
              <div v-for="(edu, idx) in data.education" :key="idx" class="text-[11px]">
                <strong class="text-slate-900 block">{{ edu.degree }}</strong>
                <span class="text-slate-500 block">{{ edu.school }}</span>
                <span class="text-slate-400 block font-mono text-[10px]"
                  >{{ edu.startDate }} - {{ edu.endDate }}</span
                >
              </div>
              <p v-if="data.education.length === 0" class="text-xs text-slate-400 italic">
                No education added
              </p>
            </div>
          </div>
        </div>

        <!-- Main (right) -->
        <div class="col-span-8 space-y-5">
          <div v-if="data.summary">
            <h3 class="text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-sm" :style="{ background: data.accentColor }"></span>
              Profile
            </h3>
            <p class="text-xs text-slate-600 leading-relaxed">{{ data.summary }}</p>
          </div>
          <div>
            <h3 class="text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-sm" :style="{ background: data.accentColor }"></span>
              Experience
            </h3>
            <div class="space-y-4">
              <div v-for="(exp, idx) in data.experience" :key="idx" class="text-xs">
                <div class="flex justify-between items-baseline">
                  <h4 class="font-bold text-slate-900 text-sm">{{ exp.position }}</h4>
                  <span class="text-[10px] font-bold" :style="{ color: data.accentColor }"
                    >{{ exp.startDate }} - {{ exp.endDate }}</span
                  >
                </div>
                <p class="text-slate-600 font-semibold text-[11px]">{{ exp.company }}</p>
                <p class="text-slate-500 mt-1 text-[11px] leading-relaxed whitespace-pre-wrap">
                  {{ exp.description }}
                </p>
              </div>
              <p v-if="data.experience.length === 0" class="text-xs text-slate-400 italic">
                No experience added
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-[10px] text-slate-400 text-center pb-4">Bold Header Template</div>
  </div>

  <!-- TEMPLATE 8: Executive Photo -->
  <div
    v-else-if="template === 'executive-photo'"
    class="h-full flex flex-col bg-white text-slate-800"
    style="font-family: 'Inter', sans-serif"
  >
    <!-- Header band with overlapping photo -->
    <div class="relative bg-slate-900 pt-6 pb-10 pl-32 pr-8">
      <h2 class="text-2xl font-extrabold text-white uppercase tracking-wide leading-tight">
        {{ data.fullname || 'Enter Full Name' }}
      </h2>
      <p class="text-xs font-semibold text-slate-300 uppercase tracking-widest mt-1.5">
        {{ data.title || 'Job Title' }}
      </p>
      <div
        class="absolute left-8 -bottom-8 w-20 h-20 rounded-md overflow-hidden border-4 border-white shadow-lg bg-slate-200"
      >
        <img v-if="data.photo" :src="data.photo" class="w-full h-full object-cover" />
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-slate-400 text-[9px]"
        >
          No Photo
        </div>
      </div>
    </div>

    <div class="grid grid-cols-12 flex-1">
      <!-- Sidebar (left) -->
      <div class="col-span-4 bg-slate-100 pt-12 pb-6 px-6">
        <h3 class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-3">Details</h3>
        <ul class="space-y-2.5 text-[11px] text-slate-600 mb-6">
          <li v-if="data.email" class="flex items-start gap-2">
            <q-icon name="mdi-email-outline" size="13px" class="mt-0.5" />
            <span class="break-all">{{ data.email }}</span>
          </li>
          <li v-if="data.address" class="flex items-start gap-2">
            <q-icon name="mdi-map-marker-outline" size="13px" class="mt-0.5" />
            <span>{{ data.address }}</span>
          </li>
          <li v-if="data.phone" class="flex items-start gap-2">
            <q-icon name="mdi-phone-outline" size="13px" class="mt-0.5" />
            <span>{{ data.phone }}</span>
          </li>
          <li v-if="data.website" class="flex items-start gap-2">
            <q-icon name="mdi-web" size="13px" class="mt-0.5" />
            <span class="break-all">{{ data.website }}</span>
          </li>
        </ul>

        <h3 class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-3">Skills</h3>
        <ul class="space-y-1.5 text-[11px] text-slate-600 mb-6 list-disc list-inside">
          <li
            v-for="skill in data.skills
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)"
            :key="skill"
          >
            {{ skill }}
          </li>
          <li v-if="!data.skills" class="text-slate-400 italic list-none">Not provided</li>
        </ul>

        <template v-if="data.languages">
          <h3 class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-2 border-t border-slate-300 pt-4">
            Languages
          </h3>
          <p class="text-[11px] font-bold text-slate-700 leading-relaxed whitespace-pre-line">
            {{ data.languages }}
          </p>
        </template>
      </div>

      <!-- Main (right) -->
      <div class="col-span-8 pt-8 pb-6 px-8">
        <div v-if="data.summary" class="mb-6">
          <h3 class="text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">Summary</h3>
          <p class="text-xs text-slate-600 leading-relaxed">{{ data.summary }}</p>
        </div>

        <div class="mb-6">
          <h3 class="text-xs font-bold uppercase tracking-widest text-slate-900 mb-3">
            Experience
          </h3>
          <div class="space-y-4">
            <div v-for="(exp, idx) in data.experience" :key="idx" class="text-xs">
              <h4 class="font-bold text-slate-900 text-sm">
                {{ exp.position }}, {{ exp.company }}
              </h4>
              <p class="text-slate-400 text-[10px] font-semibold mt-0.5 mb-1.5">
                {{ exp.startDate }} — {{ exp.endDate }}
              </p>
              <ul class="list-disc list-inside space-y-0.5 text-slate-500 text-[11px] leading-relaxed">
                <li
                  v-for="(line, lidx) in exp.description.split('\n').filter(Boolean)"
                  :key="lidx"
                >
                  {{ line }}
                </li>
              </ul>
            </div>
            <p v-if="data.experience.length === 0" class="text-xs text-slate-400 italic">
              No experience added
            </p>
          </div>
        </div>

        <div>
          <h3 class="text-xs font-bold uppercase tracking-widest text-slate-900 mb-3">
            Education
          </h3>
          <div class="space-y-3">
            <div v-for="(edu, idx) in data.education" :key="idx" class="text-xs">
              <h4 class="font-bold text-slate-900 text-sm">{{ edu.degree }}, {{ edu.school }}</h4>
              <p class="text-slate-400 text-[10px] font-semibold mt-0.5">
                {{ edu.startDate }} — {{ edu.endDate }}
              </p>
              <p v-if="edu.description" class="text-slate-500 text-[11px] mt-1 leading-relaxed">
                {{ edu.description }}
              </p>
            </div>
            <p v-if="data.education.length === 0" class="text-xs text-slate-400 italic">
              No education added
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- TEMPLATE 9: Professional Icons -->
  <div
    v-else
    class="h-full flex flex-col bg-white text-slate-800 p-10"
    style="font-family: 'Inter', sans-serif"
  >
    <!-- Header row: photo + name -->
    <div class="flex items-center gap-4 pb-6 border-b border-slate-200 mb-6">
      <img
        v-if="data.photo"
        :src="data.photo"
        class="w-14 h-14 rounded-lg object-cover flex-shrink-0"
      />
      <div
        v-else
        class="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-[9px] flex-shrink-0"
      >
        No Photo
      </div>
      <div>
        <h2 class="text-xl font-extrabold text-slate-900 leading-tight">
          {{ data.fullname || 'Enter Full Name' }}
        </h2>
        <p class="text-xs text-slate-500 font-medium mt-0.5">{{ data.title || 'Job Title' }}</p>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-8 flex-1">
      <!-- Main (left) -->
      <div class="col-span-8 space-y-5">
        <div v-if="data.summary">
          <h3
            class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-2 flex items-center gap-1.5"
          >
            <q-icon name="mdi-account-outline" size="14px" :style="{ color: data.accentColor }" />
            Summary
          </h3>
          <p class="text-xs text-slate-600 leading-relaxed">{{ data.summary }}</p>
        </div>

        <div>
          <h3
            class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-2 flex items-center gap-1.5"
          >
            <q-icon
              name="mdi-briefcase-variant-outline"
              size="14px"
              :style="{ color: data.accentColor }"
            />
            Experience
          </h3>
          <div class="space-y-4">
            <div v-for="(exp, idx) in data.experience" :key="idx" class="text-xs">
              <h4 class="font-bold text-slate-800 text-sm">
                {{ exp.position }}, {{ exp.company }}
              </h4>
              <p class="text-slate-400 text-[10px] font-semibold mb-1">
                {{ exp.startDate }} — {{ exp.endDate }}
              </p>
              <p class="text-slate-500 text-[11px] leading-relaxed whitespace-pre-wrap">
                {{ exp.description }}
              </p>
            </div>
            <p v-if="data.experience.length === 0" class="text-xs text-slate-400 italic">
              No experience added
            </p>
          </div>
        </div>

        <div>
          <h3
            class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-2 flex items-center gap-1.5"
          >
            <q-icon name="mdi-school-outline" size="14px" :style="{ color: data.accentColor }" />
            Education
          </h3>
          <div class="space-y-3">
            <div v-for="(edu, idx) in data.education" :key="idx" class="text-xs">
              <h4 class="font-bold text-slate-800 text-sm">{{ edu.degree }}, {{ edu.school }}</h4>
              <p class="text-slate-400 text-[10px] font-semibold">
                {{ edu.startDate }} — {{ edu.endDate }}
              </p>
              <p v-if="edu.description" class="text-slate-500 text-[11px] mt-0.5">
                {{ edu.description }}
              </p>
            </div>
            <p v-if="data.education.length === 0" class="text-xs text-slate-400 italic">
              No education added
            </p>
          </div>
        </div>
      </div>

      <!-- Sidebar (right) -->
      <div class="col-span-4 space-y-5">
        <div>
          <h3 class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-2">Details</h3>
          <div class="space-y-1 text-[11px] text-slate-600">
            <p v-if="data.address">{{ data.address }}</p>
            <p v-if="data.phone">{{ data.phone }}</p>
            <p v-if="data.email" class="break-all">{{ data.email }}</p>
            <p v-if="data.website" class="break-all">{{ data.website }}</p>
          </div>
        </div>

        <div>
          <h3 class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-2">Skills</h3>
          <div class="space-y-1 text-[11px] text-slate-600">
            <p
              v-for="skill in data.skills
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)"
              :key="skill"
            >
              {{ skill }}
            </p>
            <p v-if="!data.skills" class="text-slate-400 italic">Not provided</p>
          </div>
        </div>

        <div v-if="data.languages">
          <h3 class="text-xs font-bold uppercase tracking-widest text-slate-800 mb-2">
            Languages
          </h3>
          <p class="text-[11px] text-slate-600 whitespace-pre-line">{{ data.languages }}</p>
        </div>
      </div>
    </div>

    <div class="text-[10px] text-slate-400 text-right pt-6">Generated as PDF</div>
  </div>
</template>

<style>
/* Accent color theming for the live preview (global: shared by the main
   preview and the mobile template-picker carousel thumbnails) */
.accent-scope .text-indigo-400,
.accent-scope .text-indigo-600,
.accent-scope .text-indigo-700,
.accent-scope .text-indigo-800,
.accent-scope .text-indigo-900 {
  color: var(--accent) !important;
}

.accent-scope .text-indigo-100,
.accent-scope .text-indigo-200 {
  color: var(--accent-soft2) !important;
}

.accent-scope .bg-indigo-600,
.accent-scope .bg-indigo-700 {
  background-color: var(--accent) !important;
}

.accent-scope .bg-indigo-50 {
  background-color: var(--accent-soft) !important;
}

.accent-scope .bg-indigo-100 {
  background-color: var(--accent-soft2) !important;
}

.accent-scope .border-indigo-100,
.accent-scope .border-indigo-500,
.accent-scope .border-indigo-600 {
  border-color: var(--accent) !important;
}
</style>
