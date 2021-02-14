import { browser, Runtime } from 'webextension-polyfill-ts';
import Message from './types/message_type';
import { SkipTime } from './types/api/skip_time_types';
import { skipInterval } from './utils/page_utils';
import getPlayer from './utils/player_utils';
import 'tailwindcss/tailwind.css';
import './players/player.scss';

let videoElement: HTMLVideoElement;
let functionReferences: Record<string, (event: Event) => void> = {};
const { hostname } = window.location;
const player = getPlayer(hostname);

/**
 * Skips the time in the interval if it is within the interval range
 * @param skipTime Skip time object containing the intervals
 */
const skipIfInInterval = (skipTime: SkipTime) => {
  const skipTimeString = JSON.stringify(skipTime);
  // Ensures player event handlers can be removed
  const functionReference =
    functionReferences[skipTimeString] ||
    (functionReferences[skipTimeString] = (event: Event) => {
      const margin = 0;
      const video = event.currentTarget as HTMLVideoElement;
      const checkIntervalLength = 10;
      skipInterval(video, skipTime, margin, checkIntervalLength);
    });
  return functionReference;
};

/**
 * Removes skip times event handlers from the video element
 */
const clearSkipIntervals = (skipIntervalListners: EventListener[]) => {
  skipIntervalListners.forEach((listener) =>
    videoElement.removeEventListener('timeupdate', listener)
  );
};

/**
 * Handles messages between the player and the background script
 * @param message Message containing the type of action and the payload
 * @param _sender Sender of the message
 */
const messageHandler = (message: Message, _sender: Runtime.MessageSender) => {
  switch (message.type) {
    case 'player-add-skip-interval': {
      const skipTime = message.payload as SkipTime;
      player.injectSkipTimeIndicator(skipTime);
      videoElement.addEventListener('timeupdate', skipIfInInterval(skipTime));
      break;
    }
    case 'player-clear-skip-intervals': {
      clearSkipIntervals(Object.values(functionReferences));
      functionReferences = {};
      break;
    }
    case 'player-get-video-duration': {
      browser.runtime.sendMessage({
        type: `${message.type}-response`,
        payload: videoElement.duration,
      });
      break;
    }
    case 'player-get-video-current-time': {
      browser.runtime.sendMessage({
        type: `${message.type}-response`,
        payload: videoElement.currentTime,
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
        episode_length: videoElement.duration,
      };

      clearSkipIntervals(Object.values(functionReferences));

      const previewSkipHandler = (event: Event) => {
        const margin = 0;
        const video = event.currentTarget as HTMLVideoElement;
        const checkIntervalLength = 10;
        const intervalSkipped = skipInterval(
          video,
          skipTime,
          margin,
          checkIntervalLength
        );

        if (intervalSkipped) {
          video.removeEventListener('timeupdate', previewSkipHandler);
          Object.values(functionReferences).forEach((functionReference) => {
            videoElement.addEventListener('timeupdate', functionReference);
          });
        }
      };
      videoElement.addEventListener('timeupdate', previewSkipHandler);

      const margin = 3;
      const newTime = skipTime.interval.start_time - margin;
      videoElement.currentTime = newTime > 0 ? newTime : 0;
      videoElement.play();
      break;
    }
    default:
  }
};

browser.runtime.onMessage.addListener(messageHandler);

// Notify content script when video DOM element has been added
new MutationObserver((_mutations, observer) => {
  // eslint-disable-next-line prefer-destructuring
  videoElement = document.getElementsByTagName('video')[0];
  const videoContainer = player.getVideoContainer();
  if (videoElement && videoContainer) {
    observer.disconnect();
    videoElement.onloadedmetadata = () => {
      browser.runtime.sendMessage({ type: 'player-ready' });
    };
    videoContainer.onmouseover = () => player.injectSubmitButton();
  }
}).observe(document, { subtree: true, childList: true });
