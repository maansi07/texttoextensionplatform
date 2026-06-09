// Extensio.ai — AI Service
// Uses Gemini 2.0 Flash to generate browser extension code
// Returns structured JSON with all required extension files

const { GoogleGenerativeAI } = require('@google/generative-ai');

require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are an expert Chrome Extension developer.
When given a requirement, you must respond ONLY with a valid JSON object.
No explanation. No markdown. No backticks. Only raw JSON.

The JSON must follow this exact structure:
{
  "name": "Extension Name",
  "description": "Short description",
  "files": {
    "manifest.json": "full file content as string",
    "content.js": "full file content as string",
    "popup.html": "full file content as string",
    "popup.js": "full file content as string",
    "background.js": "full file content as string"
  }
}

Rules:
- manifest_version must be 3
- All files must be complete and functional
- content.js must use chrome.runtime.onMessage.addListener
- popup.html must be valid HTML with a script tag linking popup.js
- background.js must use chrome.runtime.onInstalled
- Do not include any explanation outside the JSON`;

async function generateExtension(prompt, browser = 'Chrome', retries = 2) {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
    });

    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser requirement: ${prompt}\nTarget browser: ${browser}`;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    const cleaned = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    return parsed;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... attempts left: ${retries}`);
      return generateExtension(prompt, browser, retries - 1);
    }

    console.error('AI generation error:', error.message);
    throw new Error('AI generation failed: ' + error.message);
  }
}

module.exports = { generateExtension };