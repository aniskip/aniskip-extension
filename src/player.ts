import Message from './types/message_type';
import { SkipTime } from './types/api/skip_time_types';
import { skipInterval } from './utils/on_page';

let players: HTMLCollectionOf<HTMLVideoElement>;
let skipTimes: SkipTime[] = [];
// Ensures player event handlers can be removed
const functionReferences: Record<string, (event: Event) => void> = {};

/**
 * Skips the time in the interval if it is within the interval range
 * @param skipTime Skip time object containing the intervals
 */
const skipIfInInterval = (skipTime: SkipTime) => {
  const skipTimeString = JSON.stringify(skipTime);
  const functionReference =
    functionReferences[skipTimeString] ||
    (functionReferences[skipTimeString] = (event: Event) => {
      const margin = 0.3;
      const player = event.currentTarget as HTMLVideoElement;
      skipInterval(player, skipTime, margin);
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
      skipTimes.push(skipTime);
      players[0].addEventListener('timeupdate', skipIfInInterval(skipTime));
      break;
    }
    case 'player-clear-skip-intervals': {
      skipTimes.forEach((skipTime) => {
        players[0].removeEventListener(
          'timeupdate',
          skipIfInInterval(skipTime)
        );
      });
      skipTimes = [];
      break;
    }
    default:
  }
};

chrome.runtime.onMessage.addListener(messageHandler);

// Notify content script when video DOM element has been added
new MutationObserver((_, observer) => {
  players = document.getElementsByTagName('video');
  if (players.length > 0) {
    observer.disconnect();
    players[0].onloadedmetadata = () => {
      chrome.runtime.sendMessage({ type: 'player-ready' });
    };
  }
}).observe(document, { subtree: true, childList: true });
