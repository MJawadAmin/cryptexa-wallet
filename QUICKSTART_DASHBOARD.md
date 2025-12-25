# 🚀 Quick Start - CryptoDash

Get your crypto dashboard running in 3 minutes!

## ⚡ Super Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser at http://localhost:3000
```

That's it! 🎉

## 📦 What You Get

Once running, you'll have access to:

### 1️⃣ **Dashboard** (Home Page)
- Overview of selected cryptocurrency
- Live price charts with multiple timeframes
- Market statistics
- Quick coin selector

### 2️⃣ **Markets**
- Real-time prices for 6 major coins:
  - Bitcoin (BTC)
  - Ethereum (ETH)
  - Binance Coin (BNB)
  - Solana (SOL)
  - Ripple (XRP)
  - Cardano (ADA)
- Auto-refresh every 30 seconds
- Market cap & volume data

### 3️⃣ **Predictions**
- AI-powered price predictions
- Technical analysis indicators
- Confidence scores
- Bullish/Bearish signals

### 4️⃣ **Wallet**
- MetaMask integration
- Balance display
- Network detection
- Easy connect/disconnect

## 🔧 Optional: MetaMask Setup

To use wallet features:

1. **Install MetaMask**
   - Chrome/Brave: [Download](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)
   - Firefox: [Download](https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/)

2. **Connect Wallet**
   - Click "Connect Wallet" button in top-right
   - Approve connection in MetaMask popup

## 📱 Mobile Testing

```bash
# Get your local IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# Access from mobile
http://YOUR_IP:3000
```

## 🎨 Customize

Want to change colors or add coins? Check main README!

## ⚠️ Troubleshooting

### Port 3000 already in use?

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- --port 3001
```

### API not working?

Check your internet connection. CoinGecko API requires active internet.

### Charts not showing?

Wait a few seconds - data is being fetched from CoinGecko API.

## 🚀 Production Build

```bash
# Build optimized version
npm run build

# Preview build
npm run preview
```

## 📚 Next Steps

1. Read [CRYPTO_DASHBOARD_README.md](./CRYPTO_DASHBOARD_README.md) for full docs
2. Explore the code structure
3. Customize to your needs
4. Deploy to Vercel/Netlify

## 💡 Pro Tips

- **Auto-refresh**: Markets update every 30s automatically
- **Keyboard**: Use arrow keys to navigate
- **Mobile**: Swipe to open sidebar
- **Dark Mode**: Built-in dark theme optimized for trading

---

**Happy Trading! 📈**
