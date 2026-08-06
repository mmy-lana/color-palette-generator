<script setup lang="ts">
interface Props {
  modelValue: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  min: 2,
  max: 12,
  step: 1,
  label: undefined,
  id: 'slider-input'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', Number(target.value));
};
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <div v-if="label" class="flex justify-between items-center text-xs font-medium text-zinc-700 dark:text-zinc-300">
      <label :for="id">{{ label }}</label>
      <span class="font-mono text-zinc-500 font-bold">{{ modelValue }}</span>
    </div>
    <input
      :id="id"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      class="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-1"
      @input="handleInput"
    />
  </div>
</template>