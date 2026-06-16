// Extensio.ai — Zip Service
// Creates a .zip archive from generated extension files
// Uses archiver npm package for reliable zip creation

const { ZipArchive } = require('archiver');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function createExtensionZip(files, extensionName) {
  const uniqueId = uuidv4();
  const safeName = (extensionName || 'extension')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '') || 'extension';

  // Use a unique name for the temporary directory to avoid collisions
  const tmpDir = path.join(__dirname, '../tmp', `${safeName}-${uniqueId}`);

  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  if (files && typeof files === 'object') {
    for (const [filename, content] of Object.entries(files)) {
      // Sanitize filename — only allow safe characters
      const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '');
      if (safeFilename && content) {
        fs.writeFileSync(path.join(tmpDir, safeFilename), content);
      }
    }
  }

  const zipPath = `${tmpDir}.zip`;
  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = new ZipArchive({ zlib: { level: 9 } });
    
    output.on('close', resolve);
    output.on('error', reject); // Catch write stream errors to prevent server crash
    archive.on('error', reject);
    
    archive.pipe(output);
    archive.directory(tmpDir, false);
    archive.finalize();
  });

  try {
    fs.rmSync(tmpDir, { recursive: true });
  } catch (err) {
    console.error(`Failed to clean up temp directory ${tmpDir}:`, err.message);
  }
  
  return zipPath;
}

function cleanupZip(zipPath) {
  try {
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
  } catch (error) {
    console.error(`Error deleting zip file ${zipPath}:`, error.message);
  }
}

module.exports = { createExtensionZip, cleanupZip };