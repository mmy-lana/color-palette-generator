import { ref } from 'vue';
import type { ColorData, ColorFormat } from '../../../shared/types';
import { extractColorsFromImage } from '../services/colorExtractor';

export function usePaletteExtractor() {
  const imageSrc = ref<string | null>(null);
  const colors = ref<ColorData[]>([]);
  const isExtracting = ref(false);
  const error = ref<string | null>(null);
  const colorCount = ref(6);
  const activeFormat = ref<ColorFormat>('hex');
  const selectedColor = ref<ColorData | null>(null);

  const processImage = async (imgElement: HTMLImageElement) => {
    isExtracting.value = true;
    error.value = null;

    try {
      const extracted = await extractColorsFromImage(imgElement, colorCount.value);
      colors.value = extracted;
      if (extracted.length > 0) {
        selectedColor.value = extracted[0];
      }
    } catch (err: any) {
      error.value = err?.message || 'Failed to extract colors from image.';
    } finally {
      isExtracting.value = false;
    }
  };

  const loadFromFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      error.value = 'Please select a valid image file (PNG, JPG, WebP).';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      imageSrc.value = result;

      const img = new Image();
      img.onload = () => processImage(img);
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const loadFromUrl = (url: string) => {
    imageSrc.value = url;
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => processImage(img);
    img.onerror = () => {
      error.value = 'Failed to load image from URL due to CORS or broken link.';
    };
    img.src = url;
  };

  const updateColorCount = (count: number) => {
    colorCount.value = count;
    if (imageSrc.value) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => processImage(img);
      img.src = imageSrc.value;
    }
  };

  const setFormat = (format: ColorFormat) => {
    activeFormat.value = format;
  };

  const selectColor = (color: ColorData) => {
    selectedColor.value = color;
  };

  return {
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
  };
}