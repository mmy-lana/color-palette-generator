<script setup lang="ts">
import { computed } from 'vue';
import type { ColorData, ColorFormat } from '../../../shared/types';
import ColorSwatch from '../../../components/atoms/ColorSwatch.vue';
import BaseSlider from '../../../components/atoms/BaseSlider.vue';
import BaseButton from '../../../components/atoms/BaseButton.vue';
import FormatSelector from '../../../components/molecules/FormatSelector.vue';
import { useClipboard } from '../../../shared/composables/useClipboard';
import { formatColorString } from '../../../shared/utils/formatters';

interface Props {
  colors: ColorData[];
  colorCount: number;
  activeFormat: ColorFormat;
  selectedColor?: ColorData | null;
  loading?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:colorCount', count: number): void;
  (e: 'update:activeFormat', format: ColorFormat): void;
  (e: 'select-color', color: ColorData): void;
}>();

const { copy, isCopied } = useClipboard();

const allFormattedColors = computed(() => {
  return props.colors
    .map((c) => formatColorString(c.hex, c.rgb, c.hsl, c.cmyk, props.activeFormat))
    .join(', ');
});

const handleCopyAll = () => {
  copy(allFormattedColors.value);
};
</script>

<template>
  <div class="flex flex-col gap-6 w-full">
    <!-- Controls Header -->
    <div class="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
      <div class="w-full sm:w-48">
        <BaseSlider
          :model-value="colorCount"
          :min="3"
          :max="10"
          label="Palette Swatches"
          @update:model-value="emit('update:colorCount', $event)"
        />
      </div>

      <div class="flex items-center gap-3">
        <FormatSelector
          :model-value="activeFormat"
          @update:model-value="emit('update:activeFormat', $event)"
        />

        <BaseButton
          variant="outline"
          size="sm"
          :disabled="colors.length === 0"
          @click="handleCopyAll"
        >
          <span v-if="!isCopied">Copy All</span>
          <span v-else class="text-emerald-600 font-semibold">Copied!</span>
        </BaseButton>
      </div>
    </div>

    <!-- Palette Swatches Grid -->
    <div
      v-if="colors.length > 0"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3"
    >
      <ColorSwatch
        v-for="color in colors"
        :key="color.id"
        :color="color"
        :active-format="activeFormat"
        height-class="h-36"
        @select="emit('select-color', $event)"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!loading"
      class="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400"
    >
      <p class="text-sm font-medium">Upload or select an image to generate a color palette.</p>
    </div>
  </div>
</template>