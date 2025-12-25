import React from 'react';
import { CoinData } from '../../types/crypto';
import { PriceChange } from './PriceChange';

interface CoinCardProps {
  coin: CoinData;
  onClick?: () => void;
  isSelected?: boolean;
}

export const CoinCard: React.FC<CoinCardProps> = ({ coin, onClick, isSelected = false }) => {
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
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toFixed(0)}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    return `$${volume.toFixed(0)}`;
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 
        border transition-all duration-300 cursor-pointer
        hover:bg-gray-800/70 hover:scale-[1.02] hover:shadow-xl
        ${isSelected ? 'border-cyan-500 shadow-glow' : 'border-gray-700/50'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
          <div>
            <h3 className="text-white font-semibold text-lg">{coin.name}</h3>
            <p className="text-gray-400 text-sm uppercase">{coin.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white font-bold text-xl">{formatPrice(coin.current_price)}</div>
          <PriceChange value={coin.price_change_percentage_24h} showIcon={false} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700/50">
        <div>
          <p className="text-gray-400 text-xs mb-1">Market Cap</p>
          <p className="text-white font-semibold">{formatMarketCap(coin.market_cap)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">24h Volume</p>
          <p className="text-white font-semibold">{formatVolume(coin.total_volume)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">24h High</p>
          <p className="text-green-500 font-semibold">{formatPrice(coin.high_24h)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">24h Low</p>
          <p className="text-red-500 font-semibold">{formatPrice(coin.low_24h)}</p>
        </div>
      </div>
    </div>
  );
};
