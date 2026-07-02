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

function generateMockExtensionStream(prompt, browser = 'Chrome') {
  // Extract a name from prompt
  let name = prompt.split(' ').slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1).replace(/[^a-zA-Z0-9]/g, '')).join(' ');
  if (!name || name.trim() === '') name = 'Custom Extension';
  if (!name.toLowerCase().includes('extension')) name += ' Extension';

  // Choose pageType and other attributes based on prompt keywords
  let pageType = 'generic-webpage';
  let trigger = 'button-click';
  let popupTitle = `${name} Dashboard`;
  let effectOnPage = 'page modified by extension';
  let popupElements = [
    { type: 'button', label: 'Run Action' }
  ];

  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('read') || lowerPrompt.includes('article') || lowerPrompt.includes('blog')) {
    pageType = 'article';
    trigger = 'page-load';
    popupTitle = 'Reading Assistant';
    effectOnPage = 'estimated reading time shown at the top';
    popupElements = [
      { type: 'badge', label: 'Active' },
      { type: 'toggle', label: 'Dark Mode' }
    ];
  } else if (lowerPrompt.includes('video') || lowerPrompt.includes('youtube')) {
    pageType = 'video';
    trigger = 'icon-click';
    popupTitle = 'Video Controller';
    effectOnPage = 'playback speed adjusted to 1.5x';
    popupElements = [
      { type: 'progress', label: 'Playback Speed' },
      { type: 'button', label: 'Skip Ads' }
    ];
  } else if (lowerPrompt.includes('price') || lowerPrompt.includes('shop') || lowerPrompt.includes('buy') || lowerPrompt.includes('amazon')) {
    pageType = 'shopping';
    trigger = 'hover';
    popupTitle = 'Price Tracker';
    effectOnPage = 'price history chart injected below product price';
    popupElements = [
      { type: 'badge', label: 'Best Deal' },
      { type: 'button', label: 'Compare Prices' }
    ];
  } else if (lowerPrompt.includes('social') || lowerPrompt.includes('feed') || lowerPrompt.includes('twitter') || lowerPrompt.includes('facebook')) {
    pageType = 'social-feed';
    trigger = 'button-click';
    popupTitle = 'Social Clean';
    effectOnPage = 'sponsored posts and suggested ads hidden';
    popupElements = [
      { type: 'toggle', label: 'Filter Sponsored' },
      { type: 'badge', label: '0 Ads Blocked' }
    ];
  }

  const manifestJSON = JSON.stringify({
    manifest_version: 3,
    name: name,
    version: '1.0',
    description: `Automatically generated: ${prompt.slice(0, 60)}...`,
    permissions: ['activeTab', 'storage'],
    action: {
      default_popup: 'popup.html'
    },
    background: {
      service_worker: 'background.js'
    },
    content_scripts: [
      {
        matches: ['<all_urls>'],
        js: ['content.js']
      }
    ]
  }, null, 2);

  const popupHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      width: 320px;
      padding: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #0d0e12;
      color: #e2e8f0;
      margin: 0;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 12px;
      margin-bottom: 15px;
    }
    .logo-dot {
      width: 12px;
      height: 12px;
      background: linear-gradient(135deg, #00e5ff, #7c3aed);
      border-radius: 50%;
    }
    h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
    }
    .content {
      font-size: 0.9rem;
      color: #94a3b8;
      line-height: 1.5;
      margin-bottom: 20px;
    }
    .btn {
      background: linear-gradient(135deg, #00e5ff, #7c3aed);
      color: #0d0e12;
      border: none;
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
      transition: opacity 0.2s;
    }
    .btn:hover {
      opacity: 0.9;
    }
    .badge {
      display: inline-block;
      background: rgba(0, 229, 255, 0.1);
      color: #00e5ff;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-dot"></div>
    <h3>${name}</h3>
  </div>
  <div class="content">
    <p>This extension runs on: <strong>${pageType}</strong> type pages.</p>
    <button class="btn" id="action-btn">Trigger Interaction</button>
    <div class="badge">Status: Ready</div>
  </div>
  <script src="popup.js"></script>
</body>
</html>`;

  const popupJS = `document.getElementById('action-btn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const badge = document.querySelector('.badge');
    const tab = tabs[0];
    if (!tab || !tab.id || tab.url?.startsWith('chrome://') || tab.url?.startsWith('edge://') || tab.url?.startsWith('about:')) {
      if (badge) {
        badge.textContent = 'Cannot run on system pages';
        badge.style.color = '#ef4444';
        badge.style.background = 'rgba(239, 68, 68, 0.1)';
      }
      return;
    }
    chrome.tabs.sendMessage(tab.id, { action: 'execute_trigger' }, (response) => {
      if (chrome.runtime.lastError) {
        if (badge) {
          badge.textContent = 'Error: Reload tab & try again';
          badge.style.color = '#ef4444';
          badge.style.background = 'rgba(239, 68, 68, 0.1)';
        }
        return;
      }
      console.log('Response from content script:', response);
      if (badge) {
        badge.textContent = 'Status: Executed';
        badge.style.color = '#10b981';
        badge.style.background = 'rgba(16, 185, 129, 0.1)';
      }
    });
  });
});`;

  const contentJS = `console.log('${name} content script loaded.');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'execute_trigger') {
    console.log('${name} trigger received.');
    
    // Visibly modify the page according to trigger and design
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '20px';
    overlay.style.right = '20px';
    overlay.style.padding = '15px 25px';
    overlay.style.background = 'linear-gradient(135deg, #0f172a, #1e1b4b)';
    overlay.style.color = '#38bdf8';
    overlay.style.border = '1px solid #0284c7';
    overlay.style.borderRadius = '12px';
    overlay.style.fontFamily = 'system-ui, sans-serif';
    overlay.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.3)';
    overlay.style.zIndex = '999999';
    overlay.innerHTML = '<strong>${name}</strong>: ${effectOnPage}!';
    
    document.body.appendChild(overlay);
    
    setTimeout(() => {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 1s';
      setTimeout(() => overlay.remove(), 1000);
    }, 4000);

    sendResponse({ success: true, message: '${effectOnPage}' });
  }
  return true;
});`;

  const backgroundJS = `chrome.runtime.onInstalled.addListener(() => {
  console.log('${name} extension installed successfully.');
});`;

  const mockResponse = {
    name: name,
    description: `A custom generated extension for: ${prompt}`,
    files: {
      'manifest.json': manifestJSON,
      'content.js': contentJS,
      'popup.html': popupHTML,
      'popup.js': popupJS,
      'background.js': backgroundJS
    },
    demoSpec: {
      pageType,
      pageContent: {
        headline: `Interactive mock ${pageType} demo`,
        meta: `Created for ${browser}`,
        bodyBlocks: 3
      },
      interaction: {
        trigger,
        popupTitle,
        popupElements,
        effectOnPage
      }
    }
  };

  const mockJSON = JSON.stringify(mockResponse, null, 2);

  return {
    stream: {
      [Symbol.asyncIterator]: async function* () {
        const chunkSize = 60;
        for (let i = 0; i < mockJSON.length; i += chunkSize) {
          const text = mockJSON.slice(i, i + chunkSize);
          yield {
            text: () => text
          };
          await new Promise(resolve => setTimeout(resolve, 30));
        }
      }
    }
  };
}

function generateMockEnhancePrompt(prompt, action) {
  if (action === 'shorten') {
    return `Create a ${prompt.split(' ').slice(0, 3).join(' ')} browser tool.`;
  } else if (action === 'polish') {
    return `Design a functional browser extension that allows users to ${prompt}.`;
  } else {
    return `Generate a comprehensive browser extension to ${prompt}. It should feature an interactive popup UI, run content scripts on the tab to dynamically modify page styles/DOM, and handle background lifecycle events.`;
  }
}

async function generateExtensionStream(prompt, browser = 'Chrome') {
  const models = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-2.5-flash', 'gemini-flash-latest'];
  let lastError;

  for (const modelName of models) {
    try {
      console.log(`Attempting generation with model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const fullPrompt = `${SYSTEM_PROMPT}\n\nUser requirement: ${prompt}\nTarget browser: ${browser}`;
      const result = await model.generateContentStream(fullPrompt);
      return result;
    } catch (error) {
      console.warn(`AI generation stream failed on ${modelName}:`, error.message);
      lastError = error;
      const isQuotaError = error.message.includes('429') || 
                           error.message.includes('quota') || 
                           error.message.includes('Quota') || 
                           error.message.includes('limit') || 
                           error.message.includes('Limit') ||
                           error.message.includes('not found') ||
                           error.message.includes('Not Found');
      if (!isQuotaError) {
        break;
      }
    }
  }

  console.warn('AI generation failed on all models. Falling back to local mock generation.');
  return generateMockExtensionStream(prompt, browser);
}

