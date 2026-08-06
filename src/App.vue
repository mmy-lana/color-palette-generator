<script setup lang="ts">
import { onMounted } from 'vue';
import { usePaletteExtractor } from './features/palette-generator/composables/usePaletteExtractor';
import ImageUploader from './features/palette-generator/components/ImageUploader.vue';
import PaletteDisplay from './features/palette-generator/components/PaletteDisplay.vue';
import BaseButton from './components/atoms/BaseButton.vue';
import BaseBadge from './components/atoms/BaseBadge.vue';
import { useClipboard } from './shared/composables/useClipboard';

const {
  imageSrc,
  colors,
  isExtracting,
  error,
  colorCount,
  activeFormat,
  selectedColor,
  loadFromFile,
  loadFromUrl,
  updateColorCount,
  setFormat,
  selectColor
} = usePaletteExtractor();

const { copy, isCopied } = useClipboard();

const defaultSampleUrl = 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80';

onMounted(() => {
  loadFromUrl(defaultSampleUrl);
});

const handleFileSelect = (file: File) => {
  loadFromFile(file);
};

const handleUrlSelect = (url: string) => {
  loadFromUrl(url);
};

const exportAsJson = () => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(colors.value, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', 'color-palette.json');
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

const exportAsCss = () => {
  const cssVars = colors.value
    .map((c, i) => `  --color-palette-${i + 1}: ${c.hex};`)
    .join('\n');
  const cssContent = `:root {\n${cssVars}\n}`;
  copy(cssContent);
};
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between p-4 sm:p-8 max-w-7xl mx-auto">
    <!-- Navigation / Header -->
    <header class="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center shadow-md">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Chroma Extract
          </h1>
          <p class="text-xs text-zinc-500 dark:text-zinc-400">
            Image Color Palette Generator
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <BaseButton variant="outline" size="sm" :disabled="colors.length === 0" @click="exportAsCss">
          <span v-if="!isCopied">Export CSS</span>
          <span v-else class="text-emerald-500 font-semibold">CSS Copied!</span>
        </BaseButton>
        <BaseButton variant="secondary" size="sm" :disabled="colors.length === 0" @click="exportAsJson">
          Download JSON
        </BaseButton>
      </div>
    </header>

    <!-- Main Workspace -->
    <main class="my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Column: Image Dropzone -->
      <section class="lg:col-span-5 flex flex-col gap-4">
        <h2 class="text-sm font-semibold tracking-wider text-zinc-500 uppercase">
          Source Image
        </h2>
        <ImageUploader
          :image-src="imageSrc"
          :loading="isExtracting"
          @file-selected="handleFileSelect"
          @url-selected="handleUrlSelect"
        />

        <div v-if="error" class="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-medium">
          {{ error }}
        </div>
      </section>

      <!-- Right Column: Extracted Palette & Inspector -->
      <section class="lg:col-span-7 flex flex-col gap-6">
        <h2 class="text-sm font-semibold tracking-wider text-zinc-500 uppercase">
          Extracted Palette
        </h2>

        <PaletteDisplay
          :colors="colors"
          :color-count="colorCount"
          :active-format="activeFormat"
          :selected-color="selectedColor"
          :loading="isExtracting"
          @update:color-count="updateColorCount"
          @update:active-format="setFormat"
          @select-color="selectColor"
        />

        <!-- Detailed Color Inspector Card -->
        <div
          v-if="selectedColor"
          class="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-center gap-6"
        >
          <div
            class="w-full md:w-32 h-32 rounded-xl shadow-inner border border-black/10 dark:border-white/10 shrink-0 transition-colors duration-300"
            :style="{ backgroundColor: selectedColor.hex }"
          />

          <div class="flex flex-col gap-3 w-full">
            <div class="flex items-center justify-between">
              <span class="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Color Metrics
              </span>
              <BaseBadge :variant="selectedColor.isLight ? 'neutral' : 'accent'">
                {{ selectedColor.isLight ? 'Light Tone' : 'Dark Tone' }}
              </BaseBadge>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              <div class="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <span class="block text-[10px] text-zinc-400 uppercase font-sans">HEX</span>
                <span class="font-bold text-zinc-800 dark:text-zinc-200">{{ selectedColor.hex }}</span>
              </div>
              <div class="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <span class="block text-[10px] text-zinc-400 uppercase font-sans">RGB</span>
                <span class="font-bold text-zinc-800 dark:text-zinc-200">{{ selectedColor.rgb.r }}, {{ selectedColor.rgb.g }}, {{ selectedColor.rgb.b }}</span>
              </div>
              <div class="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <span class="block text-[10px] text-zinc-400 uppercase font-sans">HSL</span>
                <span class="font-bold text-zinc-800 dark:text-zinc-200">{{ selectedColor.hsl.h }}°, {{ selectedColor.hsl.s }}%, {{ selectedColor.hsl.l }}%</span>
              </div>
              <div class="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <span class="block text-[10px] text-zinc-400 uppercase font-sans">Luminance</span>
                <span class="font-bold text-zinc-800 dark:text-zinc-200">{{ selectedColor.luminance.toFixed(3) }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
      <p>© 2026 Chroma Extract. Built with Vue 3 & Tailwind CSS.</p>
      <div class="flex gap-4">
        <span>Zero Backend Processing</span>
        <span>•</span>
        <span>Canvas Engine</span>
      </div>
    </footer>
  </div>
</template>