<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '../../../components/atoms/BaseButton.vue';

interface Props {
  imageSrc?: string | null;
  loading?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'file-selected', file: File): void;
  (e: 'url-selected', url: string): void;
}>();

const isDragging = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const sampleImages = [
  { name: 'Creative Canvas', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80' },
  { name: 'Ocean Sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Neon City', url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80' }
];

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    emit('file-selected', e.dataTransfer.files[0]);
  }
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    emit('file-selected', target.files[0]);
  }
};

const selectSample = (url: string) => {
  emit('url-selected', url);
};
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <div
      :class="[
        'relative group flex flex-col items-center justify-center w-full min-h-[320px] p-6 rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden bg-zinc-50 dark:bg-zinc-900/50',
        isDragging
          ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-950/20'
          : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600'
      ]"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <input
        ref="fileInputRef"
        type="file"
        accept="image/png, image/jpeg, image/webp"
        class="hidden"
        @change="handleFileChange"
      />

      <template v-if="imageSrc">
        <img
          :src="imageSrc"
          alt="Source image for palette extraction"
          class="absolute inset-0 w-full h-full object-cover rounded-2xl"
        />
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 backdrop-blur-xs">
          <BaseButton variant="primary" size="md" @click="triggerFileInput">
            Change Image
          </BaseButton>
        </div>
      </template>

      <template v-else>
        <div class="flex flex-col items-center text-center gap-3 max-w-sm">
          <div class="p-4 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="space-y-1">
            <p class="text-base font-semibold text-zinc-800 dark:text-zinc-200">
              Drag & drop image here
            </p>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">
              Supports PNG, JPG, or WebP up to 10MB
            </p>
          </div>
          <BaseButton variant="creative" size="md" class="mt-2" @click="triggerFileInput">
            Browse File
          </BaseButton>
        </div>
      </template>
    </div>

    <!-- Sample Preset Buttons -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1">
      <span class="text-xs font-medium text-zinc-500 whitespace-nowrap">Try samples:</span>
      <button
        v-for="sample in sampleImages"
        :key="sample.name"
        type="button"
        class="text-xs font-medium px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors whitespace-nowrap"
        @click="selectSample(sample.url)"
      >
        {{ sample.name }}
      </button>
    </div>
  </div>
</template>