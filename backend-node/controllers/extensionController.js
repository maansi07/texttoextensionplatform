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
    return res.status(404).json({ error: 'Not found' });
  }

  try {
    const zipPath = await createExtensionZip(
      extension.files,
      extension.name
    );

    res.download(zipPath, `${extension.name}.zip`, (err) => {
      cleanupZip(zipPath);
    });
  } catch (error) {
    res.status(500).json({
      error: 'Zip failed',
      details: error.message,
    });
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