// scripts/convert-images.mjs
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const inputDir = 'public/images/products';
const outputDir = 'public/images/products';

async function convertImages() {
  try {
    const files = await fs.readdir(inputDir);
    const pngFiles = files.filter(file => path.extname(file).toLowerCase() === '.png');

    if (pngFiles.length === 0) {
      console.log('No PNG files found to convert.');
      return;
    }

    console.log(`Found ${pngFiles.length} PNG files. Starting conversion...`);

    for (const file of pngFiles) {
      const inputPath = path.join(inputDir, file);
      const outputFileName = `${path.basename(file, '.png')}.webp`;
      const outputPath = path.join(outputDir, outputFileName);

      try {
        await sharp(inputPath)
          .webp({ quality: 80 }) // Using an 80% quality setting for a good balance of size and quality
          .toFile(outputPath);
        console.log(`Successfully converted ${file} to ${outputFileName}`);
      } catch (err) {
        console.error(`Error converting ${file}:`, err);
      }
    }

    console.log('Image conversion complete.');
  } catch (err) {
    console.error('Error reading the directory:', err);
  }
}

convertImages(); 