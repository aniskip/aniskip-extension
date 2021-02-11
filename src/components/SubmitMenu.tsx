import React, { useState } from 'react';
import classnames from 'classnames';
import { SubmitMenuProps } from '../types/components/submit_types';
import { timeStringToSeconds } from '../utils/string_utils';
import OpeningSkipperHttpClient from '../api/opening_skipper_http_client';
import Message from '../types/message_type';

const SubmitMenu: React.FC<SubmitMenuProps> = ({
  variant,
  hidden,
}: SubmitMenuProps) => {
  const [skipType, setSkipType] = useState<'op' | 'ed'>('op');
  const [startTime, setStartTime] = useState<string>('00:00');
  const [endTime, setEndTime] = useState<string>('01:30');
  const [openingSkipperHttpClient] = useState<OpeningSkipperHttpClient>(
    new OpeningSkipperHttpClient()
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    chrome.runtime.sendMessage(
      { type: 'get-episode-information' },
      (getEpisodeInfoResponse: Message) => {
        chrome.runtime.sendMessage(
          { type: 'player-get-video-duration' },
          (playerGetDurationResponse: Message) => {
            chrome.storage.sync.get(['userId'], ({ userId }) => {
              const {
                malId,
                episodeNumber,
                providerName,
              } = getEpisodeInfoResponse.payload;
              const duration = playerGetDurationResponse.payload;
              openingSkipperHttpClient.createSkipTimes(
                malId,
                episodeNumber,
                skipType,
                providerName,
                timeStringToSeconds(startTime),
                timeStringToSeconds(endTime),
                duration,
                userId
              );
            });
          }
        );
      }
    );
  };

  return (
    <div
      className={classnames(
        'absolute',
        'right-0',
        'text-left',
        'select-none',
        'mx-auto',
        'px-2',
        'text-center',
        'py-2',
        'bg-gray-800',
        `submit-menu--${variant}`,
        {
          hidden: hidden,
        }
      )}
      role="menu"
    >
      <form
        className={classnames('block', 'space-y-2')}
        onSubmit={handleSubmit}
      >
        <input
          className={classnames('text-black', 'w-full', 'rounded')}
          type="text"
          id="start-time"
          value={startTime}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const timeString = event.currentTarget.value;
            setStartTime(timeString);
          }}
        />
        <input
          className={classnames('text-black', 'w-full', 'rounded')}
          type="text"
          id="end-time"
          value={endTime}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const timeString = event.currentTarget.value;
            setEndTime(timeString);
          }}
        />
        <select
          className={classnames(
            'inline',
            'text-black',
            'appearance-none',
            'mr-2'
          )}
          id="skip-type"
          value={skipType}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            const type = event.currentTarget.value;
            if (type === 'op' || type === 'ed') {
              setSkipType(type);
            }
          }}
        >
          <option value="op">Opening</option>
          <option value="ed">Ending</option>
        </select>
        <input
          className={classnames(
            'border-none',
            'bg-yellow-600',
            'text-white',
            'py-1',
            'px-5',
            'rounded',
            'text-base'
          )}
          type="submit"
          value="Submit"
        />
      </form>
    </div>
  );
};

export default SubmitMenu;
