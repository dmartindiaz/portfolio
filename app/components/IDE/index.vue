<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui'

const props = withDefaults(defineProps<{
  url?: string
  tree?: TreeItem[]
  selectedFile?: string
  initialCollapsed?: boolean
}>(), {
  url: 'localhost:3000',
  tree: () => [],
  initialCollapsed: false
})

const expanded = defineModel<string[]>('expanded', { default: () => [] })

const explorerOpen = ref(!props.initialCollapsed)

// Reka compares by getKey = label, so { label: filename } is enough to drive selection
const selectedItem = computed<TreeItem | undefined>(() => {
  if (!props.selectedFile) return undefined
  const label = props.selectedFile.split('/').pop()!
  return { label }
})
</script>

<template>
  <div class="relative flex flex-col w-full h-full overflow-hidden rounded-xl select-none">
    <!-- Browser chrome bar -->
    <div class="shrink-0 bg-neutral-800 h-10 flex items-center px-4 gap-3 rounded-t-xl border-b border-white/5">
      <!-- Traffic lights -->
      <div class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-full bg-red-500/70" />
        <span class="w-3 h-3 rounded-full bg-yellow-500/70" />
        <span class="w-3 h-3 rounded-full bg-green-500/70" />
      </div>
      <!-- URL bar -->
      <div class="flex-1 mx-4 max-w-xs mx-auto bg-neutral-700/60 rounded-md h-6 flex items-center px-3">
        <UIcon name="heroicons:lock-closed" class="w-3 h-3 text-white/30 mr-1.5 shrink-0" />
        <span class="text-xs text-white/40 truncate">{{ url }}</span>
      </div>
    </div>

    <!-- IDE body -->
    <div class="flex-1 flex overflow-hidden rounded-b-xl">

      <!-- Activity bar -->
      <div class="w-10 bg-neutral-900 flex flex-col items-center pt-3 gap-5 border-r border-white/5 shrink-0">
        <button
          class="rounded-md p-0.5 transition-colors"
          :class="explorerOpen ? 'text-white/80 bg-white/8' : 'text-white/30 hover:text-white/60'"
          @click="explorerOpen = !explorerOpen"
        >
          <UIcon name="heroicons:document-duplicate" class="w-5 h-5" />
        </button>
        <UIcon name="heroicons:magnifying-glass" class="w-5 h-5 text-white/25" />
        <UIcon name="heroicons:puzzle-piece" class="w-5 h-5 text-white/25" />
        <UIcon name="heroicons:git-branch" class="w-5 h-5 text-white/25" />
      </div>

      <!-- Explorer panel -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-x-2"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 -translate-x-2"
      >
        <div v-if="explorerOpen" class="w-48 bg-neutral-900 flex flex-col overflow-hidden shrink-0 border-r border-white/5">
          <div class="px-3 pt-3 pb-1.5">
            <span class="text-[0.6rem] font-semibold tracking-widest uppercase text-white/30">
              Explorer
            </span>
          </div>
          <div class="flex-1 overflow-y-auto px-1 text-xs">
            <UTree :items="tree" :model-value="selectedItem" v-model:expanded="expanded" class="text-white/60" />
          </div>
        </div>
      </Transition>

      <!-- Main editor area -->
      <div class="flex-1 bg-neutral-950 flex flex-col min-w-0 overflow-hidden">
        <slot />
      </div>

    </div>
  </div>
</template>
