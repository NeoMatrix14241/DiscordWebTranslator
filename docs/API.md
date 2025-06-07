# API Documentation

This document provides technical details about Smart Translator's internal APIs, architecture, and integration points.

## 🏗️ Architecture Overview

Smart Translator follows the Chrome Extension Manifest V3 architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Background    │    │   Content       │    │   Popup/Options │
│   Service       │◄──►│   Scripts       │◄──►│   UI            │
│   Worker        │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Chrome        │    │   Web Page      │    │   Settings      │
│   Storage       │    │   DOM           │    │   Storage       │
│   API           │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Core Classes and APIs

### SmartTranslatorUniversal Class

Main content script class that handles all translation functionality.

#### Constructor
```javascript
class SmartTranslatorUniversal {
  constructor() {    this.settings = {
      myTypingLanguage: 'auto', // 'auto' for auto-detection or language code
      targetTranslationLanguage: 'ja',
      translationDelay: 800,
      enableHelpMode: true,
      enableOutputMode: true,
      languagesIUnderstand: ['en'],
      helpModeTarget: 'en',
      enableAllSites: true,
      allowedSites: ['discord.com'] // Only Discord is fully tested
    };
    
    // Internal state management
    this.isTranslating = false;
    this.typingTimer = null;
    this.lastText = '';
    this.currentPopup = null;
    this.translatedElements = new WeakMap();
    this.observer = null;
    this.buttonClickHandlers = new WeakMap();
    this.scannedElements = new WeakSet();
    this.scanInterval = null;
  }
}
```

#### Core Methods

##### `async init()`
Initializes the translator with settings and starts scanning.

**Flow:**
1. Load settings from storage
2. Check site permissions
3. Create UI elements
4. Setup event listeners
5. Start content scanning
6. Begin mutation observation

**Returns:** `void`

##### `async loadSettings()`
Loads user settings from Chrome storage.

**Returns:** `void`
**Throws:** Logs errors, falls back to defaults

##### `isSiteAllowed()`
Checks if current site is allowed based on user configuration.

**Returns:** `boolean`
**Logic:**
- If `enableAllSites` is true, always returns true
- Otherwise checks current hostname against `allowedSites` patterns

##### `matchesSitePattern(hostname, url, pattern)`
Matches site patterns with wildcard support.

**Parameters:**
- `hostname` (string): Current site hostname
- `url` (string): Full current URL
- `pattern` (string): Pattern to match against

**Returns:** `boolean`

**Supported Patterns:**
- Simple domain: `example.com`
- Wildcard domain: `*.google.com`
- Full URL: `https://example.com/*`

##### `detectForeignLanguage(text)`
Detects if text contains foreign language scripts.

**Parameters:**
- `text` (string): Text to analyze

**Returns:** `boolean`

**Detection Logic:**
1. Unicode script range checking
2. Non-Latin character ratio analysis
3. Minimum text length validation

**Supported Scripts:**
- East Asian: Japanese, Chinese, Korean
- Middle Eastern: Arabic, Hebrew, Persian
- South Asian: Hindi, Bengali, Tamil, etc.
- European: Cyrillic, Greek, Armenian
- Southeast Asian: Thai, Lao, Myanmar
- African: Ethiopic
- Other: Mongolian

##### `addTranslateButtonToElement(element)`
Adds a translate button to elements with foreign text.

**Parameters:**
- `element` (HTMLElement): DOM element containing foreign text

**Button Features:**
- Circular design with gradient background
- Hover effects and animations
- Smart positioning
- Click handler registration

##### `async translateElementText(element, button)`
Translates text within a DOM element.

**Parameters:**
- `element` (HTMLElement): Element to translate
- `button` (HTMLElement): Associated translate button

**Flow:**
1. Extract original text
2. Check if already translated (toggle mode)
3. Show loading state
4. Call translation API
5. Replace text content
6. Update button state
7. Show notification

##### `async translateUserInput(text, element)`
Translates user typing in real-time.

**Parameters:**
- `text` (string): Text to translate
- `element` (HTMLElement): Input element

**Features:**
- Debounced translation (configurable delay)
- Shows popup with translation
- Copy to clipboard functionality
- Works with rich text editors

##### `async translateTextWithFallback(text, fromLang, toLang, retryCount)`
Main translation method with fallback support.

**Parameters:**
- `text` (string): Text to translate
- `fromLang` (string): Source language code
- `toLang` (string): Target language code
- `retryCount` (number): Current retry attempt

**Returns:** `string` - Translated text

**API Fallback Chain:**
1. Google Translate API (primary)
2. MyMemory Translation API (fallback)
3. Error after all attempts

## 🔌 Translation APIs

### Google Translate API

**Endpoint:** `https://translate.googleapis.com/translate_a/single`

