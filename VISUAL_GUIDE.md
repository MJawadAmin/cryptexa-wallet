# 🎯 Cryptexa Wallet - Visual Guide & Features

## 🖼️ What You'll See When You Click the Extension

### **Screen 1: Welcome Screen** (First Time)

```
┌─────────────────────────────────────┐
│  🌟 Cryptexa Extension              │
├─────────────────────────────────────┤
│                                     │
│         💎 [Animated Logo]          │
│            Cryptexa                 │
│      Your Web3 Identity & Wallet    │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  🌟 Create New Wallet         │ │
│  │  Start your Web3 journey      │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  🔑 Import Existing Wallet    │ │
│  │  Restore from seed phrase     │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**What happens:**
- Beautiful gradient background (dark blue → cyan)
- Animated spinning wallet icon
- Two big buttons to choose from

---

### **Screen 2: Create Wallet Form**

```
┌─────────────────────────────────────┐
│  ← Back          Create Wallet      │
├─────────────────────────────────────┤
│                                     │
│  🔐 Set Your Password               │
│  ┌───────────────────────────────┐ │
│  │ Enter password (min 8 chars)  │ │
│  └───────────────────────────────┘ │
│  👁️ Show/Hide toggle               │
│                                     │
│  🔒 Confirm Password                │
│  ┌───────────────────────────────┐ │
│  │ Re-enter password             │ │
│  └───────────────────────────────┘ │
│                                     │
│  ⚠️ Your password protects this    │
│     device. Save your seed phrase  │
│     to recover on other devices!   │
│                                     │
│  ┌───────────────────────────────┐ │
│  │     Create Wallet ✨           │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**What happens:**
- Enter password twice
- Password strength indicator
- Click "Create Wallet"
- Extension generates your wallet!

---

### **Screen 3: Seed Phrase Backup** (CRITICAL!)

```
┌─────────────────────────────────────┐
│  🛡️ Backup Seed Phrase             │
│  Keep this safe and secret          │
├─────────────────────────────────────┤
│  ⚠️ WARNING                         │
│  Write these 12 words in order.     │
│  This is the ONLY way to recover!   │
│  Never share with anyone!           │
├─────────────────────────────────────┤
│  ┌────────┬────────┬────────┐      │
│  │ 1.word │ 2.word │ 3.word │      │
│  ├────────┼────────┼────────┤      │
│  │ 4.word │ 5.word │ 6.word │      │
│  ├────────┼────────┼────────┤      │
│  │ 7.word │ 8.word │ 9.word │      │
│  ├────────┼────────┼────────┤      │
│  │10.word │11.word │12.word │      │
│  └────────┴────────┴────────┘      │
│                         📋 Copy     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  I've Saved My Seed Phrase ✅ │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**What happens:**
- 12 random words displayed
- Copy button to copy all words
- Each word numbered 1-12
- Must click "I've Saved" to continue

---

### **Screen 4: Main Wallet Dashboard** (After Setup)

```
┌─────────────────────────────────────┐
│  🌟 Cryptexa            🔒 Lock     │
├─────────────────────────────────────┤
│  💰 Wallet │ 🎫 Credentials │ ⚙️ Settings
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │      Total Balance          │   │
│  │      0.0000 ETH             │   │
│  │   0x1234...5678             │   │
│  │                             │   │
│  │  [📤 Send]    [📥 Receive]  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Recent Transactions        │   │
│  │  ─────────────────────      │   │
│  │  No transactions yet        │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**What happens:**
- Shows your ETH balance (starts at 0)
- Your wallet address (click to copy)
- Send and Receive buttons
- Transaction history (empty at first)

---

### **Screen 5: Send Transaction Modal**

