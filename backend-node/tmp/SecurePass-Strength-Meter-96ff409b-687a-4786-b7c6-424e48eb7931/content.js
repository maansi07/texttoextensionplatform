chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fillPassword") {
    const activeElement = document.activeElement;
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    let filled = false;
    
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.getAttribute('contenteditable') === 'true')) {
      activeElement.value = request.password;
      activeElement.innerText = request.password;
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      activeElement.dispatchEvent(new Event('change', { bubbles: true }));
      filled = true;
    } else if (passwordInputs.length > 0) {
      passwordInputs[0].value = request.password;
      passwordInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      passwordInputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      filled = true;
    }
    sendResponse({ success: filled });
  }
  return true;
});