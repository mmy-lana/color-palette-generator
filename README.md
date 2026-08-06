# 🎨 Chroma Extract — Color Palette Generator

A modern, fast, client-side web application built with **Vue 3** and **Tailwind CSS v4** that extracts harmonious, dominant color palettes from any image.

🔗 **Live Demo:** [https://color-palette-generator-eight-fawn.vercel.app](https://color-palette-generator-eight-fawn.vercel.app)

---

## 🧐 What is this web app?

**Chroma Extract** is an intuitive color utility for designers, frontend developers, and digital creators. Upload any image (or choose a sample preset) to instantly generate an interactive color palette with complete color metrics (HEX, RGB, HSL, CMYK), WCAG relative luminance ratings, and one-click export tools.

---

## 🎯 Why build this?

- **Zero Server Overhead & Privacy First:** All image processing happens 100% locally in your browser. No files are uploaded to an external server.
- **Workflow Efficiency:** Quickly obtain usable palette arrays in standard web formats without opening bulky design software like Photoshop or Figma.
- **Developer-Ready Exports:** Copy individual color codes or export the entire palette as native CSS custom properties (`:root` variables) or structured JSON.
- **Accessibility & Contrast Aware:** Automatically calculates color luminance to adjust text contrast and highlight light vs. dark tones.

---

## 🔬 How does it analyze image data into Color HEX?

The color extraction pipeline uses standard browser APIs and mathematical color quantization:

1. **HTML5 Canvas Context Rendering:**
   The source image is rendered onto an offscreen HTML5 `CanvasRenderingContext2D` element.

2. **Pixel Downsampling:**
   To guarantee real-time performance (< 50ms processing speed), the image bounds are dynamically constrained to a maximum dimension of 200px before sampling raw pixel data (`getImageData`).

3. **Euclidean Color Bucket Quantization:**
   - Raw RGBA values are iterated in steps across the image grid.
   - Fully transparent pixels ($A < 128$) are discarded.
   - Colors are grouped into spatial buckets based on 3D Euclidean distance in the RGB space:
     $$\text{Distance} = \sqrt{(R_1 - R_2)^2 + (G_1 - G_2)^2 + (B_1 - B_2)^2}$$
   - Pixels within a specific threshold tolerance are merged into cluster centroids, maintaining accurate population counts.

4. **Luminance Math & Format Conversion:**
   - Dominant clusters are sorted by population density.
   - RGB values are converted into **HEX**, **HSL**, and **CMYK** color representations.
   - WCAG 2.1 relative luminance is calculated ($0.2126R + 0.7152G + 0.0722B$) to determine contrast ratios and light/dark classification.

---

## 🛠️ Tech Stack

- **Framework:** Vue 3 (Composition API + `<script setup>`)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Build Tool:** Vite + TypeScript
- **Deployment:** Vercel

---

## 🚀 Local Development Setup

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/color-palette-generator.git
cd color-palette-generator

# Install dependencies
npm install

# Start local dev server
npm run dev
