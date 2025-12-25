import React from 'react';
import { TimeFrame } from '../../types/crypto';

interface TimeFrameSelectorProps {
  selected: TimeFrame;
  onChange: (timeFrame: TimeFrame) => void;
}

const timeFrames: TimeFrame[] = ['1H', '24H', '7D', '30D', '1Y'];

export const TimeFrameSelector: React.FC<TimeFrameSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="flex gap-2 bg-gray-800/50 rounded-lg p-1">
      {timeFrames.map((tf) => (
        <button
          key={tf}
          onClick={() => onChange(tf)}
          className={`
            px-4 py-2 rounded-md text-sm font-medium transition-all
            ${
              selected === tf
                ? 'bg-cyan-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }
          `}
        >
          {tf}
        </button>
      ))}
    </div>
  );
};
