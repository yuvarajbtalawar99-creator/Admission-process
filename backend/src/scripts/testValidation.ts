import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { validateDocument } from '../utils/documentValidation.util';

async function runTests() {
  console.log('🧪 Testing Document Quality Validation System...\n');

  const testDir = path.join(process.cwd(), 'temp_test_images');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  const colorImagePath = path.join(testDir, 'sharp_color.png');
  const bwImagePath = path.join(testDir, 'bw_image.png');
  const blurryImagePath = path.join(testDir, 'blurry_image.png');

  // 1. Create a sharp color test image (Red/Blue gradient with text/shapes)
  await sharp({
    create: {
      width: 400,
      height: 400,
      channels: 4,
      background: { r: 255, g: 0, b: 50, alpha: 1 },
    },
  })
    .composite([
      {
        input: Buffer.from(
          '<svg width="400" height="400"><rect x="50" y="50" width="300" height="300" fill="#00FF44"/><text x="100" y="200" font-size="30" fill="#0000FF">SHARP COLOR DOC</text></svg>'
        ),
      },
    ])
    .png()
    .toFile(colorImagePath);

  // 2. Create a Black & White / Grayscale test image
  await sharp(colorImagePath)
    .grayscale()
    .png()
    .toFile(bwImagePath);

  // 3. Create a heavily Blurred test image
  await sharp(colorImagePath)
    .blur(15)
    .png()
    .toFile(blurryImagePath);

  console.log('1. Testing Passport Photo (Requires Color + Blur) on Sharp Color Image:');
  const res1 = await validateDocument('photo', colorImagePath);
  console.log('Result:', JSON.stringify(res1, null, 2));

  console.log('\n2. Testing Passport Photo (Requires Color + Blur) on Black & White Image:');
  const res2 = await validateDocument('photo', bwImagePath);
  console.log('Result:', JSON.stringify(res2, null, 2));

  console.log('\n3. Testing Aadhaar Card (Requires Color + Blur) on Blurry Image:');
  const res3 = await validateDocument('aadhaar', blurryImagePath);
  console.log('Result:', JSON.stringify(res3, null, 2));

  console.log('\n4. Testing E-Signature (Blur Only, NO Color) on B&W Signature Image:');
  const res4 = await validateDocument('signature', bwImagePath);
  console.log('Result:', JSON.stringify(res4, null, 2));

  // Cleanup test files
  fs.rmSync(testDir, { recursive: true, force: true });
  console.log('\n✅ All tests executed successfully.');
}

runTests().catch(console.error);
