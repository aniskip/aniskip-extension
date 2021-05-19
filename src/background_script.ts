import { browser, Runtime } from 'webextension-polyfill-ts';
import { v4 as uuidv4 } from 'uuid';
import { Message } from './types/message_type';
import {
  DefaultOptionsType,
  LocalDefaultOptionsType,
} from './types/background_script_types';
import waitForMessage from './utils/message_utils';

/**
 * Relay messages between content scripts
 * @param message Message containing the type of action and the payload
 * @param sender Sender of the message
 */
const messageHandler = (message: Message, sender: Runtime.MessageSender) => {
  const tabId = sender.tab?.id;
  if (tabId) {
    switch (message.type) {
      case 'fetch': {
        const { url, options } = message.payload;
        return (async () => {
          try {
            const response = await fetch(url, options);
            const body = await response.text();

            return { body, status: response.status, ok: response.ok };
          } catch (err) {
            return { error: err };
          }
        })();
      }
      default: {
        const uuid = uuidv4();
        browser.tabs.sendMessage(tabId, { ...message, uuid });
        return waitForMessage(uuid);
      }
    }
  }
  return Promise.reject(new Error('Tab id not found'));
};

browser.runtime.onMessage.addListener(messageHandler);

/**
 * Set the user id on installation
 */
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    const defaultOptions: DefaultOptionsType = {
      userId: uuidv4(),
      opOption: 'manual-skip',
      edOption: 'manual-skip',
    };

    browser.storage.sync.set(defaultOptions);

    const localDefaultOptions: LocalDefaultOptionsType = {
      malIdCache: {},
      skipTimesVoted: {},
    };

    browser.storage.local.set(localDefaultOptions);

    browser.runtime.openOptionsPage();
  }
});
