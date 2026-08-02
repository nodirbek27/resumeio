<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface Props {
  delay?: number
}
const props = withDefaults(defineProps<Props>(), { delay: 0 })

const el = ref<HTMLElement | null>(null)
const visible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!el.value) return
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        visible.value = true
        observer?.disconnect()
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
  )
  observer.observe(el.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div
    ref="el"
    class="reveal"
    :class="{ 'reveal--visible': visible }"
    :style="props.delay ? { transitionDelay: `${props.delay}ms` } : undefined"
  >
    <slot />
  </div>
</template>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 0.7s ease-out,
    transform 0.7s ease-out;
}

.reveal--visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    transition: none;
    transform: none;
    opacity: 1;
  }
}
</style>
