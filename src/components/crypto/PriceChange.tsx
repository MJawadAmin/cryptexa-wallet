import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceChangeProps {
  value: number;
  className?: string;
  showIcon?: boolean;
  prefix?: string;
}

export const PriceChange: React.FC<PriceChangeProps> = ({
  value,
  className = '',
  showIcon = true,
  prefix = '',
}) => {
  const isPositive = value >= 0;
  const colorClass = isPositive ? 'text-green-500' : 'text-red-500';
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <span className={`inline-flex items-center gap-1 font-medium ${colorClass} ${className}`}>
      {showIcon && <Icon size={16} />}
      {prefix}
      {isPositive && '+'}
      {value.toFixed(2)}%
    </span>
  );
};
