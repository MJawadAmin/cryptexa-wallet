import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Card } from '../../../components/Card';
import { CoinData, PredictionData } from '../../../services/CryptoMarketService';

interface PredictionPanelProps {
  coin: CoinData;
  prediction: PredictionData;
}

export const PredictionPanel: React.FC<PredictionPanelProps> = ({ coin, prediction }) => {
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'bearish':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return <TrendingUp className="w-6 h-6" />;
      case 'bearish':
        return <TrendingDown className="w-6 h-6" />;
      default:
        return <Target className="w-6 h-6" />;
    }
  };

  const calculateChange = (predicted: number, current: number) => {
    const change = ((predicted - current) / current) * 100;
    return {
      percentage: change,
      isPositive: change >= 0
    };
  };

  const change24h = calculateChange(prediction.predicted24h, prediction.currentPrice);
  const change7d = calculateChange(prediction.predicted7d, prediction.currentPrice);
  const change30d = calculateChange(prediction.predicted30d, prediction.currentPrice);

  return (
    <div className="space-y-6">
      {/* Main Prediction Card */}
      <Card className={`p-8 border-2 ${getTrendColor(prediction.trend)}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {coin.image && (
              <img src={coin.image} alt={coin.name} className="w-16 h-16" />
            )}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {coin.name} AI Prediction
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Powered by advanced ML algorithms
              </p>
            </div>
          </div>
          
          <div className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 ${getTrendColor(prediction.trend)}`}>
            {getTrendIcon(prediction.trend)}
            <div>
              <p className="text-sm font-medium opacity-75">Trend</p>
              <p className="text-2xl font-bold capitalize">{prediction.trend}</p>
            </div>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Prediction Confidence
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {prediction.confidence.toFixed(0)}%
            </span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${prediction.confidence}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                prediction.confidence >= 75 ? 'bg-green-500' :
                prediction.confidence >= 50 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
            />
          </div>
        </div>

        {/* Current Price */}
        <div className="text-center py-6 bg-white dark:bg-gray-800 rounded-xl mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Current Price</p>
          <p className="text-5xl font-bold text-gray-900 dark:text-white">
            ${prediction.currentPrice.toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </p>
        </div>
      </Card>

      {/* Prediction Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 24h Prediction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`p-6 border-2 ${change24h.isPositive ? 
            'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 
            'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                24 Hour Forecast
              </h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Predicted Price</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${prediction.predicted24h.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>
              
              <div className={`flex items-center gap-2 text-lg font-bold ${
                change24h.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {change24h.isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                {change24h.isPositive ? '+' : ''}{change24h.percentage.toFixed(2)}%
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {change24h.isPositive ? 'Expected gain' : 'Expected loss'}: $
                {Math.abs(prediction.predicted24h - prediction.currentPrice).toLocaleString(undefined, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* 7d Prediction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`p-6 border-2 ${change7d.isPositive ? 
            'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 
            'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                7 Day Forecast
              </h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Predicted Price</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${prediction.predicted7d.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>
              
              <div className={`flex items-center gap-2 text-lg font-bold ${
                change7d.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {change7d.isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                {change7d.isPositive ? '+' : ''}{change7d.percentage.toFixed(2)}%
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {change7d.isPositive ? 'Expected gain' : 'Expected loss'}: $
                {Math.abs(prediction.predicted7d - prediction.currentPrice).toLocaleString(undefined, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* 30d Prediction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className={`p-6 border-2 ${change30d.isPositive ? 
            'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 
            'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                30 Day Forecast
              </h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Predicted Price</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${prediction.predicted30d.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>
              
              <div className={`flex items-center gap-2 text-lg font-bold ${
                change30d.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {change30d.isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                {change30d.isPositive ? '+' : ''}{change30d.percentage.toFixed(2)}%
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {change30d.isPositive ? 'Expected gain' : 'Expected loss'}: $
                {Math.abs(prediction.predicted30d - prediction.currentPrice).toLocaleString(undefined, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Technical Signals */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          Technical Indicators
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                RSI (Relative Strength Index)
              </span>
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                prediction.signals.rsi > 70 ? 'bg-red-100 text-red-600' :
                prediction.signals.rsi < 30 ? 'bg-green-100 text-green-600' :
                'bg-yellow-100 text-yellow-600'
              }`}>
                {prediction.signals.rsi > 70 ? 'OVERBOUGHT' :
                 prediction.signals.rsi < 30 ? 'OVERSOLD' :
                 'NEUTRAL'}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {prediction.signals.rsi.toFixed(1)}
            </p>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  prediction.signals.rsi > 70 ? 'bg-red-500' :
                  prediction.signals.rsi < 30 ? 'bg-green-500' :
                  'bg-yellow-500'
                }`}
                style={{ width: `${prediction.signals.rsi}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                MACD Signal
              </span>
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                prediction.signals.macd === 'bullish' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {prediction.signals.macd.toUpperCase()}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
              {prediction.signals.macd}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              {prediction.signals.macd === 'bullish' 
                ? 'Strong buy signal detected'
                : 'Sell signal detected'
              }
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Moving Average Position
              </span>
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                prediction.signals.movingAverage === 'above' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {prediction.signals.movingAverage.toUpperCase()}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
              {prediction.signals.movingAverage} MA
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              {prediction.signals.movingAverage === 'above' 
                ? 'Bullish trend continues'
                : 'Bearish pressure detected'
              }
            </p>
          </div>
        </div>
      </Card>

      {/* Disclaimer */}
      <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
              Investment Disclaimer
            </h4>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              These predictions are generated using AI and technical analysis. Cryptocurrency markets are highly volatile 
              and unpredictable. This information is for educational purposes only and should not be considered as financial 
              advice. Always do your own research and consult with financial professionals before making investment decisions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
