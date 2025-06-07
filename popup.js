document.addEventListener('DOMContentLoaded', async function() {
  const extensionStatus = document.getElementById('extensionStatus');
  const currentSite = document.getElementById('currentSite');
  const helpModeStatus = document.getElementById('helpModeStatus');
  const outputModeStatus = document.getElementById('outputModeStatus');
  const typingLanguage = document.getElementById('typingLanguage');
  const targetTranslationLanguage = document.getElementById('targetTranslationLanguage');
  const translationDelay = document.getElementById('translationDelay');
  const siteAccess = document.getElementById('siteAccess');
  const settingsBtn = document.getElementById('settingsBtn');
  const helpBtn = document.getElementById('helpBtn');
  const helpContent = document.getElementById('helpContent');

  // Complete language names mapping - matches options.js
  const languageNames = {
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

  // Get current site
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      const url = new URL(tabs[0].url);
      currentSite.textContent = `Current site: ${url.hostname}`;
    }
  } catch (error) {
    currentSite.textContent = 'Current site: Unknown';
  }

  // Load and display settings
  try {
    const result = await chrome.storage.sync.get(['translatorSettings']);
    const settings = result.translatorSettings || {
      enableHelpMode: true,
      enableOutputMode: true,
      myTypingLanguage: 'auto',
      targetTranslationLanguage: 'de',
      translationDelay: 600,
      enableAllSites: true,
      allowedSites: []
    };

    console.log('📊 Loaded settings:', settings);

    // Update status display
    extensionStatus.textContent = 'Active';
    extensionStatus.style.color = '#00ff88';
    
    // Update settings display
    helpModeStatus.textContent = settings.enableHelpMode ? 'Enabled' : 'Disabled';
    helpModeStatus.style.color = settings.enableHelpMode ? '#28a745' : '#dc3545';
    
    outputModeStatus.textContent = settings.enableOutputMode ? 'Enabled' : 'Disabled';
    outputModeStatus.style.color = settings.enableOutputMode ? '#28a745' : '#dc3545';
    
    typingLanguage.textContent = languageNames[settings.myTypingLanguage] || settings.myTypingLanguage;
    targetTranslationLanguage.textContent = languageNames[settings.targetTranslationLanguage] || settings.targetTranslationLanguage;
    translationDelay.textContent = `${settings.translationDelay}ms`;
    
    if (settings.enableAllSites) {
      siteAccess.textContent = 'All Sites';
      siteAccess.style.color = '#28a745';
    } else {
      const siteCount = settings.allowedSites ? settings.allowedSites.length : 0;
      siteAccess.textContent = `${siteCount} Sites`;
      siteAccess.style.color = siteCount > 0 ? '#ffc107' : '#dc3545';
    }

  } catch (error) {
    console.error('❌ Error loading settings:', error);
    extensionStatus.textContent = 'Error';
    extensionStatus.style.color = '#dc3545';
  }

  // Settings button
  settingsBtn.addEventListener('click', function() {
    console.log('🔧 Opening settings page...');
    chrome.runtime.openOptionsPage();
  });

  // Help button
  helpBtn.addEventListener('click', function() {
    console.log('❓ Help button clicked');
    const isVisible = helpContent.style.display === 'block';
    helpContent.style.display = isVisible ? 'none' : 'block';
    helpBtn.textContent = isVisible ? 'Help' : 'Hide Help';
  });

  console.log(`✅ Popup initialized with support for ${Object.keys(languageNames).length} languages`);
});