import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  BarChart3,
  LineChart,
  PieChart,
  Target,
  Zap,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  Sparkles,
  Eye,
  Clock
} from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import {
  cryptoMarketService,
  CoinData,
  PredictionData,
  MarketAnalysis
} from '../../services/CryptoMarketService';
import { PriceChart } from './components/PriceChart';
import { PredictionPanel } from './components/PredictionPanel';
import { MarketOverview } from './components/MarketOverview';
import { CoinList } from './components/CoinList';

export const AnalyticsPage: React.FC = () => {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '1y'>('7d');
  const [view, setView] = useState<'overview' | 'analysis' | 'predictions'>('overview');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedCoin) {
      loadPrediction(selectedCoin.id);
    }
  }, [selectedCoin]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [coinsData, analysisData] = await Promise.all([
        cryptoMarketService.getTopCoins(50),
        cryptoMarketService.getMarketAnalysis()
      ]);
      
      setCoins(coinsData);
      setMarketAnalysis(analysisData);
      
      // Set Bitcoin as default selected coin
      const bitcoin = coinsData.find(c => c.id === 'bitcoin') || coinsData[0];
      setSelectedCoin(bitcoin);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPrediction = async (coinId: string) => {
    try {
      const predictionData = await cryptoMarketService.getPredictions(coinId);
      setPrediction(predictionData);
    } catch (error) {
      console.error('Error loading prediction:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    if (selectedCoin) {
      await loadPrediction(selectedCoin.id);
    }
    setRefreshing(false);
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) => {
    if (price < 1) return `$${price.toFixed(6)}`;
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMarketCap = (cap: number) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Activity className="w-12 h-12 text-blue-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                <Brain className="w-7 h-7 text-blue-600" />
                Crypto Analytics & Predictions
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                AI-powered market analysis and price predictions
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="flex items-center gap-2"
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setView('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                view === 'overview'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <PieChart className="w-4 h-4 inline mr-2" />
              Market Overview
            </button>
            <button
              onClick={() => setView('analysis')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                view === 'analysis'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <LineChart className="w-4 h-4 inline mr-2" />
              Chart Analysis
            </button>
            <button
              onClick={() => setView('predictions')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                view === 'predictions'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Sparkles className="w-4 h-4 inline mr-2" />
              AI Predictions
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {/* Market Overview View */}
          {view === 'overview' && marketAnalysis && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <MarketOverview analysis={marketAnalysis} />
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Top Gainer 24h
                      </p>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                        {marketAnalysis.topGainers[0]?.name}
                      </h3>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        +{marketAnalysis.topGainers[0]?.price_change_percentage_24h.toFixed(2)}%
                      </p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-green-500" />
                  </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                        Top Loser 24h
                      </p>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                        {marketAnalysis.topLosers[0]?.name}
                      </h3>
                      <p className="text-2xl font-bold text-red-600 mt-1">
                        {marketAnalysis.topLosers[0]?.price_change_percentage_24h.toFixed(2)}%
                      </p>
                    </div>
                    <TrendingDown className="w-12 h-12 text-red-500" />
                  </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        Total Market Cap
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                        {formatMarketCap(marketAnalysis.marketCap)}
                      </p>
                    </div>
                    <DollarSign className="w-12 h-12 text-blue-500" />
                  </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                        BTC Dominance
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                        {marketAnalysis.btcDominance.toFixed(1)}%
                      </p>
                    </div>
                    <Target className="w-12 h-12 text-purple-500" />
                  </div>
                </Card>
              </div>

              {/* Coin List */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Top Cryptocurrencies
                  </h2>
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search coins..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <CoinList
                  coins={filteredCoins}
                  selectedCoin={selectedCoin}
                  onSelectCoin={(coin) => {
                    setSelectedCoin(coin);
                    setView('analysis');
                  }}
                />
              </Card>
            </motion.div>
          )}

          {/* Chart Analysis View */}
          {view === 'analysis' && selectedCoin && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Selected Coin Header */}
              <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {selectedCoin.image && (
                      <img src={selectedCoin.image} alt={selectedCoin.name} className="w-16 h-16" />
                    )}
                    <div>
                      <h2 className="text-3xl font-bold">{selectedCoin.name}</h2>
                      <p className="text-blue-100 uppercase font-medium">{selectedCoin.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold">{formatPrice(selectedCoin.current_price)}</p>
                    <div className={`flex items-center gap-2 mt-2 justify-end ${
                      selectedCoin.price_change_percentage_24h >= 0 ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {selectedCoin.price_change_percentage_24h >= 0 ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5" />
                      )}
                      <span className="text-xl font-semibold">
                        {Math.abs(selectedCoin.price_change_percentage_24h).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
                  <div>
                    <p className="text-blue-100 text-sm">Market Cap</p>
                    <p className="text-xl font-bold mt-1">{formatMarketCap(selectedCoin.market_cap)}</p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">24h Volume</p>
                    <p className="text-xl font-bold mt-1">{formatMarketCap(selectedCoin.total_volume)}</p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">24h High</p>
                    <p className="text-xl font-bold mt-1">{formatPrice(selectedCoin.high_24h)}</p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">24h Low</p>
                    <p className="text-xl font-bold mt-1">{formatPrice(selectedCoin.low_24h)}</p>
                  </div>
                </div>
              </Card>

              {/* Price Chart */}
              <PriceChart
                coinId={selectedCoin.id}
                coinName={selectedCoin.name}
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
              />

              {/* Technical Indicators */}
              {prediction && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        RSI (14)
                      </span>
                      <Activity className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {prediction.signals.rsi.toFixed(1)}
                    </p>
                    <p className={`text-sm mt-1 ${
                      prediction.signals.rsi > 70 ? 'text-red-600' :
                      prediction.signals.rsi < 30 ? 'text-green-600' :
                      'text-yellow-600'
                    }`}>
                      {prediction.signals.rsi > 70 ? 'Overbought' :
                       prediction.signals.rsi < 30 ? 'Oversold' :
                       'Neutral'}
                    </p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        MACD Signal
                      </span>
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                      {prediction.signals.macd}
                    </p>
                    <p className={`text-sm mt-1 ${
                      prediction.signals.macd === 'bullish' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {prediction.signals.macd === 'bullish' ? 'Buy Signal' : 'Sell Signal'}
                    </p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Moving Average
                      </span>
                      <LineChart className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                      {prediction.signals.movingAverage}
                    </p>
                    <p className={`text-sm mt-1 ${
                      prediction.signals.movingAverage === 'above' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {prediction.signals.movingAverage === 'above' ? 'Bullish Trend' : 'Bearish Trend'}
                    </p>
                  </Card>
                </div>
              )}
            </motion.div>
          )}

          {/* AI Predictions View */}
          {view === 'predictions' && selectedCoin && prediction && (
            <motion.div
              key="predictions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <PredictionPanel
                coin={selectedCoin}
                prediction={prediction}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
