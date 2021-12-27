import React, { useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { browser } from 'webextension-polyfill-ts';
import {
  closeOverlay,
  openOverlay,
  selectIsOverlayOpen,
  selectKeybinds,
  setKeybinds,
} from '../../data';
import { useDispatch, useSelector } from '../../hooks';
import { AnimeSearchModal } from '../AnimeSearchModal';
import { useWindowEvent } from '../../utils';
import { serialiseKeybind } from '../../utils/keybinds';
import { DEFAULT_KEYBINDS, SyncOptions } from '../../scripts/background';

export function Overlay(): JSX.Element {
  const keybinds = useSelector(selectKeybinds);
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

  /**
   * Open the modal if the shortcut was pressed.
   */
  useWindowEvent('keydown', (event: KeyboardEvent): void => {
    if (!onClose) {
      return;
    }

    if (serialiseKeybind(event) !== keybinds['open-anime-search-overlay']) {
      return;
    }

    dispatch(openOverlay());
  });

  /**
   * Initialise the keybinds.
   */
  useEffect(() => {
    (async (): Promise<void> => {
      const syncedKeybinds = (
        (await browser.storage.sync.get({
          keybinds: DEFAULT_KEYBINDS,
        })) as SyncOptions
      ).keybinds;

      dispatch(setKeybinds(syncedKeybinds));
    })();
  }, []);

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
