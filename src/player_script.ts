import { browser, Runtime } from 'webextension-polyfill-ts';
import Message from './types/message_type';
import { SkipTimeType, SkipType } from './types/api/skip_time_types';
import getPlayer from './utils/player_utils';
import { Player } from './types/players/player_types';

let player: Player;

/**
 * Handles messages between the player and the background script
 * @param message Message containing the type of action and the payload
 * @param _sender Sender of the message
 */
const messageHandler = (message: Message, _sender: Runtime.MessageSender) => {
  if (!player) {
    return;
  }

  switch (message.type) {
    case 'player-add-auto-skip-time': {
      const skipTime = message.payload as SkipTimeType;
      player.addSkipTime(skipTime, false);
      break;
    }
    case 'player-add-manual-skip-time': {
      const skipTime = message.payload as SkipTimeType;
      player.addSkipTime(skipTime, true);
      break;
    }
    case 'player-get-video-duration': {
      browser.runtime.sendMessage({
        type: `${message.type}-response`,
        payload: player.getDuration(),
      });
      break;
    }
    case 'player-get-video-current-time': {
      browser.runtime.sendMessage({
        type: `${message.type}-response`,
        payload: player.getCurrentTime(),
      });
      break;
    }
    case 'player-set-video-current-time': {
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

// Notify content script when video DOM element has been added
new MutationObserver((_mutations, observer) => {
  const videoElement = document.getElementsByTagName('video')[0];
  if (videoElement && videoElement.duration > 60) {
    player = getPlayer(window.location.hostname, videoElement);
  }

  if (player) {
    const videoControlsContainer = player.getVideoControlsContainer();

    if (videoControlsContainer && videoElement) {
      observer.disconnect();
      player.initialise();
    }
  }
}).observe(document, { subtree: true, childList: true });
