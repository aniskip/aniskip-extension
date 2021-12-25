import React, { useRef } from 'react';
import { BiSearch } from 'react-icons/bi';
import {
  useShadowRootRef,
  useWindowEvent,
  useShadowRootEvent,
} from '../../utils';
import { AnimeSearchModalProps } from './AnimeSearchModal.types';

export function AnimeSearchModal({
  onClose,
}: AnimeSearchModalProps): JSX.Element {
  const shadowRoot = useShadowRootRef();
  const animeSearchModalRef = useRef<HTMLDivElement>(null);

  /**
   * Close the modal if the overlay was clicked.
   */
  useShadowRootEvent(shadowRoot!, 'mousedown', (event: Event): void => {
    const target = event.target as HTMLElement;

    if (animeSearchModalRef.current?.contains(target) || !onClose) {
      return;
    }

    onClose();
  });

  /**
   * Close the modal if the escape key was pressed.
   */
  useWindowEvent('keydown', (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || !onClose) {
      return;
    }

    onClose();
  });

  return (
    <div
      role="dialog"
      ref={animeSearchModalRef}
      className="bg-neutral-50 rounded-md font-sans shadow-md max-w-2xl md:mx-auto"
    >
      <div className="flex items-center px-4">
        <BiSearch className="w-5 h-5" />
        <div className="px-4 flex-auto">
          <input
            className="h-14 w-full bg-inherit focus:outline-none"
            placeholder="Search anime"
          />
        </div>
        <button
          className="font-semibold uppercase text-[0.625em] border border-gray-200 p-2 rounded-md hover:shadow-md hover:border-gray-300"
          type="button"
          onClick={onClose}
        >
          Esc
        </button>
      </div>
    </div>
  );
}
