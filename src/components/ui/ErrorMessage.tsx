import React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`
        bg-red-500/10 border border-red-500/50 rounded-xl p-6
        flex items-start gap-3 ${className}
      `}
    >
      <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
      <div className="flex-1">
        <h4 className="text-red-500 font-semibold mb-1">Error</h4>
        <p className="text-gray-300 text-sm">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

interface InfoMessageProps {
  message: string;
  className?: string;
}

export const InfoMessage: React.FC<InfoMessageProps> = ({ message, className = '' }) => {
  return (
    <div
      className={`
        bg-cyan-500/10 border border-cyan-500/50 rounded-xl p-6
        flex items-start gap-3 ${className}
      `}
    >
      <AlertCircle className="text-cyan-500 flex-shrink-0 mt-0.5" size={20} />
      <div className="flex-1">
        <p className="text-gray-300 text-sm">{message}</p>
      </div>
    </div>
  );
};
