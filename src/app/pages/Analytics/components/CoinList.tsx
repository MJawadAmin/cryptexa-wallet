import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CoinData } from '../../../services/CryptoMarketService';

interface CoinListProps {
  coins: CoinData[];
  selectedCoin: CoinData | null;
  onSelectCoin: (coin: CoinData) => void;
}

export const CoinList: React.FC<CoinListProps> = ({ coins, selectedCoin, onSelectCoin }) => {
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              #
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Coin
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Price
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              24h %
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              7d %
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Market Cap
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Volume (24h)
            </th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Chart
            </th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, index) => (
            <motion.tr
              key={coin.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => onSelectCoin(coin)}
              className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                selectedCoin?.id === coin.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <td className="py-4 px-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {index + 1}
                </span>
              </td>
              
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
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
              </td>
              
              <td className="py-4 px-4 text-right">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatPrice(coin.current_price)}
                </span>
              </td>
              
              <td className="py-4 px-4 text-right">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg font-semibold text-sm ${
                  coin.price_change_percentage_24h >= 0
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                }`}>
                  {coin.price_change_percentage_24h >= 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                </div>
              </td>
              
              <td className="py-4 px-4 text-right">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg font-semibold text-sm ${
                  coin.price_change_percentage_7d >= 0
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                }`}>
                  {coin.price_change_percentage_7d >= 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {Math.abs(coin.price_change_percentage_7d).toFixed(2)}%
                </div>
              </td>
              
              <td className="py-4 px-4 text-right">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatMarketCap(coin.market_cap)}
                </span>
              </td>
              
              <td className="py-4 px-4 text-right">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatMarketCap(coin.total_volume)}
                </span>
              </td>
              
              <td className="py-4 px-4">
                <div className="flex items-center justify-center">
                  {coin.sparkline_in_7d?.price && (
                    <div className="w-24 h-12">
                      <svg width="100%" height="100%" viewBox="0 0 100 40">
                        <polyline
                          points={coin.sparkline_in_7d.price
                            .slice(0, 50)
                            .map((price, i) => {
                              const x = (i / 49) * 100;
                              const minPrice = Math.min(...coin.sparkline_in_7d!.price.slice(0, 50));
                              const maxPrice = Math.max(...coin.sparkline_in_7d!.price.slice(0, 50));
                              const y = 40 - ((price - minPrice) / (maxPrice - minPrice)) * 35;
                              return `${x},${y}`;
                            })
                            .join(' ')}
                          fill="none"
                          stroke={coin.price_change_percentage_7d >= 0 ? '#10b981' : '#ef4444'}
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
