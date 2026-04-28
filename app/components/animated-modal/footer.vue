<script setup lang="ts">
import { cn } from "@inspira-ui/plugins";
interface Props {
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
});
</script>

<template>
  <div :class="cn(`flex justify-end bg-neutral-50 border-t border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 p-4`, props.class)">
    <slot />
  </div>
</template>

