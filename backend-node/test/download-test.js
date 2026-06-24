const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;
const BASE = `http://${HOST}:${PORT}`;

function httpRequest(pathname, method = 'GET', body = null, headers = {}) {
  const opts = {
    hostname: HOST,
    port: PORT,
    path: pathname,
    method,
    headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
  };

  return new Promise((resolve, reject) => {
    const req = http.request(opts, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        const ct = res.headers['content-type'] || '';
        if (ct.includes('application/json')) {
          try {
            const json = JSON.parse(buf.toString('utf8'));
            resolve({ status: res.statusCode, body: json, headers: res.headers });
          } catch (e) {
            reject(e);
          }
        } else {
          resolve({ status: res.statusCode, body: buf, headers: res.headers });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function downloadToFile(pathname, outPath) {
  const opts = {
    hostname: HOST,
    port: PORT,
    path: pathname,
    method: 'GET',
  };

  return new Promise((resolve, reject) => {
    const req = http.request(opts, (res) => {
      if (res.statusCode !== 200) {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const buf = Buffer.concat(chunks);
          let msg = buf.toString('utf8');
          try { msg = JSON.parse(msg); } catch (e) {}
          return reject(new Error(`Download failed: ${res.statusCode} ${msg && msg.error ? JSON.stringify(msg) : msg}`));
        });
        return;
      }

      const fileStream = fs.createWriteStream(outPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => fileStream.close(() => resolve()));
      fileStream.on('error', (err) => reject(err));
    });

    req.on('error', (err) => reject(err));
    req.end();
  });
}

(async () => {
  try {
    console.log('Starting integration test: generate -> download -> validate manifest');
    const prompt = 'Simple test extension that provides a manifest V3 with a popup';

    const gen = await httpRequest('/api/extensions/generate', 'POST', { prompt, browser: 'Chrome' });
    if (gen.status < 200 || gen.status >= 300) {
      console.error('Generation API failed:', gen.body);
      process.exit(2);
    }

    const id = gen.body.id;
    if (!id) {
      console.error('No id returned from generate endpoint');
      process.exit(2);
    }

    const outDir = path.join(__dirname, '..', 'tmp');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, `integration-${id}.zip`);

    console.log('Downloading zip to', outFile);
    await downloadToFile(`/api/extensions/${id}/download`, outFile);
    console.log('Download complete, validating zip...');

    const zip = new AdmZip(outFile);
    const entries = zip.getEntries().map(e => e.entryName);

    if (!entries.includes('manifest.json')) {
      console.error('manifest.json not found at zip root. Entries:', entries);
      process.exit(3);
    }

    const manifestEntry = zip.getEntry('manifest.json');
    const manifestText = manifestEntry.getData().toString('utf8');
    let manifest;
    try {
      manifest = JSON.parse(manifestText);
    } catch (e) {
      console.error('manifest.json is not valid JSON');
      process.exit(3);
    }

    if (manifest.manifest_version !== 3) {
      console.error('manifest_version is not 3:', manifest.manifest_version);
      process.exit(3);
    }

    console.log('Integration test passed: manifest.json present and manifest_version: 3');
    process.exit(0);
  } catch (err) {
    console.error('Integration test failed:', err.message);
    process.exit(4);
  }
})();
