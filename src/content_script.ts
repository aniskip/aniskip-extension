import MalsyncHttpClient from './api/malsync_http_client';
import Message from './types/message_type';
import OpeningSkipperHttpClient from './api/opening_skipper_http_client';
import { SkipTime } from './types/api/skip_time_types';
import { getProviderInformation } from './utils/page_utils';

let skipTimes: SkipTime[] = [];

const getEpisodeInformation = async () => {
  const { pathname, hostname } = window.location;
  const { providerName, identifier, episodeNumber } = getProviderInformation(
    pathname,
    hostname
  );
  const malsyncHttpClient = new MalsyncHttpClient();
  const malId = await malsyncHttpClient.getMalId(providerName, identifier);

  return {
    malId,
    episodeNumber,
    providerName,
  };
};

/**
 * Removes the skip times
 */
const clearSkipTimeIntervals = () => {
  chrome.runtime.sendMessage({
    type: 'player-clear-skip-intervals',
    payload: skipTimes,
  });
  skipTimes = [];
};

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
    skipTimes.push(skipTimesResponse.result);
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
  const { malId, episodeNumber } = await getEpisodeInformation();
  await addSkipInterval(openingSkipperHttpClient, malId, episodeNumber, 'op');
  await addSkipInterval(openingSkipperHttpClient, malId, episodeNumber, 'ed');
};

/**
 * Handles messages between the player and the background script
 * @param message Message containing the type of action and the payload
 * @param _sender Sender of the message
 * @param sendResponse Response to the sender of the message
 */
const messageHandler = (
  message: Message,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response?: Message) => void
) => {
  switch (message.type) {
    case 'player-ready': {
      addSkipIntervals();
      break;
    }
    case 'get-episode-information': {
      (async () => {
        const episodeInformation = await getEpisodeInformation();
        sendResponse({
          type: 'response',
          payload: episodeInformation,
        });
      })();
      break;
    }
    default:
  }
  return true;
};

chrome.runtime.onMessage.addListener(messageHandler);

// Handles URL change in SPAs
let lastUrl = window.location.href;
document.body.onclick = () => {
  const url = window.location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    clearSkipTimeIntervals();
  }
};
