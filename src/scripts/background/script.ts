import { browser, Runtime } from 'webextension-polyfill-ts';
import { v4 as uuidv4 } from 'uuid';
import {
  LocalOptions,
  Message,
  DEFAULT_LOCAL_OPTIONS,
  DEFAULT_SYNC_OPTIONS,
  SyncOptions,
} from './types';
import { waitForMessage } from '../../utils';

/**
 * Relay messages between content scripts.
 *
 * @param message Message containing the type of action and the payload.
 * @param sender Sender of the message.
 */
const messageHandler = (
  message: Message,
  sender: Runtime.MessageSender
): Promise<any> => {
  const tabId = sender.tab?.id;

  if (!tabId) {
    return Promise.reject(new Error('Tab id not found'));
  }

  switch (message.type) {
    case 'fetch': {
      return (async (): Promise<any> => {
        try {
          const { url, options } = message.payload;
          const response = await fetch(url, options);
          const body = await response.text();

          return { body, status: response.status, ok: response.ok };
        } catch (err) {
          return { error: err };
        }
      })();
    }
    default: {
      return (async (): Promise<any> => {
        const uuid = uuidv4();
        browser.tabs.sendMessage(tabId, { ...message, uuid } as Message);
        const response = await waitForMessage(uuid);

        return response?.payload;
      })();
    }
  }
};

browser.runtime.onMessage.addListener(messageHandler);

/**
 * Adds the default sync options if they do not exist.
 */
const addDefaultSyncOptions = async (): Promise<void> => {
  const currentSyncOptions = await browser.storage.sync.get(
    DEFAULT_SYNC_OPTIONS
  );

  // If the key does not exist, add a default for it.
  Object.keys(DEFAULT_SYNC_OPTIONS).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(currentSyncOptions, key)) {
      const typedKey = key as keyof SyncOptions;

      currentSyncOptions[typedKey] = DEFAULT_SYNC_OPTIONS[typedKey];
    }
  });

  // Add default skip options if they are not present.
  Object.keys(DEFAULT_SYNC_OPTIONS.skipOptions).forEach((key) => {
    if (
      !Object.prototype.hasOwnProperty.call(currentSyncOptions.skipOptions, key)
    ) {
      const typedKey = key as keyof SyncOptions['skipOptions'];

      currentSyncOptions.skipOptions[typedKey] =
        DEFAULT_SYNC_OPTIONS.skipOptions[typedKey];
    }
  });

  // Add default skip indicator colours if they are not present.
  Object.keys(DEFAULT_SYNC_OPTIONS.skipIndicatorColours).forEach((key) => {
    if (
      !Object.prototype.hasOwnProperty.call(
        currentSyncOptions.skipIndicatorColours,
        key
      )
    ) {
      const typedKey = key as keyof SyncOptions['skipIndicatorColours'];

      currentSyncOptions.skipIndicatorColours[typedKey] =
        DEFAULT_SYNC_OPTIONS.skipIndicatorColours[typedKey];
    }
  });

  browser.storage.sync.set(currentSyncOptions);
};

/**
 * Resets the local cache.
 */
const resetCache = async (): Promise<void> => {
  const currentLocalOptions = (await browser.storage.local.get(
    DEFAULT_LOCAL_OPTIONS
  )) as LocalOptions;

  // Reset cache.
  currentLocalOptions.malIdCache = {};
  currentLocalOptions.rulesCache = {};

  browser.storage.local.set(currentLocalOptions);
};

/**
 * Set default user settings on installation.
 */
browser.runtime.onInstalled.addListener((details) => {
  switch (details.reason) {
    case 'install': {
      browser.storage.sync.set(DEFAULT_SYNC_OPTIONS);
      browser.storage.local.set(DEFAULT_LOCAL_OPTIONS);
      browser.runtime.openOptionsPage();
      break;
    }
    case 'update': {
      Promise.all([addDefaultSyncOptions(), resetCache()]);
      break;
    }
    default:
  }
});
