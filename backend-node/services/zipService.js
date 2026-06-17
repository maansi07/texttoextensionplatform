// Extensio.ai — Zip Service
// Creates a .zip archive from generated extension files
// Uses archiver npm package for reliable zip creation

const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

async function createExtensionZip(files, extensionName) {
  if (!files || Object.keys(files).length === 0) {
    throw new Error('No files provided for zip creation');
  }

  const safeName = extensionName
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '');

  const tmpDir = path.join(__dirname, '../tmp', safeName);

  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  for (const [filename, content] of Object.entries(files)) {
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '');
    if (safeFilename && content) {
      fs.writeFileSync(path.join(tmpDir, safeFilename), content);
    }
  }

  const zipPath = `${tmpDir}.zip`;
  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(tmpDir, false);
    archive.finalize();
  });

  fs.rmSync(tmpDir, { recursive: true });
  return zipPath;
}

function cleanupZip(zipPath) {
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }
}

module.exports = { createExtensionZip, cleanupZip };