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
 * Returns the MAL id, episode number and provider name.
 */
const getEpisodeInformation = async (): Promise<{
  malId: number;
  episodeNumber: number;
  providerName: string;
}> => {
  await page.applyRules();
  const malId = await page.getMalId();
  const providerName = page.getProviderName();
  const episodeNumber = page.getEpisodeNumber();

  return {
    malId,
    episodeNumber,
    providerName,
  };
};

/**
 * Handles messages between the player and the background script.
 *
 * @param message Message containing the type of action and the payload.
 */
const messageHandler = (message: Message): any => {
  switch (message.type) {
    case 'get-episode-information': {
      (async (): Promise<void> => {
        try {
          const episodeInformation = await getEpisodeInformation();

          browser.runtime.sendMessage({
            payload: episodeInformation,
            uuid: message.uuid,
          } as Message);
        } catch (error: any) {
          page.openOverlay();
        }
      })();
      break;
    }
    default:
    // no default
  }
};

browser.runtime.onMessage.addListener(messageHandler);
