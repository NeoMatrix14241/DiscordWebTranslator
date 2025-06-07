// Smart Translator - Universal Site Scanner
console.log('🚀 Smart Translator loading (Universal Scanner)...');

class SmartTranslatorUniversal {
  constructor() {
    this.settings = {
      myTypingLanguage: 'auto', // Auto-detect typing language
      targetTranslationLanguage: 'ja',
      translationDelay: 800,
      enableHelpMode: true,
      enableOutputMode: true,
      languagesIUnderstand: ['en'],
      helpModeTarget: 'en',
      enableAllSites: true,
      allowedSites: ['discord.com'] // Only Discord is fully tested
    };
    
    this.isTranslating = false;
    this.typingTimer = null;
    this.lastText = '';
    this.currentPopup = null;
    this.translatedElements = new WeakMap();
    this.observer = null;
    this.buttonClickHandlers = new WeakMap();
    this.scannedElements = new WeakSet();
    this.scanInterval = null;
    
    console.log('🎮 Universal Translator initialized');
    this.init();
  }

  async init() {
    console.log('🔧 Starting universal initialization...');
    
    try {
      await this.loadSettings();
      
      // Check if current site is allowed
      if (!this.isSiteAllowed()) {
        console.log('🚫 Site not allowed, translator disabled');
        return;
      }
      
      console.log('✅ Site is allowed, activating translator');
      
      this.createUI();
      this.setupEventListeners();
      this.startTextObserver();
      
      console.log('✅ Initialization complete');
      console.log('⌨️ Output Mode:', this.settings.enableOutputMode ? 'ENABLED' : 'DISABLED');
      console.log('🆘 Help Mode:', this.settings.enableHelpMode ? 'ENABLED' : 'DISABLED');
      
      // Immediate scan of existing content
      console.log('🔍 Starting immediate scan of existing content...');
      this.scanExistingContent();
      
      // Repeated scans to catch content that loads later
      setTimeout(() => this.scanExistingContent(), 2000);
      setTimeout(() => this.scanExistingContent(), 5000);
      setTimeout(() => this.scanExistingContent(), 10000);
      
      // Start periodic scanning
      this.startPeriodicScanning();
      
    } catch (error) {
      console.error('❌ Init error:', error);
    }
  }

  isSiteAllowed() {
    try {
      // If all sites are enabled, allow everything
      if (this.settings.enableAllSites) {
        console.log('🌍 All sites enabled');
        return true;
      }
      
      const currentHostname = window.location.hostname;
      const currentUrl = window.location.href;
      
      console.log('🔍 Checking site:', currentHostname);
      console.log('📋 Allowed sites:', this.settings.allowedSites);
      
      // Check against allowed sites list
      for (const allowedSite of this.settings.allowedSites) {
        if (this.matchesSitePattern(currentHostname, currentUrl, allowedSite)) {
          console.log(`✅ Site matches pattern: ${allowedSite}`);
          return true;
        }
      }
      
      console.log('❌ Site not in allowed list');
      return false;
      
    } catch (error) {
      console.error('❌ Error checking site permissions:', error);
      return true; // Default to allowing if there's an error
    }
  }

