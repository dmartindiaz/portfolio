<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

interface Cta {
  label: string
  to?: string
  href?: string
  icon?: string
}

const props = defineProps<{
  badge?: string
  titleBefore?: string
  titleHighlight?: string
  titleAfter?: string
  description?: string
  primaryImg?: string
  secondaryImg?: string
  primaryCta?: Cta
  secondaryCta?: Cta
  location?: string
  experience?: string
}>()

// ── Scramble text ────────────────────────────────────────────────────────────
const CHARSET = '01<>{}[]|/\\@#$%^&*~;:=+'
const ICON_CHANCE = 0.35

// ── Fullstack cycle stacks ───────────────────────────────────────────────────
interface Stack { text: string; icons: string[]; color: string }
const STACKS: Stack[] = [
  { text: 'Vue / Nuxt', icons: ['logos:vue', 'logos:nuxt-icon'],       color: '#41b883' },
  { text: 'NestJS',     icons: ['logos:nestjs'],                        color: '#e0234e' },
  { text: 'Angular',    icons: ['logos:angular-icon'],                  color: '#dd0031' },
  { text: 'Docker',     icons: ['logos:docker-icon'],                   color: '#2496ed' },
  { text: 'Linux',      icons: ['logos:linux-tux'],                     color: 'currentColor' },
]

type Token = { type: 'char'; value: string } | { type: 'icon'; name: string }

function toCharTokens(text: string): Token[] {
  return text.split('').map(c => ({ type: 'char', value: c }))
}

const scrambleTokens = ref<Token[]>(props.titleHighlight ? toCharTokens(props.titleHighlight) : [])
const highlightOpacity = ref(0)
const activeColor = ref('#41b883')
let rafId: number | null = null
let cycleTimer: ReturnType<typeof setTimeout> | null = null
let activeIcons: string[] = ['logos:vue', 'logos:nuxt-icon']

function scramble(target: string, onDone?: () => void) {
  if (rafId) cancelAnimationFrame(rafId)
  const len = target.length
  const totalFrames = 30
  const revealFrames = 18
  const staggerPerChar = (totalFrames - revealFrames) / len
  let frame = 0
  let lastTime = performance.now()
  const frameInterval = 1000 / 18

  function tick(now: number) {
    if (now - lastTime < frameInterval) {
      rafId = requestAnimationFrame(tick)
      return
    }
    lastTime = now

    highlightOpacity.value = Math.min(1, frame / (totalFrames * 0.25))

    const tokens: Token[] = []
    for (let i = 0; i < len; i++) {
      const revealAt = i * staggerPerChar
      if (frame >= revealAt + revealFrames) {
        tokens.push({ type: 'char', value: target[i] })
      } else if (target[i] === ' ') {
        tokens.push({ type: 'char', value: ' ' })
      } else if (Math.random() < ICON_CHANCE) {
        tokens.push({ type: 'icon', name: activeIcons[Math.floor(Math.random() * activeIcons.length)] })
      } else {
        tokens.push({ type: 'char', value: CHARSET[Math.floor(Math.random() * CHARSET.length)] })
      }
    }
    scrambleTokens.value = tokens
    frame++

    if (frame <= totalFrames + revealFrames) {
      rafId = requestAnimationFrame(tick)
    } else {
      scrambleTokens.value = toCharTokens(target)
      highlightOpacity.value = 1
      onDone?.()
    }
  }
  rafId = requestAnimationFrame(tick)
}

function startCycle() {
  let index = 0

  function runNext() {
    const stack = STACKS[index % STACKS.length]
    activeIcons = stack.icons
    activeColor.value = stack.color
    // Fade out current text then scramble into next
    highlightOpacity.value = 0
    scrambleTokens.value = toCharTokens(stack.text)
    scramble(stack.text, () => {
      index++
      cycleTimer = setTimeout(runNext, 1500)
    })
  }

  runNext()
}

function initAnimation() {
  if (!props.titleHighlight) return
  if (cycleTimer) { clearTimeout(cycleTimer); cycleTimer = null }
  if (rafId) cancelAnimationFrame(rafId)

  const isFullstack = typeof window !== 'undefined' && window.location.hash === '#fullstack'

  if (isFullstack) {
    startCycle()
  } else {
    activeIcons = STACKS[0].icons
    activeColor.value = STACKS[0].color
    scrambleTokens.value = toCharTokens(props.titleHighlight)
    highlightOpacity.value = 0
    setTimeout(() => scramble(props.titleHighlight!), 0)
  }
}

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (cycleTimer) clearTimeout(cycleTimer)
})

defineExpose({ initAnimation })
</script>

