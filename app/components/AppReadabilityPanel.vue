<script setup lang="ts">
const { t } = useI18n()
const open = ref(false)

// --- Saturation ---
const saturationLevels = computed(() => [
  { key: 'normal', label: t('readability.satNormal'), icon: 'ph:drop-half', filter: '' },
  { key: 'low', label: t('readability.satLow'), icon: 'ph:drop', filter: 'saturate(0.4)' },
  { key: 'high', label: t('readability.satHigh'), icon: 'ph:drop-fill', filter: 'saturate(1.8)' },
  { key: 'none', label: t('readability.satNone'), icon: 'ph:drop-slash', filter: 'saturate(0)' },
])

const activeSaturationIdx = ref(0)
const activeSaturation = computed(() => saturationLevels.value[activeSaturationIdx.value]!)

// --- Contrast ---
const contrastLevels = computed(() => [
  { key: 'normal', label: t('readability.contrastNormal'), icon: 'ph:circle-half', filter: '' },
  { key: 'invert', label: t('readability.contrastInvert'), icon: 'ph:swap', filter: 'invert(1)' },
  { key: 'dark', label: t('readability.contrastDark'), icon: 'ph:moon', filter: 'brightness(0.7)' },
  { key: 'high', label: t('readability.contrastHigh'), icon: 'ph:eye', filter: 'contrast(1.5)' },
])

const activeContrastIdx = ref(0)
const activeContrast = computed(() => contrastLevels.value[activeContrastIdx.value]!)

// --- Combined filter (saturation + contrast) ---
function applyFilters() {
  const parts = [
    saturationLevels.value[activeSaturationIdx.value]!.filter,
    contrastLevels.value[activeContrastIdx.value]!.filter,
  ].filter(Boolean)
  document.documentElement.style.filter = parts.join(' ')
}

function cycleSaturation() {
  const next = (activeSaturationIdx.value + 1) % saturationLevels.value.length
  activeSaturationIdx.value = next
  applyFilters()
  localStorage.setItem('readability-saturation', saturationLevels.value[next]!.key)
}

function cycleContrast() {
  const next = (activeContrastIdx.value + 1) % contrastLevels.value.length
  activeContrastIdx.value = next
  applyFilters()
  localStorage.setItem('readability-contrast', contrastLevels.value[next]!.key)
}

// --- Cursor ---
const cursorLevels = computed(() => [
  { key: 'normal', label: t('readability.cursorNormal'), icon: 'ph:cursor' },
  { key: 'large', label: t('readability.cursorLarge'), icon: 'ph:cursor-fill' },
  { key: 'reading', label: t('readability.cursorReading'), icon: 'ph:book-open' },
])

const activeCursorIdx = ref(0)
const activeCursor = computed(() => cursorLevels.value[activeCursorIdx.value]!)

function cycleCursor() {
  const next = (activeCursorIdx.value + 1) % cursorLevels.value.length
  activeCursorIdx.value = next
  const key = cursorLevels.value[next]!.key
  if (key === 'normal') {
    delete document.documentElement.dataset.cursor
  } else {
    document.documentElement.dataset.cursor = key
  }
  localStorage.setItem('readability-cursor', key)
}

// --- Font ---
const fontLevels = computed(() => [
  { key: 'normal', label: t('readability.fontNormal'), icon: 'ph:text-aa' },
  { key: 'dyslexia', label: t('readability.fontDyslexia'), icon: 'ph:eyeglasses' },
  { key: 'legible', label: t('readability.fontLegible'), icon: 'ph:text-bolder' },
])

const activeFontIdx = ref(0)
const activeFont = computed(() => fontLevels.value[activeFontIdx.value]!)

function loadAtkinsonFont() {
  if (document.getElementById('font-atkinson')) return
  const link = document.createElement('link')
  link.id = 'font-atkinson'
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap'
  document.head.appendChild(link)
}

function cycleFont() {
  const next = (activeFontIdx.value + 1) % fontLevels.value.length
  activeFontIdx.value = next
  const key = fontLevels.value[next]!.key
  if (key === 'dyslexia') loadAtkinsonFont()
  if (key === 'normal') {
    delete document.documentElement.dataset.font
  } else {
    document.documentElement.dataset.font = key
  }
  localStorage.setItem('readability-font', key)
}

