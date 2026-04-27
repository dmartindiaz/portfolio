<script setup lang="ts">
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { t } = useI18n()
const colorMode = useColorMode()

function getCssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

const sectionRef = ref<HTMLElement>()
const revealWrapRef = ref<HTMLElement>()
const ideWrapRef = ref<HTMLElement>()
const statusRef = ref<HTMLElement>()
const isMobileIDE = ref(false)
const blob1Ref = ref<HTMLElement>()
const blob2Ref = ref<HTMLElement>()
const headlinePRef = ref<HTMLElement>()

// ─── Refactor status steps ────────────────────────────────────────────────────
const refactorSteps = computed(() => [
  { stage: 1, label: t('dry.refactor.step1') },
  { stage: 2, label: t('dry.refactor.step2') },
  { stage: 3, label: t('dry.refactor.step3') },
  { stage: 4, label: t('dry.refactor.step4') },
  { stage: 5, label: t('dry.refactor.step5') },
  { stage: 6, label: t('dry.refactor.step6') },
])

const headline = computed(() => t('dry.headline'))
const words = computed(() => headline.value.split(' '))

// ─── Stage ────────────────────────────────────────────────────────────────────
// 0 = spaghetti  1 = features/ creado  2 = Navbar extraído
// 3 = Section extraída  4 = Stats extraídas  5 = Table extraída  6 = código limpio
const stage = ref(0)

// ─── Tree by stage ─────────────────────────────────────────────────────────────
type FileKey = 'features/Dashboard.vue' | 'layouts/default.vue' | 'Navbar.vue' | 'Section.vue' | 'Stats.vue' | 'Table.vue' | 'index.vue' | 'nuxt.config.ts'
const activeFile = ref<FileKey>('index.vue')

const treeItems = computed(() => {
  const appChildren: any[] = []

  if (stage.value >= 1) {
    appChildren.push({
      label: 'features', icon: 'heroicons:folder',
      children: [{ label: 'Dashboard.vue', icon: 'heroicons:document-text', onSelect: () => { activeFile.value = 'features/Dashboard.vue' } }]
    })
    appChildren.push({
      label: 'layouts', icon: 'heroicons:folder',
      children: [{ label: 'default.vue', icon: 'heroicons:document-text', onSelect: () => { activeFile.value = 'layouts/default.vue' } }]
    })
  }

  if (stage.value >= 2) {
    const componentsChildren: any[] = [
      { label: 'Navbar.vue', icon: 'heroicons:document-text', onSelect: () => { activeFile.value = 'Navbar.vue' } }
    ]
    if (stage.value >= 3) componentsChildren.push({ label: 'Section.vue', icon: 'heroicons:document-text', onSelect: () => { activeFile.value = 'Section.vue' } })
    if (stage.value >= 4) componentsChildren.push({ label: 'Stats.vue', icon: 'heroicons:document-text', onSelect: () => { activeFile.value = 'Stats.vue' } })
    if (stage.value >= 5) componentsChildren.push({ label: 'Table.vue', icon: 'heroicons:document-text', onSelect: () => { activeFile.value = 'Table.vue' } })
    appChildren.push({ label: 'components', icon: 'heroicons:folder', children: componentsChildren })
  }

  appChildren.push({
    label: 'pages', icon: 'heroicons:folder',
    children: [{ label: 'index.vue', icon: 'heroicons:document', onSelect: () => { activeFile.value = 'index.vue' } }]
  })

  return [
    { label: 'app', icon: 'heroicons:folder', children: appChildren },
    { label: 'nuxt.config.ts', icon: 'heroicons:document', onSelect: () => { activeFile.value = 'nuxt.config.ts' } }
  ]
})

// Expanded folders — always keep all visible folders open
const treeExpanded = ref<string[]>(['app', 'pages'])
watch(stage, (s) => {
  if (s >= 1 && !treeExpanded.value.includes('features')) treeExpanded.value.push('features')
  if (s >= 1 && !treeExpanded.value.includes('layouts')) treeExpanded.value.push('layouts')
  if (s >= 2 && !treeExpanded.value.includes('components')) treeExpanded.value.push('components')
})