<template>
  <section id="hero" class="min-h-screen flex items-center px-8 pt-28 pb-16 md:py-16 bg-white dark:bg-neutral-950">
    <div class="mx-auto w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <!-- Left: content -->
      <div class="flex flex-col gap-7">
        <!-- Badge -->
        <div v-if="badge !== undefined">
          <span class="inline-flex items-center gap-2 border border-neutral-300 dark:border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-neutral-600 dark:text-white/70">
            <span class="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
            {{ badge }}
          </span>
        </div>
        <USkeleton v-else class="h-7 w-56 rounded-full" />
        <!-- Heading -->
        <h1 v-if="titleBefore !== undefined || titleHighlight !== undefined || titleAfter !== undefined" class="font-mono font-bold leading-tight text-neutral-900 dark:text-white">
          <span v-if="titleBefore" class="block text-3xl md:text-5xl text-neutral-700 dark:text-white/80">{{ titleBefore }}</span>
          <em v-if="titleHighlight" class="not-italic italic font-sans text-5xl md:text-7xl inline-flex items-center flex-wrap gap-x-1" :style="{ opacity: highlightOpacity, color: activeColor }">
            <template v-for="(token, i) in scrambleTokens" :key="i">
              <UIcon v-if="token.type === 'icon'" :name="token.name" class="inline-block w-[0.85em] h-[0.85em] align-middle" />
              <span v-else>{{ token.value }}</span>
            </template>
          </em>
          <br v-if="titleHighlight">
          <span v-if="titleAfter" class="text-5xl md:text-7xl">{{ titleAfter }}</span>
        </h1>
        <div v-else class="flex flex-col gap-4">
          <USkeleton class="h-[72px] w-3/4 rounded-xl" />
          <USkeleton class="h-[72px] w-1/2 rounded-xl" />
          <USkeleton class="h-[72px] w-2/3 rounded-xl" />
        </div>
        <!-- Description -->
        <p v-if="description !== undefined" class="text-base md:text-lg text-neutral-500 dark:text-white/55 max-w-sm leading-relaxed">
          {{ description }}
        </p>
        <div v-else class="flex flex-col gap-2.5 max-w-sm">
          <USkeleton class="h-4 w-full rounded" />
          <USkeleton class="h-4 w-5/6 rounded" />
          <USkeleton class="h-4 w-3/4 rounded" />
          <USkeleton class="h-4 w-4/6 rounded" />
        </div>
        <!-- CTAs -->
        <div v-if="primaryCta !== undefined || secondaryCta !== undefined" class="flex flex-wrap items-center gap-4 pt-1">
          <UButton
            v-if="primaryCta"
            :to="primaryCta.to"
            :href="primaryCta.href"
            color="primary"
            size="xl"
            class="font-semibold"
            :leading-icon="primaryCta.icon"
          >
            {{ primaryCta.label }}
          </UButton>
          <UButton
            v-if="secondaryCta"
            :to="secondaryCta.to"
            :href="secondaryCta.href"
            variant="solid"
            color="neutral"
            size="xl"
            :trailing-icon="secondaryCta.icon"
            class="bg-neutral-700 hover:bg-neutral-600 text-white border-0"
          >
            {{ secondaryCta.label }}
          </UButton>
        </div>
        <div v-else class="flex gap-4 pt-1">
          <USkeleton class="h-11 w-36 rounded-lg" />
          <USkeleton class="h-11 w-32 rounded-lg" />
        </div>
      </div>
      <!-- Right: Compare -->
      <div class="relative">
        <div v-if="primaryImg !== undefined && secondaryImg !== undefined" class="relative rounded-2xl overflow-hidden">
          <Compare
            :second-image="secondaryImg"
            slide-mode="hover"
            :show-handlebar="true"
            class="w-full aspect-square rounded-2xl"
          >
            <template #first-content>
              <div class="absolute inset-0 z-20 h-full w-full select-none overflow-hidden rounded-2xl">
                <img
                  :src="primaryImg"
                  alt="Profile photo"
                  draggable="false"
                  class="absolute inset-0 h-full w-full object-cover select-none rounded-2xl"
                >
                <div class="absolute inset-0 rounded-2xl" />
              </div>
            </template>
          </Compare>
          <!-- Stats bar -->
          <div
            v-if="location !== undefined || experience !== undefined"
            class="absolute bottom-0 left-0 right-0 flex bg-black/65 backdrop-blur m-5 rounded-xl"
          >
            <div v-if="location !== undefined" class="flex-1 px-5 py-4 border-r border-white/10">
              <p class="text-xs font-bold tracking-widest uppercase text-primary-400 mb-1">
              </p>
              <p class="text-sm font-medium text-white">
                {{ location }}
              </p>
            </div>
            <div v-if="experience !== undefined" class="flex-1 px-5 py-4">
              <p class="text-xs font-bold tracking-widest uppercase text-primary-400 mb-1">
              </p>
              <p class="text-sm font-medium text-white">
                {{ experience }}
              </p>
            </div>
          </div>
        </div>

        <!-- Skeleton when images are not provided -->
        <div v-else class="relative">
          <USkeleton class="w-full aspect-[3/4] rounded-2xl" />
          <div class="absolute bottom-5 left-5 right-5 flex rounded-xl overflow-hidden">
            <USkeleton class="flex-1 h-16" />
            <USkeleton class="flex-1 h-16" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
