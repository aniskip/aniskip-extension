import { v4 as uuidv4 } from 'uuid';
import Message from './types/message_type';

/**
 * Relay messages between content scripts
 * @param message Message containing the type of action and the payload
 * @param _sender Sender of the message
 * @param _sendResponse Response to the sender of the message
 */
const messageHandler = (
  message: Message,
  sender: chrome.runtime.MessageSender,
  _sendResponse: (response?: Message) => void
) => {
  if (sender.tab?.id) {
    chrome.tabs.sendMessage(sender.tab.id, message);
  }
};

chrome.runtime.onMessage.addListener(messageHandler);

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.sync.set({ userId: uuidv4() });
  }
});
