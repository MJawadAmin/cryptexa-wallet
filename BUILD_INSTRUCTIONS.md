# 🚀 BUILD & LOAD INSTRUCTIONS

## Quick Build (3 Steps)

### Step 1: Install
```bash
npm install
```
⏱️ Takes ~2 minutes

### Step 2: Build
```bash
npm run build
```
⏱️ Takes ~10 seconds

### Step 3: Load
1. Open Chrome: `chrome://extensions/`
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked"
4. Select the `dist` folder
5. Done! ✅

---

## Build Commands

```bash
# Production build (minified, optimized)
npm run build

# Development build (with source maps, auto-rebuild)
npm run dev

# Clean and rebuild
npm run clean
npm run build

# Type checking only (no build)
npm run type-check
```

---

## What Gets Built?

After `npm run build`, the `dist/` folder contains:

```
dist/
├── manifest.json        # Extension manifest
├── background.js        # Service worker (~2.28 MB)
├── popup.js            # Popup UI (~340 KB)
├── popup.html          # Popup HTML
├── content.js          # Content script
├── provider.js         # Web3 provider
├── options.js          # Options page
├── options.html        # Options page HTML
├── dashboard.js        # Dashboard page
├── dashboard.html      # Dashboard HTML
├── vendors.js          # Shared libraries
└── icons/             # Extension icons (if added)
```

**Total size:** ~3 MB (includes Ethers.js, DID libraries, etc.)

---

## Build Process Explained

```
TypeScript Files (.ts/.tsx)
    ↓
TypeScript Compiler
    ↓
React JSX Transformation
    ↓
Tailwind CSS Processing (PostCSS)
    ↓
Webpack Bundling
    ↓
Node.js Polyfills (crypto, buffer, stream, etc.)
    ↓
Code Minification (production)
    ↓
Source Maps (development)
    ↓
dist/ folder ready!
```

---

## Troubleshooting Build Issues

### Issue: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: "Unexpected token" or syntax errors
- Check Node.js version: `node --version` (need v16+)
- Update npm: `npm install -g npm@latest`

### Issue: Build is slow
- Close other programs
- First build is always slower
- Subsequent builds are faster

### Issue: TypeScript errors
```bash
npm run type-check
```
Fix any errors shown, then rebuild

---

## Development Workflow

### Initial Setup
```bash
npm install          # Once
npm run build        # First build
# Load in Chrome
```

### During Development
```bash
npm run dev          # Runs webpack in watch mode
# Make changes to code
# Webpack auto-rebuilds
# Refresh extension in chrome://extensions/
```

### Before Deployment
```bash
npm run build        # Production build (minified)
# Test thoroughly
# Package extension
```

---

## File Size Breakdown

| File | Size | Contains |
|------|------|----------|
| background.js | ~2.28 MB | Ethers.js, DID libs, crypto |
| popup.js | ~340 KB | React, UI components |
| content.js | ~20 KB | Content script |
| provider.js | ~30 KB | Web3 provider |
| vendors.js | ~500 KB | Shared dependencies |

**Why so large?**
- Ethers.js alone is ~1.5 MB
- DID libraries: ~500 KB
- Crypto polyfills: ~200 KB
- React: ~150 KB

This is normal for Web3 extensions!

---

## Production Checklist

Before shipping:

- [ ] Replace `YOUR_INFURA_KEY` with real API key
- [ ] Test all features (create, import, send, sign)
- [ ] Test on testnet first
- [ ] Add extension icons (16x16, 32x32, 48x48, 128x128)
- [ ] Update version in `manifest-new.json`
- [ ] Run `npm run build` (production)
- [ ] Test built extension
- [ ] Create .zip for distribution

---

## Creating Extension Package

For Chrome Web Store submission:

```bash
# 1. Build production version
npm run build

# 2. Navigate to dist folder
cd dist

# 3. Create ZIP (Windows)
Compress-Archive -Path * -DestinationPath ../cryptexa-wallet.zip

# OR on Mac/Linux
zip -r ../cryptexa-wallet.zip *

# 4. Upload cryptexa-wallet.zip to Chrome Web Store
```

---

## Quick Reference

### File Structure (Pre-Build)
```
src/
├── app/          # React app
├── extension/    # Chrome scripts
├── wallet/       # Wallet logic
└── did/          # DID logic
```

### File Structure (Post-Build)
```
dist/
├── All compiled .js files
├── All .html files
└── manifest.json
```

### Load This in Chrome
```
E:\Desktop\Office Works\Client Work\cryptexa-wallet\dist
```

---

## Performance Tips

### Faster Builds
- Use `npm run dev` for development
- Don't run `type-check` before every build
- Close unused programs

### Smaller Bundles
- Already optimized for production
- Tree-shaking enabled
- Code splitting configured
- Minification on

---

## Environment Setup

### Required
- Node.js 16+ ✅
- npm 7+ ✅
- Chrome/Edge browser ✅

### Optional
- Git (for version control)
- VS Code (recommended editor)
- Chrome extension updater (for auto-reload)

---

## Build Success Indicators

✅ **Successful Build:**
```
webpack 5.89.0 compiled successfully in 8432 ms
```

✅ **Files Created:**
```
dist/manifest.json
dist/background.js
dist/popup.js
dist/content.js
dist/provider.js
... (and more)
```

❌ **Failed Build:**
```
ERROR in ./src/...
Module not found
```
→ Check dependencies: `npm install`

---

## After Build

### Verify Extension
1. Go to `chrome://extensions/`
2. Find "Cryptexa Wallet"
3. Status should be "Enabled"
4. No errors in console
5. Icon appears in toolbar

### Test Basic Flow
1. Click extension icon
2. Create new wallet
3. Save recovery phrase
4. Enter dashboard
5. Check balance display
6. Try switching networks

---

## Next Steps After Build

1. ✅ Extension built successfully
2. ✅ Loaded in Chrome
3. 🔜 Test wallet creation
4. 🔜 Test transaction sending
5. 🔜 Connect to a dApp
6. 🔜 Explore DID features

---

**Build Time:** ~10 seconds
**Install Time:** ~2 minutes
**Total Setup:** ~3 minutes

You're ready to go! 🎉
