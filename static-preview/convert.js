const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Créer le dossier dist s'il n'existe pas
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Copier les fichiers HTML de preview/pages vers dist
const pagesDir = path.join(__dirname, '../preview/pages');
const distDir = path.join(__dirname, 'dist');

// Fonction pour lire récursivement les fichiers
function copyFiles(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyFiles(srcPath, destPath);
    } else {
      // Créer le dossier parent s'il n'existe pas
      const parentDir = path.dirname(destPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copier les fichiers
copyFiles(pagesDir, distDir);

console.log('Conversion terminée !'); 