<script setup lang="ts">
const { t } = useI18n()

const form = reactive({
  name: '',
  email: '',
  message: ''
})

type Status = 'idle' | 'sending' | 'success' | 'error'
const status = ref<Status>('idle')

function encode(data: Record<string, string>) {
  return Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
}

async function handleSubmit() {
  status.value = 'sending'
  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': 'contact',
        'bot-field': '',
        name: form.name,
        email: form.email,
        message: form.message
      })
    })
    if (res.ok) {
      status.value = 'success'
      form.name = ''
      form.email = ''
      form.message = ''
    } else {
      status.value = 'error'
    }
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <section
    id="contact"
    class="relative px-8 py-24 bg-neutral-50 dark:bg-neutral-900"
  >
    <div class="mx-auto w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
      <!-- Left: form -->
      <div class="flex flex-col gap-8">
        <div class="flex flex-col gap-4">
          <span class="text-xs font-bold tracking-widest uppercase text-primary-400">
            {{ t('contact.badge') }}
          </span>
          <h2 class="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white leading-tight">
            {{ t('contact.title') }}
          </h2>
          <p class="text-base text-neutral-500 dark:text-white/55 leading-relaxed">
            {{ t('contact.description') }}
          </p>
        </div>

        <form
          name="contact"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          class="flex flex-col gap-4"
          @submit.prevent="handleSubmit"
        >
          <!-- Honeypot (hidden) -->
          <input
            type="hidden"
            name="form-name"
            value="contact"
          >
          <input
            name="bot-field"
            type="text"
            class="hidden"
          >

          <!-- Name -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-white/40">{{ t('contact.form.name') }}</label>
            <input
              v-model="form.name"
              type="text"
              :placeholder="t('contact.form.namePlaceholder')"
              required
              class="w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-white/5 px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-white/25 focus:outline-none focus:border-primary-400/60 focus:bg-neutral-50 dark:focus:bg-white/8 transition-colors duration-200"
            >
          </div>

          <!-- Email -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-white/40">{{ t('contact.form.email') }}</label>
            <input
              v-model="form.email"
              type="email"
              :placeholder="t('contact.form.emailPlaceholder')"
              required
              class="w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-white/5 px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-white/25 focus:outline-none focus:border-primary-400/60 focus:bg-neutral-50 dark:focus:bg-white/8 transition-colors duration-200"
            >
          </div>

          <!-- Message -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-white/40">{{ t('contact.form.message') }}</label>
            <textarea
              v-model="form.message"
              rows="5"
              :placeholder="t('contact.form.messagePlaceholder')"
              required
              class="w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-white/5 px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-white/25 focus:outline-none focus:border-primary-400/60 focus:bg-neutral-50 dark:focus:bg-white/8 transition-colors duration-200 resize-none"
            />
          </div>

          <!-- Feedback -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
          >
            <p
              v-if="status === 'success'"
              class="flex items-center gap-2 text-sm text-primary-400 font-medium"
            >
              <UIcon
                name="heroicons:check-circle-solid"
                class="w-4 h-4 shrink-0"
              />
              {{ t('contact.form.success') }}
            </p>
            <p
              v-else-if="status === 'error'"
              class="flex items-center gap-2 text-sm text-red-400 font-medium"
            >
              <UIcon
                name="heroicons:exclamation-circle"
                class="w-4 h-4 shrink-0"
              />
              {{ t('contact.form.error') }}
            </p>
          </Transition>

          <button
            type="submit"
            :disabled="status === 'sending' || status === 'success'"
            class="mt-2 self-start inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-400 text-neutral-950 text-sm font-bold hover:bg-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span
              v-if="status === 'sending'"
              class="w-4 h-4 rounded-full border-2 border-neutral-950 border-t-transparent animate-spin"
            />
            <UIcon
              v-else
              name="heroicons:paper-airplane"
              class="w-4 h-4"
            />
            {{ status === 'sending' ? t('contact.form.sending') : t('contact.form.submit') }}
          </button>
        </form>
      </div>

      <!-- Right: contact info -->
      <div class="flex flex-col gap-8 md:pt-24">
        <!-- Contact items -->
        <div class="flex flex-col gap-6">
          <!-- Phone -->
          <a
            href="tel:+34665561897"
            class="group flex items-start gap-4"
          >
            <UIcon
              name="heroicons:phone"
              class="w-5 h-5 mt-0.5 shrink-0 text-neutral-400 dark:text-white/50 group-hover:text-primary-400 transition-colors duration-200"
            />
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-white/30">{{ t('contact.info.phone') }}</span>
              <span class="text-base font-medium text-neutral-900 dark:text-white group-hover:text-primary-400 transition-colors duration-200">665 56 18 97</span>
            </div>
          </a>

          <!-- Email -->
          <a
            href="mailto:dmartindiaz3@gmail.com"
            class="group flex items-start gap-4"
          >
            <UIcon
              name="heroicons:envelope"
              class="w-5 h-5 mt-0.5 shrink-0 text-neutral-400 dark:text-white/50 group-hover:text-primary-400 transition-colors duration-200"
            />
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-white/30">{{ t('contact.info.email') }}</span>
              <span class="text-base font-medium text-neutral-900 dark:text-white group-hover:text-primary-400 transition-colors duration-200">dmartindiaz3@gmail.com</span>
            </div>
          </a>

          <!-- Location -->
          <div class="flex items-start gap-4">
            <UIcon
              name="heroicons:map-pin"
              class="w-5 h-5 mt-0.5 shrink-0 text-neutral-400 dark:text-white/50"
            />
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-white/30">{{ t('contact.info.location') }}</span>
              <span class="text-base font-medium text-neutral-900 dark:text-white">La Unión, Murcia</span>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="w-full h-px bg-neutral-200 dark:bg-white/8" />

        <!-- Social links -->
        <div class="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/dmartindiaz"
            target="_blank"
            rel="noopener"
            class="text-neutral-400 dark:text-white/40 hover:text-primary-400 transition-colors duration-200"
          >
            <UIcon
              name="i-simple-icons-linkedin"
              class="w-5 h-5"
            />
          </a>
          <a
            href="https://github.com/dmartindiaz"
            target="_blank"
            rel="noopener"
            class="text-neutral-400 dark:text-white/40 hover:text-primary-400 transition-colors duration-200"
          >
            <UIcon
              name="i-simple-icons-github"
              class="w-5 h-5"
            />
          </a>
          <a
            href="https://www.npmjs.com/package/nuxt-openapi-hyperfetch"
            target="_blank"
            rel="noopener"
            class="text-neutral-400 dark:text-white/40 hover:text-primary-400 transition-colors duration-200"
          >
            <UIcon
              name="i-simple-icons-npm"
              class="w-5 h-5"
            />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
