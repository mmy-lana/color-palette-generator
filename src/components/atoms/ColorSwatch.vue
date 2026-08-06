<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ColorData, ColorFormat } from '../../shared/types';
import { formatColorString } from '../../shared/utils/formatters';

interface Props {
  color: ColorData;
  activeFormat?: ColorFormat;
  showDetails?: boolean;
  heightClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  activeFormat: 'hex',
  showDetails: true,
  heightClass: 'h-32'
});

const emit = defineEmits<{
  (e: 'copy', formattedValue: string, color: ColorData): void;
  (e: 'select', color: ColorData): void;
}>();

const isCopied = ref(false);

const formattedColor = computed(() => {
  return formatColorString(
    props.color.hex,
    props.color.rgb,
    props.color.hsl,
    props.color.cmyk,
    props.activeFormat
  );
});

const textColorClass = computed(() => {
  return props.color.isLight ? 'text-zinc-900' : 'text-white';
});

const handleCopy = () => {
  navigator.clipboard.writeText(formattedColor.value);
  isCopied.value = true;
  emit('copy', formattedColor.value, props.color);

  setTimeout(() => {
    isCopied.value = false;
  }, 1500);
};

const handleSelect = () => {
  emit('select', props.color);
};
</script>

<template>
  <div
    :class="[
      'group relative flex flex-col justify-between p-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 overflow-hidden cursor-pointer select-none border border-black/5 dark:border-white/10',
      heightClass
    ]"
    :style="{ backgroundColor: color.hex }"
    @click="handleSelect"
  >
    <div class="flex items-center justify-between w-full z-10">
      <span
        v-if="color.name"
        :class="['text-xs font-semibold tracking-wide truncate max-w-[80%]', textColorClass]"
      >
        {{ color.name }}
      </span>
      <span
        v-if="color.population > 0"
        :class="['text-[10px] font-mono opacity-75 font-medium ml-auto', textColorClass]"
      >
        {{ color.population }}px
      </span>
    </div>

    <div class="flex items-end justify-between w-full z-10">
      <div class="flex flex-col">
        <span :class="['font-mono text-sm font-bold tracking-tight', textColorClass]">
          {{ formattedColor }}
        </span>
      </div>

      <button
        type="button"
        :aria-label="`Copy color code ${formattedColor}`"
        :class="[
          'p-1.5 rounded-lg backdrop-blur-md transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100',
          color.isLight ? 'bg-black/10 hover:bg-black/20 text-zinc-900' : 'bg-white/15 hover:bg-white/25 text-white'
        ]"
        @click.stop="handleCopy"
      >
        <svg
          v-if="!isCopied"
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <svg
          v-else
          class="w-4 h-4 text-emerald-400 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </button>
    </div>

    <!-- Active highlight subtle border overlay -->
    <div class="absolute inset-0 border-2 border-transparent group-hover:border-black/20 dark:group-hover:border-white/20 rounded-xl pointer-events-none transition-colors" />
  </div>
</template>