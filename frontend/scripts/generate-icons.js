#!/usr/bin/env node

/**
 * PWA Icon Generator Script
 * Generates all required PWA icons from a base logo
 * Run with: node scripts/generate-icons.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Icon sizes required for PWA
const ICON_SIZES = [
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
];

// iOS splash screen sizes
const SPLASH_SIZES = [
  { width: 2048, height: 2732, name: 'apple-splash-2048-2732.png' },
  { width: 1668, height: 2224, name: 'apple-splash-1668-2224.png' },
  { width: 1536, height: 2048, name: 'apple-splash-1536-2048.png' },
  { width: 1125, height: 2436, name: 'apple-splash-1125-2436.png' },
  { width: 1242, height: 2208, name: 'apple-splash-1242-2208.png' },
  { width: 750, height: 1334, name: 'apple-splash-750-1334.png' },
  { width: 640, height: 1136, name: 'apple-splash-640-1136.png' },
];

// Shortcut icons
const SHORTCUT_ICONS = [
  { name: 'shortcut-promotion.png', size: 96 },
  { name: 'shortcut-store.png', size: 96 },
  { name: 'shortcut-admin.png', size: 96 },
];

const ICONS_DIR = path.join(__dirname, '../public/icons');
const BASE_LOGO = path.join(__dirname, '../public/images/logo.png');

// Create icons directory if it doesn't exist
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// Check if base logo exists
if (!fs.existsSync(BASE_LOGO)) {
  console.error('❌ Base logo not found at:', BASE_LOGO);
  console.log('📝 Please place your logo.png file in public/images/ directory');
  console.log('📝 Recommended size: 512x512px or larger');
  process.exit(1);
}

console.log('🚀 Starting PWA icon generation...');
console.log('📁 Icons will be saved to:', ICONS_DIR);

// Create a simple SVG-based icon generator
function createSVGIcon(size, type = 'app') {
  const colors = {
    app: '#0066cc',
    promotion: '#10b981',
    store: '#f59e0b',
    admin: '#ef4444',
  };
  
  const color = colors[type] || colors.app;
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="${color}"/>
    <text x="50%" y="50%" text-anchor="middle" dy="0.35em" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="white">
      ${type === 'app' ? 'وف' : type === 'promotion' ? 'ت' : type === 'store' ? 'ف' : 'م'}
    </text>
  </svg>`;
}

// Create a simple splash screen SVG
function createSplashScreen(width, height) {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="#0066cc"/>
    <circle cx="${width/2}" cy="${height/2}" r="${Math.min(width, height) * 0.15}" fill="white"/>
    <text x="50%" y="50%" text-anchor="middle" dy="0.35em" font-family="Arial, sans-serif" font-size="${Math.min(width, height) * 0.08}" font-weight="bold" fill="white">
      برنامه وفاداری
    </text>
  </svg>`;
}

// Generate icons
async function generateIcons() {
  try {
    // Generate app icons
    console.log('📱 Generating app icons...');
    for (const icon of ICON_SIZES) {
      const svg = createSVGIcon(icon.size, 'app');
      const svgPath = path.join(ICONS_DIR, icon.name.replace('.png', '.svg'));
      fs.writeFileSync(svgPath, svg);
      console.log(`✅ Generated ${icon.name}`);
    }

    // Generate splash screens
    console.log('📱 Generating splash screens...');
    for (const splash of SPLASH_SIZES) {
      const svg = createSplashScreen(splash.width, splash.height);
      const svgPath = path.join(ICONS_DIR, splash.name.replace('.png', '.svg'));
      fs.writeFileSync(svgPath, svg);
      console.log(`✅ Generated ${splash.name}`);
    }

    // Generate shortcut icons
    console.log('📱 Generating shortcut icons...');
    for (const shortcut of SHORTCUT_ICONS) {
      const type = shortcut.name.includes('promotion') ? 'promotion' : 
                   shortcut.name.includes('store') ? 'store' : 'admin';
      const svg = createSVGIcon(shortcut.size, type);
      const svgPath = path.join(ICONS_DIR, shortcut.name.replace('.png', '.svg'));
      fs.writeFileSync(svgPath, svg);
      console.log(`✅ Generated ${shortcut.name}`);
    }

    console.log('\n🎉 All icons generated successfully!');
    console.log('\n📝 Note: These are SVG placeholders. For production, you should:');
    console.log('1. Replace with actual PNG icons converted from your logo');
    console.log('2. Use tools like PWA Builder or online icon generators');
    console.log('3. Ensure icons follow PWA guidelines for maskable icons');
    
    console.log('\n🔗 Useful tools:');
    console.log('- PWA Builder: https://www.pwabuilder.com/');
    console.log('- Favicon Generator: https://realfavicongenerator.net/');
    console.log('- Maskable Icon Generator: https://maskable.app/');

  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

// Run the generator
generateIcons();
