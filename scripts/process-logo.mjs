import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '..', 'public');

async function process() {
  const src = resolve(publicDir, 'logo-source.png');
  const img = sharp(src);
  const meta = await img.metadata();
  console.log('Source:', meta.width, 'x', meta.height, meta.format, 'channels:', meta.channels);

  const trimmed = sharp(src).trim();
  await trimmed.png().toFile(resolve(publicDir, 'logo.png'));
  const logoMeta = await sharp(resolve(publicDir, 'logo.png')).metadata();
  console.log('logo.png:', logoMeta.width, 'x', logoMeta.height);

  await sharp(src).trim().resize(32, 32).png().toFile(resolve(publicDir, 'favicon-32x32.png'));
  console.log('favicon-32x32.png saved');

  await sharp(src).trim().resize(16, 16).png().toFile(resolve(publicDir, 'favicon-16x16.png'));
  console.log('favicon-16x16.png saved');

  await sharp(src).trim().resize(180, 180).png().toFile(resolve(publicDir, 'apple-touch-icon.png'));
  console.log('apple-touch-icon.png saved');

  const fav16 = await sharp(resolve(publicDir, 'favicon-16x16.png')).raw().toBuffer();
  let opaqueCount = 0;
  for (let i = 0; i < fav16.length; i += 4) {
    if (fav16[i+3] > 0) opaqueCount++;
  }
  console.log('favicon-16x16 non-transparent pixels:', opaqueCount, '/ 256');

  const fav32 = await sharp(resolve(publicDir, 'favicon-32x32.png')).raw().toBuffer();
  const colors = new Set();
  for (let i = 0; i < fav32.length; i += 4) {
    if (fav32[i+3] > 0) {
      if (!(fav32[i] > 250 && fav32[i+1] > 250 && fav32[i+2] > 250)) {
        colors.add(`${fav32[i]},${fav32[i+1]},${fav32[i+2]}`);
      }
    }
  }
  console.log('Non-white unique colors in favicon-32x32:', colors.size);
}

process().catch(err => { console.error(err); process.exit(1); });