// Auto-switch file when stage progresses
watch(stage, (s, prev) => {
  if (s >= 1 && prev === 0) activeFile.value = 'features/Dashboard.vue'
  if (s === 0) activeFile.value = 'index.vue'
})

// ─── Code strings ──────────────────────────────────────────────────────────────

// Stage 0: spaghetti original
function getCodeLines() {
  return [
    '<template>',
    '  <div class="min-h-screen bg-gray-100">',
    '',
    `    <!-- ${t('dry.code.c.navbarHardcoded')} -->`,
    '    <nav class="bg-white border-b border-gray-200 shadow-sm">',
    '      <div class="max-w-7xl mx-auto px-4">',
    '        <div class="flex items-center justify-between h-16">',
    `          <span class="text-xl font-bold text-gray-800">${t('dry.code.ui.panelTitle')}</span>`,
    '          <div class="flex items-center gap-4">',
    `            <span class="text-sm text-gray-500">${t('dry.code.ui.greeting')}</span>`,
    '            <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center',
    '              justify-center text-white text-xs font-bold">JG</div>',
    '            <button class="text-sm text-gray-500 hover:text-gray-700 px-3 py-1',
    `              border border-gray-300 rounded">${t('dry.code.ui.logout')}</button>`,
    '          </div>',
    '        </div>',
    '      </div>',
    '    </nav>',
    '',
    '    <div class="max-w-7xl mx-auto px-4 py-8">',
    '      <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>',
    '',
    `      <!-- ${t('dry.code.c.statsHardcoded')} -->`,
    '      <div class="grid grid-cols-4 gap-4 mb-8">',
    '        <div class="bg-white rounded-lg shadow p-6">',
    `          <p class="text-sm text-gray-500">${t('dry.code.ui.totalUsers')}</p>`,
    '          <p class="text-3xl font-bold text-gray-900 mt-1">1.284</p>',
    `          <p class="text-xs text-green-600 mt-2">${t('dry.code.ui.trend12')}</p>`,
    '        </div>',
    '        <div class="bg-white rounded-lg shadow p-6">',
    `          <p class="text-sm text-gray-500">${t('dry.code.ui.sales')}</p>`,
    '          <p class="text-3xl font-bold text-gray-900 mt-1">34.920€</p>',
    `          <p class="text-xs text-green-600 mt-2">${t('dry.code.ui.trend8')}</p>`,
    '        </div>',
    '        <div class="bg-white rounded-lg shadow p-6">',
    `          <p class="text-sm text-gray-500">${t('dry.code.ui.pendingOrders')}</p>`,
    '          <p class="text-3xl font-bold text-gray-900 mt-1">47</p>',
    `          <p class="text-xs text-red-600 mt-2">${t('dry.code.ui.trendMinus3')}</p>`,
    '        </div>',
    '        <div class="bg-white rounded-lg shadow p-6">',
    `          <p class="text-sm text-gray-500">${t('dry.code.ui.openIssues')}</p>`,
    '          <p class="text-3xl font-bold text-gray-900 mt-1">9</p>',
    `          <p class="text-xs text-red-600 mt-2">${t('dry.code.ui.newToday')}</p>`,
    '        </div>',
    '      </div>',
    '',
    `      <!-- ${t('dry.code.c.tableHardcoded')} -->`,
    '      <div class="bg-white rounded-lg shadow mb-8">',
    '        <div class="px-6 py-4 border-b border-gray-200">',
    `          <h2 class="text-lg font-semibold text-gray-800">${t('dry.code.ui.latestOrders')}</h2>`,
    '        </div>',
    '        <table class="w-full">',
    '          <thead><tr>',
    '            <th class="px-6 py-3 text-xs uppercase text-gray-500">ID</th>',
    `            <th class="px-6 py-3 text-xs uppercase text-gray-500">${t('dry.code.ui.client')}</th>`,
    `            <th class="px-6 py-3 text-xs uppercase text-gray-500">${t('dry.code.ui.amount')}</th>`,
    `            <th class="px-6 py-3 text-xs uppercase text-gray-500">${t('dry.code.ui.status')}</th>`,
    '          </tr></thead>',
    '          <tbody>',
    '            <tr>',
    '              <td class="px-6 py-4 text-sm text-gray-900">#10041</td>',
    '              <td class="px-6 py-4 text-sm text-gray-900">María López</td>',
    '              <td class="px-6 py-4 text-sm text-gray-900">299€</td>',
    '              <td class="px-6 py-4">',
    '                <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">',
    `                  ${t('dry.code.ui.completed')}</span></td>`,
    '            </tr>',
    '            <tr>',
    '              <td class="px-6 py-4 text-sm text-gray-900">#10040</td>',
    '              <td class="px-6 py-4 text-sm text-gray-900">Carlos Ruiz</td>',
    '              <td class="px-6 py-4 text-sm text-gray-900">49€</td>',
    '              <td class="px-6 py-4">',
    '                <span class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">',
    `                  ${t('dry.code.ui.pending')}</span></td>`,
    '            </tr>',
    '          </tbody>',
    '        </table>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</template>',
    '',
    '<script setup>',
    `// ${t('dry.code.todo.connectApi')}`,
    `// ${t('dry.code.todo.makeComponents')}`,
    `// ${t('dry.code.todo.moveI18n')}`,
    `console.log('${t("dry.code.ui.dashboardMounted")}')`,
    '<\/script>'
  ]
}

