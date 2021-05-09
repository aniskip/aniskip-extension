import React, { useEffect, useRef, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { FaPlay, FaTimes } from 'react-icons/fa';

import { SubmitMenuProps } from '../../types/components/submit_types';
import {
  formatTimeString,
  secondsToTimeString,
  timeStringToSeconds,
} from '../../utils/string_utils';
import AniskipHttpClient from '../../api/aniskip_http_client';
import Dropdown from '../Dropdown';
import DefaultButton from '../Button';
import MenuButton from './Button';
import waitForMessage from '../../utils/message_utils';
import Input from '../Input';
import { SkipType } from '../../types/api/skip_time_types';
import useFullscreen from '../../hooks/use_fullscreen';

const SubmitMenu = ({
  variant,
  hidden,
  onSubmit,
  onClose,
}: SubmitMenuProps) => {
  const { isFullscreen } = useFullscreen();
  const [skipType, setSkipType] = useState<SkipType>('op');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [aniskipHttpClient] = useState<AniskipHttpClient>(
    new AniskipHttpClient()
  );
  const [currentInputFocus, setCurrentInputFocus] = useState<
    'start-time' | 'end-time'
  >();
  const inputPatternRegexStringRef = useRef(
    '([0-9]+:)?[0-9]{1,2}:[0-9]{1,2}(.[0-9]{1,3})?'
  );
  const inputPatternTestRegexRef = useRef(/^[0-9:.]*$/);

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
          newEndTime = Math.floor(duration);
        }
        setEndTime(secondsToTimeString(newEndTime));
        setSkipType(currentTime < duration / 2 ? 'op' : 'ed');
      })();
    }
  }, [hidden]);

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

    aniskipHttpClient.createSkipTimes(
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

  /**
   * Handles input on key down events to update input time
   * @param setTime Set time useState function
   */
  const handleOnKeyDown = (
    setTime: React.Dispatch<React.SetStateAction<string>>
  ) => (event: React.KeyboardEvent<HTMLInputElement>) => {
    const timeString = event.currentTarget.value;
    const timeSeconds = timeStringToSeconds(timeString);
    let modifier = 0.25;
    let updatedSeconds = timeSeconds;

    switch (event.key) {
      case 'H': {
        modifier = 0.1;
      }
      /* falls through */
      case 'h': {
        updatedSeconds -= modifier;
        break;
      }
      case 'L': {
        modifier = 0.1;
      }
      /* falls through */
      case 'l': {
        updatedSeconds += modifier;
        break;
      }
      default:
    }

    if (updatedSeconds < 0) {
      updatedSeconds = 0;
    }

    const updatedTimeString = secondsToTimeString(updatedSeconds);
    setTime(updatedTimeString);
  };

  return (
    <div
      className={`font-sans bg-trueGray-800 bg-opacity-80 border border-gray-300 right-5 bottom-28 absolute select-none rounded-md w-96 z-10 transition-opacity ${
        hidden && 'opacity-0 pointer-events-none'
      } submit-menu--${variant} ${
        isFullscreen && `submit-menu--${variant}--fullscreen`
      }`}
      role="menu"
    >
      <div className="flex justify-between items-center w-full h-auto px-5 pt-2">
        <div className="flex items-center space-x-1 outline-none">
          <FaPlay className="text-primary" size={12} />
          <span className="text-white font-bold text-sm uppercase">
            Submit skip times
          </span>
        </div>
        <button
          type="button"
          className="flex justify-center items-center w-3 h-3 focus:outline-none text-white active:text-primary"
          onClick={() => onClose()}
        >
          <FaTimes />
        </button>
      </div>
      <div className="px-5 py-4 mx-auto">
        <form className="block space-y-2 mb-0" onSubmit={handleSubmit}>
          <div className="flex space-x-2">
            <div className="flex-1">
              <div className="text-white font-bold text-xs uppercase mb-1">
                Start time
              </div>
              <Input
                className="shadow-sm w-full text-black text-sm focus:border-primary focus:ring-primary focus:ring-1"
                id="start-time"
                value={startTime}
                pattern={inputPatternRegexStringRef.current}
                required
                title="Hours : Minutes : Seconds"
                placeholder="Start time"
                onChange={(event) => {
                  const timeString = event.currentTarget.value;
                  const testRegex = inputPatternTestRegexRef.current;
                  if (testRegex.test(timeString)) {
                    setStartTime(timeString);
                  }
                }}
                onKeyDown={handleOnKeyDown(setStartTime)}
                onFocus={() => setCurrentInputFocus('start-time')}
                onBlur={() =>
                  setStartTime((current) => formatTimeString(current))
                }
              />
            </div>
            <div className="flex-1">
              <div className="text-white font-bold text-xs uppercase mb-1">
                End time
              </div>
              <Input
                className="shadow-sm w-full text-black text-sm focus:border-primary focus:ring-primary focus:ring-1"
                id="end-time"
                value={endTime}
                pattern={inputPatternRegexStringRef.current}
                required
                title="Hours : Minutes : Seconds"
                placeholder="End time"
                onChange={(event) => {
                  const timeString = event.currentTarget.value;
                  const testRegex = inputPatternTestRegexRef.current;
                  if (testRegex.test(timeString)) {
                    setEndTime(timeString);
                  }
                }}
                onKeyDown={handleOnKeyDown(setEndTime)}
                onFocus={() => setCurrentInputFocus('end-time')}
                onBlur={() =>
                  setEndTime((current) => formatTimeString(current))
                }
              />
            </div>
          </div>
          <div className="flex text-black space-x-2">
            <DefaultButton
              className="shadow-sm flex-1 bg-primary bg-opacity-80 border border-gray-300 text-white"
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
            </DefaultButton>
            <DefaultButton
              className="shadow-sm flex-1 bg-primary bg-opacity-80 border border-gray-300 text-white"
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
            </DefaultButton>
            <DefaultButton
              className="shadow-sm flex-1 bg-primary bg-opacity-80 border border-gray-300 text-white"
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
            </DefaultButton>
          </div>
          <div>
            <div className="text-white font-bold text-xs uppercase mb-1">
              Skip type
            </div>
            <div className="flex space-x-2">
              <Dropdown
                className="flex-1 text-sm"
                value={skipType}
                onChange={setSkipType}
                options={[
                  { value: 'op', label: 'Opening' },
                  { value: 'ed', label: 'Ending' },
                ]}
              />
              <div className="flex-1">
                <DefaultButton
                  className="w-full h-full shadow-sm bg-primary bg-opacity-80 border border-gray-300 text-white"
                  submit
                >
                  Submit
                </DefaultButton>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

SubmitMenu.Button = MenuButton;

export default SubmitMenu;
