# 🚀 Cryptexa Wallet - Quick Start

## ⚡ 3-Step Setup

### 1️⃣ Install Dependencies (2 minutes)
```powershell
npm install
```

### 2️⃣ Configure API Keys (1 minute)

**Get a free Infura API key**: https://infura.io/register

Then update these 4 lines:

**File**: `src/utils/blockchain.ts`
```typescript
// Line 17: Replace YOUR_INFURA_KEY
rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',

// Line 21: Replace YOUR_INFURA_KEY  
rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
```

**File**: `src/utils/did.ts`
```typescript
// Line 21: Replace YOUR_INFURA_KEY
rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',

// Line 25: Replace YOUR_INFURA_KEY
rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
```

### 3️⃣ Build & Load (1 minute)

**Build**:
```powershell
npm run build
```

**Load in Chrome/Edge**:
1. Open `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `dist` folder ✅

## 🎉 Done!

Click the Cryptexa icon in your toolbar to start!

---

## 📚 Next Steps

- Read `SETUP.md` for detailed instructions
- Read `README.md` for full documentation
- Check `CHECKLIST.md` before production
- See `PROJECT_SUMMARY.md` for technical details

## ⚠️ Important

- **Test on Sepolia testnet first**
- **Backup your seed phrase securely**
- **Add proper extension icons** (see SETUP.md)

## 💬 Need Help?

Refer to the documentation files or check the inline code comments.

---

**Happy building! 🌟**
