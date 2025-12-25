import React from 'react';
import { PredictionData } from '../../types/crypto';
import { TrendingUp, TrendingDown, Minus, Activity, Target, Brain } from 'lucide-react';

interface PredictionCardProps {
  prediction: PredictionData;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  onRefresh,
  isRefreshing = false,
}) => {
  const getSignalColor = (signal: PredictionData['signal']) => {
    switch (signal) {
      case 'BULLISH':
        return 'text-green-500 bg-green-500/10 border-green-500/50';
      case 'BEARISH':
        return 'text-red-500 bg-red-500/10 border-red-500/50';
      default:
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/50';
    }
  };

  const getSignalIcon = (signal: PredictionData['signal']) => {
    switch (signal) {
      case 'BULLISH':
        return <TrendingUp size={24} />;
      case 'BEARISH':
        return <TrendingDown size={24} />;
      default:
        return <Minus size={24} />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'UP':
        return <TrendingUp size={16} className="text-green-500" />;
      case 'DOWN':
        return <TrendingDown size={16} className="text-red-500" />;
      default:
        return <Minus size={16} className="text-yellow-500" />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-bold text-xl">{prediction.name}</h3>
          <p className="text-gray-400 text-sm uppercase">{prediction.symbol}</p>
        </div>
        
        <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${getSignalColor(prediction.signal)}`}>
          {getSignalIcon(prediction.signal)}
          <span className="font-bold">{prediction.signal}</span>
        </div>
      </div>

      {/* Price Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-900/50 rounded-lg p-4">
          <p className="text-gray-400 text-xs mb-1">Current Price</p>
          <p className="text-white font-bold text-lg">{formatPrice(prediction.currentPrice)}</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-4">
          <p className="text-gray-400 text-xs mb-1">Predicted Price</p>
          <p className="text-white font-bold text-lg">{formatPrice(prediction.predictedPrice)}</p>
        </div>
      </div>

      {/* Prediction Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Expected Change</span>
          <span
            className={`font-bold ${
              prediction.predictedChange >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {prediction.predictedChange >= 0 && '+'}
            {prediction.predictedChange.toFixed(2)}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm flex items-center gap-2">
            <Target size={16} />
            Confidence
          </span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full transition-all"
                style={{ width: `${prediction.confidence}%` }}
              />
            </div>
            <span className="text-white font-semibold text-sm">{prediction.confidence}%</span>
          </div>
        </div>
      </div>

      {/* AI Indicators */}
      <div className="bg-gray-900/30 rounded-lg p-4 space-y-2">
        <div className="flex items-center gap-2 text-cyan-500 mb-3">
          <Brain size={16} />
          <span className="text-xs font-semibold uppercase">AI Indicators</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-gray-400 text-xs mb-1">Moving Average</p>
            <p className="text-white text-sm font-medium">
              {formatPrice(prediction.indicators.movingAverage)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Momentum</p>
            <p className="text-white text-sm font-medium flex items-center gap-1">
              {prediction.indicators.momentum >= 0 && '+'}
              {prediction.indicators.momentum.toFixed(2)}%
              <Activity size={14} className="text-cyan-500" />
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Volatility</p>
            <p className="text-white text-sm font-medium">
              {formatPrice(prediction.indicators.volatility)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Trend</p>
            <p className="text-white text-sm font-medium flex items-center gap-1">
              {prediction.indicators.trend}
              {getTrendIcon(prediction.indicators.trend)}
            </p>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="w-full mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors"
        >
          {isRefreshing ? 'Analyzing...' : 'Refresh Prediction'}
        </button>
      )}

      {/* Timestamp */}
      <p className="text-gray-500 text-xs text-center mt-3">
        Generated: {new Date(prediction.timestamp).toLocaleString()}
      </p>
    </div>
  );
};
