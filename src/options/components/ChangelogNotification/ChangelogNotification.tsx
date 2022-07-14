import { Transition } from '@headlessui/react';
import React, { Fragment, useEffect } from 'react';
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
      as={Fragment}
      show={isChangelogNotificationVisible}
      enter="transition-translate translate"
      enterFrom="translate-y-full"
      enterTo="translate-y-0"
      leave="transition-transform translate"
      leaveFrom="translate-y-0"
      leaveTo="translate-y-full"
    >
      <div className="sticky bottom-0 flex w-full border-t border-gray-300 bg-white">
        <div className="flex w-full items-center justify-center">
          <span className="py-2 pl-4 text-sm font-medium text-gray-500">
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
          className="relative bottom-0 right-0 p-3"
          type="button"
          onClick={onDismiss}
        >
          <FaTimes className="h-3 w-3 hover:text-primary" />
        </button>
      </div>
    </Transition>
  );
}