**Parameters:**
```javascript
const params = new URLSearchParams({
  client: 'gtx',
  sl: fromLang,    // source language
  tl: toLang,      // target language
  dt: 't',         // return translation
  q: text          // text to translate
});
```

**Response Format:**
```javascript
[
  [
    ["translated text", "original text", null, null, 10],
    // ... more translation segments
  ],
  null,
  "detected_source_lang",
  // ... other metadata
]
```

### MyMemory Translation API

**Endpoint:** `https://api.mymemory.translated.net/get`

**Parameters:**
```javascript
const params = new URLSearchParams({
  q: text,
  langpair: `${fromLang}|${toLang}`
});
```

**Response Format:**
```javascript
{
  "responseData": {
    "translatedText": "translated text",
    "match": confidence_score
  },
  "responseStatus": 200
}
```

## 🎛️ Event Handling

### Content Script Events

#### Input Events
```javascript
document.addEventListener('input', (event) => {
  this.handleUniversalTyping(event);
}, true);

document.addEventListener('keyup', (event) => {
  this.handleUniversalTyping(event);
}, true);

document.addEventListener('compositionend', (event) => {
  this.handleUniversalTyping(event);
}, true);
```

#### Click Events
```javascript
document.addEventListener('click', (event) => {
  this.handleGlobalClick(event);
}, true);
```

#### Scroll Events
```javascript
document.addEventListener('scroll', () => {
  clearTimeout(this.scrollTimer);
  this.scrollTimer = setTimeout(() => {
    this.scanVisibleContent();
  }, 500);
}, true);
```

### Mutation Observer
```javascript
this.observer = new MutationObserver((mutations) => {
  let hasNewContent = false;
  
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      // Handle new elements
    }
    if (mutation.type === 'characterData') {
      // Handle text changes
    }
  });
  
  if (hasNewContent) {
    // Debounced content scan
  }
});

this.observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});
```

## 💾 Storage Schema

### Settings Object
```javascript
{
  // Help Mode Settings
  enableHelpMode: boolean,
  languagesIUnderstand: string[],    // ['en', 'es', 'fr']
  helpModeTarget: string,            // 'en'
  // Output Mode Settings
  enableOutputMode: boolean,
  myTypingLanguage: string,          // 'en' or 'auto' for auto-detection
  targetTranslationLanguage: string, // 'ja'
  translationDelay: number,          // 800 (milliseconds)
    // Site Configuration
  enableAllSites: boolean,
  allowedSites: string[]             // ['discord.com'] - Only Discord is fully tested
}
```

### Storage API Usage
```javascript
// Save settings
await chrome.storage.sync.set({ 
  translatorSettings: settingsObject 
});

// Load settings
const result = await chrome.storage.sync.get(['translatorSettings']);
const settings = result.translatorSettings || defaultSettings;
```

## 🔍 DOM Scanning Algorithm

### Element Scanning Strategy

1. **Initial Scan**: Process all existing elements on page load
2. **Mutation Monitoring**: Watch for new elements added to DOM
3. **Scroll-based Scanning**: Process visible elements on scroll
4. **Periodic Scanning**: Regular interval scanning for dynamic content

### Scanning Filters

#### Elements to Skip
```javascript
shouldSkipElement(element) {
  // Non-content elements
  const skipTags = ['script', 'style', 'noscript', 'head', 'title', 'meta', 'link'];
  
  // Input elements
  const inputTags = ['input', 'textarea', 'select', 'button'];
  
  // UI elements
  const skipClasses = [
    'smart-translate-btn', 'smart-notification', 'smart-popup',
    'toolbar', 'navigation', 'header', 'footer', 'sidebar'
  ];
  
  // Already processed elements
  if (this.scannedElements.has(element)) return true;
  
  // Check visibility
  if (!this.isElementVisible(element)) return true;
  
  return false;
}
```

#### Text Extraction
```javascript
getDirectTextContent(element) {
  let text = '';
  
  // Get only direct text nodes, not from children
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    }
  }
  
  return text.trim();
}
```

## 🎨 UI Component APIs

### Translation Button
```javascript
const translateBtn = document.createElement('button');
translateBtn.className = 'smart-translate-btn';
translateBtn.innerHTML = '🌐';
translateBtn.style.cssText = `
  position: relative;
  display: inline-block;
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 14px;
  cursor: pointer;
  margin-left: 8px;
  margin-right: 4px;
  vertical-align: middle;
  z-index: 1000;
  box-shadow: 0 3px 12px rgba(40, 167, 69, 0.4);
  transition: all 0.3s ease;
  opacity: 0.9;
  flex-shrink: 0;
`;
```

### Translation Popup
```javascript
const popup = document.createElement('div');
popup.style.cssText = `
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  padding: 24px;
  border-radius: 16px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  z-index: 999999;
  max-width: 480px;
  min-width: 380px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  border: 2px solid rgba(255,255,255,0.2);
  animation: popupFadeIn 0.4s ease-out;
