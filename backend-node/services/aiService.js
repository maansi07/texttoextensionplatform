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
      model: 'gemini-flash-latest',
    });

    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser requirement: ${prompt}\nTarget browser: ${browser}`;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    // Robust JSON extraction by finding the outermost curly braces
    let cleaned = text.trim();
    const startIdx = cleaned.indexOf('{');
    const endIdx = cleaned.lastIndexOf('}');
    
    if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
      throw new Error('No valid JSON object found in response');
    }
    
    cleaned = cleaned.substring(startIdx, endIdx + 1);

    const parsed = JSON.parse(cleaned);

    // Validate structure
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Parsed AI response is not an object');
    }
    if (!parsed.name || !parsed.files || typeof parsed.files !== 'object') {
      throw new Error('AI response is missing "name" or "files" object');
    }

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