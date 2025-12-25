import axios from 'axios';

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
  image: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface ChartData {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface PredictionData {
  coin: string;
  currentPrice: number;
  predicted24h: number;
  predicted7d: number;
  predicted30d: number;
  confidence: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  signals: {
    rsi: number;
    macd: string;
    movingAverage: string;
  };
}

export interface MarketAnalysis {
  sentiment: 'fear' | 'greed' | 'neutral';
  sentimentScore: number;
  marketCap: number;
  volume24h: number;
  btcDominance: number;
  topGainers: CoinData[];
  topLosers: CoinData[];
}

class CryptoMarketService {
  private baseURL = 'https://api.coingecko.com/api/v3';
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 60000; // 1 minute

  // Get top cryptocurrencies with market data
  async getTopCoins(limit: number = 100): Promise<CoinData[]> {
    const cacheKey = `top_coins_${limit}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    try {
      const response = await axios.get(`${this.baseURL}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: true,
          price_change_percentage: '24h,7d'
        }
      });

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching top coins:', error);
      return this.getMockTopCoins();
    }
  }

  // Get specific coin data
  async getCoinData(coinId: string): Promise<CoinData | null> {
    const cacheKey = `coin_${coinId}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    try {
      const response = await axios.get(`${this.baseURL}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          ids: coinId,
          sparkline: true
        }
      });

      const data = response.data[0];
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching coin data for ${coinId}:`, error);
      return null;
    }
  }

  // Get historical chart data
  async getChartData(coinId: string, days: number = 7): Promise<ChartData[]> {
    const cacheKey = `chart_${coinId}_${days}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    try {
      const response = await axios.get(`${this.baseURL}/coins/${coinId}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: days,
          interval: days === 1 ? 'hourly' : 'daily'
        }
      });

      const chartData: ChartData[] = response.data.prices.map((item: [number, number], index: number) => ({
        timestamp: item[0],
        price: item[1],
        volume: response.data.total_volumes[index]?.[1] || 0
      }));

      this.setCache(cacheKey, chartData);
      return chartData;
    } catch (error) {
      console.error(`Error fetching chart data for ${coinId}:`, error);
      return this.getMockChartData(days);
    }
  }

  // Generate AI-based predictions (simplified version)
  async getPredictions(coinId: string): Promise<PredictionData> {
    try {
      const chartData = await this.getChartData(coinId, 30);
      const coinData = await this.getCoinData(coinId);
      
      if (!coinData || chartData.length === 0) {
        throw new Error('Insufficient data');
      }

      const currentPrice = coinData.current_price;
      const prices = chartData.map(d => d.price);
      
      // Calculate technical indicators
      const rsi = this.calculateRSI(prices);
      const macd = this.calculateMACD(prices);
      const ma = this.calculateMA(prices, 7);
      
      // Simple prediction algorithm
      const trend = this.determineTrend(prices, rsi, macd);
      const volatility = this.calculateVolatility(prices);
      
      // Generate predictions with some randomness for demo
      const predicted24h = currentPrice * (1 + (Math.random() - 0.5) * volatility * 0.3);
      const predicted7d = currentPrice * (1 + (Math.random() - 0.5) * volatility * 0.5);
      const predicted30d = currentPrice * (1 + (Math.random() - 0.5) * volatility * 0.8);
      
      return {
        coin: coinId,
        currentPrice,
        predicted24h,
        predicted7d,
        predicted30d,
        confidence: Math.max(60, 100 - volatility * 100),
        trend,
        signals: {
          rsi,
          macd: macd > 0 ? 'bullish' : 'bearish',
          movingAverage: currentPrice > ma ? 'above' : 'below'
        }
      };
    } catch (error) {
      console.error('Error generating predictions:', error);
      return this.getMockPrediction(coinId);
    }
  }

  // Get market analysis
  async getMarketAnalysis(): Promise<MarketAnalysis> {
    const cacheKey = 'market_analysis';
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    try {
      const coins = await this.getTopCoins(50);
      
      // Sort by 24h change
      const sortedCoins = [...coins].sort((a, b) => 
        b.price_change_percentage_24h - a.price_change_percentage_24h
      );
      
      const topGainers = sortedCoins.slice(0, 5);
      const topLosers = sortedCoins.slice(-5).reverse();
      
      // Calculate market metrics
      const totalMarketCap = coins.reduce((sum, coin) => sum + coin.market_cap, 0);
      const totalVolume = coins.reduce((sum, coin) => sum + coin.total_volume, 0);
      const btcMarketCap = coins.find(c => c.id === 'bitcoin')?.market_cap || 0;
      const btcDominance = (btcMarketCap / totalMarketCap) * 100;
      
      // Calculate sentiment (simplified)
      const avgChange = coins.reduce((sum, coin) => sum + coin.price_change_percentage_24h, 0) / coins.length;
      const sentimentScore = Math.max(0, Math.min(100, 50 + avgChange * 2));
      
      let sentiment: 'fear' | 'greed' | 'neutral' = 'neutral';
      if (sentimentScore < 30) sentiment = 'fear';
      else if (sentimentScore > 70) sentiment = 'greed';
      
      const analysis: MarketAnalysis = {
        sentiment,
        sentimentScore,
        marketCap: totalMarketCap,
        volume24h: totalVolume,
        btcDominance,
        topGainers,
        topLosers
      };
      
      this.setCache(cacheKey, analysis);
      return analysis;
    } catch (error) {
      console.error('Error fetching market analysis:', error);
      return this.getMockMarketAnalysis();
    }
  }

  // Technical indicator calculations
  private calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = prices.length - period; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateMACD(prices: number[]): number {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    return ema12 - ema26;
  }

  private calculateEMA(prices: number[], period: number): number {
    if (prices.length === 0) return 0;
    const k = 2 / (period + 1);
    let ema = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema = prices[i] * k + ema * (1 - k);
    }
    
    return ema;
  }

  private calculateMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1];
    const slice = prices.slice(-period);
    return slice.reduce((sum, p) => sum + p, 0) / period;
  }

  private calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0.1;
    
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
    
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    return Math.sqrt(variance);
  }

  private determineTrend(prices: number[], rsi: number, macd: number): 'bullish' | 'bearish' | 'neutral' {
    const recentPrices = prices.slice(-7);
    const avgRecent = recentPrices.reduce((sum, p) => sum + p, 0) / recentPrices.length;
    const avgOlder = prices.slice(-14, -7).reduce((sum, p) => sum + p, 0) / 7;
    
    let score = 0;
    if (avgRecent > avgOlder) score += 1;
    if (rsi > 50) score += 1;
    if (macd > 0) score += 1;
    
    if (score >= 2) return 'bullish';
    if (score <= 1) return 'bearish';
    return 'neutral';
  }

  // Cache management
  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Mock data for fallback
  private getMockTopCoins(): CoinData[] {
    return [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 43500,
        price_change_percentage_24h: 2.5,
        price_change_percentage_7d: 5.2,
        market_cap: 850000000000,
        total_volume: 25000000000,
        high_24h: 44000,
        low_24h: 42800,
        circulating_supply: 19500000,
        image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        current_price: 2280,
        price_change_percentage_24h: 3.2,
        price_change_percentage_7d: 6.8,
        market_cap: 275000000000,
        total_volume: 12000000000,
        high_24h: 2320,
        low_24h: 2210,
        circulating_supply: 120000000,
        image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'
      },
      {
        id: 'dogecoin',
        symbol: 'doge',
        name: 'Dogecoin',
        current_price: 0.092,
        price_change_percentage_24h: 8.5,
        price_change_percentage_7d: 15.2,
        market_cap: 13000000000,
        total_volume: 850000000,
        high_24h: 0.095,
        low_24h: 0.085,
        circulating_supply: 141000000000,
        image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png'
      }
    ];
  }

  private getMockChartData(days: number): ChartData[] {
    const data: ChartData[] = [];
    const now = Date.now();
    const interval = days === 1 ? 3600000 : 86400000; // hourly or daily
    const points = days === 1 ? 24 : days;
    
    let price = 43500;
    for (let i = points; i >= 0; i--) {
      price += (Math.random() - 0.5) * 1000;
      data.push({
        timestamp: now - (i * interval),
        price: Math.max(40000, Math.min(50000, price)),
        volume: Math.random() * 1000000000
      });
    }
    
    return data;
  }

  private getMockPrediction(coinId: string): PredictionData {
    return {
      coin: coinId,
      currentPrice: 43500,
      predicted24h: 44200,
      predicted7d: 45800,
      predicted30d: 48500,
      confidence: 72,
      trend: 'bullish',
      signals: {
        rsi: 58,
        macd: 'bullish',
        movingAverage: 'above'
      }
    };
  }

  private getMockMarketAnalysis(): MarketAnalysis {
    return {
      sentiment: 'greed',
      sentimentScore: 72,
      marketCap: 1750000000000,
      volume24h: 85000000000,
      btcDominance: 48.5,
      topGainers: this.getMockTopCoins().slice(0, 3),
      topLosers: this.getMockTopCoins().slice(0, 2)
    };
  }
}

export const cryptoMarketService = new CryptoMarketService();
