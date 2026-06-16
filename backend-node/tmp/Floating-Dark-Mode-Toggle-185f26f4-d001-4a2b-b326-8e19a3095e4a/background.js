chrome.runtime.onInstalled.addListener(() => {
  console.log("Floating Dark Mode Toggle loaded and configured.");
  chrome.storage.local.set({ enabled: true });
});