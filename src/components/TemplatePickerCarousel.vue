<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
  type ComponentPublicInstance,
} from 'vue'

interface TemplateOption {
  id: string
  label: string
}

const props = withDefaults(
  defineProps<{
    templates: TemplateOption[]
    modelValue: string
    /** "real" render size of the content projected into the #thumb slot */
    previewWidth?: number
    previewHeight?: number
  }>(),
  {
    previewWidth: 700,
    previewHeight: () => Math.round(700 * 1.414),
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

// The active card takes this fraction of the viewport width; the rest is
// split evenly between the two sides so the neighboring cards peek in.
const CARD_FRACTION = 0.76

const viewportRef = ref<HTMLDivElement | null>(null)
const viewportWidth = ref(0)
const cardRefs = ref<(HTMLDivElement | null)[]>([])
let resizeObserver: ResizeObserver | null = null

function setCardRef(el: Element | ComponentPublicInstance | null, i: number) {
  cardRefs.value[i] = (el as HTMLDivElement | null) ?? null
}

const total = computed(() => props.templates.length)
const frontIndex = ref(Math.max(0, props.templates.findIndex((t) => t.id === props.modelValue)))

const cardWidth = computed(() => viewportWidth.value * CARD_FRACTION)
const cardHeight = computed(() => cardWidth.value * (props.previewHeight / props.previewWidth))
const thumbScale = computed(() => (cardWidth.value > 0 ? cardWidth.value / props.previewWidth : 0))

function scrollToIndex(i: number, smooth = true) {
  cardRefs.value[i]?.scrollIntoView({
    inline: 'center',
    block: 'nearest',
    behavior: smooth ? 'smooth' : 'auto',
  })
}

function goTo(i: number) {
  frontIndex.value = i
  scrollToIndex(i)
}
function next() {
  if (frontIndex.value < total.value - 1) goTo(frontIndex.value + 1)
}
function prev() {
  if (frontIndex.value > 0) goTo(frontIndex.value - 1)
}
function choose(id: string) {
  emit('update:modelValue', id)
}

let scrollRaf = 0
function onScroll() {
  if (scrollRaf) return
  scrollRaf = requestAnimationFrame(() => {
    scrollRaf = 0
    const el = viewportRef.value
    if (!el) return
    const center = el.getBoundingClientRect().left + el.clientWidth / 2
    let closest = frontIndex.value
    let closestDist = Infinity
    cardRefs.value.forEach((card, i) => {
      if (!card) return
      const rect = card.getBoundingClientRect()
      const dist = Math.abs(rect.left + rect.width / 2 - center)
      if (dist < closestDist) {
        closestDist = dist
        closest = i
      }
    })
    if (closest !== frontIndex.value) frontIndex.value = closest
  })
}

watch(
  () => props.modelValue,
  (val) => {
    const idx = props.templates.findIndex((t) => t.id === val)
    if (idx >= 0 && idx !== frontIndex.value) goTo(idx)
  },
)

onMounted(() => {
  if (viewportRef.value) {
    resizeObserver = new ResizeObserver(() => {
      viewportWidth.value = viewportRef.value?.clientWidth ?? 0
    })
    resizeObserver.observe(viewportRef.value)
  }
  nextTick(() => scrollToIndex(frontIndex.value, false))
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <div class="tpl-carousel">
    <div
      ref="viewportRef"
      class="tpl-viewport"
      :style="{ height: cardHeight + 'px' }"
      @scroll.passive="onScroll"
    >
      <div
        v-for="(tpl, i) in templates"
        :key="tpl.id"
        :ref="(el) => setCardRef(el, i)"
        class="tpl-card"
        :class="{ 'tpl-card--active': i === frontIndex }"
        :style="{ width: cardWidth + 'px' }"
        @click="i !== frontIndex && goTo(i)"
      >
        <div class="tpl-thumb-viewport">
          <div
            class="tpl-thumb-canvas"
            :style="{
              width: previewWidth + 'px',
              height: previewHeight + 'px',
              transform: `scale(${thumbScale})`,
            }"
          >
            <slot name="thumb" :id="tpl.id" :template="tpl" />
          </div>
        </div>

        <div class="tpl-card-footer">
          <span class="tpl-card-label">{{ tpl.label }}</span>
          <button
            v-if="i === frontIndex"
            type="button"
            class="tpl-choose-btn"
            :class="{ 'tpl-choose-btn--selected': tpl.id === modelValue }"
            @click.stop="choose(tpl.id)"
          >
            <q-icon
              :name="tpl.id === modelValue ? 'mdi-check-circle' : 'mdi-check-circle-outline'"
              size="16px"
            />
            {{ tpl.id === modelValue ? 'Selected' : 'Choose Template' }}
          </button>
        </div>
      </div>
    </div>

    <div class="tpl-nav">
      <button
        type="button"
        class="tpl-nav-btn"
        :disabled="frontIndex === 0"
        @click="prev"
      >
        <q-icon name="mdi-chevron-left" size="22px" />
      </button>
      <span class="tpl-nav-count">{{ frontIndex + 1 }} / {{ total }}</span>
      <button
        type="button"
        class="tpl-nav-btn"
        :disabled="frontIndex === total - 1"
        @click="next"
      >
        <q-icon name="mdi-chevron-right" size="22px" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.tpl-carousel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding-top: 4px;
}
.tpl-viewport {
  position: relative;
  width: 100%;
  display: flex;
  gap: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.tpl-viewport::-webkit-scrollbar {
  display: none;
}
.tpl-card {
  flex: 0 0 auto;
  scroll-snap-align: center;
  border-radius: 16px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 10px 25px -8px rgba(15, 23, 42, 0.25);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  opacity: 0.55;
  transform: scale(0.92);
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
  cursor: pointer;
}
.tpl-card--active {
  opacity: 1;
  transform: scale(1);
  cursor: default;
}
.tpl-thumb-viewport {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #fff;
  min-height: 0;
}
.tpl-thumb-canvas {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: top left;
  /* Content is designed for a real full-size preview; disable pointer
     interaction since this is a scaled-down visual only. */
  pointer-events: none;
}
.tpl-card-footer {
  padding: 8px 10px 10px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #fff;
}
.tpl-card-label {
  font-size: 11px;
  font-weight: 700;
  color: #334155;
  text-align: center;
}
.tpl-choose-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  padding: 6px 8px;
  border-radius: 999px;
  background: #4f46e5;
  color: #fff;
  border: none;
}
.tpl-choose-btn--selected {
  background: #16a34a;
}
.tpl-nav {
  display: flex;
  align-items: center;
  gap: 14px;
}
.tpl-nav-btn {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #e2e8f0;
  color: #475569;
}
.tpl-nav-btn:disabled {
  opacity: 0.35;
  cursor: default;
}
.tpl-nav-count {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  min-width: 40px;
  text-align: center;
}
</style>
