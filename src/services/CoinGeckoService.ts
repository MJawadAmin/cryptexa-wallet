import axios, { AxiosInstance } from 'axios';
import { CoinData, PriceHistory, SUPPORTED_COINS, TimeFrame } from '../types/crypto';

class CoinGeckoService {
  private api: AxiosInstance;
  private baseURL = 'https://api.coingecko.com/api/v3';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('CoinGecko API Error:', error.message);
        throw error;
      }
    );
  }

  /**
   * Fetch market data for multiple coins
   */
  async getMarketData(): Promise<CoinData[]> {
    try {
      const response = await this.api.get<CoinData[]>('/coins/markets', {
        params: {
          vs_currency: 'usd',
          ids: SUPPORTED_COINS.join(','),
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: true,
          price_change_percentage: '24h',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw new Error('Failed to fetch market data. Please try again later.');
    }
  }

  /**
   * Fetch detailed data for a single coin
   */
  async getCoinData(coinId: string): Promise<CoinData> {
    try {
      const response = await this.api.get<CoinData>(`/coins/${coinId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching coin data for ${coinId}:`, error);
      throw new Error(`Failed to fetch data for ${coinId}`);
    }
  }

  /**
   * Fetch price history for a coin
   */
  async getPriceHistory(coinId: string, days: number = 7): Promise<PriceHistory> {
    try {
      const response = await this.api.get<PriceHistory>(
        `/coins/${coinId}/market_chart`,
        {
          params: {
            vs_currency: 'usd',
            days: days,
            interval: days === 1 ? 'hourly' : 'daily',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Error fetching price history for ${coinId}:`, error);
      throw new Error(`Failed to fetch price history for ${coinId}`);
    }
  }

  /**
   * Fetch price data for a specific time range
   */
  async getPriceRange(
    coinId: string,
    from: number,
    to: number
  ): Promise<PriceHistory> {
    try {
      const response = await this.api.get<PriceHistory>(
        `/coins/${coinId}/market_chart/range`,
        {
          params: {
            vs_currency: 'usd',
            from: from,
            to: to,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Error fetching price range for ${coinId}:`, error);
      throw new Error(`Failed to fetch price range for ${coinId}`);
    }
  }

  /**
   * Search coins by query
   */
  async searchCoins(query: string): Promise<any[]> {
    try {
      const response = await this.api.get('/search', {
        params: {
          query: query,
        },
      });

      return response.data.coins || [];
    } catch (error) {
      console.error('Error searching coins:', error);
      throw new Error('Failed to search coins');
    }
  }

  /**
   * Get days value from TimeFrame
   */
  getDaysFromTimeFrame(timeFrame: TimeFrame): number {
    const timeFrameMap: Record<TimeFrame, number> = {
      '1H': 0.042, // 1 hour = 1/24 day
      '24H': 1,
      '7D': 7,
      '30D': 30,
      '1Y': 365,
    };

    return timeFrameMap[timeFrame];
  }

  /**
   * Fetch trending coins
   */
  async getTrendingCoins(): Promise<any> {
    try {
      const response = await this.api.get('/search/trending');
      return response.data;
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      throw new Error('Failed to fetch trending coins');
    }
  }

  /**
   * Get global market data
   */
  async getGlobalData(): Promise<any> {
    try {
      const response = await this.api.get('/global');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching global data:', error);
      throw new Error('Failed to fetch global market data');
    }
  }
}

// Export singleton instance
export const coinGeckoService = new CoinGeckoService();
export default coinGeckoService;
