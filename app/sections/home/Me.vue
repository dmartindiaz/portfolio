<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
const colorMode = useColorMode()

function getCssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

interface Highlight {
  text: string
  href?: string
}

interface Card {
  icon: string
  title: string
  description: string
}

const props = defineProps<{
  badge?: string
  title?: string
  body?: string
  highlights?: Highlight[]
  cards?: Card[]
}>()

const titleLines = computed(() => {
  const t = props.title ?? 'This is the title.'
  const parts = t.split('. ')
  return parts.map((p, i) => i < parts.length - 1 ? p + '.' : p)
})

const DEFAULT_CARDS: Card[] = [
  { icon: 'heroicons:square-3-stack-3d', title: 'Card title', description: 'This is the card description.' },
  { icon: 'heroicons:square-3-stack-3d', title: 'Card title', description: 'This is the card description.' }
]

gsap.registerPlugin(ScrollTrigger)

interface Segment {
  text: string
  href?: string
}

function parseBody(body: string, highlights: { text: string; href?: string }[]): Segment[] {
  const segments: Segment[] = []
  let remaining = body

  while (remaining.length > 0) {
    let earliest: { index: number; highlight: { text: string; href?: string } } | null = null

    for (const h of highlights) {
      const idx = remaining.indexOf(h.text)
      if (idx !== -1 && (earliest === null || idx < earliest.index)) {
        earliest = { index: idx, highlight: h }
      }
    }

    if (!earliest) {
      segments.push({ text: remaining })
      break
    }

    if (earliest.index > 0) {
      segments.push({ text: remaining.slice(0, earliest.index) })
    }

    segments.push({ text: earliest.highlight.text, href: earliest.highlight.href })
    remaining = remaining.slice(earliest.index + earliest.highlight.text.length)
  }

  return segments
}

const titleRef = ref<HTMLElement>()
const cardsRef = ref<HTMLElement>()
const sectionRef = ref<HTMLElement>()
const blob1Ref = ref<HTMLElement>()
const blob2Ref = ref<HTMLElement>()
const verticalNameRef = ref<HTMLElement>()
let st: ScrollTrigger | null = null
let stCards: ScrollTrigger | null = null
let stBlobs: ScrollTrigger | null = null
let stName: ScrollTrigger | null = null
let resizeTimer: ReturnType<typeof setTimeout>

function isMobile() {
  return window.innerWidth < 768
}

function killAll() {
  st?.kill(); st = null
  stCards?.kill(); stCards = null
  stBlobs?.kill(); stBlobs = null
  stName?.kill(); stName = null
}

function initAnimations() {
  killAll()

  const wordEls = titleRef.value?.querySelectorAll<HTMLElement>('.title-word')
  if (wordEls?.length) {
    // Reset word colors to initial dim state before re-animating
    gsap.set(wordEls, { color: getCssVar('--title-word-dim') })

    st = ScrollTrigger.create({
      trigger: titleRef.value,
      start: 'top 90%',
      end: 'center 60%',
      scrub: 1,
      animation: gsap.to(wordEls, {
        keyframes: [
          { color: getCssVar('--title-word-dim'), duration: 0.01 },
          { color: getCssVar('--title-word-bright'), duration: 0.04 }
        ],
        stagger: { each: 0.1 },
        ease: 'none'
      })
    })
  }

  // Cards animation — desktop only
  if (!isMobile() && cardsRef.value) {
    const cardEls = cardsRef.value.querySelectorAll<HTMLElement>('.anim-card')
    if (cardEls.length >= 2) {
      gsap.set(cardEls, { clearProps: 'transform' })

      const tl = gsap.timeline({ paused: true })
      tl.to(cardEls[0], {
        x: () => {
          const base = (cardsRef.value!.offsetWidth - (cardEls[0] as HTMLElement).offsetWidth) / 2
          const factor = window.innerWidth > 1080 ? 2.5 : 1
          return -(base * factor)
        },
        ease: 'none'
      }, 0)
      tl.to(cardEls[1], {
        x: () => {
          const base = (cardsRef.value!.offsetWidth - (cardEls[1] as HTMLElement).offsetWidth) / 2
          const factor = window.innerWidth > 1080 ? 2.5 : 1
          return base * factor
        },
        ease: 'none'
      }, 0)

      stCards = ScrollTrigger.create({
        trigger: cardsRef.value,
        start: 'top 80%',
        end: 'bottom 30%',
        scrub: 1,
        animation: tl
      })
    }
  } else if (cardsRef.value) {
    // Clear any leftover transform from desktop on mobile
    const cardEls = cardsRef.value.querySelectorAll<HTMLElement>('.anim-card')
    gsap.set(cardEls, { clearProps: 'transform' })
  }

  // Blobs
  if (sectionRef.value && blob1Ref.value && blob2Ref.value) {
    stBlobs = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      animation: gsap.timeline()
        .fromTo(blob1Ref.value, { y: '100vh' }, { y: '-100vh', ease: 'none' }, 0)
        .fromTo(blob2Ref.value, { y: '100vh' }, { y: '-100vh', ease: 'none' }, 0)
    })
  }

  // Vertical name parallax
  if (sectionRef.value && verticalNameRef.value) {
    stName = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      animation: gsap.fromTo(verticalNameRef.value, { y: '20%' }, { y: '-20%', ease: 'none' })
    })
  }
}

