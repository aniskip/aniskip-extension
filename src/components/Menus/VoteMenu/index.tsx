import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaPlay, FaTimes } from 'react-icons/fa';
import { browser } from 'webextension-polyfill-ts';

import { useAniskipHttpClient } from '../../../hooks/use_aniskip_http_client';
import { SkipTime, VoteType } from '../../../api';
import { VoteMenuProps } from '../../../types/components/vote_menu_types';
import { Message } from '../../../scripts/background';
import { secondsToTimeString } from '../../../utils/string_utils';
import { LinkButton } from '../../LinkButton';
import Button from './Button';

const VoteMenu = ({
  hidden,
  skipTimes,
  onClose,
  submitMenuOpen,
}: VoteMenuProps): JSX.Element => {
  const { aniskipHttpClient } = useAniskipHttpClient();
  const [skipTimesVoted, setSkipTimesVoted] = useState<
    Record<string, VoteType>
  >({});
  const [filteredSkipTimes, setFilteredSkipTimes] = useState<SkipTime[]>([]);
  const [playerDuration, setPlayerDuration] = useState(0);

  useEffect(() => {
    skipTimes.sort((a, b) => a.interval.start_time - b.interval.end_time);
    setFilteredSkipTimes([...skipTimes.filter((skipTime) => skipTime.skip_id)]);

    (async (): Promise<void> => {
      const { skipTimesVoted: currentSkipTimesVoted } =
        await browser.storage.local.get('skipTimesVoted');
      setSkipTimesVoted(currentSkipTimesVoted);

      if (skipTimes.length === 0) {
        return;
      }

      const duration = await browser.runtime.sendMessage({
        type: 'player-get-duration',
      } as Message);
      setPlayerDuration(duration);
    })();
  }, [skipTimes]);

  const setPlayerCurrentTime = (time: number) => (): void => {
    browser.runtime.sendMessage({
      type: 'player-set-current-time',
      payload: time,
    } as Message);
    browser.runtime.sendMessage({ type: 'player-play' } as Message);
  };

  return (
    <div
      className={`text-sm md:text-base font-sans w-60 px-5 py-2 z-10 bg-trueGray-800 bg-opacity-80 border border-gray-300 select-none rounded-md transition-opacity text-white opacity-0 pointer-events-none ${
        !hidden ? 'sm:opacity-100 sm:pointer-events-auto' : ''
      }`}
    >
      <div className="flex justify-between items-center w-full h-auto mb-2">
        <div className="flex items-center space-x-1 outline-none">
          <FaPlay className="text-primary" size={12} />
          <span className="font-bold text-sm uppercase">Vote skip times</span>
        </div>
        <button
          type="button"
          className="flex justify-center items-center focus:outline-none"
          onClick={(): void => onClose()}
        >
          <FaTimes className="w-4 h-4 active:text-primary" />
        </button>
      </div>
      <div className="divide-y divide-gray-300">
        {filteredSkipTimes.length === 0 && (
          <div className="text-xs space-y-1 mt-4">
            <div className="text-gray-200 uppercase font-semibold">
              No skip times found
            </div>
            <LinkButton
              className="text-blue-500 uppercase font-bold hover:no-underline"
              onClick={(): void => {
                onClose();
                submitMenuOpen();
              }}
            >
              Submit here
            </LinkButton>
          </div>
        )}
        {filteredSkipTimes.length > 0 &&
          filteredSkipTimes.map((skipTime) => {
            const {
              skip_id: skipId,
              interval,
              skip_type: skipType,
              episode_length: episodeLength,
            } = skipTime;
            const offset = playerDuration - episodeLength;
            const isUpvoted = skipTimesVoted[skipId] === 'upvote';
            const isDownvoted = skipTimesVoted[skipId] === 'downvote';
            const startTimeFormatted = secondsToTimeString(
              interval.start_time + offset,
              0
            );
            const endTimeFormatted = secondsToTimeString(
              interval.end_time + offset,
              0
            );

            let skipTypeFormatted = '';
            switch (skipType) {
              case 'op':
                skipTypeFormatted = 'Opening';
                break;
              case 'ed':
                skipTypeFormatted = 'Ending';
                break;
              default:
            }

            return (
              <div
                className="flex justify-between py-2"
                key={`vote-menu-skip-time-${skipId}`}
              >
                <div className="flex flex-col justify-between">
                  <span className="font-bold uppercase text-xs">
                    {skipTypeFormatted}
                  </span>
                  <span className="text-sm text-blue-500">
                    <LinkButton
                      onClick={setPlayerCurrentTime(
                        // Ensure that it won't be auto-skipped.
                        interval.start_time + offset + 0.01
                      )}
                    >
                      {startTimeFormatted}
                    </LinkButton>{' '}
                    <span className="text-white">-</span>{' '}
                    <LinkButton
                      onClick={setPlayerCurrentTime(interval.end_time + offset)}
                    >
                      {endTimeFormatted}
                    </LinkButton>
                  </span>
                </div>
                <div className="flex flex-col justify-between">
                  <button
                    className={`focus:outline-none hover:text-primary active:opacity-80 ${
                      isUpvoted && 'text-primary'
                    }`}
                    type="button"
                    onClick={async (): Promise<void> => {
                      if (isUpvoted) {
                        return;
                      }

                      const { skipTimesVoted: currentSkipTimesVoted } =
                        await browser.storage.local.get('skipTimesVoted');

                      const updatedSkipTimesVoted = {
                        ...skipTimesVoted,
                        ...currentSkipTimesVoted,
                        [skipId]: 'upvote',
                      };

                      setSkipTimesVoted(updatedSkipTimesVoted);

                      try {
                        const response = await aniskipHttpClient.upvote(skipId);
                        if (response.message === 'success') {
                          browser.storage.local.set({
                            skipTimesVoted: updatedSkipTimesVoted,
                          });
                        }
                      } catch (err) {
                        if (err.code === 'vote/rate-limited') {
                          browser.storage.local.set({
                            skipTimesVoted: updatedSkipTimesVoted,
                          });
                        }
                      }
                    }}
                    disabled={isUpvoted}
                  >
                    <FaChevronUp />
                  </button>
                  <button
                    className={`focus:outline-none hover:text-blue-500 active:opacity-80 ${
                      isDownvoted && 'text-blue-500'
                    }`}
                    type="button"
                    onClick={async (): Promise<void> => {
                      if (isDownvoted) {
                        return;
                      }

                      const { skipTimesVoted: currentSkipTimesVoted } =
                        await browser.storage.local.get('skipTimesVoted');

                      const updatedSkipTimesVoted = {
                        ...skipTimesVoted,
                        ...currentSkipTimesVoted,
                        [skipId]: 'downvote',
                      };

                      setSkipTimesVoted(updatedSkipTimesVoted);

                      browser.runtime.sendMessage({
                        type: 'player-remove-skip-time',
                        payload: skipId,
                      } as Message);

                      try {
                        const response = await aniskipHttpClient.downvote(
                          skipId
                        );
                        if (response.message === 'success') {
                          browser.storage.local.set({
                            skipTimesVoted: updatedSkipTimesVoted,
                          });
                        }
                      } catch (err) {
                        if (err.code === 'vote/rate-limited') {
                          browser.storage.local.set({
                            skipTimesVoted: updatedSkipTimesVoted,
                          });
                        }
                      }
                    }}
                    disabled={isDownvoted}
                  >
                    <FaChevronDown />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

VoteMenu.Button = Button;

export default VoteMenu;
