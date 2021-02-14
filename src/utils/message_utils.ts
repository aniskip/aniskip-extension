import { browser, Runtime } from 'webextension-polyfill-ts';
import Message from '../types/message_type';

/**
 * Waits for a message with the specified type
 * @param type Message type to wait for
 */
const waitForMessage = (type: string) =>
  new Promise<Message>((resolve, _reject) => {
    const handler = (message: Message, _sender: Runtime.MessageSender) => {
      if (message.type === type) {
        resolve(message);
        browser.runtime.onMessage.removeListener(handler);
      }
    };
    browser.runtime.onMessage.addListener(handler);
  });

export default waitForMessage;
