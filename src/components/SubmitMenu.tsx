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
        'tw-absolute',
        'tw-right-0',
        'tw-text-left',
        'tw-select-none',
        'tw-mx-auto',
        'tw-px-2',
        'tw-text-center',
        'tw-py-2',
        'tw-bg-gray-800',
        `submit-menu--${variant}`,
        {
          'tw-hidden': hidden,
        }
      )}
      role="menu"
    >
      <form
        className={classnames('tw-block', 'tw-space-y-2')}
        onSubmit={handleSubmit}
      >
        <input
          className={classnames('tw-text-black', 'tw-w-full', 'tw-rounded')}
          type="text"
          id="start-time"
          value={startTime}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const timeString = event.currentTarget.value;
            setStartTime(timeString);
          }}
        />
        <input
          className={classnames('tw-text-black', 'tw-w-full', 'tw-rounded')}
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
            'tw-inline',
            'tw-text-black',
            'tw-appearance-none',
            'tw-mr-2'
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
            'tw-border-none',
            'tw-bg-yellow-600',
            'tw-text-white',
            'tw-py-1',
            'tw-px-5',
            'tw-rounded',
            'tw-text-base'
          )}
          type="submit"
          value="Submit"
        />
      </form>
    </div>
  );
};

export default SubmitMenu;