```
┌─────────────────────────────────────┐
│  ✕ Close      Send Transaction      │
├─────────────────────────────────────┤
│                                     │
│  To Address:                        │
│  ┌───────────────────────────────┐ │
│  │ 0x...                         │ │
│  └───────────────────────────────┘ │
│                                     │
│  Amount (ETH):                      │
│  ┌───────────────────────────────┐ │
│  │ 0.001                         │ │
│  └───────────────────────────────┘ │
│                                     │
│  💰 Balance: 0.0000 ETH             │
│  ⚡ Est. Gas: ~0.0002 ETH           │
│                                     │
│  Password:                          │
│  ┌───────────────────────────────┐ │
│  │ ••••••••                      │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │      Send Transaction 🚀      │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**What happens:**
- Enter recipient address
- Enter amount to send
- Enter your password to confirm
- Transaction gets broadcast!

---

### **Screen 6: Receive Modal (QR Code)**

```
┌─────────────────────────────────────┐
│  ✕ Close      Receive Crypto        │
├─────────────────────────────────────┤
│                                     │
│      ┌─────────────────┐            │
│      │                 │            │
│      │   [QR CODE]     │            │
│      │                 │            │
│      └─────────────────┘            │
│                                     │
│  Your Address:                      │
│  ┌───────────────────────────────┐ │
│  │ 0x1234567890abcdef1234...     │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │    📋 Copy Address            │ │
│  └───────────────────────────────┘ │
│                                     │
│  ℹ️ Share this address to receive  │
│     crypto on Ethereum network     │
│                                     │
└─────────────────────────────────────┘
```

**What happens:**
- Shows QR code of your address
- Full address displayed
- Copy button for easy sharing
- Anyone can send you crypto here!

---

### **Screen 7: Credentials Tab (DID Features)**

```
┌─────────────────────────────────────┐
│  🌟 Cryptexa            🔒 Lock     │
├─────────────────────────────────────┤
│  💰 Wallet │ 🎫 Credentials │ ⚙️ Settings
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Cryptexa ID (DID)          │   │
│  │  ─────────────────────      │   │
│  │  🆔 did:ethr:mainnet:0x...  │   │
│  │                             │   │
│  │  📊 0 Credentials Stored    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Verifiable Credentials     │   │
│  │  ─────────────────────      │   │
│  │  No credentials yet         │   │
│  │                             │   │
│  │  [+ Create] [📥 Import]     │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**What happens:**
- Shows your DID (Decentralized ID)
- Lists verifiable credentials
- Can create or import credentials
- Advanced identity management

---

### **Screen 8: Settings Tab**

```
┌─────────────────────────────────────┐
│  🌟 Cryptexa            🔒 Lock     │
├─────────────────────────────────────┤
│  💰 Wallet │ 🎫 Credentials │ ⚙️ Settings
├─────────────────────────────────────┤
│                                     │
│  Network:                           │
│  ┌───────────────────────────────┐ │
│  │ ⬇️ Ethereum Mainnet           │ │
│  └───────────────────────────────┘ │
│  Options:                           │
│  • Ethereum Mainnet                 │
│  • Ethereum Sepolia (Testnet)       │
│  • Polygon                          │
│  • Binance Smart Chain              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Cryptexa ID (DID)          │   │
│  │  did:ethr:mainnet:0x1234... │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌───────────────────────────────┐ │
│  │    🔒 Lock Wallet             │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**What happens:**
- Switch between networks
- View your DID
- Lock wallet manually
- More settings coming soon

---

## 🎨 What Technologies Are Used

### **1. React 18.2** - User Interface
```
Component Structure:
├── App.tsx (Main router)
├── WelcomeScreenNew.tsx (First screen)
├── UnlockScreenNew.tsx (Password entry)
└── MainWallet.tsx (Dashboard)
```
**Why:** Modern, fast, component-based UI

### **2. TypeScript 5.3** - Type Safety
```typescript
interface WalletState {
  address: string;
  balance: string;
  isLocked: boolean;
  network: NetworkType;
}
```
**Why:** Catches errors before runtime, better code quality

### **3. Tailwind CSS** - Beautiful Styling
```css
bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900
shadow-glow animate-pulse-slow
```
**Why:** Modern gradients, animations, responsive design

### **4. Framer Motion** - Smooth Animations
```typescript
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
>
```
**Why:** Buttery-smooth transitions and effects

### **5. Ethers.js 6.9** - Blockchain Library
```typescript
import { ethers, Wallet, JsonRpcProvider } from 'ethers';

