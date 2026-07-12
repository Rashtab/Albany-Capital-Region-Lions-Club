/**
 * One-time image optimization script.
 * Generates:
 *  1. A compressed WebP hero image from the original PNG banner.
 *  2. 480px-wide WebP thumbnails for every gallery photo.
 *
 * Outputs land in attached_assets/thumbnails/ so Vite's @assets alias picks them up.
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(ROOT, "attached_assets");
const THUMB_DIR = path.join(ASSETS_DIR, "thumbnails");

fs.mkdirSync(THUMB_DIR, { recursive: true });

// ── 1. Hero banner → compressed WebP ─────────────────────────────────────────
const heroBanner = path.join(ASSETS_DIR, "banner_without_text_1777739378649.png");
const heroOut = path.join(ASSETS_DIR, "banner_hero_optimized.webp");

console.log("Optimizing hero banner…");
await sharp(heroBanner)
  .resize({ width: 1920, withoutEnlargement: true })
  .webp({ quality: 75, effort: 4 })
  .toFile(heroOut);

const heroInSize = fs.statSync(heroBanner).size;
const heroOutSize = fs.statSync(heroOut).size;
console.log(
  `  ${(heroInSize / 1024).toFixed(0)} KB → ${(heroOutSize / 1024).toFixed(0)} KB  (${Math.round((1 - heroOutSize / heroInSize) * 100)}% smaller)`
);

// ── 2. Gallery thumbnails (480px wide WebP) ───────────────────────────────────
const galleryPhotos = [
  // Eid
  "660302350_27351706501086056_6964347259712242193_n_1777737102946.jpg",
  "660312857_27351712484418791_1133339746705830951_n_1777737102946.jpg",
  "661679011_27351706741086032_2203451379640769336_n_1777737102947.jpg",
  "661940042_27351705901086116_3208867297445150570_n_1777737102947.jpg",
  "661999974_27351710474418992_7778557972642127946_n_1777737102947.jpg",
  "662299240_27351713694418670_3924625390615541126_n_1777737102947.jpg",
  "662557547_27351706257752747_654196626627361434_n_1777737102948.jpg",
  "662651788_27351705661086140_1970818503690945375_n_1777737102948.jpg",
  "663392265_27351718824418157_1639878535471500215_n_1777737102948.jpg",
  // Bangladesh
  "654920156_27236604242596283_4619469104950022459_n_1777737014658.jpg",
  "655647114_27236602609263113_4884393155647146208_n_1777737014659.jpg",
  "655921593_27236601795929861_2995428896969278720_n_1777737014659.jpg",
  "656439556_27236603982596309_2283481694874313580_n_1777737014659.jpg",
  "656977872_27236604639262910_4883503647491506412_n_1777737014659.jpg",
  "657518596_27236602432596464_3393425326490924330_n_1777737014660.jpg",
  "657677275_27236602002596507_5436907802804670794_n_1777737014660.jpg",
  "DSC_0027_1777737014660.jpg",
  "DSC_0035_1777737014661.jpg",
  "DSC_0036_1777737014661.jpg",
  "DSC_0061_1777737014661.jpg",
  "IMG_0176~photo_1777737014661.JPG",
  // Spring
  "657170638_27329824959940877_7160008379873549711_n_1777736796621.jpg",
  "658138737_27329818183274888_5144718517033310575_n_1777736796622.jpg",
  "658368733_27329813153275391_7675333575341318947_n_1777736796622.jpg",
  "658953008_27329812339942139_6719885944769756001_n_1777736796622.jpg",
  "659080083_27329814346608605_345116296583840873_n_1777736796622.jpg",
  "659080083_27329819236608116_8403862632037547446_n_1777736796622.jpg",
  "659142810_27329814616608578_7127971519937103089_n_1777736796623.jpg",
  "659142988_27329831493273557_8666769162277819709_n_1777736805936.jpg",
  "659190846_27338065105783529_5936683302501544713_n_1777736805936.jpg",
  "659634467_27329829429940430_2589865739915104268_n_1777736805937.jpg",
  "659827450_27338064329116940_7936053785895768580_n_1777736805937.jpg",
  "659829676_27338067249116648_1986983784978650012_n_1777736805937.jpg",
  "659838771_27329812919942081_5536429888456845101_n_1777736805937.jpg",
  "660159449_27329829713273735_2326270760096400055_n_1777736805938.jpg",
  "660532668_27329815713275135_8307670286658515926_n_1777736906026.jpg",
  "660970208_27329815199941853_5232342538291491060_n_1777736906026.jpg",
  "661047750_27342935765296463_6855499252572700307_n_1777736906026.jpg",
  "661213735_27329821953274511_2613966495426069028_n_1777736906027.jpg",
  "662403874_27329811583275548_6050078312485094749_n_1777736906027.jpg",
  "662509903_27329817939941579_7055871740958051907_n_1777736906027.jpg",
  "663042370_27329814116608628_8525675026473977089_n_1777736906028.jpg",
  "DSC_0784_1777736906028.jpg",
  "DSC_0805_1777736906028.jpg",
  "WhatsApp_Image_2026-04-18_at_4.51.41_AM_1777736906029.jpeg",
  // District
  "_DSC4848_1777736679657.JPG",
  "651138768_27123701403886568_1823916708111424254_n_1777736679657.jpg",
  "WhatsApp_Image_2026-04-24_at_1.31.09_AM_1777736679657.jpeg",
  "WhatsApp_Image_2026-04-24_at_1.31.21_AM_(3)_1777736679657.jpeg",
  "WhatsApp_Image_2026-04-24_at_10.01.55_AM_1777736679658.jpeg",
  "WhatsApp_Image_2026-04-24_at_10.01.56_AM_(1)_1777736679658.jpeg",
  "WhatsApp_Image_2026-04-24_at_10.01.56_AM_(2)_1777736679658.jpeg",
  "WhatsApp_Image_2026-04-24_at_10.01.56_AM_(3)_1777736679658.jpeg",
  "WhatsApp_Image_2026-04-24_at_10.01.56_AM_(4)_1777736679659.jpeg",
  "WhatsApp_Image_2026-04-24_at_10.01.56_AM_(5)_1777736679659.jpeg",
  "WhatsApp_Image_2026-04-24_at_10.01.56_AM_1777736679659.jpeg",
  "WhatsApp_Image_2026-04-24_at_11.32.02_AM_(1)_1777736679659.jpeg",
  "WhatsApp_Image_2026-04-24_at_11.32.02_AM_1777736679660.jpeg",
  // Iftar
  "647084174_27055032814086761_5907395881288517276_n_1777736424850.jpg",
  "648101133_27055032100753499_8094953426604179726_n_1777736424851.jpg",
  "649531670_27055033367420039_3542110652252670645_n_1777736424851.jpg",
];

console.log(`\nGenerating ${galleryPhotos.length} thumbnails…`);
let totalIn = 0;
let totalOut = 0;

for (const filename of galleryPhotos) {
  const src = path.join(ASSETS_DIR, filename);
  // Output name: strip original extension, add .webp suffix
  const baseName = path.basename(filename, path.extname(filename));
  const dest = path.join(THUMB_DIR, `${baseName}.webp`);

  if (!fs.existsSync(src)) {
    console.warn(`  SKIP (not found): ${filename}`);
    continue;
  }

  try {
    await sharp(src)
      .resize({ width: 480, withoutEnlargement: true })
      .webp({ quality: 72, effort: 3 })
      .toFile(dest);

    const inSize = fs.statSync(src).size;
    const outSize = fs.statSync(dest).size;
    totalIn += inSize;
    totalOut += outSize;
    console.log(
      `  ${filename.slice(0, 40).padEnd(40)} ${(inSize / 1024).toFixed(0).padStart(6)} KB → ${(outSize / 1024).toFixed(0).padStart(5)} KB`
    );
  } catch (err) {
    console.error(`  ERROR: ${filename}: ${err.message}`);
  }
}

console.log(`\nTotal gallery payload:`);
console.log(`  Before: ${(totalIn / 1024 / 1024).toFixed(1)} MB`);
console.log(`  After:  ${(totalOut / 1024 / 1024).toFixed(1)} MB`);
console.log(`  Saved:  ${((1 - totalOut / totalIn) * 100).toFixed(0)}%`);
console.log("\nDone.");
