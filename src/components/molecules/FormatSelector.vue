<script setup lang="ts">
import type { ColorFormat } from '../../shared/types';

interface Props {
  modelValue: ColorFormat;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', format: ColorFormat): void;
}>();

const formats: ColorFormat[] = ['hex', 'rgb', 'hsl', 'cmyk'];
</script>

<template>
  <div class="inline-flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 select-none">
    <button
      v-for="fmt in formats"
      :key="fmt"
      type="button"
      :class="[
        'px-3 py-1 text-xs font-mono font-bold uppercase rounded-lg transition-all duration-150',
        modelValue === fmt
          ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
          : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
      ]"
      @click="emit('update:modelValue', fmt)"
    >
      {{ fmt }}
    </button>
  </div>
</template>