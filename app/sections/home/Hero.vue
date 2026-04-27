<script setup lang="ts">
interface Cta {
  label: string
  to?: string
  href?: string
  icon?: string
}

defineProps<{
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
          <em v-if="titleHighlight" class="not-italic italic font-sans text-primary-400 text-5xl md:text-7xl">{{ titleHighlight }}</em>
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
