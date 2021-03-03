import { browser, Runtime } from 'webextension-polyfill-ts';
import { v4 as uuidv4 } from 'uuid';
import Message from './types/message_type';
import { SkipOptionType } from './types/options/skip_option_type';

/**
 * Relay messages between content scripts
 * @param message Message containing the type of action and the payload
 * @param sender Sender of the message
 */
const messageHandler = (message: Message, sender: Runtime.MessageSender) => {
  const tabId = sender.tab?.id;
  if (tabId) {
    return browser.tabs.sendMessage(tabId, message);
  }
  return Promise.reject(new Error('Tab id not found'));
};

browser.runtime.onMessage.addListener(messageHandler);

/**
 * Set the user id on installation
 */
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    const defaultOptions: {
      userId: string;
      openingOption: SkipOptionType;
      endingOption: SkipOptionType;
    } = {
      userId: uuidv4(),
      openingOption: 'manual-skip',
      endingOption: 'manual-skip',
    };

    browser.storage.sync.set(defaultOptions);

    const localDefaultOptions: {
      episodeOffsetCache: Record<string, number>;
    } = {
      episodeOffsetCache: {},
    };

    browser.storage.local.set(localDefaultOptions);
  }
});
