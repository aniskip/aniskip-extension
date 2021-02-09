import Message from './types/message_type';
import { SkipTime } from './types/api/skip_time_types';
import { skipInterval } from './utils/page_utils';
import getPlayer from './utils/player_utils';
import SubmitButtonContainer from './components/SubmitButtonContainer';
import 'tailwindcss/tailwind.css';

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
      const margin = 0.3;
      const video = event.currentTarget as HTMLVideoElement;
      const checkIntervalLength =
        skipTime.interval.end_time - skipTime.interval.start_time;
      skipInterval(video, skipTime, margin, checkIntervalLength);
    });
  return functionReference;
};

/**
 * Handles messages between the player and the background script
 * @param message Message containing the type of action and the payload
 * @param _sender Sender of the message
 * @param _sendResponse Response to the sender of the message
 */
const messageHandler = (
  message: Message,
  _sender: chrome.runtime.MessageSender,
  _sendResponse: (response?: Message) => void
) => {
  switch (message.type) {
    case 'player-add-skip-interval': {
      const skipTime = message.payload as SkipTime;
      videoElement.addEventListener('timeupdate', skipIfInInterval(skipTime));
      break;
    }
    case 'player-clear-skip-intervals': {
      const skipTimes = message.payload as SkipTime[];
      skipTimes.forEach((skipTime) => {
        videoElement.removeEventListener(
          'timeupdate',
          skipIfInInterval(skipTime)
        );
      });
      functionReferences = {};
      break;
    }
    default:
  }
};

chrome.runtime.onMessage.addListener(messageHandler);

// Notify content script when video DOM element has been added
new MutationObserver(async (_mutations, observer) => {
  // eslint-disable-next-line prefer-destructuring
  videoElement = document.getElementsByTagName('video')[0];
  const videoContainer = player.getVideoContainer();
  if (videoElement && videoContainer) {
    observer.disconnect();
    videoElement.onloadedmetadata = () =>
      chrome.runtime.sendMessage({ type: 'player-ready' });
    videoContainer.onmouseover = () =>
      player.injectSubmitButton(SubmitButtonContainer);
  }
}).observe(document, { subtree: true, childList: true });
