// One-off converter: resizes the app's PNG artwork and re-encodes as WebP.
// Usage: node scripts/convert-images.mjs
import sharp from "sharp";
import { stat } from "node:fs/promises";

// Full-page backgrounds: capped at 1600px wide
const backgrounds = ["avocado1", "lemon", "cherry1", "peach5"];
// Cat portraits: rendered at ~200px, so 400px covers retina screens
const cats = [
  "ginger-cat-v2-meow",
  "ginger-cat-v2-floof",
  "ginger-cat-v2-grumpy",
  "ginger-cat-v2-windy",
  "ginger-cat-fruit-peach",
  "ginger-cat-fruit-cherry",
  "ginger-cat-fruit-lemon",
  "ginger-cat-fruit-avocado",
];

async function convert(name, maxWidth, quality) {
  const input = `public/${name}.png`;
  const output = `public/${name}.webp`;
  await sharp(input)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toFile(output);
  const before = (await stat(input)).size;
  const after = (await stat(output)).size;
  console.log(
    `${name}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`,
  );
}

for (const name of backgrounds) await convert(name, 1600, 75);
for (const name of cats) await convert(name, 400, 80);