// Stage 1: recién movido a features/ — sin nav ni layout wrapper
function getFeaturesStage0() {
  return [
    '<template>',
    `  <!-- ${t('dry.code.c.movedToFeatures')} -->`,
    '  <div class="flex flex-col gap-5">',
    '',
    `    <!-- ${t('dry.code.todo.extractStats')} -->`,
    '    <div class="grid grid-cols-4 gap-4">',
    '      <div class="bg-white rounded-lg shadow p-6">',
    `        <p class="text-sm text-gray-500">${t('dry.code.ui.totalUsers')}</p>`,
    '        <p class="text-3xl font-bold text-gray-900 mt-1">1.284</p>',
    `        <p class="text-xs text-green-600 mt-2">${t('dry.code.ui.trend12')}</p>`,
    '      </div>',
    `      <!-- ${t('dry.code.c.threeMore')} -->`,
    '    </div>',
    '',
    `    <!-- ${t('dry.code.todo.extractTable')} -->`,
    '    <div class="bg-white rounded-lg shadow">',
    `      <!-- ${t('dry.code.c.hardcodedRows')} -->`,
    '    </div>',
    '',
    '  </div>',
    '</template>',
    '',
    '<script setup>',
    `// ${t('dry.code.todo.makeComponents')}`,
    `// ${t('dry.code.todo.moveI18n')}`,
    '<\/script>'
  ]
}

// Stage 2: navbar extraído — Navbar ahora en index.vue
function getFeaturesStage1() {
  return [
    '<template>',
    '  <div class="flex flex-col gap-5">',
    '',
    `    <!-- ${t('dry.code.todo.extractStats')} -->`,
    '    <div class="grid grid-cols-4 gap-4">',
    '      <div class="bg-white rounded-lg shadow p-6">',
    `        <p class="text-sm text-gray-500">${t('dry.code.ui.totalUsers')}</p>`,
    '        <p class="text-3xl font-bold text-gray-900 mt-1">1.284</p>',
    '        <!-- ... -->',
    '      </div>',
    `      <!-- ${t('dry.code.c.threeMore')} -->`,
    '    </div>',
    '',
    `    <!-- ${t('dry.code.todo.extractTable')} -->`,
    '    <div class="bg-white rounded-lg shadow">',
    `      <!-- ${t('dry.code.c.hardcodedRows')} -->`,
    '    </div>',
    '',
    '  </div>',
    '</template>',
    '',
    '<script setup lang="ts">',
    '<\/script>'
  ]
}

