<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { nextTick, onMounted, onUnmounted, ref, computed, watch } from 'vue'

gsap.registerPlugin(ScrollTrigger)

export interface TechItem {
  name: string
  icon: string
  description: string
}

export interface MainTech {
  name: string
  icon: string
}

export interface TimelineItem {
  title: string
  company: string
  period: string
  description: string
  mainTechs?: MainTech[]
  technologies?: TechItem[]
}

const props = withDefaults(defineProps<{
  badge?: string
  items?: TimelineItem[]
}>(), {
  badge: 'Professional Journey',
  items: () => [
    {
      title: 'Senior Front-end Engineer',
      company: 'TechSolutions Global',
      period: '2021 — Present',
      description: 'Leading a team of 5 developers in architecting a Nuxt-based SaaS platform serving 500k+ monthly active users.',
      technologies: ['Vue', 'Nuxt', 'TypeScript', 'Tailwind', 'Pinia']
    },
    {
      title: 'Full Stack Developer',
      company: 'Creative Dynamics Agency',
      period: '2018 — 2021',
      description: 'Developed high-impact marketing sites and e-commerce solutions using Vue and Node.js.',
      technologies: ['Vue', 'Node.js', 'MongoDB', 'Express', 'Sass']
    },
    {
      title: 'Tech Degree: Telecom & Marketing',
      company: 'Polytechnic Institute',
      period: '2016 — 2018',
      description: 'Dual-specialization focusing on enterprise network infrastructure and digital advertising psychology.',
      technologies: ['Networking', 'Python', 'Marketing', 'Analytics']
    }
  ]
})

const activeIndex = ref(0)
const activeItem = computed(() => props.items?.[activeIndex.value])
const isMobile = ref(false)

const sectionRef = ref<HTMLElement | null>(null)
const itemRefs = ref<HTMLElement[]>([])

// Compute vertical offset so the active item is always centered in the 220px window
const trackOffset = computed(() => {
  const el = itemRefs.value[activeIndex.value]
  if (!el) return 0
  // offsetTop of the item within the track, center it in 220px
  return -el.offsetTop
})

let resizeTimer: ReturnType<typeof setTimeout>

function navigateTo(index: number) {
  if (!sectionRef.value) return
  const totalItems = props.items?.length ?? 0
  if (totalItems < 2) return
  const st = ScrollTrigger.getAll().find(t => t.trigger === sectionRef.value)
  if (!st) return
  const start = st.start
  const end = st.end
  const progress = index / (totalItems - 1)
  const targetY = start + (end - start) * progress
  window.scrollTo({ top: targetY, behavior: 'smooth' })
}

function initAnimation() {
  const items = itemRefs.value
  if (!items.length || !sectionRef.value) return
  if (isMobile.value) return

  const totalItems = items.length

  ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top top',
    end: () => `+=${(totalItems - 1) * window.innerHeight}`,
    pin: true,
    pinSpacing: true,
    onUpdate: (self) => {
      const index = Math.min(
        Math.floor(self.progress * totalItems),
        totalItems - 1
      )
      activeIndex.value = index
    }
  })
}

watch(isMobile, async () => {
  ScrollTrigger.getAll().forEach(t => t.kill())
  activeIndex.value = 0
  await nextTick()
  initAnimation()
  ScrollTrigger.refresh()
}, { flush: 'post' })

onMounted(() => {
  isMobile.value = window.innerWidth < 768

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      isMobile.value = window.innerWidth < 768
    }, 150)
  })
})

defineExpose({ initAnimation })

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(t => t.kill())
  clearTimeout(resizeTimer)
})
</script>

