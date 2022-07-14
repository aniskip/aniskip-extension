import { browser } from 'webextension-polyfill-ts';
import { Message } from '../background';
import { PageFactory } from '../../pages/page-factory';

// Override font-size.
const htmlElement = document.querySelector(':root') as HTMLHtmlElement;
htmlElement.style.fontSize = '16px';

const page = PageFactory.getPage(window.location.href);

/**
 * Injects the overlay.
 */
const injectOverlayListener = (): void => {
  page.injectOverlay();

  document.removeEventListener('DOMContentLoaded', injectOverlayListener);
};

// Inject search overlay once when the document body loads.
document.addEventListener('DOMContentLoaded', injectOverlayListener);

/**
 * Handles messages from the player script.
 *
 * @param message Message containing the type of action and the payload.
 */
const messageHandler = (message: Message): any => {
  switch (message.type) {
    case 'get-episode-information': {
      return (async (): Promise<any> => {
        await page.applyRules();
        const malId = await page.getMalId();
        const providerName = page.getProviderName();
        const episodeNumber = page.getEpisodeNumber();

        if (malId === 0) {
          page.openOverlay();

          return {
            error: 'MAL id not found',
          };
        }

        return {
          malId,
          providerName,
          episodeNumber,
        };
      })();
    }
    default:
      return undefined;
  }
};

browser.runtime.onMessage.addListener(messageHandler);
