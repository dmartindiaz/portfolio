<script setup lang="ts">
import {
  AnimatedModal,
  AnimatedModalBody,
  AnimatedModalContent,
  AnimatedModalFooter
} from '~/components/animated-modal'

export interface ProjectItem {
  title: string
  description: string
  /** Short role label shown in the modal header */
  role?: string
  /** Period shown under the role, e.g. 'Mar 2024 – Present' */
  period?: string
  /** Key highlights shown as a bullet list inside the modal */
  highlights?: string[]
  /** Extended description shown inside the modal only */
  details?: string
  tags?: string[]
  image?: string
  /** 'featured' spans 2 columns, 'default' spans 1 */
  size?: 'default' | 'featured'
  /** Optional tint color class applied over the image, e.g. 'bg-teal-900/40' */
  tint?: string
  href?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  docsCta?: { label: string; href: string }
  /** If true, hides the footer CTAs inside the modal */
  hideModalCtas?: boolean
}

withDefaults(defineProps<{
  badge?: string
  title?: string
  ctaLabel?: string
  ctaHref?: string
  /** Label for the "more info" button on each card */
  moreInfoLabel?: string
  items?: ProjectItem[]
}>(), {
  badge: 'Portfolio',
  title: 'Featured Lab.',
  ctaLabel: 'All Projects',
  ctaHref: '#',
  moreInfoLabel: 'Más información',
  items: () => [
    {
      title: 'NexGen Analytics Platform',
      description: 'Enterprise-grade data orchestration dashboard with real-time streaming.',
      tags: ['Nuxt 3', 'TypeScript'],
      size: 'featured',
      tint: 'bg-neutral-900/60'
    },
    {
      title: 'Aura E-Commerce',
      description: 'Headless retail experience with motion-heavy transitions.',
      tags: ['Vue 3'],
      size: 'default',
      tint: 'bg-teal-900/50'
    },
    {
      title: 'Architect UI Kit',
      description: 'A proprietary design system for high-performance apps.',
      tags: [],
      size: 'default',
      tint: 'bg-neutral-900/60'
    },
    {
      title: 'MarketSense Engine',
      description: 'Marketing automation tool leveraging AI to predict customer behavior.',
      tags: [],
      size: 'featured',
      tint: 'bg-neutral-900/50'
    }
  ]
})
</script>

