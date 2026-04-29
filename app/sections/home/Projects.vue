<script setup lang="ts">
export interface ProjectItem {
  title: string
  description: string
  role?: string
  period?: string
  highlights?: string[]
  details?: string
  tags?: string[]
  image?: string
  size?: 'default' | 'featured'
  tint?: string
  href?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  docsCta?: { label: string; href: string }
  hideModalCtas?: boolean
  credentials?: { user: string; password: string; note?: string }
  logo?: string
}

const props = withDefaults(defineProps<{
  badge?: string
  title?: string
  ctaLabel?: string
  ctaHref?: string
  moreInfoLabel?: string
  items?: ProjectItem[]
}>(), {
  badge: 'Portfolio',
  title: 'Featured Lab.',
  ctaLabel: 'All Projects',
  ctaHref: '#',
  moreInfoLabel: 'Más información',
  items: () => []
})

const openStates = computed(() => props.items?.map(() => ref(false)) ?? [])
</script>

<template>
  <section id="projects" class="relative px-8 py-24 bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
    <!-- Blobs -->
    <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div class="absolute left-[10%] top-[20%] w-[500px] h-[500px] rounded-full bg-primary-500/4 dark:bg-primary-500/10 blur-3xl" />
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
        <template
          v-for="(item, i) in items"
          :key="i"
        >
          <!-- ── Card ───────────────────────────────────────────── -->
          <div
            class="group relative rounded-2xl overflow-hidden cursor-pointer flex flex-col bg-white/30 dark:bg-white/5 backdrop-blur-md border border-neutral-200/50 dark:border-transparent min-h-64 lg:min-h-0"
            :class="[
              item.size === 'featured' ? 'lg:col-span-2' : 'lg:col-span-1',
              (i === 0) ? 'border border-transparent' : 'border border-neutral-200 dark:border-white/10'
            ]"
            @click="openStates[i].value = true"
          >
            <!-- Glow on first card only -->
            <Glow
              v-if="i === 0"
              class="z-50"
              :border-radius="16"
              color="#41b883"
              :border-width="1"
              :duration="8"
            />

            <!-- Subtle accent blob -->
            <div class="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full bg-primary-500/8 blur-3xl" />

            <!-- Content -->
            <div class="relative z-10 p-6 flex flex-col gap-4 flex-1 min-h-0">
              <!-- Logo -->
              <div class="h-14 flex items-center shrink-0">
                <img
                  v-if="item.logo"
                  :src="item.logo"
                  :alt="item.title + ' logo'"
                  class="h-full w-auto object-contain object-left grayscale mix-blend-multiply opacity-70 dark:invert dark:mix-blend-screen dark:opacity-55 transition-opacity duration-300 group-hover:opacity-90 dark:group-hover:opacity-70"
                  :class="item.size === 'featured' ? 'max-w-[260px]' : 'max-w-[200px]'"
                  draggable="false"
                />
              </div>

              <!-- Title -->
              <h3 class="text-xl font-mono font-bold text-neutral-900 dark:text-white leading-snug shrink-0">{{ item.title }}</h3>

              <!-- Description -->
              <p class="text-sm text-neutral-600 dark:text-white/70 leading-relaxed flex-1 min-h-0 overflow-hidden line-clamp-4">{{ item.description }}</p>

              <!-- Tags + CTA -->
              <div class="flex flex-col gap-3 shrink-0 pt-2 border-t border-neutral-200/60 dark:border-white/8">
                <div v-if="item.tags?.length" class="flex flex-wrap gap-1.5">
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wider uppercase bg-neutral-200/80 dark:bg-white/8 text-neutral-500 dark:text-white/40 border border-neutral-300/60 dark:border-white/10"
                  >
                    <UIcon
                      :name="({
                        'Nuxt': 'logos:nuxt-icon',
                        'Vue 3': 'logos:vue',
                        'Vue': 'logos:vue',
                        'Tailwind CSS': 'logos:tailwindcss-icon',
                        'TypeScript': 'logos:typescript-icon',
                        'OpenAPI': 'logos:openapi-icon',
                        'Ionic': 'logos:ionic-icon',
                        'iOS': 'logos:apple',
                        'Android': 'logos:android-icon',
                        'Angular': 'logos:angular-icon',
                        'NestJS': 'logos:nestjs',
                        'Docker': 'logos:docker-icon',
                      } as Record<string,string>)[tag] ?? 'heroicons:code-bracket'"
                      class="w-3 h-3 shrink-0 grayscale"
                    />
                    {{ tag }}
                  </span>
                </div>
                <div>
                  <UButton
                    color="primary"
                    :leading-icon="'heroicons:information-circle'"
                    @click.stop="openStates[i].value = true"
                  >
                    {{ moreInfoLabel }}
                  </UButton>
                </div>
              </div>
            </div>

            <!-- Hover border glow (only on non-Glow cards) -->
            <div
              v-if="i !== 0 && i !== 3"
              class="absolute inset-0 z-40 rounded-2xl ring-1 ring-inset ring-neutral-200 dark:ring-white/10 transition-all duration-300 group-hover:ring-primary-400/30 pointer-events-none"
            />
          </div>

          <!-- ── Modal ──────────────────────────────────────────── -->
          <UModal v-model:open="openStates[i].value" :ui="{ content: 'max-w-[min(720px,calc(100vw-32px))] max-h-[85vh] flex flex-col' }">
            <template #content>
              <!-- Close button -->
              <button
                type="button"
                class="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors"
                aria-label="Close"
                @click="openStates[i].value = false"
              >
                <UIcon name="heroicons:x-mark" class="w-5 h-5" />
              </button>

              <!-- Scrollable body -->
              <div class="flex-1 overflow-y-auto p-8 md:p-10">
                <div class="flex flex-col gap-6">

                  <!-- Header: role + period + logo -->
                  <div class="flex flex-col gap-3">
                    <div class="flex flex-wrap items-center gap-2">
                      <span v-if="item.role" class="text-xs font-bold tracking-widest uppercase text-primary-600 dark:text-primary-400">
                        {{ item.role }}
                      </span>
                      <span v-if="item.role && item.period" class="text-neutral-300 dark:text-white/20 text-xs">·</span>
                      <span v-if="item.period" class="text-xs text-neutral-500 dark:text-white/40 font-medium">
                        {{ item.period }}
                      </span>
                    </div>

                    <div class="flex items-center gap-4">
                      <img
                        v-if="item.logo"
                        :src="item.logo"
                        :alt="item.title + ' logo'"
                        class="h-8 w-auto object-contain grayscale mix-blend-multiply opacity-60 dark:invert dark:mix-blend-screen dark:opacity-40"
                        draggable="false"
                      />
                      <h2 class="text-2xl font-bold text-neutral-900 dark:text-white leading-snug">{{ item.title }}</h2>
                    </div>

                    <div v-if="item.tags?.length" class="flex flex-wrap gap-2">
                      <span
                        v-for="tag in item.tags"
                        :key="tag"
                        class="px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wider uppercase bg-primary-500/15 dark:bg-primary-400/15 text-primary-700 dark:text-primary-400 border border-primary-500/30 dark:border-primary-400/25"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>

                  <!-- Description -->
                  <p class="text-sm text-neutral-600 dark:text-white/60 leading-relaxed">
                    {{ item.description }}
                  </p>

                  <!-- Highlights -->
                  <div v-if="item.highlights?.length" class="flex flex-col gap-3 border-t border-neutral-200 dark:border-white/8 pt-5">
                    <div
                      v-for="(h, hi) in item.highlights"
                      :key="hi"
                      class="flex items-start gap-3"
                    >
                      <span class="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-primary-500/15 dark:bg-primary-400/15 border border-primary-500/30 dark:border-primary-400/25 flex items-center justify-center">
                        <UIcon name="heroicons:check" class="w-3 h-3 text-primary-600 dark:text-primary-400" />
                      </span>
                      <p class="text-sm text-neutral-600 dark:text-white/60 leading-relaxed">{{ h }}</p>
                    </div>
                  </div>

                  <!-- Demo credentials -->
                  <div v-if="item.credentials" class="border-t border-neutral-200 dark:border-white/8 pt-4 flex flex-col gap-2">
                    <div class="flex items-center gap-2 mb-1">
                      <UIcon name="heroicons:key" class="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                      <span class="text-xs font-bold tracking-widest uppercase text-neutral-500 dark:text-white/40">Demo credentials</span>
                    </div>
                    <div class="rounded-lg bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/8 px-4 py-3 flex flex-col gap-2 font-mono">
                      <div class="flex items-center gap-3">
                        <span class="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-white/30 w-16 shrink-0">User</span>
                        <span class="text-xs text-neutral-700 dark:text-white/70 select-all">{{ item.credentials.user }}</span>
                      </div>
                      <div class="flex items-center gap-3">
                        <span class="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-white/30 w-16 shrink-0">Pass</span>
                        <span class="text-xs text-neutral-700 dark:text-white/70 select-all">{{ item.credentials.password }}</span>
                      </div>
                    </div>
                    <p v-if="item.credentials.note" class="text-[11px] text-neutral-400 dark:text-white/30 leading-relaxed">
                      {{ item.credentials.note }}
                    </p>
                  </div>

                  <!-- Extra details -->
                  <p v-if="item.details" class="text-sm text-neutral-500 dark:text-white/40 leading-relaxed border-t border-neutral-200 dark:border-white/8 pt-4">
                    {{ item.details }}
                  </p>

                </div>
              </div>

              <!-- Footer CTAs -->
              <div
                v-if="!item.hideModalCtas && (item.primaryCta || item.secondaryCta || item.docsCta)"
                class="flex justify-end bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 p-4 gap-2 flex-wrap shrink-0"
              >
                <a
                  v-if="item.docsCta"
                  :href="item.docsCta.href"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-neutral-300 dark:border-white/20 text-neutral-600 dark:text-white/70 text-sm font-bold hover:border-neutral-400 dark:hover:border-white/40 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 mr-auto shrink-0"
                >
                  <UIcon name="heroicons:book-open" class="w-4 h-4 shrink-0" />
                  {{ item.docsCta.label }}
                </a>
                <div class="flex items-center gap-2 shrink-0">
                  <a
                    v-if="item.secondaryCta"
                    :href="item.secondaryCta.href"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-neutral-300 dark:border-white/20 text-neutral-600 dark:text-white/70 text-sm font-bold hover:border-neutral-400 dark:hover:border-white/40 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200"
                  >
                    {{ item.secondaryCta.label }}
                    <UIcon name="heroicons:arrow-top-right-on-square" class="w-4 h-4 shrink-0" />
                  </a>
                  <a
                    v-if="item.primaryCta"
                    :href="item.primaryCta.href"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-400 text-neutral-950 text-sm font-bold hover:bg-primary-300 transition-colors duration-200"
                  >
                    {{ item.primaryCta.label }}
                    <UIcon name="heroicons:arrow-top-right-on-square" class="w-4 h-4 shrink-0" />
                  </a>
                </div>
              </div>
            </template>
          </UModal>
        </template>
      </div>

    </div>
  </section>
</template>
