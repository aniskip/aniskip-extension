import { browser, Runtime } from 'webextension-polyfill-ts';
import { v4 as uuidv4 } from 'uuid';
import { Message } from './types/message_type';
import {
  DefaultOptionsType,
  LocalDefaultOptionsType,
} from './types/background_script_types';

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
            const json = await response.json();
            browser.tabs.sendMessage(tabId, {
              type: 'fetch-response',
              payload: {
                json,
                status: response.status,
                ok: response.ok,
              },
            } as Message);
          } catch (err) {
            browser.tabs.sendMessage(tabId, {
              type: 'fetch-response',
              payload: { json: { error: err.message } },
            } as Message);
          }
        })();
      }
      default: {
        return browser.tabs.sendMessage(tabId, message);
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
