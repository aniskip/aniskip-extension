import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaPlay, FaTimes } from 'react-icons/fa';
import { browser } from 'webextension-polyfill-ts';

import useAniskipHttpClient from '../../../hooks/use_aniskip_http_client';
import useFullscreen from '../../../hooks/use_fullscreen';
import { VoteMenuProps } from '../../../types/components/vote_menu_types';
import { secondsToTimeString } from '../../../utils/string_utils';
import LinkButton from '../../LinkButton';
import Button from './Button';

const VoteMenu = ({ variant, hidden, skipTimes, onClose }: VoteMenuProps) => {
  const { isFullscreen } = useFullscreen();
  const { aniskipHttpClient } = useAniskipHttpClient();
  const [votesSubmitted, setVotesSubmitted] = useState<boolean[]>([]);

  useEffect(() => {
    skipTimes.sort((a, b) => a.interval.start_time - b.interval.end_time);
  }, [skipTimes]);

  const setPlayerCurrentTime = (time: number) => () => {
    browser.runtime.sendMessage({
      type: 'player-set-video-current-time',
      payload: time,
    });
  };

  return (
    <div
      className={`font-sans w-60 px-5 py-2 z-10 bg-trueGray-800 bg-opacity-80 border border-gray-300 absolute right-5 bottom-28 select-none rounded-md transition-opacity text-white ${
        hidden && 'opacity-0 pointer-events-none'
      } vote-menu--${variant} ${
        isFullscreen && `vote-menu--${variant}--fullscreen`
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
          onClick={() => onClose()}
        >
          <FaTimes className="w-4 h-4 active:text-primary" />
        </button>
      </div>
      <div className="divide-y divide-gray-300">
        {skipTimes.length === 0 && (
          <div className="text-xs uppercase font-semibold text-red-500">
            No skip times found
          </div>
        )}
        {skipTimes.length > 0 &&
          skipTimes
            .filter((skipTime) => skipTime.skip_id)
            .map((skipTime, index) => {
              const {
                skip_id: skipId,
                interval,
                skip_type: skipType,
              } = skipTime;
              const isVoteSubmitted = votesSubmitted[index];
              const startTimeFormatted = secondsToTimeString(
                interval.start_time,
                0
              );
              const endTimeFormatted = secondsToTimeString(
                interval.end_time,
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
                  <div>
                    <span className="font-bold uppercase text-xs">
                      {skipTypeFormatted}
                    </span>
                    <br />
                    <span className="text-sm text-blue-500">
                      <LinkButton
                        onClick={setPlayerCurrentTime(interval.start_time)}
                      >
                        {startTimeFormatted}
                      </LinkButton>{' '}
                      <span className="text-white">-</span>{' '}
                      <LinkButton
                        onClick={setPlayerCurrentTime(interval.end_time)}
                      >
                        {endTimeFormatted}
                      </LinkButton>
                    </span>
                  </div>
                  <div className="flex flex-col justify-between py-1">
                    <button
                      className="focus:outline-none hover:text-primary active:opacity-80"
                      type="button"
                      onClick={() => {
                        aniskipHttpClient.upvote(skipId);
                      }}
                    >
                      <FaChevronUp />
                    </button>
                    <button
                      className="focus:outline-none hover:text-blue-500 active:opacity-80"
                      type="button"
                      onClick={async () => {
                        browser.runtime.sendMessage({
                          type: 'player-remove-skip-time',
                          payload: skipTime,
                        });

                        aniskipHttpClient.downvote(skipId);
                      }}
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