<template>
  <section id="projects" class="relative px-8 py-24 bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
    <!-- Blobs -->
    <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div class="absolute left-[10%] top-[20%] w-[500px] h-[500px] rounded-full bg-primary-500/10 blur-3xl" />
      <div class="absolute left-[65%] top-[50%] w-[420px] h-[420px] rounded-full bg-neutral-400/10 blur-3xl" />
    </div>

    <div class="relative z-10 mx-auto w-full max-w-6xl">

      <!-- Header -->
      <div class="flex items-end justify-between mb-10">
        <div class="flex flex-col gap-2">
          <span class="text-xs font-bold tracking-widest uppercase text-primary-400">
            {{ badge }}
          </span>
          <h2 class="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white leading-tight">
            {{ title }}
          </h2>
        </div>
      </div>

      <!-- Bento grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 lg:auto-rows-[320px] gap-4">
        <AnimatedModal
          v-for="(item, i) in items"
          :key="i"
        >
          <template #default="{ openModal }">
            <!-- ── Card ───────────────────────────────────────────── -->
            <div
              class="group relative rounded-2xl overflow-hidden cursor-pointer min-h-[280px] lg:min-h-0"
              :class="[
                item.size === 'featured' ? 'lg:col-span-2' : 'lg:col-span-1',
                (i === 0 || i === 3) ? 'border border-transparent' : 'border border-neutral-200 dark:border-white/8'
              ]"
            >
              <!-- Glow on first and fourth card -->
              <Glow
                v-if="i === 0 || i === 3"
                class="z-50"
                :border-radius="16"
                color="#41b883"
                :border-width="1"
                :duration="8"
              />
              <!-- Background image -->
              <div v-if="item.image" class="absolute inset-0 z-0">
                <img
                  :src="item.image"
                  :alt="item.title"
                  class="w-full h-full object-cover object-center scale-105 transition-all duration-700 group-hover:scale-100 brightness-[0.85] saturate-[0.6] dark:brightness-[0.6] dark:saturate-[0.3] group-hover:brightness-[0.95] group-hover:saturate-[0.75] dark:group-hover:brightness-[0.75] dark:group-hover:saturate-[0.5]"
                >
                <div class="absolute inset-0 bg-primary-500/20 mix-blend-overlay" />
                <div class="absolute inset-0 opacity-[0.04]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E'); background-size: 256px 256px;" />
              </div>

              <!-- Tint / base bg (dark only) -->
              <div
                class="absolute inset-0 z-10 transition-opacity duration-300 group-hover:opacity-80 hidden dark:block"
                :class="item.tint ?? 'bg-neutral-900/70'"
              />
              <!-- Light mode overlay -->
              <div class="absolute inset-0 z-10 bg-white/80 dark:hidden" />

              <!-- Bottom gradient (dark only) -->
              <div class="absolute inset-x-0 bottom-0 z-20 h-2/3 bg-gradient-to-t from-black/80 to-transparent hidden dark:block" />

              <!-- Content -->
              <div class="absolute inset-x-0 bottom-0 z-30 p-6 flex flex-col gap-2">
                <!-- Tags -->
                <div v-if="item.tags?.length" class="flex flex-wrap gap-2 mb-1">
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wider uppercase bg-primary-500/20 dark:bg-primary-400/15 text-primary-700 dark:text-primary-400 border border-primary-500/40 dark:border-primary-400/25"
                  >
                    {{ tag }}
                  </span>
                </div>

                <h3 class="text-xl font-mono font-bold text-neutral-900 dark:text-white leading-snug drop-shadow-none dark:drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">{{ item.title }}</h3>
                <p class="text-sm text-neutral-600 dark:text-white/70 leading-relaxed">{{ item.description }}</p>

                <!-- More info -->
                <div class="mt-2">
                  <UButton
                    color="primary"
                    :leading-icon="'heroicons:information-circle'"
                    @click.stop="openModal()"
                  >
                    {{ moreInfoLabel }}
                  </UButton>
                </div>
              </div>

              <!-- Hover border glow (only on non-Glow cards) -->
              <div
                v-if="i !== 0 && i !== 3"
                class="absolute inset-0 z-40 rounded-2xl ring-1 ring-inset ring-neutral-200 dark:ring-white/10 transition-all duration-300 group-hover:ring-primary-400/30 pointer-events-none"
              />
            </div>

            <!-- ── Modal ──────────────────────────────────────────── -->
            <AnimatedModalBody content-class="overflow-y-auto">
              <!-- Modal content -->
              <AnimatedModalContent>
                <div class="flex flex-col gap-6">

                  <!-- Header: role + period + tags -->
                  <div class="flex flex-col gap-3">
                    <div class="flex flex-wrap items-center gap-2">
                      <span v-if="item.role" class="text-xs font-bold tracking-widest uppercase text-primary-400">
                        {{ item.role }}
                      </span>
                      <span v-if="item.role && item.period" class="text-white/20 text-xs">·</span>
                      <span v-if="item.period" class="text-xs text-white/40 font-medium">
                        {{ item.period }}
                      </span>
                    </div>

                    <h2 class="text-2xl font-bold text-white leading-snug">{{ item.title }}</h2>

                    <div v-if="item.tags?.length" class="flex flex-wrap gap-2">
                      <span
                        v-for="tag in item.tags"
                        :key="tag"
                        class="px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wider uppercase bg-primary-400/15 text-primary-400 border border-primary-400/25"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>

                  <!-- Description -->
                  <p class="text-sm text-white/60 leading-relaxed">
                    {{ item.description }}
                  </p>

                  <!-- Highlights -->
                  <div v-if="item.highlights?.length" class="flex flex-col gap-3 border-t border-white/8 pt-5">
                    <div
                      v-for="(h, hi) in item.highlights"
                      :key="hi"
                      class="flex items-start gap-3"
                    >
                      <span class="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-primary-400/15 border border-primary-400/25 flex items-center justify-center">
                        <UIcon name="heroicons:check" class="w-3 h-3 text-primary-400" />
                      </span>
                      <p class="text-sm text-white/60 leading-relaxed">{{ h }}</p>
                    </div>
                  </div>

                  <!-- Extra details -->
                  <p v-if="item.details" class="text-sm text-white/40 leading-relaxed border-t border-white/8 pt-4">
                    {{ item.details }}
                  </p>

                </div>
              </AnimatedModalContent>

              <!-- Footer CTAs -->
              <AnimatedModalFooter
                v-if="!item.hideModalCtas && (item.primaryCta || item.secondaryCta || item.docsCta)"
                class="dark:bg-neutral-900 gap-2"
              >
                <a
                  v-if="item.docsCta"
                  :href="item.docsCta.href"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/20 text-white/70 text-sm font-bold hover:border-white/40 hover:text-white transition-colors duration-200 mr-auto"
                >
                  <UIcon name="heroicons:book-open" class="w-4 h-4" />
                  {{ item.docsCta.label }}
                </a>
                <a
                  v-if="item.secondaryCta"
                  :href="item.secondaryCta.href"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/20 text-white/70 text-sm font-bold hover:border-white/40 hover:text-white transition-colors duration-200"
                >
                  {{ item.secondaryCta.label }}
                  <UIcon name="heroicons:arrow-top-right-on-square" class="w-4 h-4" />
                </a>
                <a
                  v-if="item.primaryCta"
                  :href="item.primaryCta.href"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-400 text-neutral-950 text-sm font-bold hover:bg-primary-300 transition-colors duration-200"
                >
                  {{ item.primaryCta.label }}
                  <UIcon name="heroicons:arrow-top-right-on-square" class="w-4 h-4" />
                </a>
              </AnimatedModalFooter>
            </AnimatedModalBody>
          </template>
        </AnimatedModal>
      </div>

    </div>
  </section>
</template>
