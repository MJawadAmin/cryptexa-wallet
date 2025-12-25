import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { Card } from '../../../components/Card';
import { MarketAnalysis } from '../../../services/CryptoMarketService';

interface MarketOverviewProps {
  analysis: MarketAnalysis;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({ analysis }) => {
  const formatMarketCap = (cap: number) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString()}`;
  };

  const getSentimentColor = () => {
    switch (analysis.sentiment) {
      case 'greed':
        return 'from-green-500 to-emerald-600';
      case 'fear':
        return 'from-red-500 to-rose-600';
      default:
        return 'from-yellow-500 to-orange-600';
    }
  };

  const getSentimentIcon = () => {
    switch (analysis.sentiment) {
      case 'greed':
        return <ThumbsUp className="w-8 h-8" />;
      case 'fear':
        return <ThumbsDown className="w-8 h-8" />;
      default:
        return <Activity className="w-8 h-8" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Sentiment */}
      <Card className={`p-8 bg-gradient-to-r ${getSentimentColor()} text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 opacity-10">
          <Activity className="w-64 h-64" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-2">Market Sentiment</p>
              <h2 className="text-5xl font-bold capitalize mb-4">{analysis.sentiment}</h2>
              <p className="text-white/90 text-lg">
                Fear & Greed Index: <span className="font-bold">{analysis.sentimentScore.toFixed(0)}/100</span>
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
              {getSentimentIcon()}
            </div>
          </div>

          {/* Sentiment Bar */}
          <div className="mt-6">
            <div className="h-4 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${analysis.sentimentScore}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-white rounded-full"
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-white/80">
              <span>Extreme Fear</span>
              <span>Neutral</span>
              <span>Extreme Greed</span>
            </div>
          </div>

          <p className="mt-4 text-white/90 text-sm">
            {analysis.sentiment === 'greed' && 'Investors are getting greedy. Time to be cautious.'}
            {analysis.sentiment === 'fear' && 'Investors are fearful. Potential buying opportunity.'}
            {analysis.sentiment === 'neutral' && 'Market is balanced. Monitor for trend signals.'}
          </p>
        </div>
      </Card>

      {/* Top Gainers & Losers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Top Gainers (24h)
            </h3>
          </div>
          
          <div className="space-y-3">
            {analysis.topGainers.map((coin, index) => (
              <motion.div
                key={coin.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400 w-6">
                    {index + 1}
                  </span>
                  {coin.image && (
                    <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {coin.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                      {coin.symbol}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${coin.current_price.toLocaleString(undefined, { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </p>
                  <p className="text-sm font-bold text-green-600 flex items-center justify-end gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +{coin.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Top Losers */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Top Losers (24h)
            </h3>
          </div>
          
          <div className="space-y-3">
            {analysis.topLosers.map((coin, index) => (
              <motion.div
                key={coin.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400 w-6">
                    {index + 1}
                  </span>
                  {coin.image && (
                    <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {coin.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                      {coin.symbol}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${coin.current_price.toLocaleString(undefined, { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 6 
                    })}
                  </p>
                  <p className="text-sm font-bold text-red-600 flex items-center justify-end gap-1">
                    <TrendingDown className="w-3 h-3" />
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
