<script setup lang="ts">
import { computed } from 'vue';
import type { BadgeVariant } from '../../shared/types';

interface Props {
  variant?: BadgeVariant;
  interactive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  interactive: false
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'accent':
      return 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300 border-violet-200 dark:border-violet-800';
    case 'success':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    case 'outline':
      return 'bg-transparent text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700';
    case 'neutral':
    default:
      return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
  }
});
</script>

<template>
  <span
    :class="[
      'inline-flex items-center tracking-wider uppercase font-mono text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-colors',
      variantClasses,
      interactive ? 'hover:opacity-80 cursor-pointer select-none' : ''
    ]"
  >
    <slot />
  </span>
</template>