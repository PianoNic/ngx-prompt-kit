#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'projects', 'prompt-kit-ng');
const distDir = path.join(root, 'dist', 'prompt-kit-ng');
const schematicsSrc = path.join(srcDir, 'src');
const schematicsDist = path.join(distDir, 'schematics');

fs.mkdirSync(schematicsDist, { recursive: true });

// 1. collection.json → dist/schematics/collection.json
fs.copyFileSync(
  path.join(schematicsSrc, 'collection.json'),
  path.join(schematicsDist, 'collection.json'),
);

// 2. For each schematic folder under src/, copy its schema.json + files/ tree.
for (const entry of fs.readdirSync(schematicsSrc, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const name = entry.name;
  const srcFolder = path.join(schematicsSrc, name);
  const dstFolder = path.join(schematicsDist, name);
  fs.mkdirSync(dstFolder, { recursive: true });

  const schemaPath = path.join(srcFolder, 'schema.json');
  if (fs.existsSync(schemaPath)) {
    fs.copyFileSync(schemaPath, path.join(dstFolder, 'schema.json'));
  }

  const filesPath = path.join(srcFolder, 'files');
  if (fs.existsSync(filesPath)) {
    fs.cpSync(filesPath, path.join(dstFolder, 'files'), { recursive: true });
  }
}

// 3. Library package.json + README → dist root.
fs.copyFileSync(path.join(srcDir, 'package.json'), path.join(distDir, 'package.json'));
const readme = path.join(srcDir, 'README.md');
if (fs.existsSync(readme)) {
  fs.copyFileSync(readme, path.join(distDir, 'README.md'));
}

console.log(`Copied schematic assets to ${path.relative(root, distDir)}`);
