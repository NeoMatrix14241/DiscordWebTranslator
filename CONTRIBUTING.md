# Contributing to Smart Translator

Thank you for your interest in contributing to Smart Translator! This document provides guidelines and information for contributors.

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive experience for all contributors. Please be respectful and considerate in all interactions.

## 🚀 Getting Started

### Prerequisites
- Basic knowledge of JavaScript, HTML, and CSS
- Familiarity with Chrome extension development
- A Chromium-based browser for testing

### Development Setup
1. Fork the repository
2. Clone your fork locally
3. Load the extension in developer mode
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## 📝 How to Contribute

### Reporting Bugs
Before creating a bug report, please check existing issues to avoid duplicates.

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- Browser: [Chrome/Edge/Brave/Opera]
- Version: [e.g. 91.0.4472.124]
- Extension version: [e.g. 1.0.0]
- OS: [e.g. Windows 10]

**Additional context**
Any other context about the problem.
```

### Suggesting Features
Feature suggestions are welcome! Please use the feature request template:

**Feature Request Template:**
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots about the feature request.
```

### Pull Requests

#### Before You Start
1. Check existing issues and PRs to avoid duplicates
2. Discuss major changes in an issue first
3. Make sure your idea aligns with the project goals

#### PR Guidelines
1. **Fork & Branch**: Create a feature branch from `main`
2. **Commits**: Use clear, descriptive commit messages
3. **Testing**: Test your changes thoroughly
4. **Documentation**: Update documentation if needed
5. **Code Style**: Follow existing code patterns

#### Commit Message Format
```
type(scope): brief description

Longer description if needed

Fixes #123
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 🏗️ Development Guidelines

### Code Style
- Use consistent indentation (2 spaces)
- Use meaningful variable and function names
- Add comments for complex logic
- Follow ES6+ standards
- Keep functions small and focused

### File Structure
```
smart-translator/
├── manifest.json          # Extension configuration
├── background.js          # Service worker
├── content.js            # Content script (main logic)
├── content.css           # Content script styles
├── popup.html/js         # Extension popup
├── options.html/js       # Settings page
└── docs/                 # Documentation
```

### Testing Checklist
Before submitting a PR, ensure:
- [ ] Extension loads without errors
- [ ] Help Mode works on various websites
- [ ] Output Mode works in different input fields
- [ ] Settings save and load correctly
- [ ] No console errors
- [ ] Works across different Chromium browsers
- [ ] Responsive design on different screen sizes

### Adding Language Support
To add support for a new language script:

1. **Update `detectForeignLanguage()` in content.js:**
```javascript
const scripts = {
  // Add your language script detection
  newLanguage: /[\u1234-\u5678]/.test(text), // Unicode range
  // ...existing scripts
};
```

2. **Add language to `getLanguageName()` mapping:**
```javascript
const names = {
  'new': 'New Language',
  // ...existing languages
};
```

3. **Update language lists in options.js and popup.js**

4. **Test with real text samples**

## 🧪 Testing

### Manual Testing
1. **Load Extension**: Test loading in developer mode
2. **Help Mode**: Visit sites with foreign text
3. **Output Mode**: Test typing in various input fields
4. **Settings**: Verify all settings work correctly
5. **Cross-Browser**: Test in Chrome, Edge, Brave
6. **Error Handling**: Test with network issues

### Test Sites
Good sites for testing:
- **Japanese**: Twitter Japan, Yahoo Japan
- **Chinese**: Baidu, Weibo
- **Arabic**: Al Jazeera
- **Russian**: Yandex, VK
- **Korean**: Naver
- **Multi-language**: Wikipedia, Reddit

## 📚 Documentation

### Update Documentation When:
- Adding new features
- Changing existing functionality
- Adding language support
- Modifying settings or configuration

### Documentation Files
- `README.md` - Main documentation
- `CONTRIBUTING.md` - This file
- `docs/LANGUAGES.md` - Supported languages
- `docs/API.md` - Technical API documentation

## 🏷️ Release Process

### Version Numbering
We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist
- [ ] Update version in `manifest.json`
- [ ] Update CHANGELOG.md
- [ ] Test thoroughly
- [ ] Create release notes
- [ ] Tag release
- [ ] Update Chrome Web Store

## 🎯 Project Goals

### Primary Goals
- Universal translation support across all websites
- Privacy-focused (no data collection)
- Easy to use for non-technical users
- High-quality translations
- Fast and responsive

### Non-Goals
- Complex linguistic analysis
- Paid/premium features
- Data collection or analytics
- Platform-specific features

## 💡 Ideas for Contributions

### Beginner-Friendly
- Fix typos in documentation
- Improve error messages
- Add more language detection patterns
- Enhance CSS styling
- Write tests

### Intermediate
- Improve translation quality
- Add new language scripts
- Optimize performance
- Enhance UI/UX
- Add keyboard shortcuts

### Advanced
- Firefox port
- Safari support
- Offline translation
- OCR for images
- Voice translation

## 🤔 Questions?

- Check existing [Issues](https://github.com/yourusername/smart-translator/issues)
- Start a [Discussion](https://github.com/yourusername/smart-translator/discussions)
- Email: dev@smart-translator.com

## 🙏 Recognition

All contributors will be recognized in:
- README.md contributors section
- Release notes
- Special thanks for major contributions

Thank you for helping make Smart Translator better for everyone! 🌟
