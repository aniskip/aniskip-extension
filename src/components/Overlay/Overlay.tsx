import { Transition } from '@headlessui/react';
import React, { useState } from 'react';
import { AnimeSearchModal } from '../AnimeSearchModal';
import { OverlayProps } from './Overlay.types';

export function Overlay({ isOpen: _unused }: OverlayProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }

  return (
    <Transition
      show={isOpen}
      as={React.Fragment}
      enter="transition-opacity"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 w-screen h-screen z-[9999] backdrop-blur-sm p-4 md:p-[10vh]">
        <AnimeSearchModal onClose={(): void => setIsOpen(false)} />
      </div>
    </Transition>
  );
}
