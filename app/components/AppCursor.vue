<script setup lang="ts">
const topEl = ref<HTMLDivElement | null>(null)
const bottomEl = ref<HTMLDivElement | null>(null)
const borderTopEl = ref<HTMLDivElement | null>(null)
const borderBottomEl = ref<HTMLDivElement | null>(null)
const isReading = ref(false)
const visible = ref(false)

const BAND_HEIGHT = 80 // px — half-height of the clear reading zone

let observer: MutationObserver | null = null

function onMouseMove(e: MouseEvent) {
  if (!isReading.value) return
  if (!visible.value) visible.value = true
  const y = e.clientY
  if (topEl.value) topEl.value.style.height = `${Math.max(0, y - BAND_HEIGHT)}px`
  if (bottomEl.value) bottomEl.value.style.top = `${y + BAND_HEIGHT}px`
  if (borderTopEl.value) borderTopEl.value.style.top = `${Math.max(0, y - BAND_HEIGHT)}px`
  if (borderBottomEl.value) borderBottomEl.value.style.top = `${y + BAND_HEIGHT}px`
}

function onMouseLeave() {
  visible.value = false
}

onMounted(() => {
  isReading.value = document.documentElement.dataset.cursor === 'reading'
  observer = new MutationObserver(() => {
    isReading.value = document.documentElement.dataset.cursor === 'reading'
    if (!isReading.value) visible.value = false
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-cursor'] })
  window.addEventListener('mousemove', onMouseMove)
  document.documentElement.addEventListener('mouseleave', onMouseLeave)
})

onUnmounted(() => {
  observer?.disconnect()
  window.removeEventListener('mousemove', onMouseMove)
  document.documentElement.removeEventListener('mouseleave', onMouseLeave)
})
</script>

<template>
  <template v-if="isReading && visible">
    <!-- Dark overlay above the reading zone -->
    <div
      ref="topEl"
      class="fixed top-0 left-0 w-full pointer-events-none z-9998 bg-neutral-950/60 dark:bg-neutral-950/70"
    />
    <!-- Dark overlay below the reading zone -->
    <div
      ref="bottomEl"
      class="fixed left-0 bottom-0 w-full pointer-events-none z-9998 bg-neutral-950/60 dark:bg-neutral-950/70"
    />
    <!-- Green border at top edge of reading band -->
    <div
      ref="borderTopEl"
      class="fixed left-0 w-full h-px pointer-events-none z-9999 bg-green-400/40"
    />
    <!-- Green border at bottom edge of reading band -->
    <div
      ref="borderBottomEl"
      class="fixed left-0 w-full h-px pointer-events-none z-9999 bg-green-400/40"
    />
  </template>
</template>
