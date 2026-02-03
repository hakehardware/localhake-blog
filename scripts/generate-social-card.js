#!/usr/bin/env node
/**
 * Social Card Generator for Localhake
 * 
 * This script converts the SVG social card to PNG format.
 * 
 * Usage:
 *   node scripts/generate-social-card.js
 * 
 * Requirements:
 *   pnpm add -D sharp
 * 
 * The script reads static/img/localhake-social-card.svg and outputs
 * static/img/localhake-social-card.png at 1200x630 pixels.
 */

const fs = require('fs');
const path = require('path');

async function generateSocialCard() {
  try {
    // Try to use sharp if available
    const sharp = require('sharp');
    
    const svgPath = path.join(__dirname, '../static/img/localhake-social-card.svg');
    const pngPath = path.join(__dirname, '../static/img/localhake-social-card.png');
    
    const svgBuffer = fs.readFileSync(svgPath);
    
    await sharp(svgBuffer)
      .resize(1200, 630)
      .png()
      .toFile(pngPath);
    
    console.log('✅ Social card generated successfully!');
    console.log(`   Output: ${pngPath}`);
    console.log('   Dimensions: 1200x630px');
    
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('⚠️  Sharp module not found.');
      console.log('');
      console.log('To generate the PNG social card, you have two options:');
      console.log('');
      console.log('Option 1: Install sharp and run this script');
      console.log('  pnpm add -D sharp');
      console.log('  node scripts/generate-social-card.js');
      console.log('');
      console.log('Option 2: Convert manually');
      console.log('  1. Open static/img/localhake-social-card.svg in a browser');
      console.log('  2. Take a screenshot or use an online SVG to PNG converter');
      console.log('  3. Save as static/img/localhake-social-card.png (1200x630px)');
      console.log('');
      console.log('Option 3: Use ImageMagick (if installed)');
      console.log('  convert -background none -size 1200x630 static/img/localhake-social-card.svg static/img/localhake-social-card.png');
      
    } else {
      console.error('❌ Error generating social card:', error.message);
    }
    process.exit(1);
  }
}

generateSocialCard();
