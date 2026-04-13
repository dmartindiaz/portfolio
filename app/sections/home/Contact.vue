<script setup lang="ts">
const { t } = useI18n()

const form = reactive({
  name: '',
  email: '',
  message: ''
})

function handleSubmit() {
  // TODO: connect to email service
}
</script>

<template>
  <section id="contact" class="relative px-8 py-24 bg-neutral-900">

    <!-- Coming soon overlay -->
    <div class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 backdrop-blur-sm bg-neutral-900/70 pointer-events-none">
      <span class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary-400/30 bg-primary-400/8 text-primary-400 text-sm font-bold tracking-widest uppercase">
        <span class="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
        {{ t('contact.comingSoon') }}
      </span>
    </div>
    <div class="mx-auto w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

      <!-- Left: form -->
      <div class="flex flex-col gap-8">
        <div class="flex flex-col gap-4">
          <span class="text-xs font-bold tracking-widest uppercase text-primary-400">
            {{ t('contact.badge') }}
          </span>
          <h2 class="text-4xl md:text-5xl font-bold text-white leading-tight">
            {{ t('contact.title') }}
          </h2>
          <p class="text-base text-white/55 leading-relaxed">
            {{ t('contact.description') }}
          </p>
        </div>

        <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
          <!-- Name -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold tracking-widest uppercase text-white/40">{{ t('contact.form.name') }}</label>
            <input
              v-model="form.name"
              type="text"
              :placeholder="t('contact.form.namePlaceholder')"
              required
              class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary-400/60 focus:bg-white/8 transition-colors duration-200"
            >
          </div>

          <!-- Email -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold tracking-widest uppercase text-white/40">{{ t('contact.form.email') }}</label>
            <input
              v-model="form.email"
              type="email"
              :placeholder="t('contact.form.emailPlaceholder')"
              required
              class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary-400/60 focus:bg-white/8 transition-colors duration-200"
            >
          </div>

          <!-- Message -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold tracking-widest uppercase text-white/40">{{ t('contact.form.message') }}</label>
            <textarea
              v-model="form.message"
              rows="5"
              :placeholder="t('contact.form.messagePlaceholder')"
              required
              class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary-400/60 focus:bg-white/8 transition-colors duration-200 resize-none"
            />
          </div>

          <button
            type="submit"
            class="mt-2 self-start inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-400 text-neutral-950 text-sm font-bold hover:bg-primary-300 transition-colors duration-200"
          >
            {{ t('contact.form.submit') }}
            <UIcon name="heroicons:paper-airplane" class="w-4 h-4" />
          </button>
        </form>
      </div>

      <!-- Right: contact info -->
      <div class="flex flex-col gap-8 md:pt-24">

        <!-- Contact items -->
        <div class="flex flex-col gap-6">
          <!-- Phone -->
          <a href="tel:+34665561897" class="group flex items-start gap-4">
            <UIcon name="heroicons:phone" class="w-5 h-5 mt-0.5 shrink-0 text-white/50 group-hover:text-primary-400 transition-colors duration-200" />
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-semibold tracking-widest uppercase text-white/30">{{ t('contact.info.phone') }}</span>
              <span class="text-base font-medium text-white group-hover:text-primary-400 transition-colors duration-200">665 56 18 97</span>
            </div>
          </a>

          <!-- Email -->
          <a href="mailto:dmartindiaz3@gmail.com" class="group flex items-start gap-4">
            <UIcon name="heroicons:envelope" class="w-5 h-5 mt-0.5 shrink-0 text-white/50 group-hover:text-primary-400 transition-colors duration-200" />
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-semibold tracking-widest uppercase text-white/30">{{ t('contact.info.email') }}</span>
              <span class="text-base font-medium text-white group-hover:text-primary-400 transition-colors duration-200">dmartindiaz3@gmail.com</span>
            </div>
          </a>

          <!-- Location -->
          <div class="flex items-start gap-4">
            <UIcon name="heroicons:map-pin" class="w-5 h-5 mt-0.5 shrink-0 text-white/50" />
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-semibold tracking-widest uppercase text-white/30">{{ t('contact.info.location') }}</span>
              <span class="text-base font-medium text-white">La Unión, Murcia</span>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="w-full h-px bg-white/8" />

        <!-- Social links -->
        <div class="flex items-center gap-4">
          <a href="https://www.linkedin.com/in/dmartindiaz" target="_blank" rel="noopener" class="text-white/40 hover:text-primary-400 transition-colors duration-200">
            <UIcon name="i-simple-icons-linkedin" class="w-5 h-5" />
          </a>
          <a href="https://github.com/dmartindiaz" target="_blank" rel="noopener" class="text-white/40 hover:text-primary-400 transition-colors duration-200">
            <UIcon name="i-simple-icons-github" class="w-5 h-5" />
          </a>
          <a href="https://www.npmjs.com/package/nuxt-openapi-hyperfetch" target="_blank" rel="noopener" class="text-white/40 hover:text-primary-400 transition-colors duration-200">
            <UIcon name="i-simple-icons-npm" class="w-5 h-5" />
          </a>
        </div>

      </div>
    </div>
  </section>
</template>
