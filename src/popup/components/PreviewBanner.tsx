import React from 'react';
import { AlertCircle } from 'lucide-react';

interface PreviewBannerProps {
  show: boolean;
}

/**
 * Banner shown in localhost preview to inform users about limitations
 */
export const PreviewBanner: React.FC<PreviewBannerProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 shadow-lg z-50">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0 animate-pulse" />
        <div className="flex-1 text-sm">
          <strong>Browser Preview Mode:</strong> You're viewing the UI for styling/layout work. 
          Extension features won't work here. Build with <code className="bg-white/20 px-1.5 py-0.5 rounded font-mono text-xs">npm run build:extension</code> to test functionality.
        </div>
      </div>
    </div>
  );
};
