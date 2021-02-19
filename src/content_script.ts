import { browser, Runtime } from 'webextension-polyfill-ts';
import Message from './types/message_type';
import OpeningSkipperHttpClient from './api/opening_skipper_http_client';
import getPage from './utils/page_utils';

/**
 * Returns the MAL id, episode number and provider name
 */
const getEpisodeInformation = async () => {
  const { pathname, hostname } = window.location;
  const page = getPage(pathname, hostname);

  const providerName = page.getProviderName();
  const episodeNumber = await page.getEpisodeNumber();
  const malId = await page.getMalId();

  return {
    malId,
    episodeNumber,
    providerName,
  };
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
    browser.runtime.sendMessage({
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
 */
const messageHandler = (message: Message, _sender: Runtime.MessageSender) => {
  switch (message.type) {
    case 'player-ready': {
      addSkipIntervals();
      break;
    }
    case 'get-episode-information': {
      getEpisodeInformation()
        .then((episodeInformation) => ({
          type: `${message.type}-response`,
          payload: episodeInformation,
        }))
        .then((response) => browser.runtime.sendMessage(response));
      break;
    }
    default:
  }
};

browser.runtime.onMessage.addListener(messageHandler);