  matchesSitePattern(hostname, url, pattern) {
    // Remove whitespace
    pattern = pattern.trim();
    if (!pattern) return false;
    
    // If pattern is just a domain name
    if (!pattern.includes('*') && !pattern.includes('/') && !pattern.includes('://')) {
      return hostname === pattern || hostname.endsWith('.' + pattern);
    }
    
    // Handle wildcard patterns
    if (pattern.includes('*')) {
      const regexPattern = pattern
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.*');
      
      const regex = new RegExp('^' + regexPattern + '$', 'i');
      return regex.test(hostname);
    }
    
    // Handle full URL patterns
    if (pattern.includes('://')) {
      const regexPattern = pattern
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.*')
        .replace(/\//g, '\\/');
      
      const regex = new RegExp('^' + regexPattern, 'i');
      return regex.test(url);
    }
    
    // Default domain matching
    return hostname === pattern || hostname.endsWith('.' + pattern);
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['translatorSettings']);
      if (result.translatorSettings) {
        this.settings = { ...this.settings, ...result.translatorSettings };
        console.log('📊 Settings loaded:', this.settings);
      }
    } catch (error) {
      console.log('⚠️ Using default settings');
    }
  }

  setupEventListeners() {
    console.log('🎧 Setting up universal event listeners...');
    
    // Output Mode: Universal typing translation
    document.addEventListener('input', (event) => {
      this.handleUniversalTyping(event);
    }, true);
    
    document.addEventListener('keyup', (event) => {
      this.handleUniversalTyping(event);
    }, true);
    
    // Also listen for composition events (for Asian languages)
    document.addEventListener('compositionend', (event) => {
      this.handleUniversalTyping(event);
    }, true);
    
    // Global click handler for buttons
    document.addEventListener('click', (event) => {
      this.handleGlobalClick(event);
    }, true);
    
    // Listen for scroll events to scan new content
    document.addEventListener('scroll', () => {
      clearTimeout(this.scrollTimer);
      this.scrollTimer = setTimeout(() => {
        this.scanVisibleContent();
      }, 500);
    }, true);
    
    console.log('✅ Universal event listeners active');
  }

  startPeriodicScanning() {
    console.log('⏰ Starting periodic content scanning...');
    
    // Scan every 15 seconds for new content
    this.scanInterval = setInterval(() => {
      this.scanForNewContent();
    }, 15000);
  }

  scanExistingContent() {
    console.log('🔍 Scanning ALL existing content on page...');
    
    if (!this.settings.enableHelpMode) {
      console.log('⏹️ Help mode disabled, skipping scan');
      return;
    }
    
    // Get ALL text elements on the page
    const allElements = document.querySelectorAll('*');
    let scannedCount = 0;
    let foundForeignCount = 0;
    
    console.log(`🔍 Found ${allElements.length} total elements to check`);
    
    allElements.forEach((element) => {
      // Skip if we've already scanned this element
      if (this.scannedElements.has(element)) {
        return;
      }
      
      // Skip non-visible elements
      if (!this.isElementVisible(element)) {
        return;
      }
      
      // Skip elements that shouldn't contain translatable text
      if (this.shouldSkipElement(element)) {
        return;
      }
      
      // Get direct text content (not from child elements)
      const textContent = this.getDirectTextContent(element);
      
      if (textContent && textContent.length >= 5) {
        scannedCount++;
        
        if (this.detectForeignLanguage(textContent)) {
          console.log(`🌏 Found existing foreign text: "${textContent.substring(0, 50)}..."`);
          foundForeignCount++;
          this.addTranslateButtonToElement(element);
        }
        
        // Mark as scanned
        this.scannedElements.add(element);
      }
    });
    
    console.log(`✅ Existing content scan complete: ${scannedCount} elements scanned, ${foundForeignCount} foreign texts found`);
  }

  scanForNewContent() {
    console.log('🔍 Scanning for new content...');
    
    if (!this.settings.enableHelpMode) return;
    
    // Find elements we haven't scanned yet
    const allElements = document.querySelectorAll('*');
    let newElementsCount = 0;
    let newForeignCount = 0;
    
    allElements.forEach((element) => {
      if (!this.scannedElements.has(element)) {
        if (this.isElementVisible(element) && !this.shouldSkipElement(element)) {
          const textContent = this.getDirectTextContent(element);
          
          if (textContent && textContent.length >= 5) {
            newElementsCount++;
            
            if (this.detectForeignLanguage(textContent)) {
              console.log(`🌏 Found new foreign text: "${textContent.substring(0, 50)}..."`);
              newForeignCount++;
              this.addTranslateButtonToElement(element);
            }
            
            this.scannedElements.add(element);
          }
        }
      }
    });
    
    if (newElementsCount > 0) {
      console.log(`✅ New content scan: ${newElementsCount} new elements, ${newForeignCount} new foreign texts`);
    }
  }

  scanVisibleContent() {
    console.log('👁️ Scanning currently visible content...');
    
    if (!this.settings.enableHelpMode) return;
    
    // Get viewport dimensions
    const viewportHeight = window.innerHeight;
    const scrollTop = window.pageYOffset;
    
    // Find elements in viewport
    const visibleElements = document.querySelectorAll('*');
    let visibleCount = 0;
    
    visibleElements.forEach((element) => {
      if (this.scannedElements.has(element)) return;
      
      const rect = element.getBoundingClientRect();
      const isInViewport = rect.top < viewportHeight && rect.bottom > 0;
      
      if (isInViewport && !this.shouldSkipElement(element)) {
        const textContent = this.getDirectTextContent(element);
        
        if (textContent && textContent.length >= 5) {
          visibleCount++;
          
          if (this.detectForeignLanguage(textContent)) {
            console.log(`🌏 Found visible foreign text: "${textContent.substring(0, 30)}..."`);
            this.addTranslateButtonToElement(element);
          }
          
          this.scannedElements.add(element);
        }
      }
    });
    
    if (visibleCount > 0) {
      console.log(`👁️ Visible scan complete: ${visibleCount} new visible elements processed`);
    }
  }

  isElementVisible(element) {
    if (!element || !element.getBoundingClientRect) return false;
    
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0'
    );
  }

  shouldSkipElement(element) {
    if (!element) return true;
    
    const tagName = element.tagName?.toLowerCase();
    const className = element.className?.toString() || '';
    const id = element.id || '';
    
    // Skip non-content elements
    if (['script', 'style', 'noscript', 'head', 'title', 'meta', 'link'].includes(tagName)) {
      return true;
    }
    
    // Skip input elements
    if (['input', 'textarea', 'select', 'button'].includes(tagName)) {
      return true;
    }
    
    // Skip if element already has a translate button
    if (element.querySelector('.smart-translate-btn')) {
      return true;
    }
    
    // Skip if parent has a translate button (avoid nested buttons)
    if (element.closest('.smart-translate-btn')) {
      return true;
    }
    
    // Skip UI elements that shouldn't be translated
    const skipClasses = [
      'smart-translate-btn',
      'smart-notification',
      'smart-popup',
      'toolbar',
      'navigation',
      'header',
      'footer',
      'sidebar'
    ];
    
    if (skipClasses.some(cls => className.includes(cls) || id.includes(cls))) {
      return true;
    }
    
    return false;
  }

  getDirectTextContent(element) {
    if (!element) return '';
    
    // Get only direct text content, not from child elements
    let text = '';
    
    for (const node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent;
      }
    }
    
    return text.trim();
  }

  startTextObserver() {
    console.log('👀 Starting enhanced text observer...');
    
    this.observer = new MutationObserver((mutations) => {
      let hasNewContent = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if new element contains text
              const textContent = this.getDirectTextContent(node);
              if (textContent && textContent.length >= 5) {
                hasNewContent = true;
                
                // Immediately check if it's foreign text
                if (this.detectForeignLanguage(textContent)) {
                  console.log(`🌏 New foreign text detected immediately: "${textContent.substring(0, 50)}..."`);
                  this.addTranslateButtonToElement(node);
                  this.scannedElements.add(node);
                }
              }
              
              // Also scan child elements
              const childElements = node.querySelectorAll('*');
              childElements.forEach(child => {
                const childText = this.getDirectTextContent(child);
                if (childText && childText.length >= 5 && this.detectForeignLanguage(childText)) {
                  console.log(`🌏 New child foreign text: "${childText.substring(0, 30)}..."`);
                  this.addTranslateButtonToElement(child);
                  this.scannedElements.add(child);
                }
              });
            }
          });
        }
        
        if (mutation.type === 'characterData') {
          hasNewContent = true;
        }
      });
      
      if (hasNewContent) {
        // Debounced scan for other new content
        clearTimeout(this.mutationTimer);
        this.mutationTimer = setTimeout(() => {
          this.scanForNewContent();
        }, 1000);
      }
    });
    
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    console.log('✅ Enhanced text observer started');
  }

  getLanguageName(code) {
    const names = {
      'af': 'Afrikaans', 'sq': 'Albanian', 'am': 'Amharic', 'ar': 'Arabic', 'hy': 'Armenian',
      'as': 'Assamese', 'ay': 'Aymara', 'az': 'Azerbaijani', 'bm': 'Bambara', 'eu': 'Basque',
      'be': 'Belarusian', 'bn': 'Bengali', 'bho': 'Bhojpuri', 'bs': 'Bosnian', 'bg': 'Bulgarian',
      'ca': 'Catalan', 'ceb': 'Cebuano', 'ny': 'Chichewa', 'zh': 'Chinese (Simplified)',
      'zh-cn': 'Chinese (Simplified)', 'zh-tw': 'Chinese (Traditional)', 'co': 'Corsican',
      'hr': 'Croatian', 'cs': 'Czech', 'da': 'Danish', 'dv': 'Dhivehi', 'doi': 'Dogri',
      'nl': 'Dutch', 'en': 'English', 'eo': 'Esperanto', 'et': 'Estonian', 'ee': 'Ewe',
      'tl': 'Filipino', 'fi': 'Finnish', 'fr': 'French', 'fy': 'Frisian', 'gl': 'Galician',
      'ka': 'Georgian', 'de': 'German', 'el': 'Greek', 'gn': 'Guarani', 'gu': 'Gujarati',
      'ht': 'Haitian Creole', 'ha': 'Hausa', 'haw': 'Hawaiian', 'iw': 'Hebrew', 'he': 'Hebrew',
      'hi': 'Hindi', 'hmn': 'Hmong', 'hu': 'Hungarian', 'is': 'Icelandic', 'ig': 'Igbo',
      'ilo': 'Ilocano', 'id': 'Indonesian', 'ga': 'Irish', 'it': 'Italian', 'ja': 'Japanese',
      'jw': 'Javanese', 'kn': 'Kannada', 'kk': 'Kazakh', 'km': 'Khmer', 'rw': 'Kinyarwanda',
      'gom': 'Konkani', 'ko': 'Korean', 'kri': 'Krio', 'ku': 'Kurdish (Kurmanji)',
      'ckb': 'Kurdish (Sorani)', 'ky': 'Kyrgyz', 'lo': 'Lao', 'la': 'Latin', 'lv': 'Latvian',
      'ln': 'Lingala', 'lt': 'Lithuanian', 'lg': 'Luganda', 'lb': 'Luxembourgish',
      'mk': 'Macedonian', 'mai': 'Maithili', 'mg': 'Malagasy', 'ms': 'Malay', 'ml': 'Malayalam',
      'mt': 'Maltese', 'mi': 'Maori', 'mr': 'Marathi', 'mni-mtei': 'Meiteilon (Manipuri)',
      'lus': 'Mizo', 'mn': 'Mongolian', 'my': 'Myanmar (Burmese)', 'ne': 'Nepali',
      'no': 'Norwegian', 'or': 'Odia (Oriya)', 'om': 'Oromo', 'ps': 'Pashto', 'fa': 'Persian',
      'pl': 'Polish', 'pt': 'Portuguese', 'pa': 'Punjabi', 'qu': 'Quechua', 'ro': 'Romanian',
      'ru': 'Russian', 'sm': 'Samoan', 'sa': 'Sanskrit', 'gd': 'Scots Gaelic', 'nso': 'Sepedi',
      'sr': 'Serbian', 'st': 'Sesotho', 'sn': 'Shona', 'sd': 'Sindhi', 'si': 'Sinhala',
      'sk': 'Slovak', 'sl': 'Slovenian', 'so': 'Somali', 'es': 'Spanish', 'su': 'Sundanese',
      'sw': 'Swahili', 'sv': 'Swedish', 'tg': 'Tajik', 'ta': 'Tamil', 'tt': 'Tatar',
      'te': 'Telugu', 'th': 'Thai', 'ti': 'Tigrinya', 'ts': 'Tsonga', 'tr': 'Turkish',
      'tk': 'Turkmen', 'ak': 'Twi', 'uk': 'Ukrainian', 'ur': 'Urdu', 'ug': 'Uyghur',
      'uz': 'Uzbek', 'vi': 'Vietnamese', 'cy': 'Welsh', 'xh': 'Xhosa', 'yi': 'Yiddish',
      'yo': 'Yoruba', 'zu': 'Zulu', 'auto': 'Auto-Detect'
    };
    return names[code] || code.toUpperCase();
  }

  detectForeignLanguage(text) {
    if (!text || text.length < 2) return false;
    
    // Enhanced script detection for more languages
    const scripts = {
      // East Asian
      japanese: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text),
      chinese: /[\u4E00-\u9FFF]/.test(text),
      korean: /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(text),
      
      // Middle Eastern & South Asian
      arabic: /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text),
      hebrew: /[\u0590-\u05FF]/.test(text),
      persian: /[\u0600-\u06FF]/.test(text),
      urdu: /[\u0600-\u06FF]/.test(text),
      hindi: /[\u0900-\u097F]/.test(text),
      bengali: /[\u0980-\u09FF]/.test(text),
      gujarati: /[\u0A80-\u0AFF]/.test(text),
      punjabi: /[\u0A00-\u0A7F]/.test(text),
      tamil: /[\u0B80-\u0BFF]/.test(text),
      telugu: /[\u0C00-\u0C7F]/.test(text),
      kannada: /[\u0C80-\u0CFF]/.test(text),
      malayalam: /[\u0D00-\u0D7F]/.test(text),
      sinhala: /[\u0D80-\u0DFF]/.test(text),
      
      // European scripts
      cyrillic: /[\u0400-\u04FF]/.test(text), // Russian, Bulgarian, Serbian, etc.
      greek: /[\u0370-\u03FF]/.test(text),
      armenian: /[\u0530-\u058F]/.test(text),
      georgian: /[\u10A0-\u10FF]/.test(text),
      
      // Southeast Asian
      thai: /[\u0E00-\u0E7F]/.test(text),
      lao: /[\u0E80-\u0EFF]/.test(text),
      myanmar: /[\u1000-\u109F]/.test(text),
      khmer: /[\u1780-\u17FF]/.test(text),
      
      // African scripts
      ethiopic: /[\u1200-\u137F]/.test(text), // Amharic, Tigrinya
      
      // Other scripts
      mongolian: /[\u1800-\u18AF]/.test(text),
    };
    
    // Check if any foreign script is detected
    const hasForeignScript = Object.values(scripts).some(detected => detected);
    
    if (hasForeignScript) {
      console.log('🔍 Foreign script detected in:', text.substring(0, 30));
      return true;
    }
    
    // Additional check: if text is mostly non-Latin characters
    const nonLatinChars = text.match(/[^\u0000-\u007F\u0080-\u00FF\u0100-\u017F\u0180-\u024F]/g);
    const nonLatinRatio = nonLatinChars ? nonLatinChars.length / text.length : 0;
    
    if (nonLatinRatio > 0.3) {
      console.log('🔍 High non-Latin ratio detected:', nonLatinRatio);
      return true;
    }
    
    return false;
  }

  addTranslateButtonToElement(element) {
    if (!element || element.querySelector('.smart-translate-btn')) {
      return;
    }
    
    // Create translate button
    const translateBtn = document.createElement('button');
    translateBtn.className = 'smart-translate-btn';
    translateBtn.innerHTML = '🌐';
    translateBtn.title = 'Translate to ' + this.getLanguageName(this.settings.helpModeTarget);
    translateBtn.setAttribute('data-smart-btn', 'translate');
    
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
    
    // Store click handler
    this.buttonClickHandlers.set(translateBtn, () => {
      this.translateElementText(element, translateBtn);
    });
    
    // Add hover effects
    translateBtn.addEventListener('mouseenter', () => {
      translateBtn.style.opacity = '1';
      translateBtn.style.transform = 'scale(1.15)';
      translateBtn.style.boxShadow = '0 5px 18px rgba(40, 167, 69, 0.6)';
    });
    
    translateBtn.addEventListener('mouseleave', () => {
      translateBtn.style.opacity = '0.9';
      translateBtn.style.transform = 'scale(1)';
      translateBtn.style.boxShadow = '0 3px 12px rgba(40, 167, 69, 0.4)';
    });
    
    // Insert button smartly
    try {
      // Try different insertion methods
      if (element.style.display === 'flex' || element.style.display === 'inline-flex') {
        element.style.alignItems = 'center';
      }
      
      element.appendChild(translateBtn);
      console.log('✅ Translate button added to element');
    } catch (error) {
      console.log('⚠️ Could not add translate button:', error);
    }
  }

  async translateElementText(element, button) {
    const originalText = this.getDirectTextContent(element);
    
    if (this.translatedElements.has(element)) {
      // Text is already translated, restore original
      const originalData = this.translatedElements.get(element);
      this.setElementText(element, originalData.original);
      button.innerHTML = '🌐';
      button.title = 'Translate to ' + this.getLanguageName(this.settings.helpModeTarget);
      button.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
      this.translatedElements.delete(element);
      console.log('🔄 Restored original text');
      return;
    }
    
    // Show loading state
    button.innerHTML = '⏳';
    button.style.background = 'linear-gradient(135deg, #ffc107, #fd7e14)';
    
    try {
      console.log('🌏 Translating element text:', originalText.substring(0, 50));
      
      const translatedText = await this.translateTextWithFallback(
        originalText,
        'auto',
        this.settings.helpModeTarget
      );
      
      if (translatedText && translatedText !== originalText) {
        // Store original text
        this.translatedElements.set(element, {
          original: originalText,
          translated: translatedText
        });
        
        // Replace with translation
        this.setElementText(element, translatedText);
        
        // Update button to show it can be reverted
        button.innerHTML = '🔄';
        button.title = 'Restore original text';
        button.style.background = 'linear-gradient(135deg, #007bff, #0056b3)';
        
        console.log('✅ Element text translated:', translatedText.substring(0, 50));
        
        // Show success notification
        this.showTranslationNotification(originalText, translatedText);
        
      } else {
        throw new Error('Translation returned same text or empty');
      }
      
    } catch (error) {
      console.error('❌ Translation failed:', error);
      
      // Show error state
      button.innerHTML = '❌';
      button.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
      button.title = 'Translation failed - Click to retry';
      
      // Reset button after 3 seconds
      setTimeout(() => {
        button.innerHTML = '🌐';
        button.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        button.title = 'Translate to ' + this.getLanguageName(this.settings.helpModeTarget);
      }, 3000);
    }
  }

  setElementText(element, text) {
    // Replace only the text nodes, preserve child elements
    for (const node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = text;
        break; // Only replace the first text node
      }
    }
  }

  handleUniversalTyping(event) {
    if (!this.settings.enableOutputMode) return;

    const element = event.target;

    if (!this.isTypingInput(element)) {
      return;
    }

    const text = this.getInputText(element);

    // Only translate if text is different from last translated text and long enough
    if (text.length < 3 || text === this.lastText) {
      return;
    }

    clearTimeout(this.typingTimer);

    this.typingTimer = setTimeout(() => {
      // Only translate if text is still different from last translated text
      if (text !== this.lastText) {
        this.translateUserInput(text, element);
        this.lastText = text;
      }
    }, this.settings.translationDelay);
  }

  isTypingInput(element) {
    if (!element) return false;
    
    const tagName = element.tagName?.toLowerCase();
    const type = element.type?.toLowerCase();
    const role = element.getAttribute?.('role')?.toLowerCase();
    const contentEditable = element.contentEditable;
    const ariaLabel = element.getAttribute?.('aria-label')?.toLowerCase() || '';
    
    // Universal input detection
    const isTextInput = (
      // Standard form inputs
      (tagName === 'input' && ['text', 'search', 'url', 'email', 'password'].includes(type)) ||
      tagName === 'textarea' ||
      // Content editable elements
      contentEditable === 'true' ||
      // ARIA textbox role
      role === 'textbox' ||
      // Common rich text editors
      element.hasAttribute?.('data-slate-editor') ||
      element.closest?.('[data-slate-editor]') ||
      element.closest?.('[role="textbox"]') ||
      element.closest?.('[contenteditable="true"]')
    );
    
    // Skip password and sensitive fields
    if (type === 'password' || 
        ariaLabel.includes('password') || 
        element.id?.toLowerCase().includes('password') ||
        element.name?.toLowerCase().includes('password')) {
      return false;
    }
    
    const result = isTextInput;
    
    if (result) {
      console.log('✅ Typing input detected:', {
        tag: tagName,
        type: type,
        role: role,
        contentEditable: contentEditable,
        site: window.location.hostname
      });
    }
    
    return result;
  }

  getInputText(element) {
    let text = '';

    // Standard input/textarea elements
    if (typeof element.value === 'string') {
      text = element.value;
    } 
    // Content editable elements and rich text editors
    else if (element.contentEditable === 'true' || element.getAttribute('role') === 'textbox') {
      // Try different methods to get text content
      if (element.textContent) {
        text = element.textContent;
      } else if (element.innerText) {
        text = element.innerText;
      } else {
        // Walk through text nodes for complex editors
        const walker = document.createTreeWalker(
          element,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );
        let node;
        let parts = [];
        while ((node = walker.nextNode())) {
          parts.push(node.textContent);
        }
        text = parts.join('');
      }
    }

    // Clean up text
    text = text.trim();
    text = text.replace(/[\u200B-\u200D\uFEFF]/g, ''); // Remove zero-width characters

    return text;
  }

  async translateUserInput(text, element) {
    if (this.isTranslating) return;
    
    console.log('🚀 Starting universal input translation:', text);
    this.showIndicator();
    this.isTranslating = true;
    
    try {
      // Determine source language (auto-detect or specified)
      const fromLang = this.settings.myTypingLanguage === 'auto' ? 'auto' : this.settings.myTypingLanguage;
      
      const translated = await this.translateTextWithFallback(
        text,
        fromLang,
        this.settings.targetTranslationLanguage
      );
      
      if (translated && translated !== text) {
        console.log('✅ Universal input translation success:', translated);
        this.showTypingTranslation(element, text, translated);
      }
      
    } catch (error) {
      console.error('❌ Universal input translation failed:', error);
      this.showError('Translation failed - Network issue');
    }
    
    this.hideIndicator();
    this.isTranslating = false;
  }

  async translateTextWithFallback(text, fromLang, toLang, retryCount = 0) {
    const maxRetries = 2;
    
    if (retryCount >= maxRetries) {
      throw new Error('All translation methods failed');
    }
    
    try {
      if (retryCount === 0) {
        return await this.translateWithGoogle(text, fromLang, toLang);
      } else {
        return await this.translateWithMyMemory(text, fromLang, toLang);
      }
    } catch (error) {
      console.warn(`Translation method ${retryCount + 1} failed:`, error.message);
      return this.translateTextWithFallback(text, fromLang, toLang, retryCount + 1);
    }
  }

  async translateWithGoogle(text, fromLang, toLang) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const result = await response.json();
    
    // Join all translated segments to handle multi-sentence input
    if (result && Array.isArray(result[0])) {
      return result[0].map(seg => seg[0]).join('');
    }
    
    throw new Error('Invalid Google Translate response');
  }

  async translateWithMyMemory(text, fromLang, toLang) {
    const langPair = fromLang === 'auto' ? `autodetect|${toLang}` : `${fromLang}|${toLang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result && result.responseData && result.responseData.translatedText) {
      return result.responseData.translatedText;
    }
    
    throw new Error('Invalid MyMemory response');
  }

  handleGlobalClick(event) {
    const target = event.target;
    
    if (target.classList.contains('smart-translate-btn')) {
      event.preventDefault();
      event.stopPropagation();
      
      const handler = this.buttonClickHandlers.get(target);
      if (handler) {
        handler();
      }
    }
    
    if (target.classList.contains('notification-close-btn')) {
      event.preventDefault();
      event.stopPropagation();
      target.closest('.smart-notification').remove();
    }
    
    if (target.classList.contains('popup-close-btn')) {
      event.preventDefault();
      event.stopPropagation();
      this.removeCurrentPopup();
    }
    
    if (target.classList.contains('copy-btn')) {
      event.preventDefault();
      event.stopPropagation();
      
      const handler = this.buttonClickHandlers.get(target);
      if (handler) {
        handler();
      }
    }
  }

  showTranslationNotification(original, translated) {
    const existing = document.querySelector('.smart-notification');
    if (existing) existing.remove();
    
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
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 18px;">🌐</span>
        <span style="flex: 1;">Text Translated!</span>
        <button class="notification-close-btn" style="background: none; border: none; color: white; cursor: pointer; opacity: 0.8; font-size: 18px; padding: 2px; border-radius: 4px;">&times;</button>
      </div>
      <div style="font-size: 13px; opacity: 0.9; margin-top: 8px; line-height: 1.4;">
        Click 🔄 button to restore original
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideInFromRight 0.4s ease-in reverse';
        setTimeout(() => {
          notification.remove();
        }, 400);
      }
    }, 6000);
  }

  showTypingTranslation(element, original, translated) {
    this.removeCurrentPopup();
    
    const popup = document.createElement('div');
    popup.id = 'typing-translator-popup';
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
    
    const siteName = window.location.hostname.replace('www.', '');
    
    popup.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
        <div style="font-weight: bold; font-size: 18px;">
          ⌨️ ${siteName} Translator
        </div>
        <button class="popup-close-btn" style="background: none; border: none; color: white; cursor: pointer; font-size: 22px; opacity: 0.7;">&times;</button>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); padding: 18px; border-radius: 10px; margin-bottom: 18px;">
        <div style="font-size: 13px; opacity: 0.8; margin-bottom: 10px;">
          ${this.getLanguageName(this.settings.myTypingLanguage)} → ${this.getLanguageName(this.settings.targetTranslationLanguage)}
        </div>
        <div style="font-weight: 500; font-size: 20px; line-height: 1.4;">
          "${translated}"
        </div>
      </div>
      
      <div style="display: flex; gap: 12px;">
        <button class="copy-btn"
                style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 14px 18px; border-radius: 10px; cursor: pointer; flex: 1; font-size: 14px; font-weight: bold;">
          📋 Copy Translation
        </button>
        <button class="popup-close-btn"
                style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 14px 18px; border-radius: 10px; cursor: pointer; font-size: 14px;">
          ✕ Close
        </button>
      </div>
    `;
    
    document.body.appendChild(popup);
    this.currentPopup = popup;
    
    const copyBtn = popup.querySelector('.copy-btn');
    this.buttonClickHandlers.set(copyBtn, async () => {
      try {
        await navigator.clipboard.writeText(translated);
        copyBtn.innerHTML = '✅ Copied!';
        copyBtn.style.background = 'rgba(40, 167, 69, 0.4)';
        
        setTimeout(() => {
          if (copyBtn) {
            copyBtn.innerHTML = '📋 Copy Translation';
            copyBtn.style.background = 'rgba(255,255,255,0.2)';
          }
        }, 2500);
      } catch (error) {
        console.error('❌ Copy failed:', error);
      }
    });
    
    setTimeout(() => {
      if (this.currentPopup === popup) {
        this.removeCurrentPopup();
      }
    }, 15000);
  }

  removeCurrentPopup() {
    if (this.currentPopup && this.currentPopup.parentElement) {
      this.currentPopup.remove();
      this.currentPopup = null;
    }
  }

  showError(message = 'Translation failed') {
    const error = document.createElement('div');
    error.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #dc3545, #c82333);
      color: white;
      padding: 16px 22px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: bold;
      z-index: 999999;
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    `;
    error.innerHTML = `❌ ${message}`;
    
    document.body.appendChild(error);
    
    setTimeout(() => {
      error.remove();
    }, 5000);
  }

  createUI() {
    this.indicator = document.createElement('div');
    this.indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white;
      padding: 14px 22px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: bold;
      z-index: 999999;
      display: none;
      box-shadow: 0 6px 25px rgba(0,0,0,0.3);
    `;
    this.indicator.innerHTML = `🔄 Translating...`;
    
    document.body.appendChild(this.indicator);
    
    if (!document.getElementById('smart-translator-styles')) {
      const style = document.createElement('style');
      style.id = 'smart-translator-styles';
      style.textContent = `
        @keyframes popupFadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes buttonPopIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInFromRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  showIndicator() {
    this.indicator.style.display = 'block';
  }

  hideIndicator() {
    this.indicator.style.display = 'none';
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM loaded, creating universal translator...');
    window.smartTranslator = new SmartTranslatorUniversal();
  });
} else {
  console.log('🎯 Document ready, creating universal translator...');
  window.smartTranslator = new SmartTranslatorUniversal();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'settingsUpdated' && window.smartTranslator) {
    console.log('🔄 Settings updated, reloading...');
    window.smartTranslator.loadSettings();
  }
});

console.log('📝 Universal Smart Translator loaded successfully');