// Stage 3: Section extraída — Section ahora en index.vue
function getFeaturesStageSection() {
  return [
    '<template>',
    '  <div class="flex flex-col gap-5">',
    '',
    `    <!-- ${t('dry.code.todo.extractStats')} -->`,
    '    <div class="grid grid-cols-4 gap-4">',
    '      <div class="bg-white rounded-lg shadow p-6">',
    `        <!-- ${t('dry.code.c.hardcodedStats')} -->`,
    '      </div>',
    '    </div>',
    '',
    `    <!-- ${t('dry.code.todo.extractTable')} -->`,
    '    <div class="bg-white rounded-lg shadow">',
    `      <!-- ${t('dry.code.c.hardcodedRows')} -->`,
    '    </div>',
    '',
    '  </div>',
    '</template>',
    '',
    '<script setup lang="ts">',
    '<\/script>'
  ]
}

// Stage 4: stats extraídas
function getFeaturesStage2() {
  return [
    '<template>',
    '  <div class="flex flex-col gap-5">',
    '',
    `    <!-- ${t('dry.code.c.statsExtracted')} -->`,
    '    <Stats :items="stats" />',
    '',
    `    <!-- ${t('dry.code.todo.extractTable')} -->`,
    '    <div class="bg-white rounded-lg shadow">',
    `      <!-- ${t('dry.code.c.hardcodedRows')} -->`,
    '    </div>',
    '',
    '  </div>',
    '</template>',
    '',
    '<script setup lang="ts">',
    'const { data: stats } = await useFetch(\'/api/stats\')',
    '<\/script>'
  ]
}

// Stage 5: tabla extraída
function getFeaturesStage3() {
  return [
    '<template>',
    '  <div class="flex flex-col gap-5">',
    '',
    '    <Stats :items="stats" />',
    '',
    `    <!-- ${t('dry.code.c.tableExtracted')} -->`,
    '    <Table :rows="orders" :columns="columns" />',
    '',
    '  </div>',
    '</template>',
    '',
    '<script setup lang="ts">',
    'const { data: stats } = await useFetch(\'/api/stats\')',
    'const { data: orders } = await useFetch(\'/api/orders\')',
    'const columns = [',
    "  { key: 'id', label: t('orders.id') },",
    "  { key: 'client', label: t('orders.client') },",
    "  { key: 'status', label: t('orders.status') }",
    ']',
    '<\/script>'
  ]
}

// Stage 6: limpio
function getFeaturesStage4() {
  return [
    '<template>',
    '  <div class="flex flex-col gap-5">',
    '    <Stats :items="stats" />',
    '    <Table :rows="orders" :columns="columns" />',
    '  </div>',
    '</template>',
    '',
    '<script setup lang="ts">',
    'const { data: stats } = await useFetch(\'/api/stats\')',
    'const { data: orders } = await useFetch(\'/api/orders\')',
    'const columns = [',
    "  { key: 'id', label: t('orders.id') },",
    "  { key: 'client', label: t('orders.client') },",
    "  { key: 'status', label: t('orders.status') }",
    ']',
    '<\/script>'
  ]
}

// Simple stubs for component files
const navbarCode = [
  '<template>',
  '  <nav class="bg-white border-b border-gray-200 shadow-sm">',
  '    <div class="max-w-7xl mx-auto px-4">',
  '      <div class="flex items-center justify-between h-16">',
  '        <span class="text-xl font-bold">{{ appName }}</span>',
  '        <div class="flex items-center gap-3">',
  '          <span class="text-sm text-gray-500">{{ user.name }}</span>',
  '          <div class="w-8 h-8 rounded-full bg-primary-500',
  '            flex items-center justify-center',
  '            text-white text-xs font-bold">',
  '            {{ user.initials }}',
  '          </div>',
  '        </div>',
  '      </div>',
  '    </div>',
  '  </nav>',
  '</template>',
  '',
  '<script setup lang="ts">',
  'defineProps<{',
  '  appName: string',
  '  user: { name: string, initials: string }',
  '}>()',
  '<\/script>'
]

