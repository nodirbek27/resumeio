<script setup lang="ts">
export interface CoverLetterData {
  senderName: string
  senderTitle: string
  senderEmail: string
  senderPhone: string
  senderAddress: string
  senderWebsite: string
  date: string
  recipientName: string
  recipientTitle: string
  companyName: string
  companyAddress: string
  subject: string
  salutation: string
  bodyText: string
  signOff: string
}

defineProps<{
  template: string
  data: CoverLetterData
}>()
</script>

<template>
  <!-- TEMPLATE 1: Modern Minimalist -->
  <div
    v-if="template === 'modern'"
    class="h-full grid grid-cols-12 bg-white"
    style="font-family: 'Inter', sans-serif"
  >
    <!-- Sidebar -->
    <div class="col-span-4 bg-slate-900 text-slate-100 p-6 flex flex-col justify-between h-full">
      <div class="space-y-6">
        <div>
          <h3 class="text-sm font-extrabold text-white leading-tight break-words">
            {{ data.senderName || 'Your Name' }}
          </h3>
          <p class="text-[11px] text-indigo-400 font-semibold tracking-wide mt-1">
            {{ data.senderTitle }}
          </p>
        </div>

        <div class="space-y-4 pt-4 border-t border-slate-800">
          <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact</h4>
          <ul class="space-y-3 text-xs text-slate-300">
            <li v-if="data.senderPhone" class="flex gap-2">
              <q-icon name="mdi-phone" class="text-indigo-400" size="14px" />
              <span class="break-all">{{ data.senderPhone }}</span>
            </li>
            <li v-if="data.senderEmail" class="flex gap-2">
              <q-icon name="mdi-email" class="text-indigo-400" size="14px" />
              <span class="break-all">{{ data.senderEmail }}</span>
            </li>
            <li v-if="data.senderAddress" class="flex gap-2">
              <q-icon name="mdi-map-marker" class="text-indigo-400" size="14px" />
              <span>{{ data.senderAddress }}</span>
            </li>
            <li v-if="data.senderWebsite" class="flex gap-2">
              <q-icon name="mdi-web" class="text-indigo-400" size="14px" />
              <span class="break-all">{{ data.senderWebsite }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="text-[10px] text-slate-600 text-center">Modern Minimalist</div>
    </div>

    <!-- Main Content -->
    <div class="col-span-8 p-8 flex flex-col justify-between h-full bg-slate-50/20">
      <div>
        <div class="text-right text-[10px] font-semibold text-slate-400 font-mono">
          {{ data.date }}
        </div>

        <!-- Recipient details block -->
        <div class="mb-6 text-xs text-slate-600 space-y-1 mt-4">
          <p class="font-bold text-slate-800 text-sm">{{ data.recipientName }}</p>
          <p>{{ data.recipientTitle }}</p>
          <p class="font-semibold text-slate-700">{{ data.companyName }}</p>
          <p>{{ data.companyAddress }}</p>
        </div>

        <!-- Subject Line -->
        <div class="mb-6 border-b border-slate-200 pb-2">
          <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Subject: {{ data.subject || 'Job Application' }}
          </h2>
        </div>

        <!-- Salutation -->
        <p class="text-xs font-bold text-slate-800 mb-4">{{ data.salutation }}</p>

        <!-- Letter Body -->
        <div class="text-xs text-slate-600 leading-relaxed space-y-4 whitespace-pre-wrap">
          {{ data.bodyText || 'Write your letter text here...' }}
        </div>

        <!-- Sign-off -->
        <div class="mt-8 text-xs text-slate-700 whitespace-pre-wrap">
          {{ data.signOff }}
        </div>
      </div>

      <div class="text-[10px] text-slate-400 text-right">Generated as PDF</div>
    </div>
  </div>

  <!-- TEMPLATE 2: Classic Professional -->
  <div
    v-else-if="template === 'classic'"
    class="h-full p-10 flex flex-col justify-between bg-white text-slate-800"
    style="font-family: 'Georgia', serif"
  >
    <div>
      <!-- Top Header -->
      <div class="text-center pb-4 border-b border-slate-800 mb-6 font-sans">
        <h2 class="text-2xl font-bold tracking-wide text-slate-900">
          {{ data.senderName || 'Your Name' }}
        </h2>
        <p class="text-[10px] font-bold text-indigo-700 uppercase tracking-widest mt-1">
          {{ data.senderTitle }}
        </p>
        <div class="flex flex-wrap justify-center gap-x-4 text-[10px] text-slate-500 mt-2 font-mono">
          <span v-if="data.senderEmail">{{ data.senderEmail }}</span>
          <span v-if="data.senderPhone">{{ data.senderPhone }}</span>
          <span v-if="data.senderWebsite">{{ data.senderWebsite }}</span>
        </div>
      </div>

      <!-- Date & Recipient Details -->
      <div class="flex justify-between items-start text-xs mb-6 font-sans">
        <div class="space-y-0.5 text-slate-600">
          <strong class="text-slate-800">{{ data.recipientName }}</strong>
          <p>{{ data.recipientTitle }}</p>
          <p class="font-semibold">{{ data.companyName }}</p>
          <p class="text-[11px] text-slate-500">{{ data.companyAddress }}</p>
        </div>
        <div class="text-slate-500 font-mono text-[11px]">
          {{ data.date }}
        </div>
      </div>

      <!-- Subject Line -->
      <div class="mb-4">
        <h3
          class="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1 font-sans"
        >
          Subject: {{ data.subject }}
        </h3>
      </div>

      <!-- Salutation -->
      <p class="text-xs font-bold mb-4 font-sans text-slate-900">{{ data.salutation }}</p>

      <!-- Letter Body -->
      <div class="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap space-y-4">
        {{ data.bodyText || 'Enter your letter text...' }}
      </div>

      <!-- Sign off -->
      <div class="mt-8 text-xs text-slate-800 font-sans whitespace-pre-wrap">
        {{ data.signOff }}
      </div>
    </div>

    <div class="text-[10px] text-slate-400 text-center font-sans">
      Professional Classic Template
    </div>
  </div>

  <!-- TEMPLATE 3: Creative Accent -->
  <div
    v-else-if="template === 'creative'"
    class="h-full flex flex-col justify-between bg-white text-slate-800"
    style="font-family: 'Outfit', sans-serif"
  >
    <div>
      <!-- Top Accent Banner -->
      <div class="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white p-6">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-2xl font-black tracking-wide">{{ data.senderName || 'Your Name' }}</h2>
            <p class="text-xs font-semibold text-indigo-200 tracking-wider mt-1">
              {{ data.senderTitle }}
            </p>
          </div>
          <div class="text-right text-[10px] font-mono text-indigo-100">
            {{ data.date }}
          </div>
        </div>

        <div class="flex flex-wrap gap-x-4 text-[10px] text-indigo-100 mt-4 font-mono">
          <span v-if="data.senderPhone"><q-icon name="mdi-phone" /> {{ data.senderPhone }}</span>
          <span v-if="data.senderEmail"><q-icon name="mdi-email" /> {{ data.senderEmail }}</span>
          <span v-if="data.senderWebsite"><q-icon name="mdi-web" /> {{ data.senderWebsite }}</span>
        </div>
      </div>

      <!-- Main Content -->
      <div class="p-6">
        <!-- Recipient Block -->
        <div class="p-3 bg-slate-50 border border-slate-100 rounded-xl mb-5 text-xs text-slate-600">
          <p class="text-[10px] uppercase font-bold text-indigo-700 tracking-wider mb-1">
            Sending to:
          </p>
          <strong class="text-slate-800 text-sm block">{{ data.recipientName }}</strong>
          <span class="block">{{ data.recipientTitle }}</span>
          <span class="font-semibold block mt-0.5 text-slate-700">{{ data.companyName }}</span>
          <span class="text-[11px]">{{ data.companyAddress }}</span>
        </div>

        <!-- Subject -->
        <h3 class="text-xs font-extrabold text-indigo-800 uppercase tracking-widest mb-3">
          Subject: {{ data.subject }}
        </h3>

        <!-- Salutation -->
        <p class="text-xs font-bold text-slate-800 mb-3">{{ data.salutation }}</p>

        <!-- Letter Body -->
        <div class="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
          {{ data.bodyText || 'Write your letter text here...' }}
        </div>

        <!-- Sign-off -->
        <div class="mt-6 text-xs text-slate-700 whitespace-pre-wrap">
          {{ data.signOff }}
        </div>
      </div>
    </div>

    <div class="text-[10px] text-slate-400 text-center pb-4">Creative Accent Template</div>
  </div>

  <!-- TEMPLATE 4: Elegant Timeline -->
  <div
    v-else-if="template === 'timeline'"
    class="h-full p-10 flex flex-col justify-between bg-white text-slate-800"
    style="font-family: 'Inter', sans-serif"
  >
    <div>
      <div class="text-center mb-8">
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">
          {{ data.senderName || 'Your Name' }}
        </h2>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 mt-2">
          {{ data.senderTitle }}
        </p>
        <div
          class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500 mt-3 font-mono"
        >
          <span v-if="data.senderEmail">{{ data.senderEmail }}</span>
          <span v-if="data.senderPhone">{{ data.senderPhone }}</span>
          <span v-if="data.senderWebsite">{{ data.senderWebsite }}</span>
        </div>
      </div>

      <!-- Meta block with decorative timeline spine -->
      <div class="relative pl-6 border-l-2 border-slate-100 mb-8">
        <span
          class="absolute -left-[7px] top-0.5 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white"
        ></span>
        <div class="flex justify-between items-start text-xs">
          <div class="space-y-0.5 text-slate-600">
            <strong class="text-slate-800">{{ data.recipientName }}</strong>
            <p>{{ data.recipientTitle }}</p>
            <p class="font-semibold">{{ data.companyName }}</p>
            <p class="text-[11px] text-slate-500">{{ data.companyAddress }}</p>
          </div>
          <div class="text-slate-500 font-mono text-[11px]">{{ data.date }}</div>
        </div>
      </div>

      <!-- Subject Line -->
      <div class="mb-4 text-center">
        <h3 class="text-xs font-bold uppercase tracking-widest text-slate-800">
          Subject: {{ data.subject || 'Job Application' }}
        </h3>
      </div>

      <!-- Salutation -->
      <p class="text-xs font-bold mb-4 text-slate-900">{{ data.salutation }}</p>

      <!-- Letter Body -->
      <div class="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap space-y-4">
        {{ data.bodyText || 'Write your letter text here...' }}
      </div>

      <!-- Sign off -->
      <div class="mt-8 text-xs text-slate-800 whitespace-pre-wrap">
        {{ data.signOff }}
      </div>
    </div>

    <div class="text-[10px] text-slate-400 text-center pt-6">Elegant Timeline Template</div>
  </div>

  <!-- TEMPLATE 5: Bold Header -->
  <div
    v-else
    class="h-full flex flex-col justify-between bg-white text-slate-800"
    style="font-family: 'Outfit', sans-serif"
  >
    <div>
      <div class="p-8 text-white" style="background: #4338ca">
        <h2 class="text-2xl font-black uppercase tracking-wide leading-none">
          {{ data.senderName || 'Your Name' }}
        </h2>
        <p class="text-xs font-bold uppercase tracking-[0.25em] text-white/80 mt-2">
          {{ data.senderTitle }}
        </p>
        <div class="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-white/90 mt-5 font-mono">
          <span v-if="data.senderPhone"
            ><q-icon name="mdi-phone" size="13px" /> {{ data.senderPhone }}</span
          >
          <span v-if="data.senderEmail"
            ><q-icon name="mdi-email" size="13px" /> {{ data.senderEmail }}</span
          >
          <span v-if="data.senderWebsite"
            ><q-icon name="mdi-web" size="13px" /> {{ data.senderWebsite }}</span
          >
        </div>
      </div>

      <div class="p-8">
        <div class="flex justify-between items-start text-xs mb-6">
          <div class="space-y-0.5 text-slate-600">
            <strong class="text-slate-900 block">{{ data.recipientName }}</strong>
            <span class="block">{{ data.recipientTitle }}</span>
            <span class="font-semibold block">{{ data.companyName }}</span>
            <span class="text-[11px] block">{{ data.companyAddress }}</span>
          </div>
          <div class="text-slate-400 font-mono text-[11px]">{{ data.date }}</div>
        </div>

        <h3 class="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-sm" style="background: #4338ca"></span>
          Subject: {{ data.subject || 'Job Application' }}
        </h3>

        <p class="text-xs font-bold text-slate-900 mb-4">{{ data.salutation }}</p>

        <div class="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
          {{ data.bodyText || 'Write your letter text here...' }}
        </div>

        <div class="mt-6 text-xs text-slate-700 whitespace-pre-wrap">
          {{ data.signOff }}
        </div>
      </div>
    </div>

    <div class="text-[10px] text-slate-400 text-center pb-4">Bold Header Template</div>
  </div>
</template>