`;
```

### Notification System
```javascript
showTranslationNotification(original, translated) {
  const notification = document.createElement('div');
  notification.className = 'smart-notification';
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: bold;
    z-index: 999999;
    max-width: 350px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    animation: slideInFromRight 0.5s ease-out;
    border: 2px solid rgba(255,255,255,0.2);
  `;
}
```

## 🔧 Performance Optimizations

### Memory Management
- **WeakMap Usage**: Prevents memory leaks for element references
- **WeakSet Usage**: Efficient tracking of scanned elements
- **Debounced Operations**: Reduces excessive API calls and DOM scanning

### DOM Optimization
- **Visibility Checking**: Only process visible elements
- **Direct Text Extraction**: Avoid processing child elements unnecessarily
- **Mutation Observer**: Efficient detection of DOM changes

### API Optimization
- **Translation Caching**: Avoid retranslating identical text
- **Fallback Strategy**: Multiple API endpoints for reliability
- **Rate Limiting**: Respect API rate limits

## 🛡️ Security Considerations

### Content Security Policy (CSP)
Extension works with strict CSP by:
- Using inline styles only for dynamic UI
- No eval() or unsafe-inline script execution
- External API calls through fetch() only

### XSS Prevention
- Sanitize all user input
- Use textContent instead of innerHTML for user text
- Validate translation API responses

### Privacy Protection
- No personal data collection
- Local processing of language detection
- No tracking or analytics

## 🧪 Testing APIs

### Unit Testing Framework
```javascript
// Example test structure
describe('SmartTranslatorUniversal', () => {
  let translator;
  
  beforeEach(() => {
    translator = new SmartTranslatorUniversal();
  });
  
  describe('detectForeignLanguage', () => {
    it('should detect Japanese text', () => {
      const text = 'こんにちは世界';
      expect(translator.detectForeignLanguage(text)).toBe(true);
    });
  });
});
```

### Integration Testing
```javascript
// Test real website integration
async function testWebsiteIntegration(url) {
  const page = await browser.newPage();
  await page.goto(url);
  await page.addScriptTag({ path: './content.js' });
  
  // Test translation functionality
  const result = await page.evaluate(() => {
    return window.smartTranslator.detectForeignLanguage('测试文本');
  });
  
  expect(result).toBe(true);
}
```

## 📡 Message Passing

### Content Script ↔ Background
```javascript
// Content script sends message
chrome.runtime.sendMessage({
  action: 'translate',
  text: 'Hello world',
  fromLang: 'en',
  toLang: 'ja'
});

// Background receives message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translate') {
    // Handle translation request
    sendResponse({ success: true });
  }
});
```

### Settings Updates
```javascript
// Options page notifies content scripts
chrome.tabs.sendMessage(tab.id, { 
  action: 'settingsUpdated' 
});

// Content script receives update
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'settingsUpdated') {
    this.loadSettings();
  }
});
```

## 🔄 Error Handling

### Translation Errors
```javascript
try {
  const translated = await this.translateTextWithFallback(text, fromLang, toLang);
} catch (error) {
  console.error('Translation failed:', error);
  this.showError('Translation failed - Network issue');
}
```

### DOM Errors
```javascript
try {
  element.appendChild(translateBtn);
} catch (error) {
  console.log('Could not add translate button:', error);
  // Graceful degradation
}
```

### API Errors
```javascript
async translateWithGoogle(text, fromLang, toLang) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Google Translate API failed: ${error.message}`);
  }
}
```

---

*This API documentation is updated with each release. For the latest version, check the source code.*

## 🔍 Auto-Detection Functionality

### Overview
Smart Translator includes intelligent auto-detection capabilities that can automatically identify the language users are typing in before translating to their target language. This feature eliminates the need to manually specify the source language for translations.

### Auto-Detection Architecture

#### Language Detection Flow
```javascript
// Auto-detection workflow in translateUserInput method
async translateUserInput(text, element) {
  if (!this.settings.enableOutputMode || !text.trim()) return;
  
  // Determine source language
  const fromLang = this.settings.myTypingLanguage === 'auto' ? 'auto' : this.settings.myTypingLanguage;
  const toLang = this.settings.targetTranslationLanguage;
  
  // Pass 'auto' to translation APIs for automatic detection
  const translated = await this.translateTextWithFallback(text, fromLang, toLang);
}
```

#### API Integration
Both translation APIs support auto-detection:

**Google Translate API:**
```javascript
// When fromLang is 'auto', Google Translate automatically detects the source language
const params = new URLSearchParams({
  client: 'gtx',
  sl: 'auto',        // Auto-detect source language
  tl: toLang,        // Target language
  dt: 't',
  q: text
});
```