<template>
  <section id="experience" ref="sectionRef" class="px-4 md:px-8 py-12 md:py-24 bg-neutral-950 md:h-screen flex flex-col justify-center">
    <div class="mx-auto w-full max-w-6xl">

      <!-- Badge -->
      <div class="flex justify-center mb-16">
        <span class="text-xs font-bold tracking-widest uppercase text-primary-400">
          {{ badge }}
        </span>
      </div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start md:items-center">

        <!-- Left: technology cards — desktop only -->
        <div class="hidden md:flex flex-col gap-6">
          <Transition name="fade" mode="out-in">
            <div :key="activeIndex" class="flex flex-col gap-4">
              <!-- Main techs title -->
              <div v-if="activeItem?.mainTechs?.length" class="flex flex-col gap-2">
                <span class="text-xs font-semibold tracking-widest uppercase text-neutral-600">{{ $t('timeline.mainStack') }}</span>
                <div class="flex items-center gap-3 flex-wrap">
                  <template v-for="(tech, i) in activeItem.mainTechs" :key="tech.name">
                    <div class="flex items-center gap-1.5">
                      <UIcon :name="tech.icon" class="w-5 h-5 text-white/70 shrink-0" />
                      <span class="text-3xl font-bold text-white">{{ tech.name }}</span>
                    </div>
                    <span v-if="i < activeItem.mainTechs.length - 1" class="text-3xl font-bold text-white/25">·</span>
                  </template>
                </div>
              </div>

              <UTooltip :delay-duration="100" :arrow="false" :content="{ side: 'top', align: 'center', sideOffset: 4 }" :ui="{ content: 'h-auto ring-0 rounded-xl bg-neutral-900 border border-white/10 p-4 w-72' }">
                <div class="flex flex-col gap-3 overflow-hidden cursor-help">
                <!-- Row 1: first half, moves left -->
                <Marquee :duration="20" pause-on-hover class="[--gap:12px]">
                  <div
                    v-for="tech in (activeItem?.technologies ?? []).slice(0, Math.ceil((activeItem?.technologies ?? []).length / 2))"
                    :key="tech.name"
                    class="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col gap-3 w-64 shrink-0"
                  >
                    <div class="flex items-center gap-3">
                      <UIcon :name="tech.icon" class="w-7 h-7 shrink-0" />
                      <span class="text-base font-semibold text-white">{{ tech.name }}</span>
                    </div>
                    <p class="text-sm text-white/50 leading-relaxed">{{ tech.description }}</p>
                  </div>
                </Marquee>
                <!-- Row 2: second half, moves right -->
                <Marquee :duration="20" :reverse="true" pause-on-hover class="[--gap:12px]">
                  <div
                    v-for="tech in (activeItem?.technologies ?? []).slice(Math.ceil((activeItem?.technologies ?? []).length / 2))"
                    :key="tech.name"
                    class="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col gap-3 w-64 shrink-0"
                  >
                    <div class="flex items-center gap-3">
                      <UIcon :name="tech.icon" class="w-7 h-7 shrink-0" />
                      <span class="text-base font-semibold text-white">{{ tech.name }}</span>
                    </div>
                    <p class="text-sm text-white/50 leading-relaxed">{{ tech.description }}</p>
                  </div>
                </Marquee>
              </div>

                <template #content>
                  <div class="flex flex-col gap-2 max-h-52 overflow-y-auto">
                    <p class="text-xs font-semibold tracking-widest uppercase text-white/40">{{ $t('timeline.allTechs') }}</p>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="tech in (activeItem?.technologies ?? [])"
                        :key="tech.name"
                        class="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/70"
                      >
                        <UIcon :name="tech.icon" class="w-3.5 h-3.5 shrink-0" />
                        {{ tech.name }}
                      </span>
                    </div>
                  </div>
                </template>
              </UTooltip>
            </div>
          </Transition>
        </div>

        <!-- Right: Timeline entries -->
        <div class="flex flex-col gap-4">

          <!-- Progress indicator — desktop only -->
          <div class="hidden md:flex items-center gap-3 pl-8">
            <div class="flex gap-1.5">
              <div
                v-for="(_, i) in items"
                :key="i"
                class="h-1 rounded-full transition-all duration-500 cursor-pointer"
                :class="i === activeIndex
                  ? 'w-6 bg-primary-400'
                  : i < activeIndex ? 'w-2 bg-primary-400/40' : 'w-2 bg-white/15'"
                @click="navigateTo(i)"
              />
            </div>
            <span class="text-xs text-white/40 tabular-nums">
              {{ activeIndex + 1 }} / {{ items?.length }}
            </span>
          </div>

          <!-- Clipping window -->
          <div
            class="relative md:overflow-hidden"
            :style="isMobile ? {} : { height: '75vh' }"
          >

            <!-- Vertical line -->
            <div class="absolute left-8 top-0 bottom-0 w-px bg-white/10 z-10" />

          <!-- Sliding track -->
          <div
            :class="isMobile ? 'relative w-full' : 'absolute w-full pt-8 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]'"
            :style="isMobile ? {} : { transform: `translateY(${trackOffset}px)` }"
          >
            <div
              v-for="(item, i) in items"
              :key="i"
              :ref="el => { if (el) itemRefs[i] = el as HTMLElement }"
              class="relative pl-14 pr-10 pb-12 last:pb-0 transition-all duration-500 origin-left"
              :class="isMobile ? 'opacity-100' : (activeIndex === i
                ? 'opacity-100 blur-0'
                : 'opacity-25 blur-[1px]')"
            >
              <!-- Dot -->
              <div
                class="absolute left-8 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full border-2 transition-all duration-500"
                :class="activeIndex === i
                  ? 'border-primary-400 bg-primary-400/20 scale-125'
                  : 'border-white/20 bg-neutral-950'"
              />

              <!-- Period -->
              <p class="text-sm text-white/40 mb-3">
                {{ item.period }}
              </p>

              <!-- Title -->
              <h3
                class="text-xl font-bold mb-1 text-white transition-all duration-500 origin-left inline-block"
                :class="!isMobile && activeIndex === i ? 'scale-110' : 'scale-100'"
              >
                {{ item.title }}
              </h3>

              <!-- Company -->
              <p class="text-xs font-bold tracking-widest uppercase text-primary-400 mb-3">
                {{ item.company }}
              </p>

              <!-- Description -->
              <p class="text-sm leading-relaxed text-white/70">
                {{ item.description }}
              </p>

              <!-- Mobile tech badges -->
              <div v-if="isMobile && item.technologies?.length" class="flex flex-wrap gap-2 mt-4">
                <span
                  v-for="tech in item.technologies"
                  :key="tech.name"
                  class="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/60"
                >
                  <UIcon :name="tech.icon" class="w-3.5 h-3.5 shrink-0" />
                  {{ tech.name }}
                </span>
              </div>
            </div>
          </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
