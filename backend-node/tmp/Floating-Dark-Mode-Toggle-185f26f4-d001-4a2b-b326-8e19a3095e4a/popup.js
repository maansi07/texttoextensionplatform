document.addEventListener('DOMContentLoaded', () => {
  const checkbox = document.getElementById('toggle-button-visibility');
  const toggleBtn = document.getElementById('toggle-dark-now');

  chrome.storage.local.get(['enabled'], (result) => {
    checkbox.checked = result.enabled !== false;
  });

  checkbox.addEventListener('change', () => {
    const enabled = checkbox.checked;
    chrome.storage.local.set({ enabled }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "toggleButton", enabled });
        }
      });
    });
  });

  toggleBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggleDarkMode" });
      }
    });
  });
});