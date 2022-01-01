import { Transition } from '@headlessui/react';
import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { browser } from 'webextension-polyfill-ts';
import { LinkButton } from '../../../components';
import {
  changelogNotificationDismissed,
  changelogNotificationUpdated,
  selectIsChangelogNotificationVisible,
} from '../../../data';
import { SyncOptions } from '../../../scripts/background';
import { useDispatch, useSelector } from '../../../utils';

export function ChangelogNotification(): JSX.Element {
  const dispatch = useDispatch();

  const isChangelogNotificationVisible = useSelector(
    selectIsChangelogNotificationVisible
  );

  const { version } = browser.runtime.getManifest();

  /**
   * Closes the changelog notification.
   */
  const onDismiss = (): void => {
    dispatch(changelogNotificationDismissed());

    browser.storage.sync.set({
      isChangelogNotificationVisible: false,
    } as Partial<SyncOptions>);
  };

  /**
   * Initialise changelog notification visibility.
   */
  useEffect(() => {
    (async (): Promise<void> => {
      const syncOptions = (await browser.storage.sync.get({
        isChangelogNotificationVisible: false,
      } as Partial<SyncOptions>)) as SyncOptions;

      dispatch(
        changelogNotificationUpdated(syncOptions.isChangelogNotificationVisible)
      );
    })();
  }, []);

  return (
    <Transition
      as={React.Fragment}
      show={isChangelogNotificationVisible}
      enter="transition-translate translate"
      enterFrom="translate-y-full"
      enterTo="translate-y-0"
      leave="transition-transform translate"
      leaveFrom="translate-y-0"
      leaveTo="translate-y-full"
    >
      <div className="flex sticky bottom-0 border-t border-gray-300 w-full bg-white">
        <div className="flex items-center justify-center w-full">
          <span className="pl-4 py-2 text-sm font-medium text-gray-500">
            You are now using the latest version of Aniskip! View the changelog
            here{' '}
            <LinkButton className="text-blue-500" onClick={onDismiss}>
              <a
                href={`https://github.com/lexesjan/typescript-aniskip-extension/releases/tag/v${version}`}
                rel="noreferrer"
                target="_blank"
              >
                v{version}
              </a>
            </LinkButton>
            .
          </span>
        </div>
        <button
          className="p-3 relative bottom-0 right-0"
          type="button"
          onClick={onDismiss}
        >
          <FaTimes className="w-3 h-3 hover:text-primary" />
        </button>
      </div>
    </Transition>
  );
}
