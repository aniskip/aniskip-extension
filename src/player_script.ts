import { browser } from 'webextension-polyfill-ts';

import { Message } from './types/message_type';
import { SkipTimeType, SkipType } from './types/api/aniskip_types';
import PlayerFactory from './players/player_factory';

const player = PlayerFactory.getPlayer(window.location.hostname);

/**
 * Handles messages between the player and the background script
 * @param message Message containing the type of action and the payload
 */
const messageHandler = (message: Message) => {
  if (!player.isReady) {
    return;
  }

  switch (message.type) {
    case 'player-add-skip-time': {
      const skipTime = message.payload as SkipTimeType;
      player.addSkipTime(skipTime);
      break;
    }
    case 'player-get-duration': {
      browser.runtime.sendMessage({
        type: `${message.type}-response`,
        payload: player.getDuration(),
      } as Message);
      break;
    }
    case 'player-get-current-time': {
      browser.runtime.sendMessage({
        type: `${message.type}-response`,
        payload: player.getCurrentTime(),
      } as Message);
      break;
    }
    case 'player-set-current-time': {
      player.setCurrentTime(message.payload);
      break;
    }
    case 'player-add-preview-skip-time': {
      const { payload } = message;
      const skipTime: SkipTimeType = {
        interval: {
          start_time: payload.interval.startTime as number,
          end_time: payload.interval.endTime as number,
        },
        skip_type: payload.skipType as SkipType,
        skip_id: '',
        episode_length: player.getDuration(),
      };
      player.addPreviewSkipTime(skipTime);
      break;
    }
    case 'player-play': {
      player.play();
      break;
    }
    case 'player-remove-skip-time': {
      player.removeSkipTime(message.payload);
      break;
    }
    default:
  }
};

browser.runtime.onMessage.addListener(messageHandler);

// Notify content script when video controls are found
new MutationObserver((_mutations, observer) => {
  const videoControlsContainer = player.getVideoControlsContainer();

  if (videoControlsContainer) {
    observer.disconnect();
    player.initialise();
  }
}).observe(document, { subtree: true, childList: true });

// Notify content script when video element is found;
new MutationObserver(() => {
  const videoElements = document.getElementsByTagName('video');

  for (let i = 0; i < videoElements.length; i += 1) {
    const videoElement = videoElements[i];
    videoElement.onloadedmetadata = (event) => {
      const target = event.currentTarget as HTMLVideoElement;
      if (target.duration > 60) {
        player.setVideoElement(target);
        player.initialise();
        player.ready();
      }
    };
  }
}).observe(document, { subtree: true, childList: true });
