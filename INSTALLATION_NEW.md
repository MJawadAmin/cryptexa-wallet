# 🚀 Cryptexa Wallet - Complete Installation Guide

## Overview

Cryptexa Wallet is a **production-ready** Chrome extension that combines a full-featured Web3 wallet with Decentralized Identity (DID) integration. This guide will walk you through the complete installation and setup process.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Google Chrome** or **Microsoft Edge** browser
- **Git** (optional, for cloning)

---

## 📥 Installation Steps

### Step 1: Download or Clone the Project

```bash
# Option 1: Clone from repository (if available)
git clone https://github.com/yourrepo/cryptexa-wallet.git
cd cryptexa-wallet

# Option 2: Extract the provided ZIP file
# Navigate to the extracted folder
cd cryptexa-wallet
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install

# This will install:
# - React 18.2.0 & React DOM
# - Ethers.js 6.9.0 (Web3 library)
# - DID libraries (ethr-did, did-jwt, did-resolver)
# - Tailwind CSS 3.4.0
# - Framer Motion (animations)
# - Webpack 5 (bundler)
# - TypeScript 5.3.3
# - And all other dependencies
```

**Expected output:**
```
added 1247 packages in 2m
```

### Step 3: Build the Extension

```bash
# Build for production
npm run build

# OR build in development mode with watch
npm run dev
```

**What happens during build:**
- TypeScript files are compiled
- React components are bundled
- Tailwind CSS is processed
- All files are output to `dist/` folder
- Manifest.json is copied
- Background script, popup, and content scripts are generated

**Expected output:**
```
webpack 5.89.0 compiled successfully in 8432 ms
```

### Step 4: Load Extension in Chrome

1. **Open Chrome Extensions Page**
   - Method 1: Type `chrome://extensions/` in address bar
   - Method 2: Menu → More Tools → Extensions

2. **Enable Developer Mode**
   - Toggle the switch in top-right corner

3. **Load Unpacked Extension**
   - Click "Load unpacked" button
   - Navigate to your project folder
   - Select the `dist` folder
   - Click "Select Folder"

4. **Verify Installation**
   - You should see "Cryptexa Wallet" in your extensions list
   - Extension icon appears in toolbar
   - Status shows "Enabled"

### Step 5: Pin the Extension (Optional)

- Click the puzzle icon in Chrome toolbar
- Find "Cryptexa Wallet"
- Click the pin icon to keep it visible

---

## 🎨 First Launch

### Create New Wallet

1. Click the Cryptexa Wallet icon
2. Choose "Create New Wallet"
3. Set a strong password (min 8 characters)
4. **IMPORTANT**: Save your 12-word recovery phrase
   - Write it down on paper
   - Store it in a safe place
   - Never share it with anyone
5. Confirm you've saved it
6. Complete setup

### Import Existing Wallet

1. Click the Cryptexa Wallet icon
2. Choose "Import Existing Wallet"
3. Enter your 12-word recovery phrase
4. Set a new password for this device
5. Click "Import Wallet"

---

## 🔧 Configuration

### Add Infura API Key (For Real Blockchain Access)

The extension includes placeholder Infura keys. To use real networks:

