<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const { t } = useI18n()
const { locale, setLocale } = useI18n()

const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const navLinks = computed(() => [
  { label: t('nav.about'), href: '#about' },
  { label: t('nav.experience'), href: '#experience' },
  { label: t('nav.projects'), href: '#projects' },
  { label: t('nav.stack'), href: '#stack' },
  { label: t('nav.contact'), href: '#contact' },
])

function toggleLocale() {
  setLocale(locale.value === 'en' ? 'es' : 'en')
}

function scrollTo(href: string) {
  const el = document.querySelector(href)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <header class="fixed top-6 inset-x-0 z-50 px-4 sm:px-6 pointer-events-none">
    <nav
      class="mx-auto max-w-6xl flex items-center justify-between gap-4 px-4 sm:px-6 py-3 rounded-2xl border transition-all duration-300 pointer-events-auto"
      :class="scrolled
        ? 'bg-white/[0.06] backdrop-blur-xl border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]'
        : 'bg-white/[0.03] backdrop-blur-md border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'"
    >
      <!-- Logo -->
      <a href="#hero" class="shrink-0" @click.prevent="scrollTo('#hero')">
        <img
          src="/home-hero-draw.jpeg"
          alt="Logo"
          class="w-8 h-8 rounded-full object-cover object-center ring-1 ring-white/20"
        >
      </a>

      <!-- Nav links — hidden on mobile -->
      <ul class="hidden md:flex items-center gap-1">
        <li v-for="link in navLinks" :key="link.href">
          <a
            :href="link.href"
            class="px-3 py-1.5 text-sm text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
            @click.prevent="scrollTo(link.href)"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>

      <!-- Right: locale toggle -->
      <button
        class="text-xs font-bold tracking-widest uppercase text-white/40 hover:text-white transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-white/5"
        @click="toggleLocale"
      >
        {{ locale === 'en' ? 'ES' : 'EN' }}
      </button>
    </nav>
  </header>
</template>
