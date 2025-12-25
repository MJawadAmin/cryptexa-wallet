import { useCallback, useEffect } from 'react';
import { usePredictionStore } from '../store/web3-store';
import { useCryptoStore } from '../store/crypto-store';
import { predictionService } from '../services/PredictionService';
import { PredictionData } from '../types/crypto';

/**
 * Custom hook for price predictions
 */
export const usePredictions = () => {
  const {
    predictions,
    isCalculating,
    error,
    setPrediction,
    setPredictions,
    setCalculating,
    setError,
    clearPrediction,
  } = usePredictionStore();

  const { coins, priceHistory } = useCryptoStore();

  /**
   * Generate prediction for a single coin
   */
  const generatePrediction = useCallback(
    async (coinId: string): Promise<PredictionData | null> => {
      const coin = coins.find((c) => c.id === coinId);
      const history = priceHistory[coinId];

      if (!coin || !history || history.length === 0) {
        setError('Insufficient data to generate prediction');
        return null;
      }

      setCalculating(true);
      setError(null);

      try {
        // Simulate AI processing delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const prediction = predictionService.generatePrediction(coin, history);
        setPrediction(coinId, prediction);
        return prediction;
      } catch (err: any) {
        console.error('Error generating prediction:', err);
        setError(err.message || 'Failed to generate prediction');
        return null;
      } finally {
        setCalculating(false);
      }
    },
    [coins, priceHistory, setPrediction, setCalculating, setError]
  );

  /**
   * Generate predictions for all available coins
   */
  const generateAllPredictions = useCallback(async () => {
    if (coins.length === 0) {
      setError('No coin data available');
      return;
    }

    setCalculating(true);
    setError(null);

    try {
      // Simulate AI processing delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const batchPredictions = predictionService.generateBatchPredictions(
        coins,
        priceHistory
      );
      setPredictions(batchPredictions);
    } catch (err: any) {
      console.error('Error generating batch predictions:', err);
      setError(err.message || 'Failed to generate predictions');
    } finally {
      setCalculating(false);
    }
  }, [coins, priceHistory, setPredictions, setCalculating, setError]);

  /**
   * Get prediction for a specific coin
   */
  const getPrediction = useCallback(
    (coinId: string): PredictionData | undefined => {
      return predictions[coinId];
    },
    [predictions]
  );

  /**
   * Refresh prediction for a coin
   */
  const refreshPrediction = useCallback(
    async (coinId: string) => {
      clearPrediction(coinId);
      return await generatePrediction(coinId);
    },
    [clearPrediction, generatePrediction]
  );

  /**
   * Auto-generate predictions when data is available
   */
  useEffect(() => {
    if (
      coins.length > 0 &&
      Object.keys(priceHistory).length > 0 &&
      Object.keys(predictions).length === 0
    ) {
      // Auto-generate predictions on first load
      const timer = setTimeout(() => {
        generateAllPredictions();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [coins, priceHistory, predictions]);

  return {
    // State
    predictions,
    isCalculating,
    error,

    // Actions
    generatePrediction,
    generateAllPredictions,
    getPrediction,
    refreshPrediction,
    clearPrediction,
  };
};
