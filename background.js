chrome.runtime.onInstalled.addListener(function() {
  console.log('Smart Translator installed successfully!');
  
  // Set default settings if none exist
  chrome.storage.sync.get(['translatorSettings'], function(result) {
    if (!result.translatorSettings) {
      chrome.storage.sync.set({
        translatorSettings: {
          defaultLanguage: 'en',
          targetLanguage: 'en',
          autoTranslateTyping: true,
          showLanguageDetection: true,
          translationDelay: 1000
        }
      });
    }
  });
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "translate") {
    // Handle translation requests if needed
    sendResponse({ success: true });
  }
});