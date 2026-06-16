let isDarkMode = false;
let isButtonEnabled = true;

const styleId = "floating-darkmode-style";
const buttonId = "floating-darkmode-btn";

function injectCSS() {
  if (document.getElementById(styleId)) return;
  const style = document.createElement("style");
  style.id = styleId;
  style.innerHTML = "html { filter: invert(1) hue-rotate(180deg) !important; background-color: #000 !important; } img, video, iframe, canvas { filter: invert(1) hue-rotate(180deg) !important; }";
  document.head.appendChild(style);
}

function removeCSS() {
  const style = document.getElementById(styleId);
  if (style) style.remove();
}

function toggleDarkMode(enable) {
  isDarkMode = enable;
  if (isDarkMode) {
    injectCSS();
  } else {
    removeCSS();
  }
  const hostname = window.location.hostname;
  chrome.storage.local.set({ [hostname]: isDarkMode });
}

function createFloatingButton() {
  if (document.getElementById(buttonId)) return;
  const btn = document.createElement("button");
  btn.id = buttonId;
  btn.innerHTML = isDarkMode ? "☀️" : "🌙";
  btn.style.position = "fixed";
  btn.style.bottom = "20px";
  btn.style.right = "20px";
  btn.style.zIndex = "999999";
  btn.style.width = "50px";
  btn.style.height = "50px";
  btn.style.borderRadius = "50%";
  btn.style.border = "none";
  btn.style.backgroundColor = isDarkMode ? "#eee" : "#333";
  btn.style.color = isDarkMode ? "#000" : "#fff";
  btn.style.fontSize = "24px";
  btn.style.cursor = "pointer";
  btn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
  btn.style.display = "flex";
  btn.style.alignItems = "center";
  btn.style.justifyContent = "center";
  btn.style.transition = "transform 0.2s, background-color 0.2s";

  btn.addEventListener("mouseover", () => {
    btn.style.transform = "scale(1.1)";
  });
  btn.addEventListener("mouseout", () => {
    btn.style.transform = "scale(1)";
  });

  btn.addEventListener("click", () => {
    toggleDarkMode(!isDarkMode);
    btn.innerHTML = isDarkMode ? "☀️" : "🌙";
    btn.style.backgroundColor = isDarkMode ? "#eee" : "#333";
    btn.style.color = isDarkMode ? "#000" : "#fff";
  });

  document.body.appendChild(btn);
}

function removeFloatingButton() {
  const btn = document.getElementById(buttonId);
  if (btn) btn.remove();
}

const hostname = window.location.hostname;
chrome.storage.local.get(["enabled", hostname], (result) => {
  isButtonEnabled = result.enabled !== false;
  const siteDark = result[hostname] === true;

  if (siteDark) {
    isDarkMode = true;
    injectCSS();
  }

  if (isButtonEnabled) {
    createFloatingButton();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleButton") {
    isButtonEnabled = request.enabled;
    if (isButtonEnabled) {
      createFloatingButton();
    } else {
      removeFloatingButton();
    }
    sendResponse({ status: "done" });
  } else if (request.action === "toggleDarkMode") {
    toggleDarkMode(!isDarkMode);
    const btn = document.getElementById(buttonId);
    if (btn) {
      btn.innerHTML = isDarkMode ? "☀️" : "🌙";
      btn.style.backgroundColor = isDarkMode ? "#eee" : "#333";
      btn.style.color = isDarkMode ? "#000" : "#fff";
    }
    sendResponse({ status: "done", isDarkMode });
  }
});