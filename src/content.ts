import MalsyncHttpClient from './api/malsync_http_client';
import OpeningSkipperHttpClient from './api/opening_skipper_http_client';
import Message from './types/message_type';
import { getProviderInformation } from './utils/on_page';

/**
 * Adds the skip intervals to the player
 * @param openingSkipperHttpClient OpeningSkipperHttpClient object
 * @param malId MAL idenfitication number
 * @param episodeNumber Episode number
 * @param type Type of interval to add, either 'op' or 'ed'
 */
const addSkipInterval = async (
  openingSkipperHttpClient: OpeningSkipperHttpClient,
  malId: number,
  episodeNumber: number,
  type: 'op' | 'ed'
) => {
  const skipTimesResponse = await openingSkipperHttpClient.getSkipTimes(
    malId,
    episodeNumber,
    type
  );
  if (skipTimesResponse.found) {
    chrome.runtime.sendMessage({
      type: 'player-add-skip-interval',
      payload: skipTimesResponse.result,
    });
  }
};

/**
 * Adds the opening and ending skip invervals
 */
const addSkipIntervals = async () => {
  const openingSkipperHttpClient = new OpeningSkipperHttpClient();
  const malsyncHttpClient = new MalsyncHttpClient();
  const { pathname, hostname } = window.location;
  const { providerName, identifier, episodeNumber } = getProviderInformation(
    pathname,
    hostname
  );
  const malId = await malsyncHttpClient.getMalId(providerName, identifier);
  await addSkipInterval(openingSkipperHttpClient, malId, episodeNumber, 'op');
  await addSkipInterval(openingSkipperHttpClient, malId, episodeNumber, 'ed');
};

/**
 * Handles messages between the player and the background script
 * @param message Message containing the type of action and the payload
 * @param _sender Sender of the message
 * @param _sendResponse Response to the sender of the message
 */
const messageHandler = async (
  message: Message,
  _sender: chrome.runtime.MessageSender,
  _sendResponse: (response?: Message) => void
) => {
  switch (message.type) {
    case 'player-ready': {
      await addSkipIntervals();
      break;
    }
    default:
  }
  return true;
};

chrome.runtime.onMessage.addListener(messageHandler);

// Handles URL change in SPAs
let lastUrl = window.location.href;
new MutationObserver(async () => {
  const url = window.location.href;

  if (url !== lastUrl) {
    lastUrl = url;
    chrome.runtime.sendMessage({ type: 'player-clear-skip-intervals' });
  }
}).observe(document, { subtree: true, childList: true });
