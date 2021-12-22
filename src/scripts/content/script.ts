import { browser } from 'webextension-polyfill-ts';
import { Message } from '../background';
import { PageFactory } from '../../pages/page-factory';

/**
 * Returns the MAL id, episode number and provider name.
 */
const getEpisodeInformation = async (): Promise<{
  malId: number;
  episodeNumber: number;
  providerName: string;
}> => {
  const { hostname, pathname, href } = window.location;
  const page = PageFactory.getPage(hostname, pathname, href);

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
        const episodeInformation = await getEpisodeInformation();
        browser.runtime.sendMessage({
          payload: episodeInformation,
          uuid: message.uuid,
        } as Message);
      })();
      break;
    }
    default:
  }
};

browser.runtime.onMessage.addListener(messageHandler);
