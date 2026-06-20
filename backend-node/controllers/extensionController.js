const { generateExtension } = require('../services/aiService');
const { createExtensionZip, cleanupZip } = require('../services/zipService');
const { v4: uuidv4 } = require('uuid');

const store = new Map();

async function generate(req, res) {
  const { prompt, browser, category } = req.body;

  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const aiResult = await generateExtension(prompt, browser);

    const extension = {
      id: uuidv4(),
      name: aiResult.name,
      description: aiResult.description,
      browser: browser || 'Chrome',
      category: category || 'General',
      status: 'Generated',
      files: aiResult.files,
      createdAt: new Date().toISOString(),
    };

    store.set(extension.id, extension);

    // Log generation with timestamp
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ✓ Generated: "${extension.name}" for ${extension.browser}`);

    res.status(201).json(extension);
  } catch (error) {
    console.error('Generation error:', error.message);
    res.status(500).json({
      error: 'Failed to generate',
      details: error.message,
    });
  }
}

async function downloadZip(req, res) {
  const extension = store.get(req.params.id);
  if (!extension) {
    return res.status(404).json({ error: 'Extension not found' });
  }

  if (!extension.files || Object.keys(extension.files).length === 0) {
    return res.status(400).json({ error: 'Extension has no files to download' });
  }

  try {
    const zipPath = await createExtensionZip(extension.files, extension.name);

    // Stream the zip to the client with proper headers
    const stat = require('fs').statSync(zipPath);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${extension.name}.zip"`);
    res.setHeader('Content-Length', stat.size);

    const stream = require('fs').createReadStream(zipPath);

    stream.on('error', (streamErr) => {
      console.error('Stream error:', streamErr.message);
      try { cleanupZip(zipPath); } catch (e) {}
      if (!res.headersSent) res.status(500).json({ error: 'Failed to stream zip', details: streamErr.message });
    });

    // After response finishes, remove the zip
    res.on('finish', () => {
      try { cleanupZip(zipPath); } catch (e) { console.warn('cleanup failed', e.message); }
    });

    stream.pipe(res);
  } catch (error) {
    console.error('Zip error:', error.message);
    if (error && error.statusCode === 422) {
      return res.status(422).json({ error: 'Invalid generated manifest', details: error.message });
    }
    res.status(500).json({ error: 'Failed to create zip', details: error.message });
  }
}

function getAll(req, res) {
  res.json(Array.from(store.values()).reverse());
}

function getById(req, res) {
  const ext = store.get(req.params.id);

  if (!ext) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(ext);
}

function deleteById(req, res) {
  const deleted = store.delete(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(204).send();
}

module.exports = {
  generate,
  downloadZip,
  getAll,
  getById,
  deleteById,
};