onMounted(() => {
  const savedSat = localStorage.getItem('readability-saturation')
  if (savedSat) {
    const idx = saturationLevels.value.findIndex(l => l.key === savedSat)
    if (idx !== -1) activeSaturationIdx.value = idx
  }
  const savedContrast = localStorage.getItem('readability-contrast')
  if (savedContrast) {
    const idx = contrastLevels.value.findIndex(l => l.key === savedContrast)
    if (idx !== -1) activeContrastIdx.value = idx
  }
  applyFilters()

  const savedCursor = localStorage.getItem('readability-cursor')
  if (savedCursor && savedCursor !== 'normal') {
    const idx = cursorLevels.value.findIndex(l => l.key === savedCursor)
    if (idx !== -1) {
      activeCursorIdx.value = idx
      document.documentElement.dataset.cursor = savedCursor
    }
  }

  const savedFont = localStorage.getItem('readability-font')
  if (savedFont && savedFont !== 'normal') {
    const idx = fontLevels.value.findIndex(l => l.key === savedFont)
    if (idx !== -1) {
      activeFontIdx.value = idx
      if (savedFont === 'dyslexia') loadAtkinsonFont()
      document.documentElement.dataset.font = savedFont
    }
  }
})
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50">
    <UPopover
      v-model:open="open"
      :popper="{ placement: 'top-end', offsetDistance: 14 }"
    >
      <button
        class="w-16 h-16 flex items-center justify-center rounded-2xl shadow-xl transition-all duration-200 text-white dark:text-neutral-900"
        :class="open ? 'bg-neutral-400 dark:bg-neutral-600' : 'bg-primary hover:opacity-90'"
        :aria-label="t('readability.title')"
      >
        <UIcon
          name="material-symbols:settings-accessibility-rounded"
          class="text-4xl"
        />
      </button>

      <template #content>
        <div class="p-4 w-80">
          <div class="flex flex-col mb-4">
            <div class="flex justify-end mb-3">
              <button
                class="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-white/35 hover:text-neutral-700 dark:hover:text-white/70 transition-colors duration-150"
                @click="open = false"
              >
                {{ t('readability.close') }} ✕
              </button>
            </div>
            <div class="flex items-center gap-4 py-5">
              <UIcon
                name="material-symbols:settings-accessibility-rounded"
                class="text-5xl text-primary shrink-0"
              />
              <div class="w-px h-10 bg-neutral-200 dark:bg-white/10" />
              <p class="text-2xl font-semibold text-neutral-700 dark:text-white/80">
                {{ t('readability.toolsTitle') }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <button
              class="flex flex-col items-center rounded-xl px-3 pt-5 pb-3 gap-2 transition-colors duration-150 bg-neutral-100 dark:bg-white/6 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-700 dark:text-white/80"
              @click="cycleSaturation"
            >
              <UIcon
                :name="activeSaturation.icon"
                class="text-3xl"
              />
              <span class="text-sm leading-none font-medium">{{ activeSaturation.label }}</span>
              <div class="flex gap-1.5 w-full mt-1 px-1">
                <div
                  v-for="(_, i) in saturationLevels"
                  :key="i"
                  class="flex-1 rounded-full transition-all duration-200"
                  :class="i === activeSaturationIdx ? 'h-2 bg-neutral-700 dark:bg-white' : 'h-1.5 bg-neutral-300 dark:bg-white/20'"
                />
              </div>
            </button>

            <button
              class="flex flex-col items-center rounded-xl px-3 pt-5 pb-3 gap-2 transition-colors duration-150 bg-neutral-100 dark:bg-white/6 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-700 dark:text-white/80"
              @click="cycleCursor"
            >
              <UIcon
                :name="activeCursor.icon"
                class="text-3xl"
              />
              <span class="text-sm leading-none font-medium">{{ activeCursor.label }}</span>
              <div class="flex gap-1.5 w-full mt-1 px-1">
                <div
                  v-for="(_, i) in cursorLevels"
                  :key="i"
                  class="flex-1 rounded-full transition-all duration-200"
                  :class="i === activeCursorIdx ? 'h-2 bg-neutral-700 dark:bg-white' : 'h-1.5 bg-neutral-300 dark:bg-white/20'"
                />
              </div>
            </button>

            <button
              class="flex flex-col items-center rounded-xl px-3 pt-5 pb-3 gap-2 transition-colors duration-150 bg-neutral-100 dark:bg-white/6 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-700 dark:text-white/80"
              @click="cycleContrast"
            >
              <UIcon
                :name="activeContrast.icon"
                class="text-3xl"
              />
              <span class="text-sm leading-none font-medium">{{ activeContrast.label }}</span>
              <div class="flex gap-1.5 w-full mt-1 px-1">
                <div
                  v-for="(_, i) in contrastLevels"
                  :key="i"
                  class="flex-1 rounded-full transition-all duration-200"
                  :class="i === activeContrastIdx ? 'h-2 bg-neutral-700 dark:bg-white' : 'h-1.5 bg-neutral-300 dark:bg-white/20'"
                />
              </div>
            </button>

            <button
              class="flex flex-col items-center rounded-xl px-3 pt-5 pb-3 gap-2 transition-colors duration-150 bg-neutral-100 dark:bg-white/6 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-700 dark:text-white/80"
              @click="cycleFont"
            >
              <UIcon
                :name="activeFont.icon"
                class="text-3xl"
              />
              <span class="text-sm leading-none font-medium">{{ activeFont.label }}</span>
              <div class="flex gap-1.5 w-full mt-1 px-1">
                <div
                  v-for="(_, i) in fontLevels"
                  :key="i"
                  class="flex-1 rounded-full transition-all duration-200"
                  :class="i === activeFontIdx ? 'h-2 bg-neutral-700 dark:bg-white' : 'h-1.5 bg-neutral-300 dark:bg-white/20'"
                />
              </div>
            </button>
          </div>

          <p class="mt-4 pt-4 border-t border-neutral-200 dark:border-white/8 text-sm text-neutral-500 dark:text-white/40 leading-relaxed">
            {{ t('readability.description') }}
          </p>
        </div>
      </template>
    </UPopover>
  </div>
</template>