const sectionCode = [
  '<template>',
  '  <div class="max-w-7xl mx-auto px-4 py-8">',
  '    <h1 class="text-2xl font-bold text-gray-900 mb-6">{{ title }}</h1>',
  '    <slot />',
  '  </div>',
  '</template>',
  '',
  '<script setup lang="ts">',
  'defineProps<{',
  '  title: string',
  '}>()',
  '<\/script>'
]

const statsCode = [
  '<template>',
  '  <div class="grid grid-cols-4 gap-4 mb-8">',
  '    <div v-for="stat in items" :key="stat.key"',
  '      class="bg-white rounded-lg shadow p-6">',
  '      <p class="text-sm text-gray-500">{{ stat.label }}</p>',
  '      <p class="text-3xl font-bold text-gray-900 mt-1">{{ stat.value }}</p>',
  '      <p class="text-xs mt-2"',
  "        :class=\"stat.up ? 'text-green-600' : 'text-red-600'\">",
  '        {{ stat.trend }}',
  '      </p>',
  '    </div>',
  '  </div>',
  '</template>',
  '',
  '<script setup lang="ts">',
  'defineProps<{',
  '  items: Array<{',
  '    key: string',
  '    label: string',
  '    value: string',
  '    trend: string',
  '    up: boolean',
  '  }>',
  '}>()',
  '<\/script>'
]

const tableCode = [
  '<template>',
  '  <div class="bg-white rounded-lg shadow mb-8">',
  '    <UTable :rows="rows" :columns="columns" />',
  '  </div>',
  '</template>',
  '',
  '<script setup lang="ts">',
  'defineProps<{',
  '  rows: Record<string, unknown>[]',
  '  columns: Array<{ key: string, label: string }>',
  '}>()',
  '<\/script>'
]

// index.vue evolves as layout components are extracted
function getIndexVueStage1() {
  return [
    '<template>',
    `  <!-- ${t('dry.code.c.layoutManages')} -->`,
    '  <NuxtLayout>',
    '    <Dashboard />',
    '  </NuxtLayout>',
    '</template>'
  ]
}

function getIndexVueStage2() {
  return [
    '<template>',
    `  <!-- ${t('dry.code.c.navbarInLayout')} -->`,
    '  <NuxtLayout>',
    '    <Dashboard />',
    '  </NuxtLayout>',
    '</template>'
  ]
}

function getIndexVueStage3Plus() {
  return [
    '<template>',
    '  <NuxtLayout>',
    `    <!-- ${t('dry.code.c.sectionWraps')} -->`,
    '    <Section :title="t(\'dashboard.title\')">' ,
    '      <Dashboard />',
    '    </Section>',
    '  </NuxtLayout>',
    '</template>',
    '',
    '<script setup lang="ts">',
    "const { t } = useI18n()",
    '<\/script>'
  ]
}

// layouts/default.vue: stage 1 no navbar yet, stage 2+ navbar with full logic
function getLayoutStage1() {
  return [
    '<template>',
    '  <Page>',
    `    <!-- ${t('dry.code.todo.extractNavbar')} -->`,
    '    <nav class="bg-white border-b border-gray-200 shadow-sm">',
    `      <!-- ${t('dry.code.c.hardcoded')} -->`,
    '    </nav>',
    '    <slot />',
    '  </Page>',
    '</template>'
  ]
}

function getLayoutStage2Plus() {
  return [
    '<template>',
    '  <Page>',
    `    <!-- ${t('dry.code.c.navbarExtracted')} -->`,
    '    <Navbar',
    '      :app-name="t(\'app.name\')"',
    '      :user="user"',
    '      @logout="handleLogout"',
    '    />',
    '    <slot />',
    '  </Page>',
    '</template>',
    '',
    '<script setup lang="ts">',
    "const { t } = useI18n()",
    'const { data: user } = await useFetch(\'/api/me\')',
    'function handleLogout() { navigateTo(\'/login\') }',
    '<\/script>'
  ]
}

const nuxtConfigLines = [
  '// https://nuxt.com/docs/api/configuration/nuxt-config',
  "export default defineNuxtConfig({",
  "  modules: ['@nuxt/ui', '@nuxtjs/i18n'],",
  '',
  "  compatibilityDate: '2025-01-15',",
  "})"
]

