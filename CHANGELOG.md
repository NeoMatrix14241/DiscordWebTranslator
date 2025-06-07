# Changelog

All notable changes to Smart Translator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Auto-Detection Feature**: Automatic language detection for typing input
- **Enhanced Documentation**: Comprehensive auto-detect functionality documentation
- **Test Page**: Created test page for verifying auto-detect functionality

### Changed
- **Terminology Update**: Changed "Learning Language" to "Target Translation Language" for clarity
- **Default Settings**: Auto-detect now enabled by default for typing language
- **UI Labels**: Updated all user interface labels to use consistent terminology

### Improved
- **Language Selection**: Added auto-detect option to typing language dropdown
- **API Documentation**: Enhanced API documentation with auto-detect implementation details
- **User Experience**: Simplified language selection with intelligent auto-detection
- Safari support consideration
- Voice translation research

### Changed
- Performance optimizations for large pages

## [1.0.0] - 2025-01-15

### Added
- **Help Mode**: Automatic foreign text detection and translation
- **Output Mode**: Real-time typing translation for language learning
- **Universal Site Support**: Works on any website
- **50+ Language Scripts**: Support for major world languages
- **Smart Detection**: Intelligent foreign text recognition
- **Site Configuration**: Enable on all sites or specific domains
- **Wildcard Patterns**: Flexible site matching with `*.domain.com`
- **Dual Translation APIs**: Google Translate + MyMemory fallback
- **Privacy-First Design**: No data collection or tracking
- **Chromium Universal**: Chrome, Edge, Brave, Opera, Vivaldi support
- **Popup Interface**: Quick access to settings and status
- **Settings Page**: Comprehensive configuration options
- **Real-time Translation**: Live translation as you type
- **Copy to Clipboard**: Easy copying of translations
- **Visual Feedback**: Loading states and error handling
- **Restore Original**: Toggle between original and translated text
- **Notification System**: Success and error notifications
- **Responsive Design**: Works on all screen sizes

### Features in Detail

#### Help Mode
- Scans web pages for foreign text automatically
- Adds unobtrusive 🌐 translate buttons
- One-click translation to your preferred language
- Smart script detection for 50+ writing systems
- Handles dynamic content and AJAX updates
- Preserves original formatting and styling

#### Output Mode
- Detects typing in any text input or rich text editor
- Translates from your native language to target language
- Configurable delay (300-3000ms) for optimal UX
- Works with complex editors (Discord, Twitter, etc.)
- Copy translations with one click
- Beautiful popup with gradient design

#### Language Support
- **East Asian**: Japanese (Hiragana, Katakana, Kanji), Chinese, Korean
- **Middle Eastern**: Arabic, Hebrew, Persian, Urdu
- **South Asian**: Hindi, Bengali, Tamil, Telugu, Gujarati, Punjabi
- **European**: Cyrillic, Greek, Armenian, Georgian
- **Southeast Asian**: Thai, Lao, Myanmar, Khmer
- **African**: Ethiopic (Amharic, Tigrinya)
- **Other**: Mongolian, and many more

#### Technical Features
- Manifest V3 compliance for future-proofing
- Content script architecture for universal compatibility
- Efficient DOM scanning with mutation observers
- Smart element visibility detection
- Debounced scanning for performance
- Memory-efficient WeakMap usage
- Error handling with graceful fallbacks

### Security & Privacy
- No personal data collection
- No user tracking or analytics
- Local language detection processing
- Public API usage only
- No registration or API keys required
- Open source for transparency

### Browser Compatibility
- ✅ Chrome 88+
- ✅ Microsoft Edge 88+
- ✅ Brave Browser
- ✅ Opera
- ✅ Vivaldi
- ✅ Arc Browser
- ✅ Any Chromium-based browser

### Performance
- Lightweight content script (<50KB)
- Efficient DOM scanning algorithms
- Lazy loading of translation services
- Optimized for sites with dynamic content
- Minimal memory footprint
- No background processing when idle

### User Experience
- Zero-configuration setup for basic usage
- Intuitive visual design with gradients
- Smooth animations and transitions
- Consistent behavior across all sites
- Helpful error messages and recovery
- Accessible design following WCAG guidelines

## [0.9.0-beta] - 2024-12-20

### Added
- Initial beta release for testing
- Core translation functionality
- Basic UI implementation

### Known Issues
- Limited language detection
- Performance issues on large pages
- Translation API rate limiting

## [0.1.0-alpha] - 2024-11-15

### Added
- Project initialization
- Basic extension structure
- Proof of concept translation
