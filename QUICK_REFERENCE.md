# 🚀 CRYPTO DASHBOARD - QUICK REFERENCE

## ⚡ START IN 30 SECONDS

```powershell
npm install && npm run dev
```
Opens at: http://localhost:3000

---

## 📁 KEY FILES

### Run the App
- `START-DASHBOARD.bat` - Double-click to start (Windows)
- `start-dashboard.ps1` - PowerShell script to start

### Main Code
- `src/CryptoDashboardApp.tsx` - Main app
- `src/dashboard-main.tsx` - Entry point
- `dashboard.html` - HTML template

### Configuration
- `.env` - Environment variables
- `vite.config.ts` - Build config
- `tailwind.config.js` - Styling config

---

## 🎯 PAGES

1. **Dashboard** - Main overview with charts
2. **Markets** - Live prices for all coins
3. **Predictions** - AI-powered forecasts
4. **Wallet** - MetaMask integration

---

## 🔑 KEY COMMANDS

```powershell
# Development
npm run dev              # Start dev server
npm run build:dashboard  # Production build
npm run preview         # Preview build

# Quality
npm run type-check      # Check TypeScript
npm run lint           # Run ESLint
```

---

## 📚 DOCUMENTATION

1. **CRYPTO_DASHBOARD_README.md** - Full documentation
2. **QUICKSTART_DASHBOARD.md** - Quick start guide
3. **DASHBOARD_INSTRUCTIONS.md** - Detailed usage
4. **VISUAL_DESIGN_GUIDE.md** - UI/UX guide
5. **FEATURES_COMPLETE.md** - Feature list
6. **PROJECT_CRYPTO_DASHBOARD_COMPLETE.md** - Summary

---

## 🎨 CUSTOMIZATION

### Add Coins
Edit `src/types/crypto.ts`:
```typescript
export const SUPPORTED_COINS = [
  'bitcoin', 'ethereum', 'your-coin'
]
```

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: { 500: '#YOUR_COLOR' }
}
```

---

## 🔧 TECH STACK

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Axios
- Recharts
- Ethers.js

---

## 🌐 API

**CoinGecko** - Free tier
- No API key needed
- 10-50 calls/minute
- Real-time data

---

## 💼 WALLET

**MetaMask** required
1. Install: https://metamask.io
2. Click "Connect Wallet"
3. Approve connection

---

## 📱 RESPONSIVE

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## ⚠️ TROUBLESHOOTING

### Port in use?
```powershell
npx kill-port 3000
```

### API errors?
- Check internet connection
- Verify CoinGecko is accessible

### MetaMask?
- Ensure installed
- Unlock wallet
- Refresh page

---

## 🎯 PROJECT STRUCTURE

```
src/
├── components/     # UI components
├── pages/         # Page components
├── hooks/         # Custom hooks
├── services/      # API services
├── store/         # Zustand stores
└── types/         # TypeScript types
```

---

## 📊 FEATURES

✅ Real-time prices
✅ Interactive charts
✅ AI predictions
✅ Wallet connection
✅ Auto-refresh
✅ Responsive design
✅ Dark theme
✅ Professional UI

---

## 🚀 DEPLOY

### Vercel
```bash
vercel
```

### Netlify
```bash
npm run build:dashboard
# Upload dist-dashboard
```

---

## 💡 TIPS

- Data refreshes every 30s
- Charts load on demand
- Wallet state persists
- Mobile-friendly

---

## 📞 HELP

1. Check docs in project root
2. Review code comments
3. Check browser console

---

## ✅ CHECKLIST

Before using:
- [ ] Node.js 16+ installed
- [ ] npm install completed
- [ ] MetaMask installed (optional)

Ready?
```powershell
npm run dev
```

---

**That's it! You're ready to go! 🎉**

Open http://localhost:3000 and start trading!

---

*Quick reference card - Print or save for easy access*
