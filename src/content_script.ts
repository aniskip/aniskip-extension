import { browser, Runtime } from 'webextension-polyfill-ts';
import MalsyncHttpClient from './api/malsync_http_client';
import Message from './types/message_type';
import OpeningSkipperHttpClient from './api/opening_skipper_http_client';
import getProviderInformation from './utils/page_utils';
import { SkipOptionType } from './types/options/skip_option_type';

/**
 * Returns the MAL id, episode number and provider name
 */
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
 * Adds the skip time to the player
 * @param openingSkipperHttpClient OpeningSkipperHttpClient object
 * @param malId MAL idenfitication number
 * @param episodeNumber Episode number
 * @param type Type of time to add, either 'op' or 'ed'
 */
const addSkipTime = async (
  openingSkipperHttpClient: OpeningSkipperHttpClient,
  malId: number,
  episodeNumber: number,
  type: 'op' | 'ed',
  option: SkipOptionType
) => {
  if (option === 'disabled') {
    return;
  }
  const skipTimesResponse = await openingSkipperHttpClient.getSkipTimes(
    malId,
    episodeNumber,
    type
  );
  if (skipTimesResponse.found) {
    browser.runtime.sendMessage({
      type: `player-add-${option}-time`,
      payload: skipTimesResponse.result,
    });
  }
};

/**
 * Adds the opening and ending skip invervals
 */
const initialiseSkipTimes = async () => {
  const openingSkipperHttpClient = new OpeningSkipperHttpClient();
  const { malId, episodeNumber } = await getEpisodeInformation();
  const { openingOption, endingOption } = await browser.storage.sync.get([
    'openingOption',
    'endingOption',
  ]);
  addSkipTime(
    openingSkipperHttpClient,
    malId,
    episodeNumber,
    'op',
    openingOption
  );
  addSkipTime(
    openingSkipperHttpClient,
    malId,
    episodeNumber,
    'ed',
    endingOption
  );
};

/**
 * Handles messages between the player and the background script
 * @param message Message containing the type of action and the payload
 * @param _sender Sender of the message
 */
const messageHandler = (message: Message, _sender: Runtime.MessageSender) => {
  switch (message.type) {
    case 'player-ready': {
      initialiseSkipTimes();
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
