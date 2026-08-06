<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  text: string;
  position?: 'top' | 'bottom';
}

withDefaults(defineProps<Props>(), {
  position: 'top'
});

const isVisible = ref(false);
</script>

<template>
  <div
    class="relative inline-flex"
    @mouseenter="isVisible = true"
    @mouseleave="isVisible = false"
  >
    <slot />
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isVisible"
        :class="[
          'absolute z-50 px-2 py-1 text-xs font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded shadow-md whitespace-nowrap pointer-events-none left-1/2 -translate-x-1/2',
          position === 'top' ? '-top-8' : 'top-full mt-2'
        ]"
      >
        {{ text }}
      </div>
    </Transition>
  </div>
</template>