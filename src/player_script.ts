import { browser, Runtime } from 'webextension-polyfill-ts';
import Message from './types/message_type';
import { SkipTime } from './types/api/skip_time_types';
import getPlayer from './utils/player_utils';
import Player from './types/players/player_type';
import 'tailwindcss/tailwind.css';
import './player_script.scss';

let player: Player;

/**
 * Handles messages between the player and the background script
 * @param message Message containing the type of action and the payload
 * @param _sender Sender of the message
 */
const messageHandler = (message: Message, _sender: Runtime.MessageSender) => {
  switch (message.type) {
    case 'player-add-auto-skip-interval': {
      const skipTime = message.payload as SkipTime;
      player.addSkipTime(skipTime);
      break;
    }
    case 'player-clear-skip-intervals': {
      player.reset();
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
    case 'player-add-preview-skip-interval': {
      const { payload } = message;
      const skipTime: SkipTime = {
        interval: {
          start_time: payload.interval.startTime as number,
          end_time: payload.interval.endTime as number,
        },
        skip_type: payload.skipType as 'op' | 'ed',
        skip_id: '',
        episode_length: player.getDuration(),
      };
      player.addPreviewSkipInterval(skipTime);
      break;
    }
    default:
  }
};

browser.runtime.onMessage.addListener(messageHandler);

// Notify content script when video DOM element has been added
new MutationObserver((_mutations, observer) => {
  // eslint-disable-next-line prefer-destructuring
  const videoElement = document.getElementsByTagName('video')[0];
  if (videoElement) {
    player = getPlayer(window.location.hostname, videoElement);
  }

  if (player) {
    const videoContainer = player.getVideoContainer();

    if (videoContainer && videoElement) {
      observer.disconnect();
      videoElement.onloadedmetadata = () => {
        player.reset();
        player.injectSubmitButton();
        player.injectSkipTimeIndicator();
        browser.runtime.sendMessage({ type: 'player-ready' });
      };
      videoContainer.onmouseover = () => {
        player.injectSubmitButton();
        player.injectSkipTimeIndicator();
      };
    }
  }
}).observe(document, { subtree: true, childList: true });
