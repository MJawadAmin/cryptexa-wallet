import React from 'react';
import { useCryptoMarket } from '../../hooks/useCryptoMarket';
import { CoinCard } from '../../components/crypto/CoinCard';
import { LoadingState } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { RefreshCw } from 'lucide-react';

export const MarketsPage: React.FC = () => {
  const {
    coins,
    selectedCoin,
    isLoading,
    error,
    lastUpdate,
    fetchMarketData,
    selectCoin,
  } = useCryptoMarket(true, 30000); // Auto-refresh every 30 seconds

  const handleRefresh = () => {
    fetchMarketData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Live Markets</h1>
          <p className="text-gray-400">
            Real-time cryptocurrency prices • Auto-updates every 30 seconds
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Last Update Time */}
      {lastUpdate > 0 && (
        <div className="text-sm text-gray-500">
          Last updated: {new Date(lastUpdate).toLocaleTimeString()}
        </div>
      )}

      {/* Error State */}
      {error && <ErrorMessage message={error} onRetry={handleRefresh} />}

      {/* Loading State */}
      {isLoading && coins.length === 0 && (
        <LoadingState message="Loading market data..." />
      )}

      {/* Coins Grid */}
      {!isLoading && coins.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {coins.map((coin) => (
            <CoinCard
              key={coin.id}
              coin={coin}
              onClick={() => selectCoin(coin.id)}
              isSelected={selectedCoin?.id === coin.id}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && coins.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No market data available</p>
        </div>
      )}
    </div>
  );
};
