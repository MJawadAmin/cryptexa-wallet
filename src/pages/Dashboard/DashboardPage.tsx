import React, { useEffect } from 'react';
import { useCryptoMarket } from '../../hooks/useCryptoMarket';
import { PriceChart } from '../../components/crypto/PriceChart';
import { TimeFrameSelector } from '../../components/crypto/TimeFrameSelector';
import { PriceChange } from '../../components/crypto/PriceChange';
import { LoadingState } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { TrendingUp, BarChart3, DollarSign, Activity } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    coins,
    selectedCoin,
    priceHistory,
    isLoading,
    error,
    timeFrame,
    setTimeFrame,
    selectCoin,
  } = useCryptoMarket(true, 30000);

  // Auto-select Bitcoin if no coin is selected
  useEffect(() => {
    if (!selectedCoin && coins.length > 0) {
      selectCoin('bitcoin');
    }
  }, [coins, selectedCoin, selectCoin]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatMarketCap = (cap: number) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    return `$${(cap / 1e6).toFixed(2)}M`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome to your crypto trading dashboard</p>
      </div>

      {/* Error State */}
      {error && <ErrorMessage message={error} />}

      {/* Loading State */}
      {isLoading && coins.length === 0 && (
        <LoadingState message="Loading dashboard..." />
      )}

      {/* Main Content */}
      {!isLoading && coins.length > 0 && selectedCoin && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <DollarSign className="text-cyan-500" size={24} />
                </div>
                <p className="text-gray-400 text-sm">Market Cap</p>
              </div>
              <p className="text-white text-2xl font-bold">
                {formatMarketCap(selectedCoin.market_cap)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <TrendingUp className="text-green-500" size={24} />
                </div>
                <p className="text-gray-400 text-sm">24h High</p>
              </div>
              <p className="text-white text-2xl font-bold">
                {formatPrice(selectedCoin.high_24h)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Activity className="text-purple-500" size={24} />
                </div>
                <p className="text-gray-400 text-sm">24h Volume</p>
              </div>
              <p className="text-white text-2xl font-bold">
                {formatMarketCap(selectedCoin.total_volume)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <BarChart3 className="text-orange-500" size={24} />
                </div>
                <p className="text-gray-400 text-sm">24h Change</p>
              </div>
              <PriceChange
                value={selectedCoin.price_change_percentage_24h}
                className="text-2xl font-bold"
                showIcon={false}
              />
            </div>
          </div>

          {/* Main Chart Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            {/* Chart Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={selectedCoin.image}
                    alt={selectedCoin.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h2 className="text-white text-2xl font-bold">{selectedCoin.name}</h2>
                    <p className="text-gray-400 uppercase">{selectedCoin.symbol}</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-white text-3xl font-bold">
                    {formatPrice(selectedCoin.current_price)}
                  </span>
                  <PriceChange value={selectedCoin.price_change_percentage_24h} />
                </div>
              </div>

              <TimeFrameSelector selected={timeFrame} onChange={setTimeFrame} />
            </div>

            {/* Price Chart */}
            {priceHistory[selectedCoin.id] && priceHistory[selectedCoin.id].length > 0 ? (
              <PriceChart
                data={priceHistory[selectedCoin.id]}
                timeFrame={timeFrame}
                height={400}
              />
            ) : (
              <div className="h-[400px] flex items-center justify-center bg-gray-800/30 rounded-xl">
                <LoadingState message="Loading chart data..." />
              </div>
            )}
          </div>

          {/* Quick Select Coins */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Select</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {coins.map((coin) => (
                <button
                  key={coin.id}
                  onClick={() => selectCoin(coin.id)}
                  className={`
                    p-4 rounded-xl border transition-all
                    ${
                      selectedCoin.id === coin.id
                        ? 'bg-cyan-500/20 border-cyan-500'
                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                    }
                  `}
                >
                  <img src={coin.image} alt={coin.name} className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-white text-sm font-medium text-center">
                    {coin.symbol.toUpperCase()}
                  </p>
                  <PriceChange
                    value={coin.price_change_percentage_24h}
                    showIcon={false}
                    className="text-xs justify-center mt-1"
                  />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