const codeByFile = computed((): Record<FileKey, string> => ({
  'index.vue': '```vue\n' + (
    stage.value === 0 ? getCodeLines()
    : stage.value === 1 ? getIndexVueStage1()
    : stage.value === 2 ? getIndexVueStage2()
    : getIndexVueStage3Plus()
  ).join('\n') + '\n```',
  'features/Dashboard.vue': '```vue\n' + (
    stage.value <= 1 ? getFeaturesStage0()
    : stage.value === 2 ? getFeaturesStage1()
    : stage.value === 3 ? getFeaturesStageSection()
    : stage.value === 4 ? getFeaturesStage2()
    : stage.value === 5 ? getFeaturesStage3()
    : getFeaturesStage4()
  ).join('\n') + '\n```',
  'layouts/default.vue': '```vue\n' + (stage.value <= 1 ? getLayoutStage1() : getLayoutStage2Plus()).join('\n') + '\n```',
  'Navbar.vue': '```vue\n' + navbarCode.join('\n') + '\n```',
  'Section.vue': '```vue\n' + sectionCode.join('\n') + '\n```',
  'Stats.vue': '```vue\n' + statsCode.join('\n') + '\n```',
  'Table.vue': '```vue\n' + tableCode.join('\n') + '\n```',
  'nuxt.config.ts': '```typescript\n' + nuxtConfigLines.join('\n') + '\n```'
}))

const activeCode = computed(() => codeByFile.value[activeFile.value] ?? '')

// ─── GSAP ─────────────────────────────────────────────────────────────────────
let st: ScrollTrigger | null = null
let resizeTimer: ReturnType<typeof setTimeout>

function killAnimation() {
  st?.kill()
  st = null

  // Reset all GSAP inline styles so CSS classes take over again
  if (revealWrapRef.value) gsap.set(revealWrapRef.value, { clearProps: 'all' })
  if (ideWrapRef.value) gsap.set(ideWrapRef.value, { clearProps: 'all' })
  if (headlinePRef.value) gsap.set(headlinePRef.value, { clearProps: 'all' })
  if (statusRef.value) gsap.set(statusRef.value, { clearProps: 'all' })
  if (blob1Ref.value) gsap.set(blob1Ref.value, { clearProps: 'all' })
  if (blob2Ref.value) gsap.set(blob2Ref.value, { clearProps: 'all' })

  stage.value = 0
}

