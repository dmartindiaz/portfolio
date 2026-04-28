<script setup lang="ts">
import gsap from 'gsap'

const { t } = useI18n()

const props = defineProps<{
  ready: boolean
}>()

const emit = defineEmits<{
  done: []
}>()

// SVG ring math — r=96, circumference ≈ 603.19
const RADIUS = 96
const CIRC = +(2 * Math.PI * RADIUS).toFixed(2)

const overlayRef = ref<HTMLElement>()
const counterRef = ref<HTMLElement>()
const imageRef = ref<HTMLElement>()
const labelRef = ref<HTMLElement>()
const nameRef = ref<HTMLElement>()

const displayCount = ref(0)
const dashoffset = ref(CIRC) // starts full (empty ring)

const LABELS = computed(() => [
  t('loading.label1'),
  t('loading.label2'),
  t('loading.label3'),
  t('loading.label4'),
  t('loading.label5'),
])
const labelIndex = ref(0)
let labelTimer: ReturnType<typeof setInterval>

const fakeProgress = { value: 0 }
let appReady = false
let timerDone = false
let exiting = false

function updateProgress(v: number) {
  displayCount.value = Math.round(v)
  dashoffset.value = +(CIRC * (1 - v / 100)).toFixed(2)
}

function exit() {
  if (exiting) return
  exiting = true
  clearInterval(labelTimer)

  gsap.to(fakeProgress, {
    value: 100,
    duration: 0.35,
    ease: 'power2.out',
    onUpdate: () => updateProgress(fakeProgress.value),
    onComplete: () => {
      setTimeout(() => {
        if (!overlayRef.value) return
        gsap.to(overlayRef.value, {
          opacity: 0,
          duration: 0.55,
          ease: 'power2.inOut',
          onComplete: () => emit('done')
        })
      }, 280)
    }
  })
}

function startFakeProgress() {
  gsap.to(fakeProgress, {
    value: 82,
    duration: 1.4,
    ease: 'power1.inOut',
    onUpdate: () => updateProgress(fakeProgress.value),
    onComplete: () => {
      timerDone = true
      if (appReady) exit()
    }
  })
}

watch(() => props.ready, (val) => {
  if (val) {
    appReady = true
    if (timerDone) exit()
  }
})

onMounted(() => {
  // Remove the blocking preload attribute added by nuxt.config head script
  delete document.documentElement.dataset.preloading

  const tl = gsap.timeline()

  if (imageRef.value) {
    tl.fromTo(imageRef.value,
      { scale: 0.75, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out' }
    )
  }
  if (counterRef.value) {
    tl.fromTo(counterRef.value,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      '-=0.3'
    )
  }
  if (labelRef.value) {
    tl.fromTo(labelRef.value,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
      '-=0.2'
    )
  }
  if (nameRef.value) {
    tl.fromTo(nameRef.value,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.4 },
      '-=0.2'
    )
  }

  tl.call(() => startFakeProgress())

  labelTimer = setInterval(() => {
    labelIndex.value = (labelIndex.value + 1) % LABELS.value.length
  }, 480)
})

onUnmounted(() => {
  clearInterval(labelTimer)
  gsap.killTweensOf(fakeProgress)
  if (overlayRef.value) gsap.killTweensOf(overlayRef.value)
})
</script>

<template>
  <Teleport to="body">
    <div
      ref="overlayRef"
      class="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-neutral-950 select-none"
      aria-label="Loading"
      aria-live="polite"
    >
      <!-- Subtle grid texture -->
      <div
        class="pointer-events-none absolute inset-0"
        style="background-image: linear-gradient(rgba(0,220,130,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,220,130,0.03) 1px, transparent 1px); background-size: 48px 48px;"
      />

      <!-- Glow blob -->
      <div class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-105 h-105 rounded-full bg-primary-500/8 blur-[80px]" />

      <!-- Portrait + ring -->
      <div
        ref="imageRef"
        class="relative mb-8"
        style="opacity: 0"
      >
        <svg
          width="220"
          height="220"
          viewBox="0 0 220 220"
          class="absolute inset-0"
          style="transform: rotate(-90deg)"
        >
          <!-- Track ring -->
          <circle
            cx="110"
            cy="110"
            :r="RADIUS"
            fill="none"
            stroke="rgba(0,220,130,0.12)"
            stroke-width="2.5"
          />
          <!-- Progress ring -->
          <circle
            cx="110"
            cy="110"
            :r="RADIUS"
            fill="none"
            stroke="#00DC82"
            stroke-width="2.5"
            stroke-linecap="round"
            :stroke-dasharray="CIRC"
            :stroke-dashoffset="dashoffset"
            style="transition: stroke-dashoffset 0.1s linear; filter: drop-shadow(0 0 6px rgba(0,220,130,0.7))"
          />
        </svg>

        <!-- Clipped portrait -->
        <div
          class="w-55 h-55 rounded-full overflow-hidden"
          style="box-shadow: 0 0 0 1px rgba(0,220,130,0.15), 0 0 32px 8px rgba(0,220,130,0.08)"
        >
          <img
            src="/home-hero-draw.jpeg"
            alt="Portrait"
            class="w-full h-full object-cover object-top"
            draggable="false"
          >
        </div>

      </div>

      <!-- Counter -->
      <div
        ref="counterRef"
        class="flex items-end gap-1 mb-4 font-mono"
        style="opacity: 0"
      >
        <span
          class="text-6xl font-black tabular-nums leading-none text-white"
          style="text-shadow: 0 0 20px rgba(0,220,130,0.35)"
        >{{ displayCount }}</span>
        <span class="text-2xl font-bold text-primary-400 mb-1">%</span>
      </div>

      <!-- Progress bar -->
      <div class="w-48 h-0.5 bg-white/8 rounded-full overflow-hidden mb-5">
        <div
          class="h-full bg-primary-400 rounded-full transition-all duration-100"
          :style="{ width: displayCount + '%', boxShadow: '0 0 8px 2px rgba(0,220,130,0.5)' }"
        />
      </div>

      <!-- Terminal label -->
      <div
        ref="labelRef"
        class="h-5 mb-6"
        style="opacity: 0"
      >
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
          mode="out-in"
        >
          <p
            :key="labelIndex"
            class="text-xs font-mono text-primary-400/70 tracking-widest"
          >
            <span class="text-primary-400/40 mr-1">›</span>{{ LABELS[labelIndex] }}
          </p>
        </Transition>
      </div>

      <!-- Name -->
      <div
        ref="nameRef"
        class="flex flex-col items-center gap-1"
        style="opacity: 0"
      >
        <p class="text-xs font-bold tracking-[0.25em] uppercase text-white/30">
          D. MARTÍN DÍAZ
        </p>
        <p class="text-[10px] tracking-[0.15em] uppercase text-white/15 font-mono">
          Frontend Engineer
        </p>
      </div>
    </div>
  </Teleport>
</template>
