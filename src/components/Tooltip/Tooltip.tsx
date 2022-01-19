import React from 'react';
import { TooltipProps } from './Tooltip.types';

export function Tooltip({ isVisible, children }: TooltipProps): JSX.Element {
  return (
    <div
      className={`transition flex flex-col items-center absolute bottom-full mb-1 select-none pointer-events-none ${
        isVisible
          ? 'delay-500 opacity-100 translate-y-0'
          : 'opacity-0 translate-y-1'
      }`}
    >
      <span className="whitespace-nowrap bg-white flex items-center py-2 px-4 shadow-md rounded-md text-sm">
        {children}
      </span>
      <div className="w-4 overflow-hidden inline-block shadow-md">
        <div className=" h-2 w-2 bg-white -rotate-45 transform origin-top-left translate-x-1/4" />
      </div>
    </div>
  );
}
