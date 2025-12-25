import React, { useEffect } from 'react';
import { usePredictions } from '../../hooks/usePredictions';
import { useCryptoMarket } from '../../hooks/useCryptoMarket';
import { PredictionCard } from '../../components/crypto/PredictionCard';
import { LoadingState } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Brain, Sparkles, RefreshCw } from 'lucide-react';

export const PredictionsPage: React.FC = () => {
  const {
    predictions,
    isCalculating,
    error,
    generateAllPredictions,
    refreshPrediction,
  } = usePredictions();

  const { coins, isLoading: isLoadingMarket } = useCryptoMarket(true, 30000);

  const predictionsList = Object.values(predictions);

  const handleGenerateAll = () => {
    generateAllPredictions();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Brain className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">AI Price Predictions</h1>
              <p className="text-gray-400">Advanced market analysis & forecasting</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerateAll}
          disabled={isCalculating || isLoadingMarket}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg"
        >
          {isCalculating ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate Predictions
            </>
          )}
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Brain className="text-purple-500 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="text-white font-semibold mb-1">AI-Powered Analysis</h3>
            <p className="text-gray-300 text-sm">
              Our advanced algorithms analyze market trends, momentum, volatility, and moving averages
              to generate intelligent price predictions. These are educational forecasts and should not
              be considered as financial advice.
            </p>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && <ErrorMessage message={error} onRetry={handleGenerateAll} />}

      {/* Loading State */}
      {isCalculating && predictionsList.length === 0 && (
        <LoadingState message="Analyzing market data..." />
      )}

      {/* Predictions Grid */}
      {predictionsList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {predictionsList.map((prediction) => (
            <PredictionCard
              key={prediction.coinId}
              prediction={prediction}
              onRefresh={() => refreshPrediction(prediction.coinId)}
              isRefreshing={isCalculating}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isCalculating && !error && predictionsList.length === 0 && coins.length > 0 && (
        <div className="text-center py-16">
          <div className="inline-flex p-6 bg-purple-500/10 rounded-full mb-4">
            <Brain className="text-purple-500" size={48} />
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">
            No Predictions Generated Yet
          </h3>
          <p className="text-gray-400 mb-6">
            Click "Generate Predictions" to start AI-powered market analysis
          </p>
          <button
            onClick={handleGenerateAll}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all shadow-lg"
          >
            <Sparkles size={18} className="inline mr-2" />
            Generate Predictions Now
          </button>
        </div>
      )}
    </div>
  );
};
