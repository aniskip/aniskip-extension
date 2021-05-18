import { browser, Runtime } from 'webextension-polyfill-ts';

import { Message, MessageType } from '../types/message_type';

/**
 * Waits for a message with the specified type
 * @param type Message type to wait for
 */
const waitForMessage = (type: MessageType) =>
  new Promise<Message>((resolve, reject) => {
    const timeout = setTimeout(() => {
      const err = new Error('No messaged was received after 500ms');
      reject(err);
    }, 500);

    const handler = (message: Message, _sender: Runtime.MessageSender) => {
      if (message.type === type) {
        clearTimeout(timeout);
        resolve(message);
        browser.runtime.onMessage.removeListener(handler);
      }
    };

    browser.runtime.onMessage.addListener(handler);
  });

export default waitForMessage;
