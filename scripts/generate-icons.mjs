// Gera os ícones do app (PWA + favicon) como placeholders no estilo
// "placa de sinalização": círculo com listras amarelo/preto a 45°
// sobre fundo grafite. Roda uma vez, manualmente: node scripts/generate-icons.mjs
// Não depende de nenhuma lib de imagem — escreve PNG puro via zlib.

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

const publicDir = fileURLToPath(new URL("../public/", import.meta.url));
const iconsDir = join(publicDir, "icons");
mkdirSync(iconsDir, { recursive: true });

const GRAPHITE = [20, 22, 26];
const YELLOW = [247, 198, 0];

const CRC_TABLE = (() => {
  const table = new Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function makePng(width, height, pixelFn) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  let offset = 0;
  for (let y = 0; y < height; y++) {
    raw[offset++] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y);
      raw[offset++] = r;
      raw[offset++] = g;
      raw[offset++] = b;
      raw[offset++] = a;
    }
  }
  const compressed = zlib.deflateSync(raw, { level: 9 });

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function iconPixel(x, y, size, radiusFraction) {
  const cx = size / 2;
  const cy = size / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const radius = size * radiusFraction;
  if (dist > radius) return [...GRAPHITE, 255];
  const bandWidth = Math.max(4, Math.round(size / 11));
  const band = (((x - y) % (2 * bandWidth)) + 2 * bandWidth) % (2 * bandWidth);
  return band < bandWidth ? [...YELLOW, 255] : [...GRAPHITE, 255];
}

function writeIcon(filename, size, radiusFraction) {
  const png = makePng(size, size, (x, y) => iconPixel(x, y, size, radiusFraction));
  writeFileSync(join(iconsDir, filename), png);
  console.log(`✓ icons/${filename}`);
}

// "any": círculo ocupa quase todo o quadrado.
writeIcon("icon-192.png", 192, 0.46);
writeIcon("icon-512.png", 512, 0.46);
// "maskable": círculo confinado à zona segura (~40% de raio) pra não
// ser cortado por máscaras redondas/squircle do Android.
writeIcon("icon-192-maskable.png", 192, 0.34);
writeIcon("icon-512-maskable.png", 512, 0.34);
// Apple aplica o próprio recorte de cantos — ícone full-bleed.
writeIcon("apple-touch-icon.png", 180, 0.46);

// favicon.ico — PNG de 32x32 embrulhado em contêiner ICO (suportado
// desde o Windows Vista / todos os navegadores modernos).
const faviconPng = makePng(32, 32, (x, y) => iconPixel(x, y, 32, 0.46));
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(1, 4);
const icoEntry = Buffer.alloc(16);
icoEntry[0] = 32;
icoEntry[1] = 32;
icoEntry[2] = 0;
icoEntry[3] = 0;
icoEntry.writeUInt16LE(1, 4);
icoEntry.writeUInt16LE(32, 6);
icoEntry.writeUInt32LE(faviconPng.length, 8);
icoEntry.writeUInt32LE(22, 12);
const ico = Buffer.concat([icoHeader, icoEntry, faviconPng]);
writeFileSync(join(fileURLToPath(new URL("../app/", import.meta.url)), "favicon.ico"), ico);
console.log("✓ app/favicon.ico");
