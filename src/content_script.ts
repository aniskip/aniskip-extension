import { browser } from 'webextension-polyfill-ts';

import { Message } from './types/message_type';
import AniskipHttpClient from './api/aniskip_http_client';
import { SkipType } from './types/api/aniskip_types';
import PageFactory from './pages/page_factory';

/**
 * Returns the MAL id, episode number and provider name.
 */
const getEpisodeInformation = async (): Promise<{
  malId: number;
  episodeNumber: number;
  providerName: string;
}> => {
  const { pathname, hostname } = window.location;
  const page = PageFactory.getPage(pathname, hostname);

  await page.applyRules();
  const malId = await page.getMalId();
  const providerName = page.getProviderName();
  const episodeNumber = page.getEpisodeNumber();

  return {
    malId,
    episodeNumber,
    providerName,
  };
};

/**
 * Adds the opening and ending skip invervals.
 */
const initialiseSkipTimes = async (): Promise<void> => {
  const aniskipHttpClient = new AniskipHttpClient();
  const { malId, episodeNumber } = await getEpisodeInformation();
  const { skipOptions } = await browser.storage.sync.get('skipOptions');

  const skipTimeTypes: SkipType[] = [];
  Object.entries(skipOptions).forEach(([skipType, value]) => {
    if (value !== 'disabled') {
      skipTimeTypes.push(skipType as SkipType);
    }
  });

  if (skipTimeTypes.length === 0) {
    return;
  }

  const getSkipTimesResponse = await aniskipHttpClient.getSkipTimes(
    malId,
    episodeNumber,
    skipTimeTypes
  );

  if (getSkipTimesResponse.found) {
    getSkipTimesResponse.results.forEach((skipTime) =>
      browser.runtime.sendMessage({
        type: 'player-add-skip-time',
        payload: skipTime,
      } as Message)
    );
  }
};

/**
 * Handles messages between the player and the background script.
 *
 * @param message Message containing the type of action and the payload.
 */
const messageHandler = (message: Message): any => {
  switch (message.type) {
    case 'player-ready': {
      initialiseSkipTimes();
      break;
    }
    case 'get-episode-information': {
      (async (): Promise<void> => {
        const episodeInformation = await getEpisodeInformation();
        browser.runtime.sendMessage({
          payload: episodeInformation,
          uuid: message.uuid,
        } as Message);
      })();
      break;
    }
    default:
  }
};

browser.runtime.onMessage.addListener(messageHandler);
