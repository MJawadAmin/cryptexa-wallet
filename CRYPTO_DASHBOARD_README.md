# CryptoDash - Professional Crypto Trading Dashboard

A production-ready crypto dashboard web application built with React, TypeScript, and modern Web3 technologies. Features real-time market data, AI-powered price predictions, and MetaMask wallet integration.

![CryptoDash](public/1.jfif)

## 🚀 Features

### 1. **Real-Time Market Data**
- Live cryptocurrency prices from CoinGecko API
- Support for BTC, ETH, BNB, SOL, XRP, ADA
- Auto-refresh every 30 seconds
- 24h price changes with color indicators
- Market cap and volume tracking
- Professional Binance-style UI

### 2. **Interactive Charts**
- Beautiful line charts with Recharts
- Multiple timeframes: 1H, 24H, 7D, 30D, 1Y
- Gradient fills and animations
- Real-time price updates
- Responsive chart design

### 3. **AI Price Predictions**
- Advanced technical analysis
- Moving average calculations
- Momentum indicators
- Volatility measurements
- Bullish/Bearish/Neutral signals
- Confidence scoring (40-95%)
- Trend detection

### 4. **Web3 Wallet Integration**
- MetaMask connection
- Real-time balance updates
- Network detection (Ethereum, BSC, Polygon, etc.)
- Shortened address display
- Transaction-ready architecture
- Auto-reconnect on page reload

### 5. **Professional UI/UX**
- Dark theme optimized for trading
- Responsive design (mobile + desktop)
- Smooth animations and transitions
- Loading states and error handling
- Clean sidebar navigation
- Search functionality

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Styling & dark theme |
| **Zustand** | Global state management |
| **Axios** | HTTP client for APIs |
| **Recharts** | Data visualization |
| **Ethers.js v6** | Web3 integration |
| **Lucide React** | Icon library |
| **CoinGecko API** | Market data source |

## 📁 Project Structure

```
cryptexa-wallet/
├── src/
│   ├── components/
│   │   ├── crypto/
│   │   │   ├── CoinCard.tsx           # Coin display card
│   │   │   ├── PriceChart.tsx         # Price chart component
│   │   │   ├── PriceChange.tsx        # Price change indicator
│   │   │   ├── PredictionCard.tsx     # AI prediction display
│   │   │   └── TimeFrameSelector.tsx  # Chart timeframe picker
│   │   ├── layout/
│   │   │   └── DashboardLayout.tsx    # Main layout with sidebar
│   │   └── ui/
│   │       ├── LoadingSpinner.tsx     # Loading states
│   │       └── ErrorMessage.tsx       # Error handling
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   └── DashboardPage.tsx      # Main dashboard
│   │   ├── Markets/
│   │   │   └── MarketsPage.tsx        # Live markets page
│   │   ├── Predictions/
│   │   │   └── PredictionsPage.tsx    # AI predictions page
│   │   └── Wallet/
│   │       └── WalletPage.tsx         # Wallet management
│   ├── services/
│   │   ├── CoinGeckoService.ts        # CoinGecko API wrapper
│   │   ├── PredictionService.ts       # AI prediction logic
│   │   └── Web3WalletService.ts       # MetaMask integration
│   ├── hooks/
│   │   ├── useCryptoMarket.ts         # Market data hook
│   │   ├── usePredictions.ts          # Predictions hook
│   │   └── useWeb3Wallet.ts           # Wallet hook
│   ├── store/
│   │   ├── crypto-store.ts            # Crypto state
│   │   ├── web3-store.ts              # Prediction state
│   │   └── web3-wallet-store.ts       # Wallet state
│   ├── types/
│   │   └── crypto.ts                  # TypeScript types
│   ├── CryptoDashboardApp.tsx         # Main app component
│   └── dashboard-main.tsx             # Entry point
├── dashboard.html                     # HTML template
├── vite.config.ts                     # Vite configuration
├── tailwind.config.js                 # Tailwind setup
├── tsconfig.json                      # TypeScript config
├── .env                               # Environment variables
└── package.json                       # Dependencies
```

