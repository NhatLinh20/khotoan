const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Remove all dark: classes
  content = content.replace(/dark:[a-zA-Z0-9/-]+/g, '');

  // Typography
  content = content.replace(/font-black/g, 'font-display font-bold');
  content = content.replace(/text-gray-900/g, 'text-primary');
  content = content.replace(/text-gray-800/g, 'text-primary');
  content = content.replace(/text-gray-600/g, 'text-secondary');
  content = content.replace(/text-gray-500/g, 'text-secondary');
  content = content.replace(/text-gray-400/g, 'text-secondary/80');
  content = content.replace(/text-gray-300/g, 'text-secondary/50');
  content = content.replace(/text-white/g, 'text-surface');
  
  // Need to be careful with text-primary since it's already there
  // Not replacing text-primary

  // Backgrounds
  content = content.replace(/bg-white/g, 'bg-surface');
  content = content.replace(/bg-gray-50/g, 'bg-neutral');
  content = content.replace(/bg-gray-100/g, 'bg-neutral');

  // Borders
  content = content.replace(/border-gray-100/g, 'border-secondary/20');
  content = content.replace(/border-gray-200/g, 'border-secondary/20');

  // Radius
  content = content.replace(/rounded-2xl/g, 'rounded-md');
  content = content.replace(/rounded-3xl/g, 'rounded-lg');
  content = content.replace(/rounded-xl/g, 'rounded-md');

  // Clean up double spaces left by removing dark:
  content = content.replace(/  +/g, ' ');
  content = content.replace(/ \]/g, ']');
  content = content.replace(/ \"/g, '"');
  content = content.replace(/ \`/g, '`');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated', filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walk('d:/khotoan/app');
