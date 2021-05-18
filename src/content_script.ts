import { browser, Runtime } from 'webextension-polyfill-ts';

import { Message } from './types/message_type';
import AniskipHttpClient from './api/aniskip_http_client';
import { SkipOptionType } from './types/options/skip_option_type';
import { SkipTimeType, SkipType } from './types/api/aniskip_types';
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
 * Adds the skip time to the player
 * @param skipTime Skip time to add
 * @param userOption User option of the skip time
 */
const addSkipTime = async (
  skipTime: SkipTimeType,
  userOption: SkipOptionType
) => {
  browser.runtime.sendMessage({
    type: `player-add-${userOption}-time`,
    payload: skipTime,
  } as Message);
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
      addSkipTime(skipTime, skipTimeOptions[`${skipTime.skip_type}Option`])
    );
  }
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
