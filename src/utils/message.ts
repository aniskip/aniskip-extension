import { browser } from 'webextension-polyfill-ts';
import { Message } from '../scripts/background';

/**
 * Waits for a message with the specified type.
 *
 * @param uuid UUID of the message to wait for.
 */
export const waitForMessage = (uuid: string): Promise<Message | undefined> =>
  new Promise<Message | undefined>((resolve) => {
    const timeout = setTimeout(() => {
      resolve(undefined);
    }, 2000);

    const handler = (message: Message): void => {
      if (message.uuid === uuid) {
        clearTimeout(timeout);
        resolve(message);
        browser.runtime.onMessage.removeListener(handler);
      }
    };

    browser.runtime.onMessage.addListener(handler);
  });
