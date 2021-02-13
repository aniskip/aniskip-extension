import { browser, Runtime } from 'webextension-polyfill-ts';
import { v4 as uuidv4 } from 'uuid';
import Message from './types/message_type';

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

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    browser.storage.sync.set({ userId: uuidv4() });
  }
});
