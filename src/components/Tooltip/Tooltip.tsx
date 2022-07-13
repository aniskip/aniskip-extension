import React from 'react';
import { TooltipProps } from './Tooltip.types';

export function Tooltip({ isVisible, children }: TooltipProps): JSX.Element {
  return (
    <div
      className={`pointer-events-none absolute bottom-full mb-1 flex select-none flex-col items-center transition ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
      }`}
    >
      <span className="flex items-center whitespace-nowrap rounded-md bg-white py-2 px-4 text-sm shadow-md">
        {children}
      </span>
      <div className="inline-block w-4 overflow-hidden shadow-md">
        <div className=" h-2 w-2 origin-top-left translate-x-1/4 -rotate-45 transform bg-white" />
      </div>
    </div>
  );
}
