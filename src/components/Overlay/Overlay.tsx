import React from 'react';
import { Transition } from '@headlessui/react';
import { closeOverlay, selectIsOverlayOpen } from '../../data';
import { useDispatch, useSelector } from '../../hooks';
import { AnimeSearchModal } from '../AnimeSearchModal';

export function Overlay(): JSX.Element {
  const isOpen = useSelector(selectIsOverlayOpen);
  const dispatch = useDispatch();

  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }

  /**
   * Close the overlay.
   */
  const onClose = (): void => {
    dispatch(closeOverlay());
  };

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
        <AnimeSearchModal onClose={onClose} />
      </div>
    </Transition>
  );
}
