import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint, TimeFrame } from '../../types/crypto';

interface PriceChartProps {
  data: ChartDataPoint[];
  timeFrame: TimeFrame;
  color?: string;
  height?: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  data,
  timeFrame,
  color,
  height = 400,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-800/30 rounded-xl">
        <p className="text-gray-400">No chart data available</p>
      </div>
    );
  }

  // Determine if trend is positive
  const firstPrice = data[0]?.price || 0;
  const lastPrice = data[data.length - 1]?.price || 0;
  const isPositive = lastPrice >= firstPrice;

  // Use custom color or default based on trend
  const lineColor = color || (isPositive ? '#10b981' : '#ef4444');
  const gradientId = `gradient-${timeFrame}`;

  // Format data for chart
  const chartData = data.map((point, index) => ({
    ...point,
    index,
    formattedDate: formatDateByTimeFrame(point.timestamp, timeFrame),
  }));

  return (
    <div className="bg-gray-800/30 rounded-xl p-4">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          
          <XAxis
            dataKey="formattedDate"
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
            tickFormatter={(value) => `$${formatYAxis(value)}`}
          />
          
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: lineColor, strokeWidth: 1, strokeDasharray: '5 5' }}
          />
          
          <Line
            type="monotone"
            dataKey="price"
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
            fill={`url(#${gradientId})`}
            activeDot={{ r: 6, fill: lineColor }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="bg-gray-900/95 border border-gray-700 rounded-lg p-3 shadow-xl">
      <p className="text-gray-400 text-xs mb-1">
        {new Date(data.timestamp).toLocaleString()}
      </p>
      <p className="text-white font-bold text-lg">
        ${data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
      </p>
    </div>
  );
};

// Format date based on timeframe
const formatDateByTimeFrame = (timestamp: number, timeFrame: TimeFrame): string => {
  const date = new Date(timestamp);

  switch (timeFrame) {
    case '1H':
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    case '24H':
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    case '7D':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case '30D':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case '1Y':
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    default:
      return date.toLocaleDateString();
  }
};

// Format Y-axis values
const formatYAxis = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
};