**MyMemory API:**
```javascript
// MyMemory uses 'autodetect' for automatic language detection
const langPair = fromLang === 'auto' ? `autodetect|${toLang}` : `${fromLang}|${toLang}`;
const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;
```

### Configuration

#### Settings Schema
```javascript
{
  myTypingLanguage: 'auto',  // 'auto' enables auto-detection, or specific language code
  targetTranslationLanguage: 'ja',  // Target language for translations
  // ... other settings
}
```

#### Default Configuration
Auto-detection is enabled by default:
```javascript
// Default settings in constructor
this.settings = {
  myTypingLanguage: 'auto',  // Auto-detect by default
  targetTranslationLanguage: 'ja',
  // ... other defaults
};
```

### User Interface

#### Options Page Integration
```javascript
// Auto-detect option is added to typing language dropdown
function populateLanguageSelect(selectElement, includeAuto = false) {
  if (includeAuto) {
    const autoOption = document.createElement('option');
    autoOption.value = 'auto';
    autoOption.textContent = '🔍 Auto-Detect';
    selectElement.appendChild(autoOption);
  }
  // ... populate other languages
}

// Called with auto-detect enabled for typing language
populateLanguageSelect(myTypingLanguage, true);
```

#### Language Mapping
```javascript
// Auto-detect included in language name mappings
const languageNames = {
  'auto': 'Auto-Detect',
  'en': 'English',
  'es': 'Spanish',
  // ... other languages
};
```

### Technical Implementation

#### Translation Method Updates
```javascript
async translateTextWithFallback(text, fromLang, toLang, retryCount = 0) {
  try {
    // Try Google Translate first (supports auto-detection)
    return await this.translateWithGoogle(text, fromLang, toLang);
  } catch (error) {
    console.log(`Google Translate failed: ${error.message}`);
    
    if (retryCount < 2) {
      try {
        // Fallback to MyMemory (also supports auto-detection)
        return await this.translateWithMyMemory(text, fromLang, toLang);
      } catch (fallbackError) {
        // Retry logic for network issues
      }
    }
    throw error;
  }
}
```

#### Detection Accuracy
- **Google Translate**: Highly accurate auto-detection for 100+ languages
- **MyMemory**: Good auto-detection with confidence scoring
- **Fallback Strategy**: If one API fails, automatic retry with the other

### Usage Examples

#### Basic Auto-Detection
```javascript
// User types in any language, system auto-detects and translates
const settings = {
  myTypingLanguage: 'auto',           // Auto-detect input language
  targetTranslationLanguage: 'es'     // Translate to Spanish
};

// User types: "Hello world" (English detected) → "Hola mundo"
// User types: "こんにちは" (Japanese detected) → "Hola"
// User types: "你好" (Chinese detected) → "Hola"
```

#### Manual Override
```javascript
// User can still specify exact source language if needed
const settings = {
  myTypingLanguage: 'en',             // Force English input
  targetTranslationLanguage: 'ja'     // Translate to Japanese
};
```

### Performance Considerations

#### Network Optimization
- Auto-detection adds minimal overhead to translation requests
- Both APIs handle auto-detection server-side (no additional requests)
- Fallback strategy ensures reliability

#### Caching Strategy
```javascript
// Results are cached to avoid repeated translations of same text
const cacheKey = `${text}_${fromLang}_${toLang}`;
if (this.translationCache.has(cacheKey)) {
  return this.translationCache.get(cacheKey);
}
```

### Error Handling

#### Auto-Detection Fallbacks
```javascript
// If auto-detection fails, graceful degradation
try {
  const result = await this.translateWithGoogle(text, 'auto', toLang);
} catch (error) {
  // Try with user's default language as fallback
  const fallbackLang = this.settings.languagesIUnderstand[0] || 'en';
  return await this.translateWithGoogle(text, fallbackLang, toLang);
}
```

#### User Feedback
- Translation failures show helpful error messages
- Users can manually specify source language if auto-detection fails
- Settings page provides troubleshooting guidance

### Language Support

#### Supported for Auto-Detection
All languages supported by Google Translate and MyMemory APIs:
- **100+ languages** with full auto-detection support
- **50+ writing systems** automatically recognized
- **High accuracy** for major world languages

#### Detection Confidence
- Google Translate provides implicit confidence through translation quality
- MyMemory includes explicit confidence scores in responses
- System provides fallback options for low-confidence detections

### Best Practices

#### When to Use Auto-Detection
- ✅ **Multilingual users** who type in multiple languages
- ✅ **Language learners** practicing different languages
- ✅ **Content creators** working with international content
- ✅ **General users** who want maximum convenience

#### When to Use Manual Selection
- ⚠️ **Specialized terminology** that might be misdetected
- ⚠️ **Mixed-language content** with specific source requirements
- ⚠️ **Technical documentation** requiring precise language control
- ⚠️ **Performance-critical scenarios** where every millisecond counts
