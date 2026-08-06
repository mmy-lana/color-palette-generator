import type { ColorData, RgbColor } from '../../../shared/types';
import {
  rgbToHex,
  rgbToHsl,
  rgbToCmyk,
  getRelativeLuminance,
  isLightColor
} from '../../../shared/utils/formatters';

interface ColorBucket {
  r: number;
  g: number;
  b: number;
  count: number;
}

export async function extractColorsFromImage(
  imageElement: HTMLImageElement,
  colorCount: number = 6
): Promise<ColorData[]> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (!ctx) {
        reject(new Error('Canvas 2D context unavailable'));
        return;
      }

      const maxDimension = 200;
      let width = imageElement.naturalWidth || imageElement.width;
      let height = imageElement.naturalHeight || imageElement.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(imageElement, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;

      const buckets = clusterPixels(pixels, colorCount);
      const colors: ColorData[] = buckets.map((bucket, index) => {
        const hex = rgbToHex(bucket.r, bucket.g, bucket.b);
        const rgb: RgbColor = { r: bucket.r, g: bucket.g, b: bucket.b };
        const hsl = rgbToHsl(bucket.r, bucket.g, bucket.b);
        const cmyk = rgbToCmyk(bucket.r, bucket.g, bucket.b);
        const luminance = getRelativeLuminance(bucket.r, bucket.g, bucket.b);
        const light = isLightColor(bucket.r, bucket.g, bucket.b);

        return {
          id: `color-${index}-${Date.now()}`,
          hex,
          rgb,
          hsl,
          cmyk,
          population: bucket.count,
          luminance,
          isLight: light
        };
      });

      resolve(colors);
    } catch (err) {
      reject(err);
    }
  });
}

function clusterPixels(pixels: Uint8ClampedArray, targetClusters: number): ColorBucket[] {
  const buckets: ColorBucket[] = [];
  const tolerance = 35;

  for (let i = 0; i < pixels.length; i += 16) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    if (a < 128) continue;

    let matched = false;
    for (const bucket of buckets) {
      const dist = Math.sqrt(
        Math.pow(r - bucket.r, 2) + Math.pow(g - bucket.g, 2) + Math.pow(b - bucket.b, 2)
      );

      if (dist < tolerance) {
        bucket.r = Math.round((bucket.r * bucket.count + r) / (bucket.count + 1));
        bucket.g = Math.round((bucket.g * bucket.count + g) / (bucket.count + 1));
        bucket.b = Math.round((bucket.b * bucket.count + b) / (bucket.count + 1));
        bucket.count++;
        matched = true;
        break;
      }
    }

    if (!matched) {
      buckets.push({ r, g, b, count: 1 });
    }
  }

  buckets.sort((a, b) => b.count - a.count);
  return buckets.slice(0, targetClusters);
}