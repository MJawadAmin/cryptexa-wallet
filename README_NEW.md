# 🔐 Cryptexa Wallet

<div align="center">

![Cryptexa Wallet](https://img.shields.io/badge/Cryptexa-Wallet-blue?style=for-the-badge&logo=ethereum)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-purple?style=for-the-badge)

**Professional Web3 Wallet with Decentralized Identity Integration**

[Features](#-features) • [Installation](#-quick-start) • [Documentation](#-documentation) • [Security](#-security)

</div>

---

## 📖 Overview

Cryptexa Wallet is a **production-ready** Chrome extension that combines a full-featured cryptocurrency wallet with **Decentralized Identity (DID)** capabilities. Built with modern web technologies and security best practices, it provides a seamless gateway to Web3 applications while maintaining your digital identity.

### 🎯 Key Highlights

- **Multi-Chain Support**: Ethereum, Polygon, BSC, Arbitrum, Optimism, Avalanche
- **DID Integration**: W3C-compliant Decentralized Identifiers (did:ethr)
- **Verifiable Credentials**: Built-in credential vault
- **Modern UI**: Beautiful interface with dark/light mode
- **Secure**: AES-256 encryption, auto-lock, isolated key management
- **dApp Ready**: Full Web3 provider support

---

## ✨ Features

### 🪙 Wallet Features

- ✅ **Create New Wallet** - Generate secure HD wallets with 12-word mnemonic
- ✅ **Import Wallet** - Restore from existing recovery phrase
- ✅ **Multi-Account** - Manage multiple accounts from one seed
- ✅ **Send & Receive** - Transfer crypto with QR code support
- ✅ **Network Switching** - Seamlessly switch between 6+ networks
- ✅ **Transaction History** - Track all your transactions
- ✅ **Balance Display** - Real-time balance updates
- ✅ **Gas Estimation** - Accurate fee calculations
- ✅ **Sign Messages** - EIP-191 message signing
- ✅ **Sign Typed Data** - EIP-712 structured data signing

### 🆔 DID Features (Cryptexa ID)

- ✅ **Automatic DID Creation** - DID generated from wallet address
- ✅ **DID Resolution** - Resolve any did:ethr identifier
- ✅ **Verifiable Credentials** - Create, store, and verify credentials
- ✅ **JWT Signing** - DID-based JWT creation and verification
- ✅ **Authentication Proofs** - Generate cryptographic proofs
- ✅ **Credential Import/Export** - Backup your digital identity
- ✅ **W3C Compliance** - Follows DID specification standards

### 🔗 dApp Integration

- ✅ **Web3 Provider** - `window.CryptexaProvider` / `window.ethereum`
- ✅ **Connection Management** - Approve/revoke dApp connections
- ✅ **RPC Support** - Standard JSON-RPC methods
- ✅ **Event Emission** - Account and chain change events
- ✅ **MetaMask Compatible** - Works with MetaMask-expecting dApps

### 🎨 User Experience

- ✅ **Beautiful UI** - Modern gradient-based design
- ✅ **Dark/Light Mode** - Adaptive theme system
- ✅ **Smooth Animations** - Framer Motion powered
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **Copy-Paste Helpers** - Quick address copying
- ✅ **QR Code Generation** - Easy address sharing

### 🔒 Security Features

- ✅ **AES-256 Encryption** - Military-grade encryption for keys
- ✅ **Password Protection** - Device-specific password
- ✅ **Auto-Lock** - Lock after inactivity (15 min default)
- ✅ **Secure Storage** - Chrome's encrypted storage API
- ✅ **Key Isolation** - Private keys never exposed to UI
- ✅ **Background Signing** - All signatures in service worker
- ✅ **No Data Collection** - 100% local, no analytics

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ ([Download](https://nodejs.org/))
- Chrome/Edge browser
- Git (optional)

### Installation (3 steps)

```bash
# 1. Install dependencies
npm install

# 2. Build the extension
npm run build

# 3. Load in Chrome
# Go to chrome://extensions/
# Enable "Developer mode"
# Click "Load unpacked"
# Select the "dist" folder
```

### First Use

1. Click the Cryptexa icon in your toolbar
2. Choose "Create New Wallet" or "Import Existing Wallet"
3. Set a secure password
4. **Save your 12-word recovery phrase safely!**
5. Start using Web3! 🎉

---

## 📁 Project Structure

```
cryptexa-wallet/
├── src/
│   ├── app/                    # React application
│   │   ├── components/         # Button, Input, Card, Modal
│   │   ├── context/           # WalletContext, ThemeContext
│   │   ├── pages/             # Landing, Dashboard, etc.
│   │   ├── services/          # Encryption, Storage
│   │   └── App.tsx
│   ├── extension/             # Chrome extension
│   │   ├── background/        # Service worker
│   │   ├── content/          # Content & Provider scripts
│   │   ├── popup/            # Extension popup UI
│   │   └── options/          # Options page
│   ├── wallet/               # WalletService (BIP39, HD keys)
│   └── did/                  # DIDService (ethr-did)
├── dist/                      # Built extension (generated)
├── webpack.config.js          # Webpack configuration
├── manifest-new.json          # Chrome manifest V3
├── package-new.json           # Dependencies
└── README.md
```

---

## 🛠️ Technology Stack

### Frontend
- **React 18.2** - UI framework
- **TypeScript 5.3** - Type safety
- **Tailwind CSS 3.4** - Styling
- **Framer Motion 10** - Animations
- **Zustand 4.4** - Optional state (not currently used in context version)

### Blockchain
- **Ethers.js 6.9** - Ethereum library
- **BIP39** - Mnemonic generation
- **HDKey** - Hierarchical deterministic keys

### DID
- **ethr-did 2.3** - Ethereum DID library
- **did-jwt 7.4** - JWT with DID
- **did-resolver 4.1** - DID resolution

### Build Tools
- **Webpack 5** - Bundler
- **TypeScript** - Compiler
- **PostCSS** - CSS processing

---

## 📚 Documentation

- **[INSTALLATION_NEW.md](./INSTALLATION_NEW.md)** - Complete installation guide with troubleshooting
- **[DEV_GUIDE.md](./DEV_GUIDE.md)** - Developer documentation (if available)
- **[SECURITY.md](./SECURITY.md)** - Security practices (if available)

---

## 🔐 Security

### Encryption

All private keys are encrypted using **AES-256** with your password. Keys are never stored in plain text.

### Storage

Data is stored using Chrome's `storage.local` API, which is:
- Encrypted by the browser
- Isolated per extension
- Not accessible to websites

### Best Practices

1. ✅ Use a strong, unique password
2. ✅ Write down your recovery phrase on paper
3. ✅ Never share your recovery phrase
4. ✅ Verify addresses before sending
5. ✅ Start with small test transactions

### Auto-Lock

Wallet automatically locks after 15 minutes of inactivity for additional security.

---

## 🌐 Network Support

| Network | ChainID | Symbol | Status |
|---------|---------|--------|--------|
| Ethereum | 1 | ETH | ✅ Supported |
| Polygon | 137 | MATIC | ✅ Supported |
| BSC | 56 | BNB | ✅ Supported |
| Arbitrum | 42161 | ETH | ✅ Supported |
| Optimism | 10 | ETH | ✅ Supported |
| Avalanche | 43114 | AVAX | ✅ Supported |

*Add your own networks in `src/wallet/WalletService.ts`*

---

## 🆔 DID Integration

### What is DID?

Decentralized Identifiers (DIDs) are a new type of identifier that enables verifiable, self-sovereign digital identity.

### Your DID Format

```
did:ethr:mainnet:0xYourWalletAddress
```

### Use Cases

- **Authentication** - Prove ownership without passwords
- **Credentials** - Store verifiable credentials
- **SSO** - Single sign-on for dApps
- **Reputation** - Build portable reputation
- **Privacy** - Selective disclosure

### Example Code

```javascript
// Get current DID
const did = await chrome.runtime.sendMessage({
  type: 'GET_CURRENT_DID'
});

// Create credential
const credential = await chrome.runtime.sendMessage({
  type: 'CREATE_CREDENTIAL',
  data: {
    password: 'mypassword',
    subject: { name: 'John Doe', age: 30 },
    type: 'PersonalIdentity'
  }
});
```

---

## 🔌 dApp Integration

### For dApp Developers

```javascript
// Check if Cryptexa is installed
if (window.CryptexaProvider) {
  
  // Request account access
  const accounts = await window.CryptexaProvider.request({
    method: 'eth_requestAccounts'
  });
  
  // Get chain ID
  const chainId = await window.CryptexaProvider.request({
    method: 'eth_chainId'
  });
  
  // Send transaction
  const txHash = await window.CryptexaProvider.request({
    method: 'eth_sendTransaction',
    params: [{
      from: accounts[0],
      to: '0xRecipient...',
      value: '0x9184e72a000', // 0.01 ETH in hex
      gas: '0x5208' // 21000 in hex
    }]
  });
  
  // Sign message
  const signature = await window.CryptexaProvider.request({
    method: 'personal_sign',
    params: ['Hello Web3!', accounts[0]]
  });
  
  // Listen for events
  window.CryptexaProvider.on('accountsChanged', (accounts) => {
    console.log('Active account:', accounts[0]);
  });
  
  window.CryptexaProvider.on('chainChanged', (chainId) => {
    console.log('Network changed:', chainId);
  });
}
```

### Supported RPC Methods

- `eth_requestAccounts` - Request account access
- `eth_accounts` - Get connected accounts
- `eth_chainId` - Get current chain ID
- `personal_sign` - Sign message
- `eth_signTypedData_v4` - Sign typed data (EIP-712)
- `eth_sendTransaction` - Send transaction
- `wallet_switchEthereumChain` - Switch network

---

## 🧪 Development

### Development Mode

```bash
# Run with hot reload
npm run dev
```

### Build for Production

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

### Clean Build

```bash
npm run clean
npm run build
```

---

## 📦 Build Output

After `npm run build`:

```
dist/
├── manifest.json (Extension manifest)
├── background.js (~2.28 MB - includes crypto libraries)
├── popup.js (~340 KB)
├── content.js (Content script)
├── provider.js (Web3 provider)
├── vendors.js (Shared dependencies)
└── *.html (UI pages)
```

**Total Size:** ~3 MB

---

## 🐛 Known Issues & Limitations

1. **Testnet Only by Default**
   - Mainnet requires Infura API key
   - Add your key in `WalletService.ts` and `DIDService.ts`

2. **Limited Transaction History**
   - No built-in block explorer integration
   - Use external explorers (Etherscan, etc.)

3. **No Hardware Wallet Support**
   - Software wallet only
   - Consider adding Ledger/Trezor support

4. **Limited dApp Compatibility Testing**
   - Tested with major dApps
   - Some niche dApps may have issues

---

## 🗺️ Roadmap

### Phase 1 (Current - v1.0)
- [x] Basic wallet functionality
- [x] DID integration
- [x] Multi-network support
- [x] dApp provider

### Phase 2 (Future)
- [ ] Hardware wallet support
- [ ] NFT gallery
- [ ] Token swaps integration
- [ ] Enhanced transaction history
- [ ] Mobile version

### Phase 3 (Vision)
- [ ] Social recovery
- [ ] Multi-signature support
- [ ] Cross-chain bridges
- [ ] DeFi dashboard
- [ ] Reputation system

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Disclaimer

**USE AT YOUR OWN RISK**

This wallet is provided "as is" for educational and development purposes. While security best practices have been implemented:

- Always test with small amounts first
- Use testnet for development
- Never share your recovery phrase
- Verify all transaction details
- Keep your software updated

The developers are not responsible for any loss of funds.

---

## 🙏 Acknowledgments

- **Ethers.js** - Ethereum library
- **ethr-did** - DID implementation
- **React** - UI framework
- **Tailwind CSS** - Styling
- **Chrome Extensions** - Platform
- **Web3 Community** - Inspiration and standards

---

## 📞 Support

### Getting Help

- 📖 Read the [Installation Guide](./INSTALLATION_NEW.md)
- 🐛 Check browser console for errors
- 🔍 Search existing issues
- 💬 Create a new issue with details

### Contact

- GitHub Issues: [Create an issue](#)
- Email: support@cryptexa.io (if applicable)
- Twitter: @CryptexaWallet (if applicable)

---

## 📊 Stats

- **Lines of Code:** ~5,000+
- **Files:** 50+
- **Components:** 20+
- **Services:** 5
- **Dependencies:** 40+
- **Build Time:** ~8-10 seconds
- **Bundle Size:** ~3 MB

---

<div align="center">

**Built with ❤️ for the Decentralized Web**

[⬆ Back to Top](#-cryptexa-wallet)

</div>
