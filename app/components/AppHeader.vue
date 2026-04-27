<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const { t } = useI18n()
const { locale, setLocale } = useI18n()
const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const scrolled = ref(false)
const mobileOpen = ref(false)

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

function scrollTo(href: string) {
  const el = document.querySelector(href)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  mobileOpen.value = false
}
</script>

<template>
  <header class="fixed top-6 inset-x-0 z-50 px-4 sm:px-6 pointer-events-none">
    <nav
      class="mx-auto max-w-6xl flex items-center justify-between gap-4 px-4 sm:px-6 py-3 rounded-2xl border transition-all duration-300 pointer-events-auto"
      :class="scrolled
        ? 'bg-white/40 dark:bg-white/6 backdrop-blur-xl border-neutral-200/80 dark:border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]'
        : 'bg-white/25 dark:bg-white/3 backdrop-blur-md border-neutral-200/40 dark:border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'"
    >
      <!-- Logo -->
      <a
        href="#hero"
        class="shrink-0"
        @click.prevent="scrollTo('#hero')"
      >
        <img
          src="/home-hero-draw.jpeg"
          alt="Logo"
          class="w-8 h-8 rounded-full object-cover object-center ring-1 ring-white/20"
        >
      </a>

      <!-- Nav links — hidden on mobile -->
      <ul class="hidden md:flex items-center gap-1">
        <li
          v-for="link in navLinks"
          :key="link.href"
        >
          <a
            :href="link.href"
            class="px-3 py-1.5 text-sm text-neutral-500 dark:text-white/50 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200"
            @click.prevent="scrollTo(link.href)"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>

      <!-- Right: controls -->
      <div class="flex items-center gap-2">
        <!-- Locale toggle -->
        <div class="flex items-center gap-0.5 rounded-lg border border-neutral-200 dark:border-white/10 p-0.5 bg-neutral-100/50 dark:bg-white/3">
          <button
            v-for="lang in ['en', 'es']"
            :key="lang"
            class="px-2.5 py-1 text-xs font-bold tracking-widest uppercase rounded-md transition-all duration-200"
            :class="locale === lang
              ? 'bg-neutral-200 dark:bg-white/15 text-neutral-900 dark:text-white shadow-sm'
              : 'text-neutral-400 dark:text-white/35 hover:text-neutral-700 dark:hover:text-white/60'"
            @click="setLocale(lang as 'en' | 'es')"
          >
            {{ lang }}
          </button>
        </div>

        <!-- Color mode toggle -->
        <button
          class="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 overflow-hidden"
          :class="colorMode.value === 'dark'
            ? 'hover:bg-white/10'
            : 'hover:bg-neutral-200'"
          :title="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleColorMode"
        >
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-50 rotate-90"
            enter-to-class="opacity-100 scale-100 rotate-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 rotate-0"
            leave-to-class="opacity-0 scale-50 -rotate-90"
            mode="out-in"
          >
            <span
              v-if="colorMode.value === 'dark'"
              key="moon"
              class="text-lg leading-none select-none"
            >🌙</span>
            <span
              v-else
              key="sun"
              class="text-lg leading-none select-none"
            >☀️</span>
          </Transition>
        </button>

        <!-- Hamburger — mobile only -->
        <button
          class="md:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
          :class="colorMode.value === 'dark' ? 'hover:bg-white/10' : 'hover:bg-neutral-200'"
          :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
          @click="mobileOpen = !mobileOpen"
        >
          <UIcon
            :name="mobileOpen ? 'ph:x-bold' : 'ph:list-bold'"
            class="text-xl text-neutral-700 dark:text-white/70"
          />
        </button>
      </div>
    </nav>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileOpen"
        class="md:hidden mx-auto max-w-6xl mt-2 rounded-2xl border px-4 py-3 pointer-events-auto"
        :class="scrolled
          ? 'bg-white/50 dark:bg-neutral-900/90 backdrop-blur-xl border-neutral-200/80 dark:border-white/15'
          : 'bg-white/35 dark:bg-neutral-900/80 backdrop-blur-md border-neutral-200/40 dark:border-white/8'"
      >
        <ul class="flex flex-col gap-1">
          <li
            v-for="link in navLinks"
            :key="link.href"
          >
            <a
              :href="link.href"
              class="flex items-center px-3 py-2.5 text-sm font-medium text-neutral-600 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200"
              @click.prevent="scrollTo(link.href)"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div>
    </Transition>
  </header>
</template>
