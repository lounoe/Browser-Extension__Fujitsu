// Escuchar mensajes desde content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'incrementAdCounter') {
      // Incrementar el contador en chrome.storage.local
      chrome.storage.local.get(['adCounter'], function (result) {
        const currentCount = result.adCounter || 0;
        chrome.storage.local.set({ adCounter: currentCount + 1 }, () => {
          sendResponse({ success: true });
        });
      });
      return true; // Indica que la respuesta será enviada asíncronamente
    }
  });