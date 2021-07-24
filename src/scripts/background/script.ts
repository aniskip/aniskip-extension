import { browser, Runtime } from 'webextension-polyfill-ts';
import { v4 as uuidv4 } from 'uuid';
import { DefaultOptions, LocalDefaultOptions, Message } from './types';
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
 * Set default user settings on installation.
 */
browser.runtime.onInstalled.addListener((details) => {
  const defaultOptions: DefaultOptions = {
    userId: uuidv4(),
    skipOptions: {
      op: 'manual-skip',
      ed: 'manual-skip',
    },
  };

  const localDefaultOptions: LocalDefaultOptions = {
    malIdCache: {},
    skipTimesVoted: {},
  };

  switch (details.reason) {
    case 'install': {
      browser.storage.sync.set(defaultOptions);
      browser.storage.local.set(localDefaultOptions);
      browser.runtime.openOptionsPage();
      break;
    }
    case 'update': {
      Promise.all([
        (async (): Promise<void> => {
          const currentOptions = await browser.storage.sync.get(defaultOptions);
          browser.storage.sync.set(currentOptions);
        })(),
        (async (): Promise<void> => {
          const currentLocalOptions = await browser.storage.local.get(
            localDefaultOptions
          );
          browser.storage.local.set(currentLocalOptions);
        })(),
      ]);
      break;
    }
    default:
  }
});