function initAnimation() {
  const isMobileLayout = window.innerWidth < 1080

  if (!sectionRef.value || !revealWrapRef.value || !ideWrapRef.value) return

  const wordEls = revealWrapRef.value.querySelectorAll<HTMLElement>('.title-word')

  if (statusRef.value) gsap.set(statusRef.value, { opacity: 0 })

  // Blobs start invisible
  if (blob1Ref.value) gsap.set(blob1Ref.value, { opacity: 0, scale: 0.6 })
  if (blob2Ref.value) gsap.set(blob2Ref.value, { opacity: 0, scale: 0.6 })

  gsap.set(ideWrapRef.value, {
    y: '100%',
    opacity: 0,
    rotateX: 28,
    transformOrigin: '50% 100%',
    transformPerspective: 900,
    pointerEvents: 'none',
    boxShadow: '0 0 120px 40px rgba(0,220,130,0.55), 0 0 40px 10px rgba(0,220,130,0.35)'
  })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: '+=600%',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress
        // intro animation takes ~40% of total scroll, remaining 60% → 4 stages × 15%
        const newStage = p < 0.40 ? 0
          : p < 0.50 ? 1
            : p < 0.60 ? 2
              : p < 0.70 ? 3
                : p < 0.80 ? 4
                  : p < 0.90 ? 5
                    : 6
        if (stage.value !== newStage) stage.value = newStage
      }
    }
  })

  st = tl.scrollTrigger as ScrollTrigger

  // Phase 1: word-by-word color reveal + blobs fade in
  gsap.set(wordEls, { color: getCssVar('--title-word-dim') })
  tl.to(wordEls, {
    keyframes: [
      { color: getCssVar('--title-word-dim'), duration: 0.01 },
      { color: getCssVar('--title-word-bright'), duration: 0.04 }
    ],
    stagger: { each: 0.1 },
    ease: 'none'
  })
  if (blob1Ref.value) tl.to(blob1Ref.value, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }, 0)
  if (blob2Ref.value) tl.to(blob2Ref.value, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }, 0.1)

  // Phase 2: headline slides left (desktop) or fades out (mobile), IDE enters
  if (isMobileLayout) {
    tl.to(revealWrapRef.value, { opacity: 0, duration: 0.2, ease: 'power2.inOut' }, '+=0.1')
  } else {
    tl.to(revealWrapRef.value, { right: '67%', duration: 0.3, ease: 'power3.inOut' }, '+=0.1')
    if (headlinePRef.value) tl.to(headlinePRef.value, { fontSize: '1.75rem', lineHeight: '2.25rem', duration: 0.3, ease: 'power3.inOut' }, '<')
  }
  tl.set(ideWrapRef.value, { opacity: 1 }, '<')
  tl.to(ideWrapRef.value, {
    y: '0%',
    rotateX: 0,
    boxShadow: '0 0 30px 6px rgba(0,220,130,0.12), 0 0 8px 2px rgba(0,220,130,0.08)',
    duration: 0.5,
    ease: 'power3.out',
    pointerEvents: 'auto'
  }, '<')
  // Status panel appears once the IDE has fully landed
  if (statusRef.value) tl.set(statusRef.value, { opacity: 1 }, '>')
  // Padding: 6 stage holds mapped to 60% of the scroll
  tl.to({}, { duration: 1.8 })
}

onMounted(() => {
  isMobileIDE.value = window.innerWidth < 760
  // init called externally from index.vue

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(async () => {
      isMobileIDE.value = window.innerWidth < 760
      killAnimation()
      await nextTick()
      initAnimation()
      ScrollTrigger.refresh()
    }, 200)
  })
})

onUnmounted(() => {
  killAnimation()
  clearTimeout(resizeTimer)
})

watch(() => colorMode.value, async () => {
  killAnimation()
  await nextTick()
  initAnimation()
  ScrollTrigger.refresh()
})

defineExpose({ initAnimation })
</script>

