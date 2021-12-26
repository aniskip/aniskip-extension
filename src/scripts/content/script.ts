import { browser } from 'webextension-polyfill-ts';
import { Message } from '../background';
import { PageFactory } from '../../pages/page-factory';

const page = PageFactory.getPage(window.location.href);

// Inject search overlay once when the document body loads.
new MutationObserver((_mutations, observer) => {
  if (document.body) {
    page.injectOverlay();
    observer.disconnect();
  }
}).observe(document, { subtree: true, childList: true });

/**
 * Handles messages from the player script.
 *
 * @param message Message containing the type of action and the payload.
 */
const messageHandler = (message: Message): any => {
  switch (message.type) {
    case 'get-episode-information': {
      (async (): Promise<void> => {
        await page.applyRules();
        const malId = await page.getMalId();
        const providerName = page.getProviderName();
        const episodeNumber = page.getEpisodeNumber();

        if (malId === 0) {
          browser.runtime.sendMessage({
            payload: { error: 'MAL id not found' },
            uuid: message.uuid,
          } as Message);

          page.openOverlay();

          return;
        }

        browser.runtime.sendMessage({
          payload: { malId, providerName, episodeNumber },
          uuid: message.uuid,
        } as Message);
      })();
      break;
    }
    default:
    // no default
  }
};

browser.runtime.onMessage.addListener(messageHandler);
