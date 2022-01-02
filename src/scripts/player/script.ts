import { browser } from 'webextension-polyfill-ts';
import { PlayerFactory } from '../../players/player-factory';
import { Message } from '../background';

const player = PlayerFactory.getPlayer(window.location.href);

// Notify content script when video controls are found.
new MutationObserver((_mutations, observer) => {
  const videoControlsContainer = player.getVideoControlsContainer();

  if (videoControlsContainer) {
    observer.disconnect();
    player.initialise();
  }
}).observe(document, { subtree: true, childList: true });

// Notify content script when video element is found.
new MutationObserver(() => {
  const videoElements = document.getElementsByTagName('video');

  for (let i = 0; i < videoElements.length; i += 1) {
    const videoElement = videoElements[i];
    videoElement.onloadedmetadata = (event): void => {
      const target = event.currentTarget as HTMLVideoElement;
      if (target.duration > 60) {
        player.setVideoElement(target);
        player.initialise();
        player.onReady();
      }
    };
  }
}).observe(document, { subtree: true, childList: true });

/**
 * Handles messages from the content script.
 *
 * @param message Message containing the type of action and the payload.
 */
const messageHandler = (message: Message): any => {
  switch (message.type) {
    case 'initialise-skip-times': {
      if (!player.getIsReady()) {
        return;
      }

      player.clearSkipTimes();
      player.initialiseSkipTimes();
      break;
    }
    default:
    // no default
  }
};

browser.runtime.onMessage.addListener(messageHandler);
