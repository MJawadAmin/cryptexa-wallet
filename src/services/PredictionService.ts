import { PredictionData, CoinData, ChartDataPoint } from '../types/crypto';

/**
 * AI-Style Price Prediction Service
 * Uses technical analysis indicators to generate predictions
 */
class PredictionService {
  /**
   * Calculate moving average
   */
  private calculateMovingAverage(prices: number[], period: number = 7): number {
    if (prices.length < period) {
      period = prices.length;
    }

    const recentPrices = prices.slice(-period);
    const sum = recentPrices.reduce((acc, price) => acc + price, 0);
    return sum / period;
  }

  /**
   * Calculate momentum (rate of change)
   */
  private calculateMomentum(prices: number[], period: number = 5): number {
    if (prices.length < period + 1) {
      return 0;
    }

    const currentPrice = prices[prices.length - 1];
    const pastPrice = prices[prices.length - period - 1];
    return ((currentPrice - pastPrice) / pastPrice) * 100;
  }

  /**
   * Calculate volatility (standard deviation)
   */
  private calculateVolatility(prices: number[]): number {
    if (prices.length < 2) {
      return 0;
    }

    const mean = prices.reduce((acc, price) => acc + price, 0) / prices.length;
    const squaredDiffs = prices.map((price) => Math.pow(price - mean, 2));
    const variance = squaredDiffs.reduce((acc, diff) => acc + diff, 0) / prices.length;
    return Math.sqrt(variance);
  }

  /**
   * Determine trend direction
   */
  private determineTrend(prices: number[]): 'UP' | 'DOWN' | 'SIDEWAYS' {
    if (prices.length < 2) {
      return 'SIDEWAYS';
    }

    const recentPrices = prices.slice(-10);
    const firstHalf = recentPrices.slice(0, 5);
    const secondHalf = recentPrices.slice(-5);

    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const diff = ((avgSecond - avgFirst) / avgFirst) * 100;

    if (diff > 2) return 'UP';
    if (diff < -2) return 'DOWN';
    return 'SIDEWAYS';
  }

  /**
   * Generate prediction signal
   */
  private generateSignal(
    currentPrice: number,
    ma: number,
    momentum: number,
    trend: 'UP' | 'DOWN' | 'SIDEWAYS'
  ): 'BULLISH' | 'BEARISH' | 'NEUTRAL' {
    let bullishScore = 0;
    let bearishScore = 0;

    // Price vs Moving Average
    if (currentPrice > ma) {
      bullishScore += 2;
    } else {
      bearishScore += 2;
    }

    // Momentum
    if (momentum > 5) {
      bullishScore += 2;
    } else if (momentum < -5) {
      bearishScore += 2;
    } else {
      bullishScore += 0.5;
      bearishScore += 0.5;
    }

    // Trend
    if (trend === 'UP') {
      bullishScore += 2;
    } else if (trend === 'DOWN') {
      bearishScore += 2;
    } else {
      bullishScore += 1;
      bearishScore += 1;
    }

    if (bullishScore > bearishScore + 1) {
      return 'BULLISH';
    } else if (bearishScore > bullishScore + 1) {
      return 'BEARISH';
    }
    return 'NEUTRAL';
  }

  /**
   * Calculate confidence level (0-100)
   */
  private calculateConfidence(
    signal: 'BULLISH' | 'BEARISH' | 'NEUTRAL',
    momentum: number,
    volatility: number,
    currentPrice: number
  ): number {
    let confidence = 50; // Base confidence

    // Strong momentum increases confidence
    const absMomentum = Math.abs(momentum);
    if (absMomentum > 10) {
      confidence += 20;
    } else if (absMomentum > 5) {
      confidence += 10;
    }

    // High volatility decreases confidence
    const volatilityPercent = (volatility / currentPrice) * 100;
    if (volatilityPercent > 10) {
      confidence -= 15;
    } else if (volatilityPercent > 5) {
      confidence -= 8;
    }

    // Neutral signals have lower confidence
    if (signal === 'NEUTRAL') {
      confidence -= 10;
    }

    // Ensure confidence is between 40 and 95
    return Math.max(40, Math.min(95, confidence));
  }

  /**
   * Generate price prediction
   */
  public generatePrediction(
    coin: CoinData,
    priceHistory: ChartDataPoint[]
  ): PredictionData {
    const prices = priceHistory.map((point) => point.price);
    const currentPrice = coin.current_price;

    // Calculate indicators
    const ma7 = this.calculateMovingAverage(prices, 7);
    const momentum = this.calculateMomentum(prices, 5);
    const volatility = this.calculateVolatility(prices);
    const trend = this.determineTrend(prices);

    // Generate signal
    const signal = this.generateSignal(currentPrice, ma7, momentum, trend);

    // Calculate confidence
    const confidence = this.calculateConfidence(signal, momentum, volatility, currentPrice);

    // Predict price change (simplified model)
    let predictedChangePercent = 0;
    if (signal === 'BULLISH') {
      predictedChangePercent = Math.min(15, Math.abs(momentum) * 0.8 + 3);
    } else if (signal === 'BEARISH') {
      predictedChangePercent = -Math.min(15, Math.abs(momentum) * 0.8 + 3);
    } else {
      predictedChangePercent = momentum * 0.3;
    }

    const predictedPrice = currentPrice * (1 + predictedChangePercent / 100);

    return {
      coinId: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      currentPrice,
      predictedPrice,
      predictedChange: predictedChangePercent,
      signal,
      confidence,
      timestamp: Date.now(),
      indicators: {
        movingAverage: ma7,
        momentum,
        volatility,
        trend,
      },
    };
  }

  /**
   * Batch generate predictions for multiple coins
   */
  public generateBatchPredictions(
    coins: CoinData[],
    priceHistories: Record<string, ChartDataPoint[]>
  ): Record<string, PredictionData> {
    const predictions: Record<string, PredictionData> = {};

    coins.forEach((coin) => {
      const history = priceHistories[coin.id];
      if (history && history.length > 0) {
        predictions[coin.id] = this.generatePrediction(coin, history);
      }
    });

    return predictions;
  }
}

// Export singleton instance
export const predictionService = new PredictionService();
export default predictionService;
