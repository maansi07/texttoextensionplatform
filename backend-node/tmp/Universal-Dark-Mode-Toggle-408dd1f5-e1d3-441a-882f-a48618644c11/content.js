const styleId = 'universal-dark-mode-styles';
let dmStyle = document.getElementById(styleId);

if (!dmStyle) {
  dmStyle = document.createElement('style');
  dmStyle.id = styleId;
  dmStyle.textContent = `
    html.udm-active {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    html.udm-active img,
    html.udm-active video,
    html.udm-active iframe,
    html.udm-active canvas,
    html.udm-active [style*="background-image"] {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    #udm-floating-btn {
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      width: 50px !important;
      height: 50px !important;
      border-radius: 50% !important;
      background-color: #222222 !important;
      color: #ffffff !important;
      border: 2px solid #ffffff !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
      cursor: pointer !important;
      z-index: 9999999999 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 24px !important;
      user-select: none !important;
      transition: transform 0.2s, background-color 0.2s !important;
    }
    #udm-floating-btn:hover {
      transform: scale(1.1) !important;
    }
    html.udm-active #udm-floating-btn {
      background-color: #ffffff !important;
      color: #222222 !important;
      border: 2px solid #222222 !important;
    }
  `;
  document.head.appendChild(dmStyle);
}

let btn = document.getElementById('udm-floating-btn');
if (!btn) {
  btn = document.createElement('button');
  btn.id = 'udm-floating-btn';
  btn.innerHTML = '🌙';
  btn.title = 'Toggle Dark Mode';
  document.body.appendChild(btn);
  btn.addEventListener('click', toggleDarkMode);
}

function toggleDarkMode() {
  const html = document.documentElement;
  if (html.classList.contains('udm-active')) {
    html.classList.remove('udm-active');
    btn.innerHTML = '🌙';
    chrome.storage.local.set({ darkModeActive: false });
  } else {
    html.classList.add('udm-active');
    btn.innerHTML = '☀️';
    chrome.storage.local.set({ darkModeActive: true });
  }
}

chrome.storage.local.get(['darkModeActive'], (result) => {
  if (result.darkModeActive) {
    document.documentElement.classList.add('udm-active');
    btn.innerHTML = '☀️';
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle") {
    toggleDarkMode();
    sendResponse({ success: true });
  }
});