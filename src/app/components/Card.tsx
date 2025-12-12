import React, { ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  gradient,
  hover,
  onClick
}) => {
  return (
    <div
      className={clsx(
        'rounded-xl p-6',
        gradient
          ? 'bg-gradient-primary text-white'
          : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border',
        hover && 'transition-all duration-200 hover:shadow-lg cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
