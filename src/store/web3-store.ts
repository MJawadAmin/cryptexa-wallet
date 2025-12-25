import { create } from 'zustand';
import { PredictionData } from '../types/crypto';

interface PredictionStore {
  // State
  predictions: Record<string, PredictionData>;
  isCalculating: boolean;
  error: string | null;

  // Actions
  setPrediction: (coinId: string, prediction: PredictionData) => void;
  setPredictions: (predictions: Record<string, PredictionData>) => void;
  setCalculating: (calculating: boolean) => void;
  setError: (error: string | null) => void;
  clearPrediction: (coinId: string) => void;
  reset: () => void;
}

const initialState = {
  predictions: {},
  isCalculating: false,
  error: null,
};

export const usePredictionStore = create<PredictionStore>((set) => ({
  ...initialState,

  setPrediction: (coinId, prediction) =>
    set((state) => ({
      predictions: {
        ...state.predictions,
        [coinId]: prediction,
      },
      error: null,
    })),

  setPredictions: (predictions) => set({ predictions, error: null }),

  setCalculating: (isCalculating) => set({ isCalculating }),

  setError: (error) => set({ error, isCalculating: false }),

  clearPrediction: (coinId) =>
    set((state) => {
      const newPredictions = { ...state.predictions };
      delete newPredictions[coinId];
      return { predictions: newPredictions };
    }),

  reset: () => set(initialState),
}));
