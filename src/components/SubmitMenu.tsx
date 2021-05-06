import React, { useEffect, useRef, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { FaPlay, FaTimes } from 'react-icons/fa';
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
  fullScreen,
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
    '([0-9]+:)?[0-9]{1,2}:[0-9]{1,2}(.[0-9]{1,3})?'
  );
  const inputPatternTestRegexRef = useRef(/^[0-9:.]*$/);

  /**
   * Handles the form event when the submit button is pressed
   * @param event Form event
   */
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
  };

  useEffect(() => {
    if (!hidden) {
      (async () => {
        let messageType = 'player-get-video-duration';
        browser.runtime.sendMessage({ type: messageType });
        const duration: number = (
          await waitForMessage(`${messageType}-response`)
        ).payload;

        messageType = 'player-get-video-current-time';
        browser.runtime.sendMessage({ type: messageType });
        const currentTime: number = (
          await waitForMessage(`${messageType}-response`)
        ).payload;
        setStartTime(secondsToTimeString(currentTime));
        let newEndTime = currentTime + 90;
        if (newEndTime > duration) {
          newEndTime = duration;
        }
        setEndTime(secondsToTimeString(newEndTime));
        setSkipType(currentTime < duration / 2 ? 'op' : 'ed');
      })();
    }
  }, [hidden]);

  return (
    <div
      className={`bg-trueGray-800 bg-opacity-80 border border-gray-300 right-5 bottom-28 absolute select-none rounded-md w-96 z-10 transition-opacity ${
        hidden && 'opacity-0 pointer-events-none'
      } submit-menu--${variant} ${
        fullScreen && `submit-menu--${variant}--fullscreen`
      }`}
      role="menu"
    >
      <div className="flex justify-between items-center w-full h-auto px-5 pt-2">
        <div className="flex items-center space-x-1 outline-none">
          <FaPlay className="text-yellow-600" size={12} />
          <span className="text-white font-bold text-sm uppercase">
            Submit skip times
          </span>
        </div>
        <button
          type="button"
          className="flex justify-center items-center w-3 h-3 focus:outline-none text-white active:text-yellow-600"
          onClick={() => onClose()}
        >
          <FaTimes />
        </button>
      </div>
      <div className="px-5 py-4 mx-auto">
        <form className="block space-y-2 mb-0" onSubmit={handleSubmit}>
          <div className="flex space-x-2">
            <div className="flex-1">
              <div className="text-white font-bold text-xs uppercase">
                Start time
              </div>
              <Input
                className="shadow-sm w-full text-black text-sm focus:border-yellow-600 focus:ring-yellow-600 focus:ring-1"
                id="start-time"
                value={startTime}
                pattern={inputPatternRegexStringRef.current}
                required
                title="Hours : Minutes : Seconds"
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
            </div>
            <div className="flex-1">
              <div className="text-white font-bold text-xs uppercase">
                End time
              </div>
              <Input
                className="shadow-sm w-full text-black text-sm focus:border-yellow-600 focus:ring-yellow-600 focus:ring-1"
                id="end-time"
                value={endTime}
                pattern={inputPatternRegexStringRef.current}
                required
                title="Hours : Minutes : Seconds"
                placeholder="End time"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const timeString = event.currentTarget.value;
                  const testRegex = inputPatternTestRegexRef.current;
                  if (testRegex.test(timeString)) {
                    setEndTime(timeString);
                  }
                }}
                onFocus={() => setCurrentInputFocus('end-time')}
                onBlur={() =>
                  setEndTime((current) => formatTimeString(current))
                }
              />
            </div>
          </div>
          <div className="flex text-black space-x-2">
            <Button
              className="shadow-sm flex-1 bg-yellow-600 bg-opacity-80 border border-gray-300 text-white"
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
            >
              Now
            </Button>
            <Button
              className="shadow-sm flex-1 bg-yellow-600 bg-opacity-80 border border-gray-300 text-white"
              onClick={async () => {
                const messageType = 'player-add-preview-skip-time';
                browser.runtime.sendMessage({
                  type: messageType,
                  payload: {
                    interval: {
                      startTime: timeStringToSeconds(startTime),
                      endTime: timeStringToSeconds(endTime),
                    },
                    skipType,
                  },
                });
              }}
            >
              Preview
            </Button>
            <Button
              className="shadow-sm flex-1 bg-yellow-600 bg-opacity-80 border border-gray-300 text-white"
              onClick={async () => {
                const messageType = 'player-get-video-duration';
                browser.runtime.sendMessage({ type: messageType });
                const duration: number = (
                  await waitForMessage(`${messageType}-response`)
                ).payload;
                const trimmedDuration = Math.floor(duration);

                if (currentInputFocus === 'start-time') {
                  setStartTime(secondsToTimeString(trimmedDuration));
                } else if (currentInputFocus === 'end-time') {
                  setEndTime(secondsToTimeString(trimmedDuration));
                }
              }}
            >
              End
            </Button>
          </div>
          <div>
            <div className="text-white text-xs font-bold uppercase">
              Skip type
            </div>
            <div className="flex space-x-2">
              <Dropdown
                className="text-sm w-1/2"
                value={skipType}
                onChange={setSkipType}
                options={[
                  { value: 'op', label: 'Opening' },
                  { value: 'ed', label: 'Ending' },
                ]}
              />
              <Button
                className="shadow-sm w-1/2 inline bg-yellow-600 bg-opacity-80 border border-gray-300 text-white"
                submit
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitMenu;