1. Get free API key from [Infura.io](https://infura.io/)
2. Open `src/wallet/WalletService.ts`
3. Replace `YOUR_INFURA_KEY` with your actual key (lines 17, 21)
4. Open `src/did/DIDService.ts`
5. Replace `YOUR_INFURA_KEY` (lines 21, 25)
6. Rebuild: `npm run build`
7. Reload extension in Chrome

### Supported Networks (Pre-configured)

- ✅ Ethereum Mainnet
- ✅ Polygon
- ✅ Binance Smart Chain (BSC)
- ✅ Arbitrum
- ✅ Optimism
- ✅ Avalanche

---

## 📁 Project Structure

```
cryptexa-wallet/
├── src/
│   ├── app/                    # React application
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   ├── context/           # React Context providers
│   │   │   ├── WalletContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── pages/             # Full page components
│   │   │   ├── Landing/
│   │   │   ├── CreateWallet/
│   │   │   ├── ImportWallet/
│   │   │   ├── Unlock/
│   │   │   └── Dashboard/
│   │   ├── services/          # Core services
│   │   │   ├── EncryptionService.ts
│   │   │   └── StorageService.ts
│   │   └── App.tsx            # Main app component
│   ├── extension/             # Chrome extension specific
│   │   ├── background/        # Service worker
│   │   │   └── index.ts
│   │   ├── content/          # Content scripts
│   │   │   ├── content-script.ts
│   │   │   └── provider.ts
│   │   ├── popup/            # Extension popup
│   │   │   ├── index.tsx
│   │   │   ├── popup.html
│   │   │   └── styles.css
│   │   └── options/          # Options page
│   ├── wallet/               # Wallet logic
│   │   └── WalletService.ts
│   └── did/                  # DID integration
│       └── DIDService.ts
├── public/                   # Static assets
│   ├── manifest.json
│   └── icons/
├── dist/                     # Built extension (generated)
├── webpack.config.js
├── tsconfig.json
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 🔐 Security Features

### Implemented Security Measures

1. **AES-256 Encryption**
   - All private keys encrypted at rest
   - Password-based encryption

2. **Auto-Lock**
   - Wallet locks after 15 minutes of inactivity
   - Configurable timeout

3. **Secure Storage**
   - Chrome's storage API (encrypted by browser)
   - No data sent to external servers

4. **Key Isolation**
   - Private keys never exposed to UI
   - All signing happens in background worker

5. **Password Requirements**
   - Minimum 8 characters
   - Hashed with SHA-256

### Security Best Practices for Users

- ✅ Never share your recovery phrase
- ✅ Use a strong, unique password
- ✅ Write down recovery phrase on paper (not digital)
- ✅ Verify addresses before sending transactions
- ✅ Start with small test transactions
- ✅ Keep the extension updated

---

## 🌐 Using with dApps

### Connect to Web3 Applications

1. Visit any dApp (e.g., Uniswap, OpenSea)
2. Click "Connect Wallet"
3. Choose "Cryptexa" or "WalletConnect"
4. Approve connection in popup
5. Start using the dApp!

### Provider API

Cryptexa exposes `window.CryptexaProvider` for dApp developers:

```javascript
// Check if Cryptexa is installed
if (window.CryptexaProvider) {
  // Request account access
  const accounts = await window.CryptexaProvider.request({
    method: 'eth_requestAccounts'
  });
  
  // Get current chain
  const chainId = await window.CryptexaProvider.request({
    method: 'eth_chainId'
  });
  
  // Send transaction
  const txHash = await window.CryptexaProvider.request({
    method: 'eth_sendTransaction',
    params: [{
      from: accounts[0],
      to: '0x...',
      value: '0x...'
    }]
  });
}
```

---

## 🆔 Decentralized Identity (DID)

### What is DID?

Cryptexa Wallet includes built-in support for **Decentralized Identifiers (DIDs)**, allowing you to:

- Create W3C-compliant DID
- Resolve DID documents
- Create Verifiable Credentials
- Sign and verify authentication proofs

### Your DID Format

```
did:ethr:mainnet:0xYourWalletAddress
```

### DID Features

1. **Automatic DID Creation**
   - DID generated from your wallet address
   - No additional setup required

2. **Verifiable Credentials Vault**
   - Store credentials securely
   - Import/export functionality
   - Credential verification

3. **DID Authentication**
   - Sign authentication challenges
   - Prove ownership of DID
   - Used for dApp login

### Accessing DID Dashboard

1. Open Cryptexa Wallet
2. Click on "Cryptexa ID" card
3. View your DID information
4. Manage Verifiable Credentials
5. Export DID data

---

## 🛠️ Development

### Development Mode

```bash
# Run with hot reload
npm run dev

# Extension will rebuild on file changes
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Clean Build

```bash
npm run clean
npm run build
```

---

## 📦 Build Output

After running `npm run build`, you'll find:

```
dist/
├── manifest.json         # Extension manifest
├── background.js         # Background service worker (~2.28 MB)
├── popup.js             # Popup UI (~340 KB)
├── popup.html           # Popup HTML
├── content.js           # Content script
├── provider.js          # Web3 provider
├── options.js           # Options page
├── options.html         # Options HTML
├── dashboard.js         # Dashboard page
├── dashboard.html       # Dashboard HTML
├── vendors.js           # Shared vendor code
└── icons/              # Extension icons
```

**Total size:** ~3 MB (includes all crypto libraries)

---

## 🐛 Troubleshooting

### Issue: Extension not loading

**Solution:**
- Ensure you selected the `dist` folder, not the root folder
- Check if build completed successfully
- Try disabling and re-enabling the extension

### Issue: "Cannot find module" errors during build

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Wallet not connecting to dApps

**Solution:**
- Make sure extension is unlocked
- Refresh the dApp page
- Check browser console for errors
- Try disabling other wallet extensions

### Issue: Transactions failing

**Solution:**
- Verify you have sufficient balance
- Check gas fees
- Ensure correct network is selected
- Add Infura API key for production use

### Issue: DID features not working

**Solution:**
- Add Infura API key (see Configuration section)
- Check network connection
- Ensure wallet is on mainnet or goerli

---

## 🔄 Updating the Extension

1. Pull latest changes (if using git)
2. Run `npm install` (if dependencies changed)
3. Run `npm run build`
4. Go to `chrome://extensions/`
5. Click the refresh icon on Cryptexa Wallet

---

## 📚 Additional Resources

### Documentation Files

- `README.md` - Project overview
- `INSTALLATION.md` - This file
- `DEV_GUIDE.md` - Developer documentation (if available)
- `SECURITY.md` - Security audit details (if available)

### External Resources

- [Ethers.js Documentation](https://docs.ethers.org/)
- [DID Specification](https://www.w3.org/TR/did-core/)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 💬 Support

### Getting Help

If you encounter issues:

1. Check the Troubleshooting section above
2. Review browser console for errors (F12)
3. Check background script logs:
   - Go to `chrome://extensions/`
   - Find Cryptexa Wallet
   - Click "background page" or "service worker"
4. Create an issue on GitHub (if repository available)

### Common Questions

**Q: Is my data safe?**
A: Yes! All keys are encrypted with AES-256 and stored locally. Nothing is sent to external servers.

**Q: Can I use the same wallet on multiple devices?**
A: Yes! Use your 12-word recovery phrase to import on another device.

**Q: Does this work with hardware wallets?**
A: Not currently. This is a software wallet only.

**Q: Which browsers are supported?**
A: Chrome, Edge, Brave, and other Chromium-based browsers.

**Q: Can I recover my wallet if I forget my password?**
A: Yes, if you have your 12-word recovery phrase. The password is device-specific.

---

## ✅ Post-Installation Checklist

- [ ] Extension installed and enabled
- [ ] Wallet created or imported
- [ ] Recovery phrase saved securely
- [ ] Password remembered/stored in password manager
- [ ] Infura API key added (optional, for production)
- [ ] Extension pinned to toolbar
- [ ] Test transaction completed (on testnet)
- [ ] DID dashboard accessed
- [ ] Connected to at least one dApp

---

## 🎉 You're All Set!

Your Cryptexa Wallet is now ready to use. Enjoy secure Web3 browsing with built-in Decentralized Identity!

**Next Steps:**
1. Add some test ETH (use a faucet on testnet)
2. Try connecting to a dApp
3. Explore your DID dashboard
4. Create your first Verifiable Credential

---

## ⚠️ Important Reminders

1. **NEVER share your recovery phrase**
2. **NEVER enter your phrase on websites**
3. **Always verify transaction details before confirming**
4. **Start with small amounts when testing**
5. **Keep your recovery phrase offline**

---

*Cryptexa Wallet v1.0.0 - Built with ❤️ for the decentralized web*
