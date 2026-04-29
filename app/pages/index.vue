<script setup lang="ts">
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { t, locale } = useI18n()

definePageMeta({
  layout: 'default'
})

const seoTitle = computed(() =>
  locale.value === 'es'
    ? 'Daniel Martín Díaz — Senior Frontend Engineer Vue / Nuxt'
    : 'Daniel Martín Díaz — Senior Frontend Engineer Vue / Nuxt'
)

const seoDescription = computed(() =>
  locale.value === 'es'
    ? 'Senior Frontend Engineer especializado en Vue y Nuxt. Combino ingeniería y visión de producto para construir sistemas frontend escalables con más de 6 años de experiencia.'
    : 'Senior Frontend Engineer specialised in Vue and Nuxt. Engineering meets product vision — scalable, maintainable frontend systems with 6+ years of expertise.'
)

const ogLocale = computed(() => locale.value === 'es' ? 'es_ES' : 'en_US')

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: 'https://dmartindiaz.com/home-hero.jpeg',
  ogImageAlt: 'Daniel Martín Díaz — Senior Frontend Engineer',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogType: 'website',
  ogSiteName: 'Daniel Martín Díaz',
  ogUrl: 'https://dmartindiaz.com',
  ogLocale: ogLocale,
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: 'https://dmartindiaz.com/home-hero.jpeg',
  robots: 'index, follow',
  author: 'Daniel Martín Díaz',
  themeColor: '#0c0d0e'
})

const meRef = ref()
const timelineRef = ref()
const dryRef = ref()
const stackRef = ref()
const companiesRef = ref()
const heroRef = ref()

const appReady = ref(false)
const loadingDone = ref(false)

onMounted(async () => {
  await nextTick()
  meRef.value?.initAnimations()
  timelineRef.value?.initAnimation()
  dryRef.value?.initAnimation()
  stackRef.value?.initAnimations()
  companiesRef.value?.initAnimations()
  ScrollTrigger.refresh()
  appReady.value = true
})
</script>

