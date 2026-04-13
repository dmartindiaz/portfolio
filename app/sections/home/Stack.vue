<script setup lang="ts">
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface StackCard {
  icon: string
  title: string
  description: string
  featured?: boolean
}

export interface StackTag {
  label: string
  featured?: boolean
  icon?: string
}

const props = withDefaults(defineProps<{
  badge?: string
  title?: string
  description?: string
  tags?: (string | StackTag)[]
  cards?: StackCard[]
}>(), {
  badge: 'Skillset',
  title: 'The Full Stack of Modern Value.',
  description: "My technical arsenal isn't just about syntax—it's about building scalable systems that solve business problems.",
  tags: () => ['Vue 3', 'Nuxt 3', 'TypeScript', 'Tailwind CSS', 'Pinia', 'Vite', 'Node.js', 'PostgreSQL'],
  cards: () => [
    {
      icon: 'heroicons:signal',
      title: 'Telecom / IT',
      description: 'Deep understanding of network layers, server maintenance, and infrastructure scalability.',
      featured: true
    },
    {
      icon: 'heroicons:megaphone',
      title: 'Marketing',
      description: 'Strategic conversion optimization, SEO-first architecture, and brand narrative.'
    },
    {
      icon: 'heroicons:check-badge',
      title: 'Senior Leadership',
      description: 'Experienced in mentoring developers, establishing code standards, and managing agile delivery cycles.'
    }
  ]
})

const featuredCard = computed(() => props.cards?.find(c => c.featured))
const regularCards = computed(() => props.cards?.filter(c => !c.featured) ?? [])

// ─── GSAP ─────────────────────────────────────────────────────────────────────
const sectionRef = ref<HTMLElement>()
const leftRef = ref<HTMLElement>()
const tagsRef = ref<HTMLElement>()
const featuredCardRef = ref<HTMLElement>()
const regularCardsRef = ref<HTMLElement[]>([])
let sts: ScrollTrigger[] = []

function initAnimations() {
  sts.forEach(s => s.kill())
  sts = []

  if (!sectionRef.value) return

  // Left column: badge + title + description stagger in
  if (leftRef.value) {
    const leftChildren = leftRef.value.querySelectorAll<HTMLElement>('.anim-left')
    gsap.set(leftChildren, { opacity: 0, y: 30 })
    sts.push(ScrollTrigger.create({
      trigger: leftRef.value,
      start: 'top 85%',
      animation: gsap.to(leftChildren, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out'
      }),
      once: true
    }))
  }

  // Tags: stagger in
  if (tagsRef.value) {
    const tagEls = tagsRef.value.querySelectorAll<HTMLElement>('.anim-tag')
    gsap.set(tagEls, { opacity: 0, scale: 0.85 })
    sts.push(ScrollTrigger.create({
      trigger: tagsRef.value,
      start: 'top 88%',
      animation: gsap.to(tagEls, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: 'back.out(1.5)'
      }),
      once: true
    }))
  }

  // Featured card: slide up
  if (featuredCardRef.value) {
    gsap.set(featuredCardRef.value, { opacity: 0, y: 40 })
    sts.push(ScrollTrigger.create({
      trigger: featuredCardRef.value,
      start: 'top 90%',
      animation: gsap.to(featuredCardRef.value, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
      }),
      once: true
    }))
  }

  // Regular cards: stagger in
  if (regularCardsRef.value.length) {
    gsap.set(regularCardsRef.value, { opacity: 0, y: 40 })
    sts.push(ScrollTrigger.create({
      trigger: regularCardsRef.value[0],
      start: 'top 92%',
      animation: gsap.to(regularCardsRef.value, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out'
      }),
      once: true
    }))
  }
}

onUnmounted(() => sts.forEach(s => s.kill()))
defineExpose({ initAnimations })
</script>

<template>
  <section id="stack" ref="sectionRef" class="relative px-4 sm:px-8 py-16 md:py-24 bg-neutral-900 overflow-hidden">

    <!-- Blobs -->
    <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div class="absolute left-[15%] top-[10%] w-[500px] h-[500px] rounded-full bg-primary-500/8 blur-3xl" />
      <div class="absolute right-[10%] bottom-[5%] w-[420px] h-[420px] rounded-full bg-neutral-400/6 blur-3xl" />
    </div>

    <div class="relative z-10 mx-auto w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start md:items-center">

      <!-- Left -->
      <div ref="leftRef" class="flex flex-col gap-8">
        <div class="flex flex-col gap-4">
          <span class="anim-left text-xs font-bold tracking-widest uppercase text-primary-400">
            {{ badge }}
          </span>
          <h2 class="anim-left text-4xl md:text-5xl font-bold text-white leading-tight">
            {{ title }}
          </h2>
          <p class="anim-left text-base text-white/55 leading-relaxed">
            {{ description }}
          </p>
        </div>

        <!-- Tech tags -->
        <div ref="tagsRef" class="flex flex-wrap gap-2">
          <span
            v-for="tag in tags"
            :key="typeof tag === 'string' ? tag : tag.label"
            class="anim-tag inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 cursor-default"
            :class="(typeof tag === 'object' && tag.featured)
              ? 'border-primary-400/40 bg-primary-400/10 text-primary-400 hover:bg-primary-400/20 hover:border-primary-400/60 hover:shadow-[0_0_12px_2px_rgba(var(--ui-primary)/0.25)]'
              : 'border-white/10 bg-white/4 text-white/70 hover:border-white/25 hover:bg-white/8 hover:text-white'"
          >
            <UIcon
              v-if="typeof tag === 'object' && tag.icon"
              :name="tag.icon"
              class="w-3.5 h-3.5 shrink-0"
            />
            {{ typeof tag === 'string' ? tag : tag.label }}
          </span>
        </div>
      </div>

      <!-- Right: cards bento -->
      <div class="flex flex-col gap-4">

        <!-- Featured card -->
        <div
          ref="featuredCardRef"
          v-if="featuredCard"
          class="relative rounded-2xl p-5 sm:p-6 flex items-center gap-5 sm:gap-8 border border-white/10 bg-neutral-800/60 backdrop-blur-sm overflow-hidden"
        >
          <Glow :border-radius="16" color="#41b883" :border-width="1" :duration="8" />
          <UIcon name="logos:vue" class="w-14 h-14 sm:w-20 sm:h-20 shrink-0 opacity-90" />
          <div class="flex flex-col gap-2">
            <p class="text-base sm:text-lg font-bold text-white leading-snug">{{ featuredCard.title }}</p>
            <p class="text-sm text-white/55 leading-relaxed">{{ featuredCard.description }}</p>
          </div>
        </div>

        <!-- Regular cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="(card, i) in regularCards"
            :key="i"
            :ref="el => { if (el) regularCardsRef[i] = el as HTMLElement }"
            class="relative rounded-2xl p-6 flex flex-col gap-3 border border-white/8 bg-neutral-800/40 text-white hover:border-white/20 hover:bg-neutral-800/70 transition-all duration-300 overflow-hidden"
          >
            <!-- Decorative number -->
            <span class="absolute top-3 right-4 text-5xl font-black text-white/[0.04] leading-none select-none tabular-nums">
              {{ String(i + 1).padStart(2, '0') }}
            </span>

            <UIcon :name="card.icon" class="w-6 h-6 text-primary-400 relative z-10" />
            <p class="text-base font-bold text-white leading-snug break-words relative z-10">{{ card.title }}</p>
            <p class="text-sm text-white/55 leading-relaxed break-words relative z-10">{{ card.description }}</p>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>