onMounted(() => {
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => initAnimations(), 150)
  })
})

watch(() => colorMode.value, () => {
  initAnimations()
})

defineExpose({ initAnimations })

onUnmounted(() => {
  killAll()
  clearTimeout(resizeTimer)
})
</script>

<template>
  <section id="about" ref="sectionRef" class="relative bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
    <!-- blobs que suben con el scroll -->
    <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div ref="blob1Ref" class="absolute left-[20%] w-[500px] h-[500px] rounded-full bg-primary-500/10 blur-3xl" />
      <div ref="blob2Ref" class="absolute left-[60%] w-[420px] h-[420px] rounded-full bg-neutral-400/10 blur-3xl mt-100 ml-32" />
    </div>

    <!-- Vertical name -->
    <div ref="verticalNameRef" class="pointer-events-none select-none absolute right-0 top-0 bottom-0 z-0 flex items-center">
      <span
        class="text-[clamp(120px,14vw,220px)] font-black tracking-[0.2em] uppercase whitespace-nowrap"
        style="writing-mode: vertical-rl; transform: rotate(180deg); color: transparent; -webkit-text-stroke: 1px rgb(229 229 229 / 0.15)"
      >FRONTEND</span>
    </div>

    <div class="relative z-10 mx-auto w-full max-w-6xl grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-12 md:gap-16 px-4 sm:px-8 py-16 md:py-32">

      <!-- Left: badge + big title + description -->
      <div class="flex flex-col gap-6">
        <span class="text-xs font-bold tracking-widest uppercase text-primary-400">
          {{ badge ?? 'Section' }}
        </span>

        <h2 ref="titleRef" class="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-neutral-900 dark:text-white">
          <span class="block">
            <template v-for="(word, wi) in titleLines[0]?.split(' ')" :key="wi">
              <span class="title-word" style="color: var(--title-word-dim)">{{ word }}</span>{{ wi < (titleLines[0]?.split(' ')?.length ?? 0) - 1 ? ' ' : '' }}
            </template>
          </span>
          <span class="block">
            <template v-for="(word, wi) in titleLines[1]?.split(' ')" :key="wi">
              <span class="title-word" style="color: var(--title-word-dim)">{{ word }}</span>{{ wi < (titleLines[1]?.split(' ')?.length ?? 0) - 1 ? ' ' : '' }}
            </template>
          </span>
        </h2>

        <p class="text-base md:text-lg text-neutral-500 dark:text-white/60 leading-relaxed max-w-sm">
          <template v-if="body !== undefined && highlights !== undefined" v-for="(segment, i) in parseBody(body, highlights)" :key="i">
            <a
              v-if="segment.href"
              :href="segment.href"
              class="text-primary-400 underline underline-offset-2 decoration-primary-400/40 hover:decoration-primary-400 transition-colors"
            >{{ segment.text }}</a>
            <span v-else>{{ segment.text }}</span>
          </template>
          <template v-else>
            This is the body text. Replace it with your own content.
          </template>
        </p>
      </div>

      <!-- Right: cards -->
      <div ref="cardsRef" class="flex flex-col items-center justify-center gap-4">
        <div
          v-for="(card, i) in (cards ?? DEFAULT_CARDS)"
          :key="i"
          class="anim-card w-full md:max-w-sm rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100/80 dark:bg-white/5 backdrop-blur-md p-6 flex flex-col gap-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
        >
          <UIcon :name="card.icon" class="text-primary-400 text-2xl w-7 h-7" />
          <p class="text-base font-semibold text-neutral-900 dark:text-white">{{ card.title }}</p>
          <p class="text-sm text-neutral-500 dark:text-white/55 leading-relaxed">{{ card.description }}</p>
        </div>
      </div>

    </div>
  </section>
</template>
