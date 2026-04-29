<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { t } = useI18n()

const sectionRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
let st: ScrollTrigger | null = null

function initAnimations() {
  st?.kill(); st = null
  if (!sectionRef.value || !contentRef.value) return

  gsap.set(contentRef.value, { clearProps: 'all' })

  const tl = gsap.timeline({ paused: true })
  tl.fromTo(
    contentRef.value,
    { y: 80, opacity: 0 },
    { y: 0, opacity: 1, ease: 'none', duration: 0.4 }
  ).to(
    contentRef.value,
    { y: -80, opacity: 0, ease: 'none', duration: 0.4 }
  )

  st = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1,
    animation: tl,
  })
}

onUnmounted(() => { st?.kill() })

defineExpose({ initAnimations })
</script>

<template>
  <section ref="sectionRef" class="relative px-8 py-24 bg-white dark:bg-neutral-950 overflow-hidden">
    <!-- Subtle grid texture -->
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
      style="background-image: linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px); background-size: 40px 40px;"
    />
    <!-- Blobs -->
    <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary-500/5 blur-3xl" />
    </div>

    <div ref="contentRef" class="relative z-10 mx-auto w-full max-w-6xl flex flex-col items-center gap-12">

      <!-- Header -->
      <div class="flex flex-col items-center gap-4 text-center max-w-2xl">
        <h2 class="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-neutral-900 dark:text-white">
          {{ t('companies.title') }}
        </h2>
        <p class="text-base md:text-lg text-neutral-500 dark:text-white/60 leading-relaxed">
          {{ t('companies.description') }}
        </p>
      </div>

    </div>
  </section>
</template>