<template>
  <section ref="sectionRef" class="relative bg-white dark:bg-neutral-950 overflow-hidden" style="min-height: 100vh; perspective: 1200px; perspective-origin: 50% 80%">

    <!-- Blobs -->
    <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div ref="blob1Ref" class="absolute left-[10%] top-[20%] w-[600px] h-[600px] rounded-full bg-primary-500/8 blur-3xl" />
      <div ref="blob2Ref" class="absolute right-[5%] bottom-[10%] w-[480px] h-[480px] rounded-full bg-neutral-400/6 blur-3xl" />
    </div>

    <!-- Headline -->
    <div ref="revealWrapRef" class="absolute inset-0 z-10 flex items-center justify-center px-12" :class="{ 'hidden lg:flex': stage >= 1 }">
      <div class="flex flex-col items-center gap-6">
        <p ref="headlinePRef" class="text-center text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
          <template v-for="(word, i) in words" :key="i">
            <span class="title-word" style="color: var(--title-word-dim)">{{ word }}</span>{{ i < words.length - 1 ? ' ' : '' }}
          </template>
        </p>

        <!-- Refactor status — desktop only inside headline panel -->
        <div ref="statusRef" class="hidden lg:flex flex-col gap-2 w-full max-w-xs">
          <div class="flex items-center gap-1.5 mb-1">
            <UIcon v-if="stage >= 6" name="heroicons:check-circle-solid" class="w-4 h-4 text-primary-400" />
            <p class="text-xs font-semibold uppercase tracking-widest" :class="stage >= 6 ? 'text-primary-400' : 'text-neutral-400 dark:text-white/40'">
              {{ stage >= 6 ? t('dry.refactor.done') : t('dry.refactor.inProgress') }}
            </p>
          </div>
          <template v-for="step in refactorSteps" :key="step.stage">
            <Transition
              enter-active-class="transition-all duration-500 ease-out"
              enter-from-class="opacity-0 translate-y-1.5"
              enter-to-class="opacity-100 translate-y-0"
            >
              <div v-if="stage >= step.stage" class="flex items-start gap-2 text-sm font-mono">
                <!-- Done -->
                <template v-if="stage > step.stage || stage >= 6">
                  <UIcon name="heroicons:check-circle-solid" class="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                  <span class="text-neutral-400 dark:text-white/50 line-through decoration-neutral-400/30 dark:decoration-white/20">
                    {{ step.label.replace('...', '') }}
                  </span>
                </template>
                <!-- In progress -->
                <template v-else>
                  <div class="w-4 h-4 shrink-0 mt-0.5 flex items-center justify-center">
                    <span class="block w-3 h-3 rounded-full border-2 border-primary-400 border-t-transparent animate-spin" />
                  </div>
                  <span class="text-neutral-700 dark:text-white/80">{{ step.label }}</span>
                </template>
              </div>
            </Transition>
          </template>
        </div>
      </div>
    </div>

    <!-- IDE -->
    <div ref="ideWrapRef" class="absolute top-24 left-4 right-4 lg:left-[33.33%] z-20 rounded-xl h-[calc(100vh-7rem)]">

    <!-- Floating badge — mobile only, shows current step -->
    <Transition
      enter-active-class="transition-all duration-400 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
      mode="out-in"
    >
      <div
        v-if="stage >= 1"
        :key="stage"
        class="lg:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-5 py-3 rounded-full border border-primary-400/30 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-sm shadow-[0_0_24px_4px_rgba(var(--ui-primary)/0.45),0_0_8px_2px_rgba(var(--ui-primary)/0.25)] max-w-[calc(100vw-3rem)] overflow-hidden"
      >
        <template v-if="stage >= 6">
          <UIcon name="heroicons:check-circle-solid" class="w-4 h-4 text-primary-400 shrink-0" />
          <span class="text-xs font-semibold text-primary-400">{{ t('dry.refactor.done') }}</span>
        </template>
        <template v-else>
          <span class="block w-3 h-3 rounded-full border-2 border-primary-400 border-t-transparent animate-spin shrink-0" />
          <span class="text-xs font-mono text-neutral-700 dark:text-white/80 truncate">{{ refactorSteps.find(s => s.stage === stage)?.label }}</span>
        </template>
      </div>
    </Transition>
      <IDE
        class="w-full h-full"
        url="localhost:3000/dashboard"
        :tree="treeItems"
        :selected-file="activeFile"
        :initial-collapsed="isMobileIDE"
        :compact="isMobileIDE"
        v-model:expanded="treeExpanded"
      >
        <!-- Tab bar + code viewer -->
        <div class="flex flex-col h-full min-h-0">

          <!-- Editor tab bar — single active tab -->
          <div class="flex items-center shrink-0 bg-neutral-900 border-b border-white/5">
            <div class="flex items-center gap-1.5 px-4 py-2 bg-neutral-950 border-r border-white/5 text-xs text-white/80 font-mono whitespace-nowrap">
              <UIcon
                name="heroicons:document-text"
                class="w-3.5 h-3.5 shrink-0"
                :class="activeFile === 'Dashboard.vue' ? 'text-orange-400' : 'text-primary-400'"
              />
              {{ activeFile }}
            </div>
          </div>

          <!-- Code content -->
          <div class="flex-1 min-h-0 overflow-y-auto bg-neutral-950 [&_pre]:!m-0 [&_pre]:!rounded-none [&_pre]:!p-4 [&_code]:!text-xs lg:[&_code]:!text-sm [&_code]:!leading-5 lg:[&_code]:!leading-6 [&_code]:font-mono [&>div]:!mt-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/30">
            <MDC :key="activeFile" :value="activeCode" unwrap="p" />
          </div>

        </div>
      </IDE>
    </div>

  </section>
</template>
