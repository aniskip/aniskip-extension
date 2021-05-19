import { browser } from 'webextension-polyfill-ts';

import { Message } from '../types/message_type';

/**
 * Waits for a message with the specified type
 * @param uuid UUID of the message to wait for
 */
const waitForMessage = (uuid: string) =>
  new Promise<Message | null>((resolve) => {
    const timeout = setTimeout(() => {
      resolve(null);
    }, 500);

    const handler = (message: Message) => {
      if (message.uuid === uuid) {
        clearTimeout(timeout);
        resolve(message);
        browser.runtime.onMessage.removeListener(handler);
      }
    };

    browser.runtime.onMessage.addListener(handler);
  });

export default waitForMessage;
