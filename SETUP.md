# Cryptexa Wallet - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```powershell
npm install
```

### 2. Configure API Keys

**Important**: Replace Infura API keys before building.

**File**: `src/utils/blockchain.ts`
- Line 17: Replace `YOUR_INFURA_KEY` with your Infura project key
- Line 21: Replace `YOUR_INFURA_KEY` with your Infura project key

**File**: `src/utils/did.ts`
- Line 21: Replace `YOUR_INFURA_KEY` with your Infura project key
- Line 25: Replace `YOUR_INFURA_KEY` with your Infura project key

Get your free Infura key at: https://infura.io/

### 3. Add Extension Icons

Add the following icon files to `public/icons/`:
- `icon16.png` (16x16 pixels)
- `icon32.png` (32x32 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

You can use any image editor or online tool to create these icons.

### 4. Build the Extension

```powershell
npm run build
```

This will create a `dist/` folder with the compiled extension.

### 5. Load in Browser

#### Chrome/Edge:
1. Open `chrome://extensions/` or `edge://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `dist` folder
5. The extension icon should appear in your browser toolbar

#### Firefox:
1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Navigate to `dist/` and select `manifest.json`
4. The extension will be loaded temporarily

### 6. Test the Extension

1. Click the Cryptexa icon in your browser toolbar
2. Create a new wallet or restore an existing one
3. **IMPORTANT**: Save your 12-word seed phrase securely
4. Test on Sepolia testnet before using mainnet

## 📋 Development Mode

For development with hot reload:

```powershell
npm run dev
```

This will watch for file changes and rebuild automatically.

## 🧪 Testing Checklist

- [ ] Create a new wallet
- [ ] Backup seed phrase
- [ ] Lock and unlock wallet
- [ ] Switch networks
- [ ] View balance
- [ ] Send transaction (on testnet)
- [ ] Receive transaction
- [ ] View transaction history
- [ ] Access credential vault
- [ ] Lock mechanism triggers after 5 minutes

## 🔒 Security Reminders

1. **Never share your seed phrase** with anyone
2. **Always test on testnets** (Sepolia) first
3. **Backup your seed phrase** securely offline
4. **Use strong passwords** (minimum 8 characters)
5. **Conduct security audit** before production use

## 📝 File Structure

```
dist/                     # Built extension (created after npm run build)
├── manifest.json        # Extension manifest
├── popup.html           # Popup interface
├── popup.js             # Popup React app
├── background.js        # Service worker
├── content.js           # Content script
├── provider.js          # dApp provider
└── icons/               # Extension icons
```

## 🐛 Troubleshooting

### Build Errors
- Run `npm install` again
- Delete `node_modules/` and `dist/`, then reinstall
- Check Node.js version (requires 18+)

### Extension Not Loading
- Make sure you're loading the `dist/` folder, not the root
- Check browser console for errors
- Verify manifest.json exists in dist/

### TypeScript Errors
- Run `npm run type-check` to see detailed errors
- Ensure all dependencies are installed

### Connection Issues
- Verify Infura API keys are set correctly
- Check network selection (use Sepolia for testing)
- Ensure you have test ETH on testnet

## 🔧 Customization

### Change Lock Timeout
Edit `src/background/service-worker.ts`:
```typescript
const LOCK_TIMEOUT_MS = 5 * 60 * 1000; // Change to desired milliseconds
```

### Add More Networks
Edit `src/utils/blockchain.ts` and add to `NETWORK_CONFIGS`.

### Customize UI Colors
Edit `src/popup/styles.css` to change the color scheme.

## 📞 Support

- Check README.md for detailed documentation
- Review requirements document for feature specifications
- Open GitHub issues for bugs or questions

## ✅ Production Checklist

Before deploying to production:

- [ ] Replace all placeholder API keys
- [ ] Add production-quality icons
- [ ] Complete security audit
- [ ] Test on all supported browsers
- [ ] Test all wallet operations on mainnet (with small amounts)
- [ ] Verify DID operations
- [ ] Test dApp integration
- [ ] Set up monitoring and error tracking
- [ ] Prepare user documentation
- [ ] Plan backup and recovery procedures

---

Good luck building with Cryptexa Wallet! 🚀