## 🚦 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- MetaMask browser extension (for wallet features)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

The app will open at `http://localhost:3000`

## 📊 API Integration

### CoinGecko API (Free Tier)

The app uses CoinGecko's free public API - **no API key required**.

**Features:**
- Real-time market data
- Historical price data
- Coin search
- Global market stats

**Rate Limits:**
- 10-50 calls/minute (free tier)
- Auto-refresh set to 30 seconds to stay within limits

**Upgrade to Pro:**
If you need higher limits, get an API key from [CoinGecko](https://www.coingecko.com/en/api) and add to `.env`:
```env
VITE_COINGECKO_API_KEY=your_api_key_here
```

## 🔐 Web3 Wallet Integration

### MetaMask Setup

1. Install [MetaMask](https://metamask.io/download/) browser extension
2. Create or import a wallet
3. Click "Connect Wallet" in the dashboard
4. Approve connection in MetaMask popup

### Supported Networks

- Ethereum Mainnet & Testnets
- Binance Smart Chain (BSC)
- Polygon (Matic)
- Avalanche C-Chain
- Fantom Opera
- Arbitrum & Optimism

## 🤖 AI Prediction System

### How It Works

The prediction system uses technical analysis indicators:

1. **Moving Average (MA7)**
   - 7-day simple moving average
   - Price vs MA comparison

2. **Momentum Indicator**
   - Rate of change over 5 periods
   - Bullish > +5%, Bearish < -5%

3. **Volatility Analysis**
   - Standard deviation calculation
   - Affects confidence scoring

4. **Trend Detection**
   - Recent price direction
   - UP, DOWN, or SIDEWAYS

### Signal Generation

- **BULLISH**: Price > MA, positive momentum, upward trend
- **BEARISH**: Price < MA, negative momentum, downward trend
- **NEUTRAL**: Mixed signals

### Confidence Scoring

Base: 50% confidence
- Strong momentum: +10-20%
- High volatility: -8-15%
- Neutral signal: -10%

Final range: 40-95%

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js` to customize colors:

```javascript
colors: {
  primary: {
    500: '#0ea5e9', // Your brand color
  },
  accent: {
    500: '#06b6d4', // Accent color
  },
}
```

### Timeframes

Add custom timeframes in `src/types/crypto.ts`:

```typescript
export type TimeFrame = '1H' | '24H' | '7D' | '30D' | '1Y' | '5Y';
```

### Supported Coins

Edit `src/types/crypto.ts` to add more coins:

```typescript
export const SUPPORTED_COINS = [
  'bitcoin',
  'ethereum',
  'your-coin-id', // Add CoinGecko coin ID
] as const;
```

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Drag dist-dashboard folder to Netlify
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📱 Mobile Responsive

The dashboard is fully responsive:
- Mobile: Single column, collapsible sidebar
- Tablet: 2 columns, persistent sidebar
- Desktop: 3 columns, full sidebar

## ⚡ Performance

- **Code Splitting**: Lazy loading for routes
- **Bundle Size**: Optimized with Vite
- **Caching**: API responses cached
- **Debouncing**: Search input debounced
- **Memoization**: React.memo for heavy components

## 🔒 Security

- No private keys stored
- Environment variables for sensitive data
- HTTPS required for wallet connection
- Input validation on all forms
- XSS protection with React

## 📈 Future Enhancements

- [ ] Trading functionality
- [ ] Portfolio tracking
- [ ] Price alerts
- [ ] News integration
- [ ] Social trading features
- [ ] Advanced charting (TradingView)
- [ ] NFT marketplace integration
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Export data to CSV/PDF

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [CoinGecko](https://www.coingecko.com/) for market data API
- [MetaMask](https://metamask.io/) for Web3 wallet
- [Recharts](https://recharts.org/) for charting library
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 💬 Support

For questions or issues:
- Open an issue on GitHub
- Contact: support@cryptodash.io

---

**⚠️ Disclaimer**: This is an educational project. Cryptocurrency trading involves risk. The AI predictions are for informational purposes only and should not be considered financial advice. Always do your own research.

**Built with ❤️ by Professional Web3 Developers**