<template>
  <AppLoading
    v-if="!loadingDone"
    :ready="appReady"
    @done="() => { loadingDone = true; heroRef?.initAnimation() }"
  />
  <AppHeader />

  <HomeHero
    ref="heroRef"
    :badge="t('hero.badge')"
    :title-before="t('hero.titleBefore')"
    :title-highlight="t('hero.titleHighlight')"
    :title-after="t('hero.titleAfter')"
    :description="t('hero.description')"
    :primary-cta="{ label: t('hero.primaryCta'), href: 'https://canva.link/f6me6jeuz1pcrxu', icon: 'heroicons:document-text' }"
    :secondary-cta="{ label: t('hero.secondaryCta'), href: 'https://linkedin.com/in/dmartindiaz', icon: 'heroicons:arrow-top-right-on-square' }"
    :location="t('hero.location')"
    :experience="t('hero.experience')"
    primary-img="/home-hero.jpeg"
    secondary-img="/home-hero-draw.jpeg"
  />

  <HomeMe
    ref="meRef"
    :badge="t('me.badge')"
    :title="t('me.title')"
    :body="t('me.body')"
    :highlights="[
      { text: t('me.highlights[0]') },
      { text: t('me.highlights[1]') }
    ]"
    :cards="[
      {
        icon: 'heroicons:signal',
        title: t('me.cards.telecom.title'),
        description: t('me.cards.telecom.description')
      },
      {
        icon: 'heroicons:megaphone',
        title: t('me.cards.marketing.title'),
        description: t('me.cards.marketing.description')
      }
    ]"
  />

  <HomeTimeline
    ref="timelineRef"
    :items="[
      {
        title: t('timeline.items.0.title'),
        company: t('timeline.items.0.company'),
        period: t('timeline.items.0.period'),
        description: t('timeline.items.0.description'),
        mainTechs: [
          { name: 'Nuxt', icon: 'logos:nuxt-icon' },
          { name: 'Java', icon: 'logos:java' }
        ],
        technologies: [
          { name: 'Nuxt', icon: 'logos:nuxt-icon', description: t('tech.nuxt') },
          { name: 'Vue 3', icon: 'logos:vue', description: t('tech.vue3') },
          { name: 'Tailwind CSS', icon: 'logos:tailwindcss-icon', description: t('tech.tailwind') },
          { name: 'OpenAPI', icon: 'logos:openapi-initiative', description: t('tech.openapi') },
          { name: 'Java', icon: 'logos:java', description: t('tech.java') },
          { name: 'Spring Boot', icon: 'logos:spring-icon', description: t('tech.springboot') }
        ]
      },
      {
        title: t('timeline.items.1.title'),
        company: t('timeline.items.1.company'),
        period: t('timeline.items.1.period'),
        description: t('timeline.items.1.description'),
        mainTechs: [
          { name: 'Angular', icon: 'logos:angular-icon' },
          { name: 'NestJS', icon: 'logos:nestjs' }
        ],
        technologies: [
          { name: 'Angular', icon: 'logos:angular-icon', description: t('tech.angular') },
          { name: 'Tailwind CSS', icon: 'logos:tailwindcss-icon', description: t('tech.tailwind') },
          { name: 'PrimeNG', icon: 'logos:primeng', description: t('tech.primeng') },
          { name: 'Node.js', icon: 'logos:nodejs-icon', description: t('tech.nodejs') },
          { name: 'NestJS', icon: 'logos:nestjs', description: t('tech.nestjs') },
          { name: 'Docker', icon: 'logos:docker-icon', description: t('tech.docker') },
          { name: 'Linux', icon: 'logos:linux-tux', description: t('tech.linux') }
        ]
      },
      {
        title: t('timeline.items.2.title'),
        company: t('timeline.items.2.company'),
        period: t('timeline.items.2.period'),
        description: t('timeline.items.2.description'),
        mainTechs: [
          { name: 'Nuxt', icon: 'logos:nuxt-icon' },
          { name: 'NestJS', icon: 'logos:nestjs' }
        ],
        technologies: [
          { name: 'Nuxt', icon: 'logos:nuxt-icon', description: t('tech.nuxt') },
          { name: 'Vue', icon: 'logos:vue', description: t('tech.vue3') },
          { name: 'Tailwind CSS', icon: 'logos:tailwindcss-icon', description: t('tech.tailwind') },
          { name: 'NestJS', icon: 'logos:nestjs', description: t('tech.nestjs') },
          { name: 'Express.js', icon: 'logos:express', description: t('tech.expressjs') },
          { name: 'MongoDB', icon: 'logos:mongodb-icon', description: t('tech.mongodb') },
          { name: 'Firebase', icon: 'logos:firebase', description: t('tech.firebase') }
        ]
      },
      {
        title: t('timeline.items.3.title'),
        company: t('timeline.items.3.company'),
        period: t('timeline.items.3.period'),
        description: t('timeline.items.3.description'),
        mainTechs: [
          { name: 'Vue', icon: 'logos:vue' },
          { name: 'Express.js', icon: 'logos:express' }
        ],
        technologies: [
          { name: 'Nuxt', icon: 'logos:nuxt-icon', description: t('tech.nuxt') },
          { name: 'Vue', icon: 'logos:vue', description: t('tech.vue3') },
          { name: 'Tailwind CSS', icon: 'logos:tailwindcss-icon', description: t('tech.tailwind') },
          { name: 'Express.js', icon: 'logos:express', description: t('tech.expressjs') },
          { name: 'WordPress', icon: 'logos:wordpress-icon', description: t('tech.wordpress') },
          { name: 'MongoDB', icon: 'logos:mongodb-icon', description: t('tech.mongodb') }
        ]
      }
    ]"
  />

  <HomeProjects
    :badge="t('projects.badge')"
    :title="t('projects.title')"
    :cta-label="t('projects.cta')"
    :more-info-label="t('projects.moreInfo')"
    :items="[
      {
        title: t('projects.items.0.title'),
        description: t('projects.items.0.description'),
        role: t('projects.items.0.role'),
        period: t('projects.items.0.period'),
        highlights: [
          t('projects.items.0.highlights[0]'),
          t('projects.items.0.highlights[1]'),
          t('projects.items.0.highlights[2]'),
          t('projects.items.0.highlights[3]')
        ],
        tags: ['Nuxt', 'Vue 3', 'Tailwind CSS', 'OpenAPI'],
        size: 'featured',
        logo: '/projects/corte-ingles.png',
        hideModalCtas: true,
        primaryCta: { label: t('projects.items.0.primaryCta'), href: 'https://www.kumonetworks.com' },
        secondaryCta: { label: t('projects.items.0.secondaryCta'), href: 'https://www.kumonetworks.com' }
      },
      {
        title: t('projects.items.1.title'),
        description: t('projects.items.1.description'),
        role: t('projects.items.1.role'),
        period: t('projects.items.1.period'),
        highlights: [
          t('projects.items.1.highlights[0]'),
          t('projects.items.1.highlights[1]'),
          t('projects.items.1.highlights[2]'),
          t('projects.items.1.highlights[3]')
        ],
        tags: ['Nuxt', 'TypeScript', 'OpenAPI'],
        size: 'default',
        href: 'https://www.npmjs.com/package/nuxt-openapi-hyperfetch',
        logo: '/projects/nuxt-openapi-hyperfetch.png',
        primaryCta: { label: t('projects.items.1.primaryCta'), href: 'https://www.npmjs.com/package/nuxt-openapi-hyperfetch' },
        secondaryCta: { label: t('projects.items.1.secondaryCta'), href: 'https://github.com/dmartindiaz' },
        docsCta: { label: t('projects.items.1.docsCta'), href: 'https://nuxt-openapi-hyperfetch.netlify.app/' }
      },
      {
        title: t('projects.items.2.title'),
        description: t('projects.items.2.description'),
        role: t('projects.items.2.role'),
        period: t('projects.items.2.period'),
        highlights: [
          t('projects.items.2.highlights[0]'),
          t('projects.items.2.highlights[1]'),
          t('projects.items.2.highlights[2]'),
          t('projects.items.2.highlights[3]')
        ],
        tags: ['Ionic', 'Vue', 'iOS', 'Android'],
        size: 'default',
        logo: '/projects/Ribera.png',
        primaryCta: { label: t('projects.items.2.primaryCta'), href: 'https://riberasalud.com/cardiosalus/app-ribera-cardiosalus/' }
      },
      {
        title: t('projects.items.3.title'),
        description: t('projects.items.3.description'),
        role: t('projects.items.3.role'),
        period: t('projects.items.3.period'),
        highlights: [
          t('projects.items.3.highlights[0]'),
          t('projects.items.3.highlights[1]'),
          t('projects.items.3.highlights[2]'),
          t('projects.items.3.highlights[3]')
        ],
        tags: ['Angular', 'NestJS', 'Docker'],
        size: 'featured',
        logo: '/projects/cluby.png',
        credentials: { user: 'admin1_demo@conecta-2s.com', password: 'Temporal.123', note: t('projects.items.3.credentialsNote') },
        secondaryCta: { label: t('projects.items.3.clientCta'), href: 'https://clubyapp.com/cluby_client_dev/' },
        primaryCta: { label: t('projects.items.3.adminCta'), href: 'https://clubyapp.com/cluby_admin_dev/' }
      }
    ]" 
  />

  <HomeCompanies ref="companiesRef" />

  <HomeDry ref="dryRef" />

  <HomeStack
    ref="stackRef"
    :badge="t('stack.badge')"
    :title="t('stack.title')"
    :description="t('stack.description')"
    :tags="[
      { label: 'Nuxt', featured: true, icon: 'logos:nuxt-icon' },
      { label: 'Vue 3', featured: true, icon: 'logos:vue' },
      { label: 'TypeScript', featured: true, icon: 'logos:typescript-icon' },
      { label: 'Tailwind CSS', featured: true, icon: 'logos:tailwindcss-icon' },
      'Pinia', 'Vite', 'Angular', 'NestJS', 'Express.js', 'Node.js', 'Docker', 'OpenAPI', 'MongoDB', 'Firebase', 'WordPress Headless'
    ]"
    :cards="[
      {
        icon: 'heroicons:cpu-chip',
        title: t('stack.cards.core.title'),
        description: t('stack.cards.core.description'),
        featured: true
      },
      {
        icon: 'heroicons:rectangle-stack',
        title: t('stack.cards.architecture.title'),
        description: t('stack.cards.architecture.description')
      },
      {
        icon: 'heroicons:chart-bar',
        title: t('stack.cards.product.title'),
        description: t('stack.cards.product.description')
      }
    ]"
  />

  <HomeContact />
</template>
