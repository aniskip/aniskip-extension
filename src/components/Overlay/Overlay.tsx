import React, { useEffect } from 'react';
import { AnimeSearchModal } from '../AnimeSearchModal';
import { OverlayProps } from './Overlay.types';

export function Overlay({ isOpen }: OverlayProps): JSX.Element {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return (): void => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <div className="fixed inset-0 w-screen h-screen z-[9999] backdrop-blur-sm p-4 md:p-[10vh]">
      <AnimeSearchModal />
    </div>
  );
}