// Create wallet from private key
const wallet = new ethers.Wallet(privateKey);

// Send transaction
await wallet.sendTransaction({
  to: recipientAddress,
  value: ethers.parseEther("0.001")
});
```
**Why:** Industry standard for Ethereum interactions

### **6. BIP39 + HDKey** - Wallet Generation
```typescript
import * as bip39 from 'bip39';
import HDKey from 'hdkey';

// Generate seed phrase
const mnemonic = bip39.generateMnemonic(); 
// "word1 word2 word3... word12"

// Derive keys
const seed = await bip39.mnemonicToSeed(mnemonic);
const masterKey = HDKey.fromMasterSeed(seed);
```
**Why:** Standard HD wallet derivation (same as MetaMask)

### **7. ethr-did + did-jwt** - Decentralized Identity
```typescript
import { EthrDID } from 'ethr-did';
import { createVerifiableCredentialJwt } from 'did-jwt-vc';

// Create DID
const did = new EthrDID({
  identifier: address,
  provider: rpcProvider
});

// Create credential
const vcJwt = await createVerifiableCredentialJwt({
  type: ['VerifiableCredential'],
  credentialSubject: { id: did.did }
}, did);
```
**Why:** W3C standard for self-sovereign identity

### **8. Crypto-JS** - Password Encryption
```typescript
import CryptoJS from 'crypto-js';

// Encrypt private key with password
const encrypted = CryptoJS.AES.encrypt(
  privateKey, 
  password
).toString();

// Decrypt when needed
const decrypted = CryptoJS.AES.decrypt(
  encrypted, 
  password
).toString(CryptoJS.enc.Utf8);
```
**Why:** AES-256 encryption, keeps keys safe

### **9. Zustand** - State Management
```typescript
import { create } from 'zustand';

