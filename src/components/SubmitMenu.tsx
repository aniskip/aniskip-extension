import React, { useEffect, useRef, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import classnames from 'classnames';
import { FaTimes } from 'react-icons/fa';
import { SubmitMenuProps } from '../types/components/submit_types';
import {
  formatTimeString,
  secondsToTimeString,
  timeStringToSeconds,
} from '../utils/string_utils';
import OpeningSkipperHttpClient from '../api/opening_skipper_http_client';
import Dropdown from './Dropdown';
import Button from './Button';
import waitForMessage from '../utils/message_utils';
import Input from './Input';

const SubmitMenu: React.FC<SubmitMenuProps> = ({
  variant,
  hidden,
  onSubmit,
  onClose,
}: SubmitMenuProps) => {
  const [skipType, setSkipType] = useState<'op' | 'ed'>('op');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [openingSkipperHttpClient] = useState<OpeningSkipperHttpClient>(
    new OpeningSkipperHttpClient()
  );
  const [currentInputFocus, setCurrentInputFocus] = useState<
    'start-time' | 'end-time'
  >();
  const inputPatternRegexStringRef = useRef(
    '^[12]?[0-9]:[0-9]{1,2}(.[0-9]{1,3})?$'
  );
  const inputPatternTestRegexRef = useRef(/^[0-9:.]*$/);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();

    let messageType = 'get-episode-information';
    browser.runtime.sendMessage({ type: messageType });
    const getEpisodeInfoResponse = await waitForMessage(
      `${messageType}-response`
    );

    messageType = 'player-get-video-duration';
    browser.runtime.sendMessage({ type: messageType });
    const playerGetDurationResponse = await waitForMessage(
      `${messageType}-response`
    );

    const { userId } = await browser.storage.sync.get(['userId']);
    const {
      malId,
      episodeNumber,
      providerName,
    } = getEpisodeInfoResponse.payload;
    const duration = playerGetDurationResponse.payload;

    console.log({
      submit_params: {
        malId,
        episodeNumber,
        skipType,
        providerName,
        startTime: timeStringToSeconds(startTime),
        endTime: timeStringToSeconds(endTime),
        duration,
        userId,
      },
    });

    // openingSkipperHttpClient.createSkipTimes(
    //   malId,
    //   episodeNumber,
    //   skipType,
    //   providerName,
    //   timeStringToSeconds(startTime),
    //   timeStringToSeconds(endTime),
    //   duration,
    //   userId
    // );
  };

  useEffect(() => {
    if (!hidden) {
      (async () => {
        let messageType = 'player-get-video-current-time';
        browser.runtime.sendMessage({ type: messageType });
        const currentTime: number = (
          await waitForMessage(`${messageType}-response`)
        ).payload;
        setStartTime(secondsToTimeString(currentTime));
        setEndTime(secondsToTimeString(currentTime + 90));

        messageType = 'player-get-video-duration';
        browser.runtime.sendMessage({ type: messageType });
        const duration: number = (
          await waitForMessage(`${messageType}-response`)
        ).payload;
        setSkipType(currentTime < duration / 2 ? 'op' : 'ed');
      })();
    }
  }, [hidden]);

  return (
    <div
      className={classnames(
        'bg-gray-800',
        '-right-20',
        'bottom-24',
        'absolute',
        'select-none',
        'rounded-md',
        'w-96',
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
          'px-5',
          'pt-2'
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
          <div className={classnames('flex', 'text-black', 'space-x-2')}>
            <Input
              className={classnames(
                'flex-auto',
                'text-sm',
                'focus:ring-2',
                'focus:ring-yellow-500'
              )}
              id="start-time"
              value={startTime}
              pattern={inputPatternRegexStringRef.current}
              required
              title="Minutes : Seconds"
              placeholder="Start time"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const timeString = event.currentTarget.value;
                const testRegex = inputPatternTestRegexRef.current;
                if (testRegex.test(timeString)) {
                  setStartTime(timeString);
                }
              }}
              onFocus={() => setCurrentInputFocus('start-time')}
              onBlur={() =>
                setStartTime((current) => formatTimeString(current))
              }
            />
            <Input
              className={classnames(
                'flex-auto',
                'text-sm',
                'focus:ring-2',
                'focus:ring-yellow-500'
              )}
              id="end-time"
              value={endTime}
              pattern={inputPatternRegexStringRef.current}
              required
              title="Minutes : Seconds"
              placeholder="End time"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const timeString = event.currentTarget.value;
                const testRegex = inputPatternTestRegexRef.current;
                if (testRegex.test(timeString)) {
                  setEndTime(timeString);
                }
              }}
              onFocus={() => setCurrentInputFocus('end-time')}
              onBlur={() => setEndTime((current) => formatTimeString(current))}
            />
          </div>
          <div className={classnames('flex', 'text-black', 'space-x-2')}>
            <Button
              className={classnames(
                'flex-1',
                'inline',
                'focus:ring-2',
                'focus:ring-yellow-100',
                'bg-yellow-600',
                'text-white'
              )}
              onClick={async () => {
                const messageType = 'player-get-video-current-time';
                browser.runtime.sendMessage({ type: messageType });
                const currentTime: number = (
                  await waitForMessage(`${messageType}-response`)
                ).payload;
                if (currentInputFocus === 'start-time') {
                  setStartTime(secondsToTimeString(currentTime));
                } else if (currentInputFocus === 'end-time') {
                  setEndTime(secondsToTimeString(currentTime));
                }
              }}
              label="Now"
            />
            <Button
              className={classnames(
                'flex-1',
                'inline',
                'focus:ring-2',
                'focus:ring-yellow-100',
                'bg-blue-600',
                'text-white'
              )}
              onClick={async () => {
                let messageType = 'player-get-video-duration';
                browser.runtime.sendMessage({
                  type: messageType,
                });
                const getEpisodeDurationResponse = await waitForMessage(
                  `${messageType}-response`
                );
                messageType = 'player-add-skip-interval';
                browser.runtime.sendMessage({
                  type: messageType,
                  payload: {
                    interval: {
                      start_time: timeStringToSeconds(startTime),
                      end_time: timeStringToSeconds(endTime),
                    },
                    skip_type: skipType,
                    skip_id: '',
                    episode_length: getEpisodeDurationResponse.payload,
                  },
                });
                messageType = 'player-set-video-current-time';
                browser.runtime.sendMessage({
                  type: messageType,
                  payload: timeStringToSeconds(startTime),
                });
              }}
              label="Preview"
            />
            <Button
              className={classnames(
                'flex-1',
                'inline',
                'focus:ring-2',
                'focus:ring-yellow-100',
                'bg-yellow-600',
                'text-white'
              )}
              onClick={async () => {
                const messageType = 'player-get-video-duration';
                browser.runtime.sendMessage({ type: messageType });
                const duration: number = (
                  await waitForMessage(`${messageType}-response`)
                ).payload;
                if (currentInputFocus === 'start-time') {
                  setStartTime(secondsToTimeString(duration));
                } else if (currentInputFocus === 'end-time') {
                  setEndTime(secondsToTimeString(duration));
                }
              }}
              label="End"
            />
          </div>
          <div className={classnames('flex', 'space-x-2')}>
            <Dropdown
              className={classnames('text-xs', 'w-1/2')}
              value={skipType}
              onChange={setSkipType}
              options={[
                { value: 'op', label: 'Opening' },
                { value: 'ed', label: 'Ending' },
              ]}
            />
            <Button
              className={classnames(
                'w-1/2',
                'inline',
                'bg-yellow-600',
                'text-white',
                'focus:ring-2',
                'focus:ring-yellow-100'
              )}
              submit
              label="Submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitMenu;
