const { generateExtensionStream } = require('../services/aiService');
const { createExtensionZip, cleanupZip } = require('../services/zipService');
const { v4: uuidv4 } = require('uuid');

const store = new Map();

async function generateStream(req, res) {
  const { prompt, browser, category } = req.body;

  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  try {
    const result = await generateExtensionStream(prompt, browser);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        res.write(`data: ${JSON.stringify({ type: 'chunk', text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Streaming error:', error.message);
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    res.end();
  }
}

async function generateZip(req, res) {
  const { files, name } = req.body;

  if (!files || Object.keys(files).length === 0) {
    return res.status(400).json({ error: 'Files are required to generate zip' });
  }

  const extName = name || 'GeneratedExtension';

  try {
    const zipPath = await createExtensionZip(files, extName);

    // Stream the zip to the client with proper headers
    const stat = require('fs').statSync(zipPath);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${extName}.zip"`);
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

async function enhancePrompt(req, res) {
  const { prompt, action } = req.body;
  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const enhancedPrompt = await require('../services/aiService').enhancePrompt(prompt, action);
    res.json({ enhancedPrompt });
  } catch (error) {
    console.error('Enhance error:', error.message);
    res.status(500).json({ error: 'Failed to enhance prompt', details: error.message });
  }
}

module.exports = {
  generateStream,
  generateZip,
  enhancePrompt,
  getAll,
  getById,
  deleteById,
};