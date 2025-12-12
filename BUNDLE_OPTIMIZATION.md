# 📦 Bundle Optimization Guide

## Current Bundle Sizes

```
✅ popup.js:      338 KB  (React + Tailwind + UI components)
⚠️  background.js: 2.28 MB  (crypto libraries + blockchain + DID)
✅ provider.js:   2 KB    (window API injection)
✅ content.js:    659 bytes (minimal)
```

**Total Extension Size**: ~2.62 MB

---

## ✅ Already Optimized

1. **`vm: false`** - Disabled unused Node.js VM module
2. **Browser polyfills** - Using lightweight browser-compatible versions:
   - `crypto-browserify` instead of Node crypto
   - `stream-browserify` instead of Node streams
   - `buffer/` polyfill for Buffer usage
3. **Webpack production mode** - Minification + tree-shaking enabled
4. **Separate development server** - Vite for fast UI previews

---

## 🎯 Optimization Strategies

### Strategy 1: Replace Heavy Dependencies

#### Current Heavy Dependencies:
| Library | Size Impact | Optimization |
|---------|-------------|--------------|
| `ethers.js` | ~1.2 MB | Use `@ethersproject/*` individual packages |
| `crypto-browserify` | ~300 KB | Use native Web Crypto API where possible |
| `elliptic` | ~150 KB | Replace with `@noble/secp256k1` (15 KB) |
| `did-jwt` + `ethr-did` | ~400 KB | Consider lighter JWT library |

#### Implementation Example:

**Replace ethers.js** (save ~800 KB):
```typescript
// Before
import { ethers } from 'ethers';

// After - only import what you need
import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { parseEther, formatEther } from '@ethersproject/units';
```

**Use Web Crypto API** (save ~200 KB):
```typescript
// Before
import CryptoJS from 'crypto-js';

// After - native browser API
async function encryptAES(data: string, password: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const passwordBuffer = encoder.encode(password);
  
  // Use native SubtleCrypto
  const key = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  const aesKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: crypto.getRandomValues(new Uint8Array(16)), iterations: 100000, hash: 'SHA-256' },
    key,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    dataBuffer
  );
  
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}
```

---

### Strategy 2: Lazy Loading (Code Splitting)

Split heavy features into separate chunks that load on-demand:

**Update webpack.config.js**:
```javascript
optimization: {
  minimize: true,
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      // Split crypto libraries
      crypto: {
        test: /[\\/]node_modules[\\/](bip39|hdkey|crypto-js|elliptic)[\\/]/,
        name: 'crypto',
        priority: 10,
      },
      // Split blockchain libraries
      blockchain: {
        test: /[\\/]node_modules[\\/](ethers|@ethersproject)[\\/]/,
        name: 'blockchain',
        priority: 9,
      },
      // Split DID libraries
      did: {
        test: /[\\/]node_modules[\\/](did-jwt|ethr-did|did-resolver)[\\/]/,
        name: 'did',
        priority: 8,
      },
    },
  },
},
```

**Lazy import in components**:
```typescript
// Before
import { createVerifiableCredential } from '@/utils/did';

// After - load only when needed
const DIDModule = await import('@/utils/did');
const credential = await DIDModule.createVerifiableCredential(...);
```

---

### Strategy 3: External Dependencies

Move crypto operations to a separate worker script:

**Create `src/workers/crypto-worker.ts`**:
```typescript
// Heavy crypto operations run in isolated worker
import { generateMnemonic, derivePrivateKey } from '@/utils/crypto';

self.addEventListener('message', async (e) => {
  const { action, payload } = e.data;
  
  switch (action) {
    case 'generateMnemonic':
      const mnemonic = generateMnemonic();
      self.postMessage({ action, result: mnemonic });
      break;
    case 'deriveKey':
      const key = await derivePrivateKey(payload.mnemonic, payload.path);
      self.postMessage({ action, result: key });
      break;
  }
});
```

**Update manifest.json**:
```json
{
  "web_accessible_resources": [{
    "resources": ["crypto-worker.js"],
    "matches": ["<all_urls>"]
  }]
}
```

---

### Strategy 4: Remove Unused Code

**Audit imports**:
```powershell
# Find large dependencies
npx webpack-bundle-analyzer dist/background.js.map

# Check for duplicate dependencies
npx npm-check-dupes
```

**Tree-shake better**:
Add to `package.json`:
```json
{
  "sideEffects": [
    "*.css"
  ]
}
```

---

## 🚀 Quick Wins (Implement These First)

### 1. Remove `vm-browserify` (Done ✅)
```javascript
// webpack.config.js
fallback: {
  vm: false, // Don't polyfill, not needed
}
```

### 2. Optimize Tailwind CSS
Update `tailwind.config.js`:
```javascript
module.exports = {
  content: ['./src/popup/**/*.{ts,tsx}'], // Only scan popup files
  theme: { /* ... */ },
  corePlugins: {
    // Disable unused plugins
    preflight: true,
    container: false,
    accessibility: false,
    backgroundOpacity: false,
    // ... disable more as needed
  },
};
```

### 3. Use Production React
Verify webpack is using production build:
```javascript
// webpack.config.js
plugins: [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  // ... other plugins
],
```

### 4. Dynamic Imports for DID Features
```typescript
// Only load DID when user accesses Credentials tab
const loadDIDFeatures = async () => {
  const { createDID, createVerifiableCredential } = await import('@/utils/did');
  return { createDID, createVerifiableCredential };
};
```

---

## 📊 Expected Results

| Optimization | Size Reduction | Effort |
|--------------|----------------|--------|
| `vm: false` | -50 KB | ✅ Done |
| Replace ethers with @ethersproject | -800 KB | Medium |
| Web Crypto API instead of crypto-js | -200 KB | Medium |
| @noble/secp256k1 instead of elliptic | -135 KB | Low |
| Code splitting (lazy load DID) | -400 KB initial | Medium |
| Tailwind purging | -20 KB | Low |
| Remove duplicate deps | -100 KB | Low |

**Potential Total Reduction**: ~1.7 MB → Target: **~900 KB total**

---

## 🎯 Recommended Implementation Order

1. ✅ **Done**: Fix `vm` warning
2. **Next**: Replace `@noble/secp256k1` for elliptic (easiest, 135 KB saved)
3. **Then**: Implement code splitting for DID features (400 KB saved)
4. **Advanced**: Migrate to @ethersproject modules (800 KB saved)
5. **Final**: Web Crypto API migration (200 KB saved)

---

## 📝 Notes

- **Extension size limit**: Chrome allows up to 128 MB, so 2.28 MB is acceptable
- **Performance**: Background service worker loads once, popup loads on click
- **Trade-offs**: Smaller bundle = more complexity in dependency management
- **Priority**: Security and functionality > bundle size for crypto wallet

---

## 🔧 Test Bundle Size Changes

```powershell
# Build and check sizes
npm run build:extension
ls dist -Name | ForEach-Object { "{0}: {1:N2} KB" -f $_, ((Get-Item "dist\$_").Length / 1KB) }

# Analyze bundle composition
npx webpack-bundle-analyzer dist/background.js.map
```

---

## 🚀 Production Checklist

Before deploying optimizations:
- [ ] Test all wallet operations still work
- [ ] Test DID features after lazy loading
- [ ] Verify transactions sign correctly
- [ ] Check auto-lock still functions
- [ ] Test on all supported networks
- [ ] Benchmark load times (target: <1s popup open)

---

**Remember**: Optimize for user experience first, bundle size second. A 2 MB wallet that works perfectly is better than a 500 KB wallet with bugs.
