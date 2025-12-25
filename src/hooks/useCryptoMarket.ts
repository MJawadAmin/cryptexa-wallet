import { useEffect, useCallback } from 'react';
import { useCryptoStore } from '../store/crypto-store';
import { coinGeckoService } from '../services/CoinGeckoService';
import { ChartDataPoint } from '../types/crypto';

/**
 * Custom hook for fetching crypto market data
 */
export const useCryptoMarket = (autoRefresh: boolean = true, interval: number = 30000) => {
  const {
    coins,
    selectedCoin,
    priceHistory,
    isLoading,
    error,
    lastUpdate,
    timeFrame,
    setCoins,
    setSelectedCoin,
    setPriceHistory,
    setLoading,
    setError,
    setTimeFrame,
    updateLastUpdate,
  } = useCryptoStore();

  /**
   * Fetch market data
   */
  const fetchMarketData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await coinGeckoService.getMarketData();
      setCoins(data);
      updateLastUpdate();

      // Auto-select first coin if none selected
      if (!selectedCoin && data.length > 0) {
        setSelectedCoin(data[0]);
      }
    } catch (err: any) {
      console.error('Error fetching market data:', err);
      setError(err.message || 'Failed to fetch market data');
    } finally {
      setLoading(false);
    }
  }, [selectedCoin, setCoins, setSelectedCoin, setLoading, setError, updateLastUpdate]);

  /**
   * Fetch price history for a coin
   */
  const fetchPriceHistory = useCallback(
    async (coinId: string, days?: number) => {
      try {
        const daysToFetch = days || coinGeckoService.getDaysFromTimeFrame(timeFrame);
        const data = await coinGeckoService.getPriceHistory(coinId, daysToFetch);

        // Transform data to ChartDataPoint format
        const chartData: ChartDataPoint[] = data.prices.map(([timestamp, price]) => ({
          timestamp,
          price,
          date: new Date(timestamp).toLocaleDateString(),
        }));

        setPriceHistory(coinId, chartData);
        return chartData;
      } catch (err: any) {
        console.error(`Error fetching price history for ${coinId}:`, err);
        throw err;
      }
    },
    [timeFrame, setPriceHistory]
  );

  /**
   * Fetch price history for selected coin when it changes
   */
  useEffect(() => {
    if (selectedCoin && !priceHistory[selectedCoin.id]) {
      fetchPriceHistory(selectedCoin.id);
    }
  }, [selectedCoin, priceHistory, fetchPriceHistory]);

  /**
   * Fetch price history when timeFrame changes
   */
  useEffect(() => {
    if (selectedCoin) {
      fetchPriceHistory(selectedCoin.id);
    }
  }, [timeFrame]);

  /**
   * Auto-refresh market data
   */
  useEffect(() => {
    if (autoRefresh) {
      fetchMarketData(); // Initial fetch

      const intervalId = setInterval(() => {
        fetchMarketData();
      }, interval);

      return () => clearInterval(intervalId);
    }
  }, [autoRefresh, interval, fetchMarketData]);

  /**
   * Search coins
   */
  const searchCoins = useCallback(async (query: string) => {
    try {
      return await coinGeckoService.searchCoins(query);
    } catch (err: any) {
      console.error('Error searching coins:', err);
      throw err;
    }
  }, []);

  /**
   * Select a coin
   */
  const selectCoin = useCallback(
    (coinId: string) => {
      const coin = coins.find((c) => c.id === coinId);
      if (coin) {
        setSelectedCoin(coin);
      }
    },
    [coins, setSelectedCoin]
  );

  return {
    // State
    coins,
    selectedCoin,
    priceHistory,
    isLoading,
    error,
    lastUpdate,
    timeFrame,

    // Actions
    fetchMarketData,
    fetchPriceHistory,
    selectCoin,
    setTimeFrame,
    searchCoins,
  };
};