async function enhancePrompt(prompt, action = 'elaborate') {
  const models = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-2.5-flash', 'gemini-flash-latest'];
  let enhanceSystemPrompt = '';

  if (action === 'shorten') {
    enhanceSystemPrompt = `Condense this browser-extension idea into a single, punchy, clear sentence. Remove any fluff. Return ONLY the enhanced prompt, no extra markdown or quotes.`;
  } else if (action === 'polish') {
    enhanceSystemPrompt = `Fix any grammatical errors and improve the phrasing of this browser-extension idea without significantly altering its length or detail. Return ONLY the enhanced prompt, no extra markdown or quotes.`;
  } else {
    enhanceSystemPrompt = `Rewrite this vague browser-extension idea into a clear, detailed spec: include the core feature, target behavior, any UI elements needed, and edge cases to consider. Keep it concise — 3-5 sentences. Return ONLY the enhanced prompt, no extra markdown or quotes.`;
  }

  const fullPrompt = `${enhanceSystemPrompt}\n\nOriginal prompt: ${prompt}`;
  let lastError;

  for (const modelName of models) {
    try {
      console.log(`Attempting prompt enhancement with model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(fullPrompt);
      const text = result.response.text();
      return text.trim();
    } catch (error) {
      console.warn(`AI enhance failed on ${modelName}:`, error.message);
      lastError = error;
      const isQuotaError = error.message.includes('429') || 
                           error.message.includes('quota') || 
                           error.message.includes('Quota') || 
                           error.message.includes('limit') || 
                           error.message.includes('Limit') ||
                           error.message.includes('not found') ||
                           error.message.includes('Not Found');
      if (!isQuotaError) {
        break;
      }
    }
  }

  console.warn('AI enhance failed on all models. Falling back to local mock enhancement.');
  return generateMockEnhancePrompt(prompt, action);
}

module.exports = { generateExtensionStream, enhancePrompt };