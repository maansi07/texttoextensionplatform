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
  },
  "demoSpec": {
    "pageType": "article" | "code-editor" | "video" | "form" | "generic-webpage" | "social-feed" | "shopping",
    "pageContent": {
      "headline": "string - short, plausible title for the mock page this extension would run on",
      "meta": "string - short secondary line, e.g. byline/timestamp/price",
      "bodyBlocks": 3
    },
    "interaction": {
      "trigger": "icon-click" | "page-load" | "button-click" | "hover",
      "popupTitle": "string",
      "popupElements": [
        { "type": "toggle" | "button" | "text" | "input" | "progress" | "badge", "label": "string" }
      ],
      "effectOnPage": "string - one short phrase describing what visibly changes on the mock page after the interaction, e.g. 'ad blocked, video continues', 'tabs grouped into folders', 'reading time shown at top of article'"
    }
  }
}

Rules:
- manifest_version must be 3
- All files must be complete and functional
- content.js must use chrome.runtime.onMessage.addListener
- popup.html must be valid HTML with a script tag linking popup.js
- background.js must use chrome.runtime.onInstalled
- The demoSpec must be derived specifically from the literal extension description the user typed, and NOT generically from the category. Two extensions in "Productivity" should get different pageType, headline, and effectOnPage values if their descriptions differ.
- Do not include any explanation outside the JSON`;

async function generateExtensionStream(prompt, browser = 'Chrome') {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser requirement: ${prompt}\nTarget browser: ${browser}`;

    const result = await model.generateContentStream(fullPrompt);
    return result;
  } catch (error) {
    console.error('AI generation stream error:', error.message);
    throw new Error('AI generation stream failed: ' + error.message);
  }
}

async function enhancePrompt(prompt, action = 'elaborate') {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    let enhanceSystemPrompt = '';

    if (action === 'shorten') {
      enhanceSystemPrompt = `Condense this browser-extension idea into a single, punchy, clear sentence. Remove any fluff. Return ONLY the enhanced prompt, no extra markdown or quotes.`;
    } else if (action === 'polish') {
      enhanceSystemPrompt = `Fix any grammatical errors and improve the phrasing of this browser-extension idea without significantly altering its length or detail. Return ONLY the enhanced prompt, no extra markdown or quotes.`;
    } else {
      // Default to elaborate
      enhanceSystemPrompt = `Rewrite this vague browser-extension idea into a clear, detailed spec: include the core feature, target behavior, any UI elements needed, and edge cases to consider. Keep it concise — 3-5 sentences. Return ONLY the enhanced prompt, no extra markdown or quotes.`;
    }

    const fullPrompt = `${enhanceSystemPrompt}\n\nOriginal prompt: ${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();
    return text.trim();
  } catch (error) {
    console.error('AI enhance error:', error.message);
    throw new Error('AI enhance failed: ' + error.message);
  }
}

module.exports = { generateExtensionStream, enhancePrompt };