import React, { useState } from 'react';
import classnames from 'classnames';
import { FaTimes } from 'react-icons/fa';
import { SubmitMenuProps } from '../types/components/submit_types';
import { timeStringToSeconds } from '../utils/string_utils';
import OpeningSkipperHttpClient from '../api/opening_skipper_http_client';
import Message from '../types/message_type';
import Dropdown from './Dropdown';
import { Option } from '../types/components/dropdown_types';

const dropdownOptions: Option[] = [
  { value: 'op', label: 'Opening' },
  { value: 'ed', label: 'Ending' },
];

const SubmitMenu: React.FC<SubmitMenuProps> = ({
  variant,
  hidden,
  onSubmit,
  onClose,
}: SubmitMenuProps) => {
  const [skipType, setSkipType] = useState<'op' | 'ed'>('op');
  const [startTime, setStartTime] = useState<string>('0:00');
  const [endTime, setEndTime] = useState<string>('1:30');
  const [openingSkipperHttpClient] = useState<OpeningSkipperHttpClient>(
    new OpeningSkipperHttpClient()
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
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
        'bg-gray-800',
        '-right-20',
        'bottom-24',
        'absolute',
        'select-none',
        'rounded-md',
        { hidden },
        `submit-menu--${variant}`
      )}
      role="menu"
    >
      <div
        className={classnames(
          'flex',
          'justify-between',
          'items-center',
          'w-full',
          'h-auto',
          'border-white',
          'border-b-2',
          'px-5',
          'py-2'
        )}
      >
        <h1 className={classnames('text-white', 'uppercase', 'text-sm')}>
          Submit Skip Times
        </h1>
        <button
          type="button"
          className={classnames(
            'flex',
            'justify-center',
            'items-center',
            'w-3',
            'h-3',
            'focus:outline-none',
            'text-white',
            'active:text-yellow-500'
          )}
          onClick={() => onClose()}
        >
          <FaTimes />
        </button>
      </div>
      <div className={classnames('container', 'px-5', 'py-4', 'mx-auto')}>
        <form
          className={classnames('block', 'space-y-2')}
          onSubmit={handleSubmit}
        >
          <div className={classnames('text-black', 'space-y-2')}>
            <input
              className={classnames(
                'rounded',
                'px-2',
                'py-1',
                'block',
                'focus:outline-none',
                'focus:ring-2',
                'focus:ring-yellow-500'
              )}
              type="text"
              id="start-time"
              autoComplete="off"
              value={startTime}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const timeString = event.currentTarget.value;
                setStartTime(timeString);
              }}
            />
            <input
              className={classnames(
                'rounded',
                'px-2',
                'py-1',
                'block',
                'focus:outline-none',
                'focus:ring-2',
                'focus:ring-yellow-500'
              )}
              type="text"
              id="end-time"
              autoComplete="off"
              value={endTime}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const timeString = event.currentTarget.value;
                setEndTime(timeString);
              }}
            />
          </div>
          <div className={classnames('flex', 'space-x-2')}>
            <Dropdown
              className={classnames('text-xs', 'flex-1')}
              value={skipType}
              onChange={setSkipType}
              options={dropdownOptions}
            />
            <input
              className={classnames(
                'flex-1',
                'inline',
                'border-none',
                'bg-yellow-600',
                'text-white',
                'py-1',
                'px-5',
                'rounded',
                'text-sm',
                'font-semibold',
                'focus:outline-none',
                'focus:ring-2',
                'focus:ring-yellow-100'
              )}
              type="submit"
              value="Submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitMenu;