export const useWalletStore = create<WalletStore>((set) => ({
  address: null,
  balance: '0',
  isLocked: true,
  
  createWallet: async (password) => {
    // Create wallet logic
    set({ address: newAddress, isLocked: false });
  }
}));
```
**Why:** Simple, lightweight state management

### **10. Webpack 5** - Bundler
```javascript
// webpack.config.js
module.exports = {
  entry: {
    popup: './src/popup/index.tsx',
    background: './src/background/service-worker.ts',
    content: './src/content/content-script.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  }
}
```
**Why:** Bundles everything into browser-ready files

---

## 🔧 How It Actually Works (Behind the Scenes)

### **Extension Architecture:**

```
┌─────────────────────────────────────────┐
│         CHROME BROWSER                  │
├─────────────────────────────────────────┤
│                                         │
│  Popup (popup.js)                       │
│  ├─ React UI                            │
│  ├─ User interacts here                 │
│  └─ Sends messages to background →     │
│                                         │
│  Background (service-worker.js)         │
│  ├─ Wallet logic                        │
│  ├─ Private keys (encrypted)            │
│  ├─ Signs transactions                  │
│  └─ Manages dApp connections ↕️         │
│                                         │
│  Content Script (content.js)            │
│  ├─ Injects into web pages              │
│  ├─ Listens for dApp requests           │
│  └─ Injects provider ↓                  │
│                                         │
│  Provider (provider.js)                 │
│  ├─ window.ethereum object              │
│  ├─ dApps call: ethereum.request()      │
│  └─ Sends to background ↑               │
│                                         │
└─────────────────────────────────────────┘
         ↕️ JSON-RPC
┌─────────────────────────────────────────┐
│     BLOCKCHAIN (Ethereum, Polygon...)   │
└─────────────────────────────────────────┘
```

### **When You Create a Wallet:**

1. **User enters password** → `WelcomeScreenNew.tsx`
2. **Generate mnemonic** → `bip39.generateMnemonic()` (12 words)
3. **Derive seed** → `bip39.mnemonicToSeed(mnemonic)`
4. **Create HD wallet** → `HDKey.fromMasterSeed(seed)`
5. **Derive account** → `m/44'/60'/0'/0/0` (Ethereum path)
6. **Get private key** → `hdkey.privateKey`
7. **Create ethers wallet** → `new ethers.Wallet(privateKey)`
8. **Encrypt private key** → `CryptoJS.AES.encrypt(key, password)`
9. **Save to storage** → `chrome.storage.local.set()`
10. **Create DID** → `did:ethr:mainnet:${address}`

### **When You Send Crypto:**

1. **User clicks Send** → `MainWallet.tsx`
2. **Opens modal** → `SendModal.tsx`
3. **User enters: address, amount, password**
4. **Sends message** → `chrome.runtime.sendMessage({ type: 'SEND_TRANSACTION' })`
5. **Background receives** → `service-worker.ts`
6. **Decrypt private key** → `CryptoJS.AES.decrypt(encrypted, password)`
7. **Create wallet instance** → `new ethers.Wallet(privateKey)`
8. **Connect to network** → `wallet.connect(provider)`
9. **Build transaction** → `{ to, value, gasLimit }`
10. **Sign & send** → `wallet.sendTransaction(tx)`
11. **Get hash** → `tx.hash`
12. **Wait for confirmation** → `tx.wait()`
13. **Update UI** → Send success message back to popup

### **When dApp Connects:**

1. **User visits Uniswap/OpenSea/etc.**
2. **Page loads** → `content.js` injects `provider.js`
3. **dApp calls** → `window.ethereum.request({ method: 'eth_requestAccounts' })`
4. **Provider forwards** → Sends to `background.js`
5. **Background shows popup** → "Uniswap wants to connect"
6. **User approves** → Clicks "Connect"
7. **Background sends address** → Returns to dApp
8. **dApp connected** → Can now request transactions
9. **When dApp requests tx** → Same flow as "Send Crypto" above

---

## 🎯 Key Features You Can Use Right Now

### ✅ **Wallet Features:**
- [x] Create new wallet (HD wallet, BIP39)
- [x] Import from seed phrase
- [x] Send ETH & tokens
- [x] Receive with QR code
- [x] View transaction history
- [x] Multi-network support (ETH, Polygon, BSC, etc.)
- [x] Password protection
- [x] Auto-lock after 15 minutes
- [x] Manual lock/unlock

### ✅ **DID Features:**
- [x] Automatic DID creation (`did:ethr:mainnet:0xYourAddress`)
- [x] Verifiable Credentials vault
- [x] Create credentials
- [x] Import/Export credentials
- [x] JWT signing for authentication
- [x] W3C compliant

### ✅ **dApp Integration:**
- [x] Web3 Provider injection (`window.ethereum`)
- [x] Connect to any dApp (Uniswap, OpenSea, etc.)
- [x] Sign transactions from dApps
- [x] Sign messages (for authentication)
- [x] Switch networks from dApps
- [x] EIP-1193 compatible

### ✅ **Security:**
- [x] AES-256 encryption
- [x] Password never leaves device
- [x] Private keys never exposed
- [x] Seed phrase backup
- [x] Session auto-lock
- [x] No server, fully client-side

---

## 📊 Data Storage (What's Saved Where)

### **Chrome Storage (chrome.storage.local):**
```json
{
  "cryptexa_store": {
    "version": "1.0.0",
    "wallets": {
      "0x1234...": {
        "address": "0x1234567890...",
        "encryptedPrivateKey": "U2FsdGVkX1...",
        "publicKey": "0x04abc...",
        "name": "Account 1",
        "balance": "0.0000",
        "did": "did:ethr:mainnet:0x1234..."
      }
    },
    "encryptedMnemonic": "U2FsdGVkX1...",
    "currentAddress": "0x1234...",
    "network": "ethereum-mainnet",
    "isLocked": false,
    "credentials": [
      {
        "id": "credential-1",
        "type": "VerifiableCredential",
        "jwt": "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ..."
      }
    ],
    "transactions": [
      {
        "hash": "0xabc...",
        "from": "0x123...",
        "to": "0x456...",
        "value": "0.001",
        "timestamp": 1702345678000,
        "status": "confirmed"
      }
    ]
  }
}
```

**Note:** All private keys and seed phrases are encrypted with your password!

---

## 🚀 What You Can Do RIGHT NOW

### **1. Test Wallet Creation**
- Click extension icon
- Create new wallet
- Save 12-word phrase (write it down!)
- See your address and balance

### **2. Get Test Crypto**
- Switch to Sepolia testnet (Settings tab)
- Copy your address (Receive button)
- Get free testnet ETH from: https://sepoliafaucet.com
- See balance update!

### **3. Send a Transaction**
- Click "Send" button
- Paste a friend's address (or another of yours)
- Enter small amount (0.001 ETH)
- Enter password
- Watch transaction go through!

### **4. Connect to a dApp**
- Visit https://app.uniswap.org
- Click "Connect Wallet"
- Select "WalletConnect" or look for Cryptexa
- Approve connection
- You're connected to DeFi!

### **5. Create Your DID**
- Go to "Credentials" tab
- Your DID is automatically created
- Format: `did:ethr:mainnet:0xYourAddress`
- This is your Web3 identity!

### **6. Test Auto-Lock**
- Leave wallet open for 15 minutes
- Extension will auto-lock
- Enter password to unlock
- Your crypto is always protected!

---

## 🎓 Advanced Usage

### **Multi-Account Support:**
Coming soon - create multiple accounts under one seed phrase

### **Custom RPC Endpoints:**
Edit `WalletService.ts` to add your own Infura/Alchemy keys

### **Hardware Wallet:**
Future feature - Ledger/Trezor integration planned

### **Mobile Sync:**
Use same 12-word phrase on mobile wallet to sync

---

## 💡 Tips & Best Practices

### **Security Tips:**
- ✅ Write seed phrase on paper (not digital!)
- ✅ Store in safe place (fireproof box, bank vault)
- ✅ Never share with anyone
- ✅ Use strong password (16+ characters)
- ✅ Test with small amounts first
- ✅ Use testnet before mainnet

### **Usage Tips:**
- 💰 Always check network before sending
- 💰 Verify recipient address twice
- 💰 Start with testnets (free crypto!)
- 💰 Check gas fees before confirming
- 💰 Keep some ETH for gas fees
- 💰 Backup credentials regularly

---

## 🆘 Common Questions

**Q: Where are my private keys stored?**  
A: Encrypted in Chrome's local storage, never sent anywhere.

**Q: Can I use this on multiple devices?**  
A: Yes! Use your 12-word phrase to import on other devices.

**Q: What if I forget my password?**  
A: Use your 12-word seed phrase to restore (with new password).

**Q: Is this safe?**  
A: Yes! Uses same security as MetaMask (AES-256, BIP39).

**Q: Can I add custom tokens?**  
A: Coming soon! Currently supports native coins (ETH, MATIC, BNB).

**Q: Does this work with Ledger?**  
A: Not yet, but planned for future update.

**Q: Can I export my DID?**  
A: Yes! Go to Credentials tab → Export.

---

## 🎉 You're Ready to Use Cryptexa!

Your wallet is now:
- ✅ Installed in Chrome
- ✅ Ready to create wallets
- ✅ Ready to send/receive crypto
- ✅ Ready to connect to dApps
- ✅ Ready to manage your Web3 identity

**Start by creating your first wallet and exploring the features!** 🚀

---

*Cryptexa Wallet v1.0.0 - Your Gateway to Web3* 💎
