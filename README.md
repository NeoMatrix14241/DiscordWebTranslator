# 🌐 Smart Translator - Chromium Browser Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue)](https://chrome.google.com/webstore)
[![Chromium Compatible](https://img.shields.io/badge/Chromium-Compatible-green)](https://www.chromium.org/)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-orange)](https://developer.chrome.com/docs/extensions/mv3/)

A powerful, privacy-focused browser extension that automatically detects and translates foreign text on any website while helping you learn new languages through real-time typing translation.

## ✨ Features

### 🆘 Help Mode - Foreign Text Detection
- **Automatic Detection**: Instantly identifies foreign text in 50+ languages and scripts
- **Smart Buttons**: Adds unobtrusive 🌐 translate buttons next to foreign content
- **One-Click Translation**: Translate any text to your preferred language
- **Restore Original**: Click 🔄 to restore original text anytime
- **Discord Tested**: Fully tested and optimized for Discord (other sites may work but are not officially tested)

### ⌨️ Output Mode - Real-Time Learning
- **Live Translation**: Translates your typing in real-time as you type
- **Auto-Detect**: Automatically detects what language you're typing in
- **Language Learning**: Type in any language, see translations in your target language
- **Smart Recognition**: Detects text inputs across all websites and rich text editors
- **Copy to Clipboard**: Easily copy translations for use anywhere
- **Customizable Delay**: Configure translation timing (300-3000ms)

### 🌍 Site Support
- **All Chromium Browsers**: Chrome, Edge, Brave, Opera, Vivaldi, Arc
- **Site Configuration**: Choose to enable on all sites or specific domains
- **Wildcard Support**: Use patterns like `*.google.com` for flexible site matching
- **No API Keys Required**: Uses free translation services
- **Privacy First**: No data stored or transmitted to third parties
- **Discord Optimized**: Fully tested on Discord; other sites may work but compatibility is not guaranteed

## 🚀 Quick Start

### Installation

#### Option 1: Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore) (Coming Soon)
2. Click "Add to Chrome"
3. Confirm installation

#### Option 2: Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open your browser's extension management page:
   - **Chrome**: `chrome://extensions/`
   - **Edge**: `edge://extensions/`
   - **Brave**: `brave://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension folder

### Initial Setup
1. Click the 🌐 extension icon in your browser toolbar
2. Click "Settings" to configure your preferences
3. Set your native language and target translation language
4. Choose which websites to enable the translator on
5. Save settings and start translating!

## 📖 How to Use

### Help Mode (Foreign Text Translation)
1. **Automatic Detection**: Browse any website normally
2. **Translate Button**: When foreign text is detected, a green 🌐 button appears
3. **Click to Translate**: Click the button to translate text to your language
4. **Restore Original**: Click the blue 🔄 button to see original text again

### Output Mode (Learning Mode)
1. **Type Normally**: Type in any text field in your native language
2. **See Translation**: After a short delay, a popup shows the translation
3. **Copy Translation**: Click "📋 Copy Translation" to use it elsewhere
4. **Continue Learning**: Keep typing to practice more phrases

## ⚙️ Configuration

### Language Settings
- **Languages I Understand**: Select all languages you can read (for Help Mode)
- **Target Language**: What to translate foreign text to
- **Typing Language**: Your native typing language
- **Target Translation Language**: Language you want to translate to

### Site Configuration
- **All Sites**: Enable translator on every website you visit
- **Specific Sites**: Only enable on chosen domains
- **Patterns**: Support for wildcards and URL patterns

### Advanced Options
- **Translation Delay**: How long to wait before translating (300-3000ms)
- **Help Mode**: Toggle automatic foreign text detection
- **Output Mode**: Toggle real-time typing translation

## 🔧 Technical Details

### Architecture
- **Manifest V3**: Latest Chrome extension standard
- **Content Scripts**: Scans and modifies web page content
- **Background Service Worker**: Handles settings and coordination
- **Storage API**: Syncs settings across devices
- **Popup UI**: Quick access to settings and status

### Translation Services
- **Primary**: Google Translate API (free public endpoint)
- **Fallback**: MyMemory Translation API
- **No Registration**: No API keys or accounts required
- **Offline Capable**: Works with cached translations

### Language Detection
Smart script detection for:
- **East Asian**: Japanese (Hiragana, Katakana, Kanji), Chinese (Simplified/Traditional), Korean
- **Middle Eastern**: Arabic, Hebrew, Persian, Urdu
- **South Asian**: Hindi, Bengali, Tamil, Telugu, Gujarati, Punjabi, Malayalam, Kannada
- **European**: Cyrillic (Russian, Bulgarian, Serbian), Greek, Armenian, Georgian
- **Southeast Asian**: Thai, Lao, Myanmar, Khmer
- **African**: Ethiopic (Amharic, Tigrinya)
- **Other**: Mongolian, and many more...

## 🛠️ Development

### Prerequisites
- Node.js (for development tools)
- Chromium-based browser
- Basic knowledge of HTML, CSS, JavaScript

### Project Structure
```
smart-translator/
├── manifest.json          # Extension manifest
├── background.js          # Service worker
├── content.js            # Main content script
├── content.css           # Content script styles
├── popup.html            # Extension popup UI
├── popup.js              # Popup functionality
├── options.html          # Settings page
├── options.js            # Settings functionality
└── README.md             # This file
```

### Building and Testing
```bash
# Clone the repository
git clone https://github.com/yourusername/smart-translator.git
cd smart-translator

# Load in browser for testing
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select the project folder
```

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🌟 Supported Languages

The extension supports translation between 100+ languages including:

| Language | Code | Script |
|----------|------|--------|
| English | en | Latin |
| Spanish | es | Latin |
| French | fr | Latin |
| German | de | Latin |
| Japanese | ja | Hiragana, Katakana, Kanji |
| Chinese (Simplified) | zh | Hanzi |
| Korean | ko | Hangul |
| Arabic | ar | Arabic |
| Russian | ru | Cyrillic |
| Hindi | hi | Devanagari |
| Thai | th | Thai |
| Hebrew | he | Hebrew |

[View complete language list →](docs/LANGUAGES.md)

## 🔒 Privacy & Security

- **No Data Collection**: Extension doesn't collect or store personal data
- **Local Processing**: Language detection happens locally in your browser
- **Public APIs**: Uses only public, free translation services
- **No Tracking**: No analytics, telemetry, or user tracking
- **Open Source**: All code is publicly auditable
- **Permissions**: Only requests necessary permissions for functionality

## 🆘 Troubleshooting

### Common Issues

**Translation not working?**
- Check if the site is in your allowed sites list
- Ensure Help/Output Mode is enabled in settings
- Try refreshing the page after changing settings
- Check browser console for error messages
- Note: Only Discord is fully tested; other sites may have compatibility issues

**Translate buttons not appearing?**
- Verify Help Mode is enabled
- Check if foreign text is long enough (5+ characters)
- Ensure the website isn't blocking the extension
- Try disabling other translation extensions
- For best results, use on Discord where functionality is fully tested

**Typing translation not working?**
- Confirm Output Mode is enabled
- Check if typing delay is appropriate for your speed
- Verify you're typing in a supported input field
- Make sure you're not in a password field
- Discord has the most reliable typing detection; other sites may vary

### Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 88+ | ✅ Full | Primary development target |
| Edge 88+ | ✅ Full | Chromium-based, full compatibility |
| Brave | ✅ Full | Chromium-based, full compatibility |
| Opera | ✅ Full | Chromium-based, full compatibility |
| Firefox | ❌ Not yet | Planned for future release |
| Safari | ❌ Not yet | Considering support |

### Site Compatibility

| Site | Support | Notes |
|------|---------|-------|
| Discord | ✅ Fully Tested | Complete functionality verified |
| Other Sites | ⚠️ Experimental | May work but not officially tested or supported |

> **Note**: While the extension may function on various websites, only Discord has been thoroughly tested. Users may experience compatibility issues on untested sites. We recommend primarily using this extension on Discord for the best experience.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Ways to Contribute
- 🐛 Report bugs or issues
- 💡 Suggest new features
- 🌍 Add support for new languages
- 📝 Improve documentation
- 🔧 Submit bug fixes
- ⭐ Star the repository

## 🙏 Acknowledgments

- Google Translate API for translation services
- MyMemory Translation API for fallback support
- All contributors and users who make this project possible

---

**I made this so I can talk to people in discord that don't understand english**

*If you find this extension helpful, please consider giving it a ⭐ star on GitHub!*
