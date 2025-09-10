#!/usr/bin/env node

/**
 * PWA Testing and Audit Script
 * Tests PWA functionality and provides audit results
 * Run with: node scripts/pwa-audit.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PWA Requirements Checklist
const PWA_REQUIREMENTS = {
  manifest: {
    name: 'Web App Manifest',
    required: true,
    files: ['/public/manifest.json'],
    checks: [
      'manifest.json exists',
      'has name and short_name',
      'has start_url',
      'has display mode',
      'has icons array',
      'has theme_color',
    ],
  },
  serviceWorker: {
    name: 'Service Worker',
    required: true,
    files: ['/public/sw.js'],
    checks: [
      'service worker file exists',
      'service worker is registered',
      'has install event handler',
      'has activate event handler',
      'has fetch event handler',
    ],
  },
  icons: {
    name: 'App Icons',
    required: true,
    files: [
      '/public/icons/icon-192x192.png',
      '/public/icons/icon-512x512.png',
    ],
    checks: [
      '192x192 icon exists',
      '512x512 icon exists',
      'icons are properly sized',
    ],
  },
  metaTags: {
    name: 'PWA Meta Tags',
    required: true,
    files: ['/app/layout.tsx'],
    checks: [
      'has theme-color meta tag',
      'has apple-mobile-web-app-capable',
      'has apple-mobile-web-app-title',
      'has mobile-web-app-capable',
      'has manifest link',
    ],
  },
  https: {
    name: 'HTTPS Support',
    required: true,
    files: [],
    checks: [
      'served over HTTPS in production',
      'secure context for service worker',
    ],
  },
  offline: {
    name: 'Offline Support',
    required: false,
    files: ['/public/offline.html'],
    checks: [
      'offline page exists',
      'service worker handles offline requests',
      'caching strategy implemented',
    ],
  },
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

// Check if file exists
function fileExists(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  return fs.existsSync(fullPath);
}

// Check file content
function checkFileContent(filePath, checks) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) {
    return { exists: false, content: null };
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  return { exists: true, content };
}

// Audit manifest.json
function auditManifest() {
  const result = { passed: 0, total: 0, issues: [] };
  
  if (!fileExists('/public/manifest.json')) {
    result.issues.push('manifest.json file not found');
    return result;
  }
  
  const { content } = checkFileContent('/public/manifest.json');
  const manifest = JSON.parse(content);
  
  const checks = [
    { key: 'name', message: 'Missing name field' },
    { key: 'short_name', message: 'Missing short_name field' },
    { key: 'start_url', message: 'Missing start_url field' },
    { key: 'display', message: 'Missing display field' },
    { key: 'icons', message: 'Missing icons array' },
    { key: 'theme_color', message: 'Missing theme_color field' },
  ];
  
  checks.forEach(check => {
    result.total++;
    if (manifest[check.key]) {
      result.passed++;
    } else {
      result.issues.push(check.message);
    }
  });
  
  // Check icons array
  if (manifest.icons && Array.isArray(manifest.icons)) {
    result.total++;
    if (manifest.icons.length >= 2) {
      result.passed++;
    } else {
      result.issues.push('Insufficient icons in manifest');
    }
  }
  
  return result;
}

// Audit service worker
function auditServiceWorker() {
  const result = { passed: 0, total: 0, issues: [] };
  
  if (!fileExists('/public/sw.js')) {
    result.issues.push('Service worker file not found');
    return result;
  }
  
  const { content } = checkFileContent('/public/sw.js');
  
  const checks = [
    { pattern: /addEventListener\s*\(\s*['"]install['"]/, message: 'Missing install event handler' },
    { pattern: /addEventListener\s*\(\s*['"]activate['"]/, message: 'Missing activate event handler' },
    { pattern: /addEventListener\s*\(\s*['"]fetch['"]/, message: 'Missing fetch event handler' },
    { pattern: /caches\.open/, message: 'Missing cache management' },
    { pattern: /skipWaiting/, message: 'Missing skipWaiting call' },
  ];
  
  checks.forEach(check => {
    result.total++;
    if (check.pattern.test(content)) {
      result.passed++;
    } else {
      result.issues.push(check.message);
    }
  });
  
  return result;
}

// Audit icons
function auditIcons() {
  const result = { passed: 0, total: 0, issues: [] };
  
  const requiredIcons = [
    '/public/icons/android-icon-192x192.png',
    '/public/icons/apple-icon-180x180.png',
  ];
  
  requiredIcons.forEach(iconPath => {
    result.total++;
    if (fileExists(iconPath)) {
      result.passed++;
    } else {
      result.issues.push(`Missing icon: ${iconPath}`);
    }
  });
  
  return result;
}

// Audit meta tags
function auditMetaTags() {
  const result = { passed: 0, total: 0, issues: [] };
  
  if (!fileExists('/app/layout.tsx')) {
    result.issues.push('layout.tsx file not found');
    return result;
  }
  
  const { content } = checkFileContent('/app/layout.tsx');
  
  const checks = [
    { pattern: /theme-color/, message: 'Missing theme-color meta tag' },
    { pattern: /apple-mobile-web-app-capable/, message: 'Missing apple-mobile-web-app-capable' },
    { pattern: /apple-mobile-web-app-title/, message: 'Missing apple-mobile-web-app-title' },
    { pattern: /mobile-web-app-capable/, message: 'Missing mobile-web-app-capable' },
    { pattern: /rel=['"]manifest['"]/, message: 'Missing manifest link' },
  ];
  
  checks.forEach(check => {
    result.total++;
    if (check.pattern.test(content)) {
      result.passed++;
    } else {
      result.issues.push(check.message);
    }
  });
  
  return result;
}

// Audit offline support
function auditOfflineSupport() {
  const result = { passed: 0, total: 0, issues: [] };
  
  result.total++;
  if (fileExists('/public/offline.html')) {
    result.passed++;
  } else {
    result.issues.push('Missing offline.html page');
  }
  
  return result;
}

// Main audit function
async function runPWAAudit() {
  console.log(colorize('🔍 PWA Audit Report', 'cyan'));
  console.log(colorize('==================', 'cyan'));
  console.log();
  
  const audits = [
    { name: 'Manifest', fn: auditManifest },
    { name: 'Service Worker', fn: auditServiceWorker },
    { name: 'Icons', fn: auditIcons },
    { name: 'Meta Tags', fn: auditMetaTags },
    { name: 'Offline Support', fn: auditOfflineSupport },
  ];
  
  let totalPassed = 0;
  let totalChecks = 0;
  
  audits.forEach(audit => {
    console.log(colorize(`📋 ${audit.name}`, 'blue'));
    const result = audit.fn();
    
    const percentage = result.total > 0 ? Math.round((result.passed / result.total) * 100) : 0;
    const status = percentage === 100 ? '✅' : percentage >= 80 ? '⚠️' : '❌';
    
    console.log(`   ${status} ${result.passed}/${result.total} checks passed (${percentage}%)`);
    
    if (result.issues.length > 0) {
      result.issues.forEach(issue => {
        console.log(colorize(`   • ${issue}`, 'red'));
      });
    }
    
    totalPassed += result.passed;
    totalChecks += result.total;
    console.log();
  });
  
  const overallPercentage = totalChecks > 0 ? Math.round((totalPassed / totalChecks) * 100) : 0;
  
  console.log(colorize('📊 Overall Score', 'magenta'));
  console.log(colorize('================', 'magenta'));
  console.log(`${totalPassed}/${totalChecks} checks passed (${overallPercentage}%)`);
  
  if (overallPercentage === 100) {
    console.log(colorize('🎉 Perfect! Your PWA is ready for production!', 'green'));
  } else if (overallPercentage >= 80) {
    console.log(colorize('👍 Good! Your PWA is mostly ready with minor issues.', 'yellow'));
  } else {
    console.log(colorize('⚠️ Your PWA needs more work before production.', 'red'));
  }
  
  console.log();
  console.log(colorize('🔗 Next Steps:', 'cyan'));
  console.log('1. Fix any issues mentioned above');
  console.log('2. Test your PWA with Chrome DevTools');
  console.log('3. Use PWA Builder for additional validation');
  console.log('4. Test on real devices');
  console.log('5. Submit to app stores if desired');
  
  console.log();
  console.log(colorize('🛠️ Testing Tools:', 'cyan'));
  console.log('• Chrome DevTools > Application > Manifest');
  console.log('• Chrome DevTools > Application > Service Workers');
  console.log('• Lighthouse PWA audit');
  console.log('• PWA Builder: https://www.pwabuilder.com/');
  console.log('• Web App Manifest Validator: https://manifest-validator.appspot.com/');
}

// Run the audit
runPWAAudit().catch(console.error);
