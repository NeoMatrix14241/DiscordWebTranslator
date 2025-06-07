document.addEventListener('DOMContentLoaded', async function() {
  console.log('🔧 Options page loaded');
  
  // Complete Google Translate language support
  const allLanguages = {
    'auto': '🔍 Auto-Detect',
    'af': '🇿🇦 Afrikaans',
    'sq': '🇦🇱 Albanian', 
    'am': '🇪🇹 Amharic',
    'ar': '🇸🇦 Arabic',
    'hy': '🇦🇲 Armenian',
    'as': '🇮🇳 Assamese',
    'ay': '🇧🇴 Aymara',
    'az': '🇦🇿 Azerbaijani',
    'bm': '🇲🇱 Bambara',
    'eu': '🇪🇸 Basque',
    'be': '🇧🇾 Belarusian',
    'bn': '🇧🇩 Bengali',
    'bho': '🇮🇳 Bhojpuri',
    'bs': '🇧🇦 Bosnian',
    'bg': '🇧🇬 Bulgarian',
    'ca': '🇪🇸 Catalan',
    'ceb': '🇵🇭 Cebuano',
    'ny': '🇲🇼 Chichewa',
    'zh': '🇨🇳 Chinese (Simplified)',
    'zh-cn': '🇨🇳 Chinese (Simplified)',
    'zh-tw': '🇹🇼 Chinese (Traditional)',
    'co': '🇫🇷 Corsican',
    'hr': '🇭🇷 Croatian',
    'cs': '🇨🇿 Czech',
    'da': '🇩🇰 Danish',
    'dv': '🇲🇻 Dhivehi',
    'doi': '🇮🇳 Dogri',
    'nl': '🇳🇱 Dutch',
    'en': '🇺🇸 English',
    'eo': '🌍 Esperanto',
    'et': '🇪🇪 Estonian',
    'ee': '🇬🇭 Ewe',
    'tl': '🇵🇭 Filipino',
    'fi': '🇫🇮 Finnish',
    'fr': '🇫🇷 French',
    'fy': '🇳🇱 Frisian',
    'gl': '🇪🇸 Galician',
    'ka': '🇬🇪 Georgian',
    'de': '🇩🇪 German',
    'el': '🇬🇷 Greek',
    'gn': '🇵🇾 Guarani',
    'gu': '🇮🇳 Gujarati',
    'ht': '🇭🇹 Haitian Creole',
    'ha': '🇳🇬 Hausa',
    'haw': '🇺🇸 Hawaiian',
    'iw': '🇮🇱 Hebrew',
    'he': '🇮🇱 Hebrew',
    'hi': '🇮🇳 Hindi',
    'hmn': '🇨🇳 Hmong',
    'hu': '🇭🇺 Hungarian',
    'is': '🇮🇸 Icelandic',
    'ig': '🇳🇬 Igbo',
    'ilo': '🇵🇭 Ilocano',
    'id': '🇮🇩 Indonesian',
    'ga': '🇮🇪 Irish',
    'it': '🇮🇹 Italian',
    'ja': '🇯🇵 Japanese',
    'jw': '🇮🇩 Javanese',
    'kn': '🇮🇳 Kannada',
    'kk': '🇰🇿 Kazakh',
    'km': '🇰🇭 Khmer',
    'rw': '🇷🇼 Kinyarwanda',
    'gom': '🇮🇳 Konkani',
    'ko': '🇰🇷 Korean',
    'kri': '🇸🇱 Krio',
    'ku': '🇹🇷 Kurdish (Kurmanji)',
    'ckb': '🇮🇶 Kurdish (Sorani)',
    'ky': '🇰🇬 Kyrgyz',
    'lo': '🇱🇦 Lao',
    'la': '🇻🇦 Latin',
    'lv': '🇱🇻 Latvian',
    'ln': '🇨🇩 Lingala',
    'lt': '🇱🇹 Lithuanian',
    'lg': '🇺🇬 Luganda',
    'lb': '🇱🇺 Luxembourgish',
    'mk': '🇲🇰 Macedonian',
    'mai': '🇮🇳 Maithili',
    'mg': '🇲🇬 Malagasy',
    'ms': '🇲🇾 Malay',
    'ml': '🇮🇳 Malayalam',
    'mt': '🇲🇹 Maltese',
    'mi': '🇳🇿 Maori',
    'mr': '🇮🇳 Marathi',
    'mni-mtei': '🇮🇳 Meiteilon (Manipuri)',
    'lus': '🇮🇳 Mizo',
    'mn': '🇲🇳 Mongolian',
    'my': '🇲🇲 Myanmar (Burmese)',
    'ne': '🇳🇵 Nepali',
    'no': '🇳🇴 Norwegian',
    'or': '🇮🇳 Odia (Oriya)',
    'om': '🇪🇹 Oromo',
    'ps': '🇦🇫 Pashto',
    'fa': '🇮🇷 Persian',
    'pl': '🇵🇱 Polish',
    'pt': '🇵🇹 Portuguese',
    'pa': '🇮🇳 Punjabi',
    'qu': '🇵🇪 Quechua',
    'ro': '🇷🇴 Romanian',
    'ru': '🇷🇺 Russian',
    'sm': '🇼🇸 Samoan',
    'sa': '🇮🇳 Sanskrit',
    'gd': '🏴 Scots Gaelic',
    'nso': '🇿🇦 Sepedi',
    'sr': '🇷🇸 Serbian',
    'st': '🇱🇸 Sesotho',
    'sn': '🇿🇼 Shona',
    'sd': '🇵🇰 Sindhi',
    'si': '🇱🇰 Sinhala',
    'sk': '🇸🇰 Slovak',
    'sl': '🇸🇮 Slovenian',
    'so': '🇸🇴 Somali',
    'es': '🇪🇸 Spanish',
    'su': '🇮🇩 Sundanese',
    'sw': '🇰🇪 Swahili',
    'sv': '🇸🇪 Swedish',
    'tg': '🇹🇯 Tajik',
    'ta': '🇮🇳 Tamil',
    'tt': '🇷🇺 Tatar',
    'te': '🇮🇳 Telugu',
    'th': '🇹🇭 Thai',
    'ti': '🇪🇷 Tigrinya',
    'ts': '🇿🇦 Tsonga',
    'tr': '🇹🇷 Turkish',
    'tk': '🇹🇲 Turkmen',
    'ak': '🇬🇭 Twi',
    'uk': '🇺🇦 Ukrainian',
    'ur': '🇵🇰 Urdu',
    'ug': '🇨🇳 Uyghur',
    'uz': '🇺🇿 Uzbek',
    'vi': '🇻🇳 Vietnamese',
    'cy': '🏴 Welsh',
    'xh': '🇿🇦 Xhosa',
    'yi': '🇮🇱 Yiddish',
    'yo': '🇳🇬 Yoruba',
    'zu': '🇿🇦 Zulu'
  };

  // Get all form elements
  const enableHelpMode = document.getElementById('enableHelpMode');
  const enableOutputMode = document.getElementById('enableOutputMode');
  const helpModeTarget = document.getElementById('helpModeTarget');
  const myTypingLanguage = document.getElementById('myTypingLanguage');
  const targetTranslationLanguage = document.getElementById('targetTranslationLanguage');
  const translationDelay = document.getElementById('translationDelay');
  const enableAllSites = document.getElementById('enableAllSites');
  const allowedSites = document.getElementById('allowedSites');
  const specificSitesGroup = document.getElementById('specificSitesGroup');
  const currentSite = document.getElementById('currentSite');
  const saveButton = document.getElementById('saveSettings');
  const status = document.getElementById('status');
  const languagesGrid = document.getElementById('languagesIUnderstand');
  const understandSearch = document.getElementById('understandSearch');

  // Populate language selects
  function populateLanguageSelect(selectElement, includeAuto = false) {
    selectElement.innerHTML = '';
    
    if (includeAuto) {
      const autoOption = document.createElement('option');
      autoOption.value = 'auto';
      autoOption.textContent = '🔍 Auto-Detect';
      selectElement.appendChild(autoOption);
    }
    
    Object.entries(allLanguages).forEach(([code, name]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = name;
      selectElement.appendChild(option);
    });
  }

  // Populate languages I understand grid
  function populateLanguagesGrid(filterText = '') {
    languagesGrid.innerHTML = '';
    
    Object.entries(allLanguages).forEach(([code, name]) => {
      if (filterText && !name.toLowerCase().includes(filterText.toLowerCase()) && 
          !code.toLowerCase().includes(filterText.toLowerCase())) {
        return;
      }
      
      const languageItem = document.createElement('div');
      languageItem.className = 'language-item';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = code;
      checkbox.id = `understand-${code}`;
      
      const label = document.createElement('label');
      label.htmlFor = `understand-${code}`;
      label.textContent = name;
      label.style.cursor = 'pointer';
      label.style.fontSize = '13px';
      
      languageItem.appendChild(checkbox);
      languageItem.appendChild(label);
      languagesGrid.appendChild(languageItem);
    });
  }

  // Search functionality
  understandSearch.addEventListener('input', (e) => {
    populateLanguagesGrid(e.target.value);
  });

  // Initialize language selects and grid
  populateLanguageSelect(helpModeTarget);
  populateLanguageSelect(myTypingLanguage, true); // Include auto-detect for typing language
  populateLanguageSelect(targetTranslationLanguage);
  populateLanguagesGrid();

  // Show current site
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs[0]) {
    const url = new URL(tabs[0].url);
    currentSite.textContent = url.hostname;
  }

  // Default settings with popular languages
  const defaultSettings = {
    enableHelpMode: true,
    languagesIUnderstand: ['en', 'es', 'fr', 'de', 'pl'], // Popular languages
    helpModeTarget: 'en',
    enableOutputMode: true,
    myTypingLanguage: 'auto', // Auto-detect typing language
    targetTranslationLanguage: 'es', // Spanish as default target language
    translationDelay: 600,
    enableAllSites: true,
    allowedSites: ['discord.com'] // Only Discord is fully tested
  };

  // Handle site configuration visibility
  enableAllSites.addEventListener('change', function() {
    specificSitesGroup.style.display = this.checked ? 'none' : 'block';
  });

  // Load current settings
  console.log('📖 Loading settings...');
  try {
    const result = await chrome.storage.sync.get(['translatorSettings']);
    console.log('🔍 Storage result:', result);
    
    const settings = result.translatorSettings || defaultSettings;
    console.log('⚙️ Using settings:', settings);

    // Set form values
    enableHelpMode.checked = settings.enableHelpMode;
    enableOutputMode.checked = settings.enableOutputMode;
    helpModeTarget.value = settings.helpModeTarget;
    myTypingLanguage.value = settings.myTypingLanguage;
    targetTranslationLanguage.value = settings.targetTranslationLanguage;
    translationDelay.value = settings.translationDelay;
    
    // Site configuration
    enableAllSites.checked = settings.enableAllSites !== false;
    specificSitesGroup.style.display = enableAllSites.checked ? 'none' : 'block';
    
    if (settings.allowedSites && Array.isArray(settings.allowedSites)) {
      allowedSites.value = settings.allowedSites.join('\n');
    }

    // Set understood languages checkboxes
    const understoodLangs = settings.languagesIUnderstand || ['en'];
    console.log('🗣️ Languages I understand:', understoodLangs);
    
    understoodLangs.forEach(lang => {
      const checkbox = document.getElementById(`understand-${lang}`);
      if (checkbox) {
        checkbox.checked = true;
        console.log(`✅ Checked language: ${lang}`);
      }
    });

    showStatus('✅ Settings loaded successfully!', 'success');
    
  } catch (error) {
    console.error('❌ Error loading settings:', error);
    showStatus('⚠️ Using default settings. Storage error: ' + error.message, 'error');
    
    // Use defaults if loading fails
    enableHelpMode.checked = defaultSettings.enableHelpMode;
    enableOutputMode.checked = defaultSettings.enableOutputMode;
    helpModeTarget.value = defaultSettings.helpModeTarget;
    myTypingLanguage.value = defaultSettings.myTypingLanguage;
    targetTranslationLanguage.value = defaultSettings.targetTranslationLanguage;
    translationDelay.value = defaultSettings.translationDelay;
    enableAllSites.checked = defaultSettings.enableAllSites;
    allowedSites.value = defaultSettings.allowedSites.join('\n');
  }

  // Save settings with detailed logging
  saveButton.addEventListener('click', async function() {
    console.log('💾 Save button clicked');
    showStatus('💾 Saving settings...', 'info');
    
    try {
      // Get understood languages
      const languagesIUnderstand = [];
      const checkboxes = document.querySelectorAll('#languagesIUnderstand input[type="checkbox"]:checked');
      console.log('🔍 Found checkboxes:', checkboxes.length);
      
      checkboxes.forEach(cb => {
        languagesIUnderstand.push(cb.value);
        console.log(`✅ Language I understand: ${cb.value}`);
      });

      // Parse allowed sites
      const allowedSitesList = allowedSites.value
        .split('\n')
        .map(site => site.trim())
        .filter(site => site.length > 0);

      const newSettings = {
        // Help Mode
        enableHelpMode: enableHelpMode.checked,
        languagesIUnderstand: languagesIUnderstand,
        helpModeTarget: helpModeTarget.value,
        
        // Output Mode
        enableOutputMode: enableOutputMode.checked,
        myTypingLanguage: myTypingLanguage.value,
        targetTranslationLanguage: targetTranslationLanguage.value,
        translationDelay: parseInt(translationDelay.value),
        
        // Site Configuration
        enableAllSites: enableAllSites.checked,
        allowedSites: allowedSitesList
      };

      console.log('💾 Saving settings:', newSettings);

      // Save to storage
      await chrome.storage.sync.set({ translatorSettings: newSettings });
      console.log('✅ Settings saved to storage');
      
      // Verify the save worked
      const verification = await chrome.storage.sync.get(['translatorSettings']);
      console.log('🔍 Verification read:', verification);
      
      if (verification.translatorSettings) {
        console.log('✅ Save verification successful');
        
        // Notify all tabs about settings update
        try {
          const tabs = await chrome.tabs.query({});
          console.log(`📢 Notifying ${tabs.length} tabs about settings update`);
          
          let notifiedTabs = 0;
          for (const tab of tabs) {
            try {
              await chrome.tabs.sendMessage(tab.id, { action: 'settingsUpdated' });
              notifiedTabs++;
            } catch (tabError) {
              // Ignore errors for tabs that don't have our content script
              console.log(`⚠️ Could not notify tab ${tab.id}:`, tabError.message);
            }
          }
          
          console.log(`✅ Successfully notified ${notifiedTabs} tabs`);
        } catch (tabError) {
          console.warn('⚠️ Error notifying tabs:', tabError);
        }
        
        showStatus(`✅ Settings saved successfully! Supporting ${Object.keys(allLanguages).length} languages.`, 'success');
      } else {
        throw new Error('Settings verification failed');
      }
      
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      showStatus('❌ Error saving settings: ' + error.message, 'error');
    }
  });

  function showStatus(message, type) {
    console.log(`📢 Status: ${message} (${type})`);
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    
    if (type === 'info') {
      status.style.background = '#d1ecf1';
      status.style.color = '#0c5460';
    }
    
    // Auto-hide after delay (except for errors)
    if (type !== 'error') {
      setTimeout(() => {
        status.style.display = 'none';
      }, 5000);
    }
  }
  
  console.log(`🔧 Options page setup complete with ${Object.keys(allLanguages).length} languages`);
});