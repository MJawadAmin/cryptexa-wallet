# 🚀 Cryptexa Wallet - Development Guide

## 📋 Quick Start

### Option 1: UI Preview (Localhost Development)

For **rapid UI development** without loading the extension:

```powershell
npm run dev
```

This opens the popup UI at `http://localhost:5173` using Vite. Changes hot-reload instantly.

**Note**: Chrome extension APIs (`chrome.*`) won't work in browser preview. This is for UI/styling work only.

---

### Option 2: Full Extension Testing

To test the **complete extension** with blockchain/DID features:

#### 1. Build the Extension

```powershell
npm run build:extension
```

This creates production-ready files in `/dist` folder.

#### 2. Load in Browser

**Chrome / Edge:**
1. Navigate to `chrome://extensions/` or `edge://extensions/`
2. Enable "**Developer mode**" (toggle top-right)
3. Click "**Load unpacked**"
4. Select the `dist` folder
5. ✅ Extension loaded!

**Firefox:**
1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click "**Load Temporary Add-on**"
3. Select `dist/manifest.json`
4. ✅ Extension loaded!

---

## 📦 NPM Scripts Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | 🔥 **Vite localhost preview** (UI only, port 5173) |
| `npm run dev:watch` | 🔧 Webpack watch mode (rebuilds extension on changes) |
| `npm run build` | 📦 **Production build** (same as build:extension) |
| `npm run build:extension` | 📦 Build full extension to `/dist` |
| `npm run preview` | 👀 Preview Vite build locally |
| `npm run type-check` | ✅ TypeScript validation |
| `npm run lint` | 🧹 ESLint code quality check |

---

## 🏗️ Project Structure

```
cryptexa-wallet/
├── src/
│   ├── popup/              # React UI (Vite dev server runs here)
│   │   ├── index.tsx       # Entry point
│   │   ├── index.html      # Vite preview HTML
│   │   ├── popup.html      # Webpack extension HTML
│   │   ├── App.tsx         # Main app component
│   │   ├── styles.css      # Tailwind styles
│   │   └── components/     # UI components
│   ├── background/         # Service worker (background.js)
│   │   └── service-worker.ts
│   ├── content/            # Content scripts
│   │   ├── content-script.ts
│   │   └── provider.ts     # window.cryptexa API
│   ├── utils/              # Shared utilities
│   │   ├── crypto.ts       # BIP39/BIP44
│   │   ├── blockchain.ts   # Ethers.js
│   │   └── did.ts          # DID/VC/VP
│   └── store/              # Zustand state
│       └── wallet-store.ts
├── dist/                   # 📦 Extension build output
├── public/
│   ├── manifest.json       # Extension manifest
│   └── icons/              # Extension icons
├── vite.config.ts          # Vite config (localhost preview)
├── webpack.config.js       # Webpack config (extension build)
└── package.json
```

---

## 🔧 Development Workflow

### For UI/Styling Work (Fast):
```powershell
npm run dev
```
- Opens `http://localhost:5173`
- Hot module replacement
- Instant feedback
- **Limitation**: No chrome.* APIs

### For Extension Feature Testing:
```powershell
npm run build:extension
# Then load /dist in browser extensions page
```

### Continuous Extension Development:
```powershell
npm run dev:watch
# Rebuilds extension automatically on file changes
# Reload extension in browser to see updates
```

---

## ⚡ Bundle Optimization Notes

### Current Setup:
- **Popup**: 338 KB (React + Tailwind + UI components)
- **Background**: 2.28 MB (includes all crypto libraries)
- **Content**: 659 bytes (minimal)
- **Provider**: 2 KB (window API injection)

### Optimization Applied:
1. **`vm: false`** in webpack - Disables unused Node.js VM module
2. **Node.js polyfills** - Only includes browser-compatible versions:
   - `buffer` → `buffer/`
   - `crypto` → `crypto-browserify`
   - `stream` → `stream-browserify`
   - `vm` → disabled (not needed)

### Further Optimization Ideas:
- **Code splitting**: Lazy-load DID features separately from wallet
- **Tree shaking**: Ensure `sideEffects: false` in package.json
- **Alternative libraries**:
  - Replace `ethers.js` (1.2MB) with `@ethersproject/providers` + specific modules
  - Replace `crypto-browserify` with native Web Crypto API where possible
  - Use `@noble/secp256k1` instead of `elliptic` for smaller bundle

---

## 🔒 Security Setup

### Before Production:

1. **Add Infura API Key**:
   - Edit `src/utils/blockchain.ts` (lines 17, 21)
   - Edit `src/utils/did.ts` (lines 21, 25)
   - Replace `YOUR_INFURA_KEY` with real key from https://infura.io

2. **Add Extension Icons**:
   ```
   public/icons/
   ├── icon16.png   (16×16px)
   ├── icon32.png   (32×32px)
   ├── icon48.png   (48×48px)
   └── icon128.png  (128×128px)
   ```

3. **Test on Testnet First**:
   - Use Sepolia testnet for development
   - Never test with real funds on mainnet
   - Get testnet ETH from https://sepoliafaucet.com

---

## 🐛 Troubleshooting

### Vite Preview Shows Errors:
- **Cause**: Chrome extension APIs don't exist in browser
- **Solution**: This is expected. Use for UI styling only.

### Extension Build Warnings:
- **"vm" module not found**: Fixed by `vm: false` in webpack config
- **Bundle size warnings**: Expected for crypto libraries. Consider optimizations above.

### Extension Not Working:
1. Check console errors in extension popup (Right-click → Inspect)
2. Check background service worker logs (chrome://extensions → Inspect service worker)
3. Verify Infura API keys are configured
4. Ensure on correct network (Sepolia for testing)

### Hot Reload Not Working:
- Vite preview: Should work automatically
- Extension: Must manually reload extension after `npm run dev:watch` rebuilds

---

## 📚 Tech Stack

| Category | Technology |
|----------|-----------|
| **UI Framework** | React 18 + TypeScript |
| **Styling** | Tailwind CSS 3.4 |
| **Animation** | Framer Motion |
| **State** | Zustand |
| **Blockchain** | Ethers.js v6 |
| **Crypto** | bip39, hdkey, crypto-js |
| **DID** | did-jwt, ethr-did |
| **Build (Extension)** | Webpack 5 |
| **Build (Preview)** | Vite 6 |
| **Extension** | Manifest V3 |

---

## 🎯 Key Features

✅ **BIP39/BIP44** wallet generation & restoration
✅ **Multi-network** support (Ethereum, Sepolia, Polygon, BSC)
✅ **Send/Receive** transactions with gas estimation
✅ **DID Integration** (W3C Decentralized Identifiers)
✅ **Verifiable Credentials** vault
✅ **Auto-lock** security (5-minute timeout)
✅ **Modern UI** with Tailwind + Framer Motion
✅ **Content Script** provider for dApp integration

---

## 📖 Additional Documentation

- **BUILD_GUIDE.md** - Complete build instructions
- **SETUP.md** - Environment setup
- **QUICKSTART.md** - Quick start guide
- **PROJECT_SUMMARY.md** - Architecture overview
- **CHECKLIST.md** - Deployment checklist

---

## 🚀 Ready to Ship?

Before publishing:
1. ✅ Test all features on testnet
2. ✅ Security audit code
3. ✅ Add production Infura keys
4. ✅ Add custom icons
5. ✅ Update manifest.json version
6. ✅ Test on Chrome, Edge, Firefox
7. ✅ Review bundle size optimizations

---

**Happy Coding! 🎉**

For issues or questions, check the inline documentation in source files.
