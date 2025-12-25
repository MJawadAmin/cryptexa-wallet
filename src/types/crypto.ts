// Crypto Dashboard Types
export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface ChartDataPoint {
  timestamp: number;
  price: number;
  date?: string;
}

export interface PriceHistory {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface PredictionData {
  coinId: string;
  symbol: string;
  name: string;
  currentPrice: number;
  predictedPrice: number;
  predictedChange: number;
  signal: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence: number;
  timestamp: number;
  indicators: {
    movingAverage: number;
    momentum: number;
    volatility: number;
    trend: 'UP' | 'DOWN' | 'SIDEWAYS';
  };
}

export interface WalletState {
  address: string | null;
  balance: string;
  network: string;
  isConnected: boolean;
  chainId: number | null;
}

export type TimeFrame = '1H' | '24H' | '7D' | '30D' | '1Y';

export interface CryptoState {
  coins: CoinData[];
  selectedCoin: CoinData | null;
  priceHistory: Record<string, ChartDataPoint[]>;
  isLoading: boolean;
  error: string | null;
  lastUpdate: number;
  timeFrame: TimeFrame;
}

export interface PredictionState {
  predictions: Record<string, PredictionData>;
  isCalculating: boolean;
}

export const SUPPORTED_COINS = [
  'bitcoin',
  'ethereum',
  'binancecoin',
  'solana',
  'ripple',
  'cardano',
] as const;

export type SupportedCoin = typeof SUPPORTED_COINS[number];
