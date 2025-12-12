# ⚡ Quick Setup Guide - Cryptexa Wallet

## 3-Minute Setup

### 1️⃣ Install Dependencies (1 min)

```bash
npm install
```

### 2️⃣ Build Extension (1 min)

```bash
npm run build
```

### 3️⃣ Load in Chrome (1 min)

1. Open `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `dist` folder
5. Done! ✅

---

## First Launch

1. Click Cryptexa Wallet icon
2. "Create New Wallet"
3. Set password
4. **SAVE YOUR 12 WORDS!** ⚠️
5. Confirm and start using

---

## Folder Structure

```
cryptexa-wallet/
├── dist/           ← Load this in Chrome
├── src/
│   ├── app/        ← React UI
│   ├── extension/  ← Chrome scripts
│   ├── wallet/     ← Wallet logic
│   └── did/        ← DID features
└── package.json
```

---

## Key Files

| File | Purpose |
|------|---------|
| `dist/` | Built extension - load this in Chrome |
| `src/app/App.tsx` | Main React app |
| `src/wallet/WalletService.ts` | Wallet operations |
| `src/did/DIDService.ts` | DID operations |
| `src/extension/background/index.ts` | Background service worker |
| `manifest-new.json` | Extension manifest |
| `webpack-new.config.js` | Build configuration |

---

## Available Commands

```bash
# Development (auto-rebuild on changes)
npm run dev

# Production build
npm run build

# Clean build
npm run clean && npm run build

# Type checking
npm run type-check
```

---

## Adding Infura Key (Optional)

For real blockchain access:

1. Get free key from [Infura.io](https://infura.io/)
2. Edit `src/wallet/WalletService.ts` line 17
3. Edit `src/did/DIDService.ts` line 21
4. Replace `YOUR_INFURA_KEY` with your key
5. Rebuild: `npm run build`

---

## Features Checklist

- ✅ Create/Import wallet
- ✅ Send/Receive crypto
- ✅ 6 networks (ETH, Polygon, BSC, etc.)
- ✅ Multi-account support
- ✅ DID integration (Cryptexa ID)
- ✅ Verifiable Credentials
- ✅ dApp connection
- ✅ Dark/Light mode
- ✅ Auto-lock security

---

## Troubleshooting

**Extension not loading?**
- Make sure you selected `dist` folder, not root
- Check if build succeeded (look for errors)

**Build errors?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Can't connect to dApps?**
- Unlock wallet first
- Refresh dApp page
- Check browser console (F12)

---

## Security Reminders

1. 🔒 Save recovery phrase on **paper** (not digital)
2. 🔐 Use strong password (8+ chars)
3. ⚠️ Never share recovery phrase
4. ✅ Test with small amounts first
5. 🔍 Verify addresses before sending

---

## What's Included?

### Pages
- Landing (Create/Import)
- Create Wallet (3 steps)
- Import Wallet
- Unlock Screen
- Dashboard (Main wallet)
- DID Page (Identity)

### Components
- Button, Input, Card, Modal
- Account Selector
- Network Selector
- Send/Receive Modals
- QR Code Generator

### Services
- WalletService (BIP39, HD keys)
- DIDService (ethr-did)
- EncryptionService (AES-256)
- StorageService (Chrome storage)

---

## Tech Stack

- **UI:** React 18 + TypeScript + Tailwind CSS
- **Web3:** Ethers.js 6.9
- **DID:** ethr-did, did-jwt
- **Build:** Webpack 5
- **Crypto:** bip39, hdkey, crypto-js

---

## Network List

| Network | ChainID | Symbol |
|---------|---------|--------|
| Ethereum | 1 | ETH |
| Polygon | 137 | MATIC |
| BSC | 56 | BNB |
| Arbitrum | 42161 | ETH |
| Optimism | 10 | ETH |
| Avalanche | 43114 | AVAX |

---

## DID Format

```
did:ethr:mainnet:0xYourAddress
```

Your DID is automatically created from your wallet address!

---

## Next Steps

1. ✅ Install extension
2. ✅ Create wallet
3. ✅ Save recovery phrase
4. 🔜 Try sending test transaction
5. 🔜 Connect to a dApp
6. 🔜 Explore DID dashboard

---

## Full Documentation

📖 See [INSTALLATION_NEW.md](./INSTALLATION_NEW.md) for detailed guide
📖 See [README_NEW.md](./README_NEW.md) for complete overview

---

**You're ready to go! 🚀**

Need help? Check browser console (F12) or the full installation guide.
