import React from 'react';
import { OverlayProps } from './Overlay.types';

export function Overlay({ children }: OverlayProps): JSX.Element {
  return (
    <div className="fixed inset-0 w-screen h-screen z-[9999] bg-gray-500 bg-opacity-50 p-4">
      {children}
    </div>
  );
}
