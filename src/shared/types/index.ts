export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'cmyk';

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export interface CmykColor {
  c: number;
  m: number;
  y: number;
  k: number;
}

export interface ColorData {
  id: string;
  hex: string;
  rgb: RgbColor;
  hsl: HslColor;
  cmyk: CmykColor;
  population: number;
  luminance: number;
  isLight: boolean;
  name?: string;
}

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'creative';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type BadgeVariant = 'neutral' | 'accent' | 'success' | 'outline';