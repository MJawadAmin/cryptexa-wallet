import { create } from 'zustand';
import { CoinData, ChartDataPoint, TimeFrame } from '../types/crypto';

interface CryptoStore {
  // State
  coins: CoinData[];
  selectedCoin: CoinData | null;
  priceHistory: Record<string, ChartDataPoint[]>;
  isLoading: boolean;
  error: string | null;
  lastUpdate: number;
  timeFrame: TimeFrame;

  // Actions
  setCoins: (coins: CoinData[]) => void;
  setSelectedCoin: (coin: CoinData | null) => void;
  setPriceHistory: (coinId: string, history: ChartDataPoint[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTimeFrame: (timeFrame: TimeFrame) => void;
  updateLastUpdate: () => void;
  reset: () => void;
}

const initialState = {
  coins: [],
  selectedCoin: null,
  priceHistory: {},
  isLoading: false,
  error: null,
  lastUpdate: 0,
  timeFrame: '24H' as TimeFrame,
};

export const useCryptoStore = create<CryptoStore>((set) => ({
  ...initialState,

  setCoins: (coins) => set({ coins, error: null }),

  setSelectedCoin: (coin) => set({ selectedCoin: coin }),

  setPriceHistory: (coinId, history) =>
    set((state) => ({
      priceHistory: {
        ...state.priceHistory,
        [coinId]: history,
      },
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  setTimeFrame: (timeFrame) => set({ timeFrame }),

  updateLastUpdate: () => set({ lastUpdate: Date.now() }),

  reset: () => set(initialState),
}));
