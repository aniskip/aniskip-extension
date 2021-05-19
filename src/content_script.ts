import { browser } from 'webextension-polyfill-ts';

import { Message } from './types/message_type';
import AniskipHttpClient from './api/aniskip_http_client';
import { SkipType } from './types/api/aniskip_types';
import PageFactory from './pages/page_factory';

/**
 * Returns the MAL id, episode number and provider name
 */
const getEpisodeInformation = async () => {
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
 * Adds the opening and ending skip invervals
 */
const initialiseSkipTimes = async () => {
  const skipTypes: SkipType[] = ['op', 'ed'];
  const aniskipHttpClient = new AniskipHttpClient();
  const { malId, episodeNumber } = await getEpisodeInformation();
  const skipTimeOptions = await browser.storage.sync.get(
    skipTypes.map((type) => `${type}Option`)
  );

  const skipTimeTypes: SkipType[] = [];
  Object.entries(skipTimeOptions).forEach(([key, value]) => {
    const skipType = key.replace('Option', '') as SkipType;
    if (value !== 'disabled') {
      skipTimeTypes.push(skipType);
    }
  });

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
 * Handles messages between the player and the background script
 * @param message Message containing the type of action and the payload
 */
const messageHandler = (message: Message) => {
  switch (message.type) {
    case 'player-ready': {
      initialiseSkipTimes();
      break;
    }
    case 'get-episode-information': {
      getEpisodeInformation()
        .then(
          (episodeInformation) =>
            ({
              type: `${message.type}-response`,
              payload: episodeInformation,
            } as Message)
        )
        .then((response) => browser.runtime.sendMessage(response));
      break;
    }
    default:
  }
};

browser.runtime.onMessage.addListener(messageHandler);
