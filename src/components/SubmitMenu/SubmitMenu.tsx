import React, { useEffect, useRef, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { FaBackward, FaForward, FaPlay, FaTimes } from 'react-icons/fa';
import { AniskipHttpClientErrorCode, SkipTime, SkipType } from '../../api';
import { DefaultButton } from '../DefaultButton';
import { Dropdown } from '../Dropdown';
import { Input } from '../Input';
import { Message } from '../../scripts/background';
import { SubmitMenuProps } from './SubmitMenu.types';
import {
  formatTimeString,
  secondsToTimeString,
  timeStringToSeconds,
} from '../../utils';
import { useAniskipHttpClient } from '../../hooks';

export const SubmitMenu = ({
  hidden,
  onSubmit,
  onClose,
}: SubmitMenuProps): JSX.Element => {
  const { aniskipHttpClient } = useAniskipHttpClient();
  const [skipType, setSkipType] = useState<SkipType>('op');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [currentInputFocus, setCurrentInputFocus] =
    useState<'start-time' | 'end-time'>('start-time');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [serverError, setServerError] = useState('');
  const inputPatternRegexStringRef = useRef(
    '([0-9]+:)?[0-9]{1,2}:[0-9]{1,2}(.[0-9]{1,3})?'
  );
  const inputPatternTestRegexRef = useRef(/^[0-9:.]*$/);

  useEffect(() => {
    if (!hidden) {
      (async (): Promise<void> => {
        const duration = await browser.runtime.sendMessage({
          type: 'player-get-duration',
        } as Message);

        const currentTime = await browser.runtime.sendMessage({
          type: 'player-get-current-time',
        } as Message);

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
   * Correct user input errors such as negative time or time greater than video
   * duration.
   *
   * @param seconds Seconds to error correct.
   */
  const errorCorrectTime = async (seconds: number): Promise<number> => {
    let result = seconds;
    if (seconds < 0) {
      result = 0;
    }

    const duration = await browser.runtime.sendMessage({
      type: 'player-get-duration',
    } as Message);

    if (seconds >= duration) {
      result = Math.floor(duration);
    }

    return result;
  };

  /**
   * Validates the form. Returns false if form has errors, otherwise true.
   */
  const validateForm = (): boolean => {
    const startTimeSeconds = timeStringToSeconds(startTime);
    const endTimeSeconds = timeStringToSeconds(endTime);

    if (startTimeSeconds > endTimeSeconds) {
      setFormError('Start time is greater than end time');
      return false;
    }

    if (endTime === startTime) {
      setFormError('Start time and end time are the same');
      return false;
    }

    setFormError('');

    return true;
  };

  /**
   * Handles the form event when the submit button is pressed.
   *
   * @param event Form event.
   */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    const { userId } = await browser.storage.sync.get('userId');
    const { malId, episodeNumber, providerName } =
      await browser.runtime.sendMessage({
        type: 'get-episode-information',
      } as Message);
    const duration = await browser.runtime.sendMessage({
      type: 'player-get-duration',
    } as Message);

    const startTimeSeconds = timeStringToSeconds(startTime);
    const endTimeSeconds = timeStringToSeconds(endTime);

    try {
      const { skip_id: skipId } = await aniskipHttpClient.createSkipTimes(
        malId,
        episodeNumber,
        skipType,
        providerName,
        startTimeSeconds,
        endTimeSeconds,
        duration,
        userId
      );

      browser.runtime.sendMessage({
        type: `player-add-skip-time`,
        payload: {
          interval: {
            start_time: startTimeSeconds,
            end_time: endTimeSeconds,
          },
          skip_type: skipType,
          skip_id: skipId,
          episode_length: duration,
        },
      } as Message);

      setServerError('');
      onSubmit();
    } catch (err) {
      switch (err.code as AniskipHttpClientErrorCode) {
        case 'skip-times/parameter-error':
          setServerError('Input errors, please double check your skip times');
          break;
        case 'skip-times/rate-limited':
          setServerError('Created too many skip times, please try again later');
          break;
        case 'skip-times/internal-server-error':
        default:
          setServerError('Internal server error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles input on key down events to update input time.
   *
   * @param setTime Set time useState function.
   */
  const handleOnKeyDown =
    (setTime: React.Dispatch<React.SetStateAction<string>>) =>
    async (event: React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
      const timeString = event.currentTarget.value;
      const timeSeconds = timeStringToSeconds(timeString);
      let modifier = 0.25;
      let updatedTime = timeSeconds;

      switch (event.key) {
        case 'J': {
          modifier = 0.1;
        }
        /* falls through */
        case 'j': {
          updatedTime -= modifier;
          break;
        }
        case 'L': {
          modifier = 0.1;
        }
        /* falls through */
        case 'l': {
          updatedTime += modifier;
          break;
        }
        default:
      }

      if (updatedTime === timeSeconds) {
        return;
      }

      updatedTime = await errorCorrectTime(updatedTime);

      browser.runtime.sendMessage({
        type: 'player-set-current-time',
        payload: updatedTime,
      } as Message);

      const updatedTimeString = secondsToTimeString(updatedTime);
      setTime(updatedTimeString);
    };

  /**
   * Adds the seek offset to the currently highligted time input.
   *
   * @param seekOffset Number to add to current time.
   */
  const handleSeekTime = (seekOffset: number) => async (): Promise<void> => {
    let setTimeFunction = (_newValue: string): void => {};
    let currentTime = '';
    switch (currentInputFocus) {
      case 'start-time':
        setTimeFunction = setStartTime;
        currentTime = startTime;
        break;
      case 'end-time':
        setTimeFunction = setEndTime;
        currentTime = endTime;
        break;
      default:
        return;
    }

    const updatedTime = await errorCorrectTime(
      timeStringToSeconds(currentTime) + seekOffset
    );

    setTimeFunction(secondsToTimeString(updatedTime));
    browser.runtime.sendMessage({
      type: 'player-set-current-time',
      payload: updatedTime,
    } as Message);
  };

  /**
   * Formats time input on blur.
   *
   * @param setTime Set time useState function.
   */
  const handleOnBlur =
    (
      setTime: React.Dispatch<React.SetStateAction<string>>,
      currentTime: string
    ) =>
    async (): Promise<void> => {
      const formatted = formatTimeString(currentTime);
      const seconds = await errorCorrectTime(timeStringToSeconds(formatted));
      setTime(secondsToTimeString(seconds));
    };

  return (
    <div
      className={`text-sm md:text-base font-sans w-[26em] px-5 pt-2 pb-4 bg-trueGray-800 bg-opacity-80 border border-gray-300 select-none rounded-md transition-opacity text-white opacity-0 pointer-events-none ${
        !hidden ? 'sm:opacity-100 sm:pointer-events-auto' : ''
      }`}
      role="menu"
    >
      <div className="flex justify-between items-center w-full h-auto mb-4">
        <div className="flex items-center space-x-1 outline-none">
          <FaPlay className="text-primary" size={12} />
          <span className="font-bold text-sm uppercase">Submit skip times</span>
        </div>
        <button
          type="button"
          className="flex justify-center items-center focus:outline-none"
          onClick={(): void => onClose()}
        >
          <FaTimes className="w-4 h-4 active:text-primary" />
        </button>
      </div>
      <form className="space-y-2" onSubmit={handleSubmit}>
        <div className="flex space-x-2">
          <div className="flex-1">
            <div className="font-bold text-xs uppercase mb-1">Start time</div>
            <Input
              className={`shadow-sm w-full text-black text-sm focus:border-primary focus:ring-primary focus:ring-1 ${
                currentInputFocus === 'start-time'
                  ? 'border-primary ring-primary ring-1'
                  : ''
              }`}
              id="start-time"
              value={startTime}
              pattern={inputPatternRegexStringRef.current}
              required
              title="Hours : Minutes : Seconds"
              placeholder="Start time"
              onChange={(event): void => {
                const timeString = event.currentTarget.value;
                const testRegex = inputPatternTestRegexRef.current;
                if (testRegex.test(timeString)) {
                  setStartTime(timeString);
                }
              }}
              onKeyDown={handleOnKeyDown(setStartTime)}
              onFocus={(): void => setCurrentInputFocus('start-time')}
              onBlur={handleOnBlur(setStartTime, startTime)}
            />
          </div>
          <div className="flex-1">
            <div className="font-bold text-xs uppercase mb-1">End time</div>
            <Input
              className={`shadow-sm w-full text-black text-sm focus:border-primary focus:ring-primary focus:ring-1 ${
                currentInputFocus === 'end-time'
                  ? 'border-primary ring-primary ring-1'
                  : ''
              }`}
              id="end-time"
              value={endTime}
              pattern={inputPatternRegexStringRef.current}
              required
              title="Hours : Minutes : Seconds"
              placeholder="End time"
              onChange={(event): void => {
                const timeString = event.currentTarget.value;
                const testRegex = inputPatternTestRegexRef.current;
                if (testRegex.test(timeString)) {
                  setEndTime(timeString);
                }
              }}
              onKeyDown={handleOnKeyDown(setEndTime)}
              onFocus={(): void => setCurrentInputFocus('end-time')}
              onBlur={handleOnBlur(setEndTime, endTime)}
            />
          </div>
        </div>
        <div className="text-xs uppercase font-bold text-red-500">
          {formError}
        </div>
        <div>
          <div className="font-bold text-xs uppercase mb-1">Time controls</div>
          <div className="flex space-x-2">
            <DefaultButton
              className="shadow-sm flex-1 bg-primary bg-opacity-80 border border-gray-300"
              onClick={async (): Promise<void> => {
                const episodeLength = await browser.runtime.sendMessage({
                  type: 'player-get-duration',
                } as Message);
                browser.runtime.sendMessage({
                  type: 'player-add-skip-time',
                  payload: {
                    interval: {
                      start_time: timeStringToSeconds(startTime),
                      end_time: timeStringToSeconds(endTime),
                    },
                    skip_type: 'preview',
                    skip_id: '',
                    episode_length: episodeLength,
                  } as SkipTime,
                } as Message);
              }}
            >
              Preview
            </DefaultButton>
            <div className="flex justify-between bg-primary bg-opacity-80 border border-gray-300 rounded">
              <DefaultButton
                title="Seek -0.25s"
                className="group px-3"
                onClick={handleSeekTime(-0.25)}
              >
                <FaBackward
                  className="transition-transform duration-150 transform group-hover:scale-125 group-active:scale-100"
                  size={16}
                />
              </DefaultButton>
              <DefaultButton
                className="px-3"
                onClick={async (): Promise<void> => {
                  const currentTime = await browser.runtime.sendMessage({
                    type: 'player-get-current-time',
                  } as Message);

                  switch (currentInputFocus) {
                    case 'start-time':
                      setStartTime(secondsToTimeString(currentTime));
                      break;
                    case 'end-time':
                      setEndTime(secondsToTimeString(currentTime));
                      break;
                    default:
                  }
                }}
              >
                Now
              </DefaultButton>
              <DefaultButton
                title="Seek +0.25s"
                className="group px-3"
                onClick={handleSeekTime(0.25)}
              >
                <FaForward
                  className="transition-transform duration-150 transform group-hover:scale-125 group-active:scale-100"
                  size={16}
                />
              </DefaultButton>
            </div>
            <DefaultButton
              className="shadow-sm flex-1 bg-primary bg-opacity-80 border border-gray-300"
              onClick={async (): Promise<void> => {
                const duration = await browser.runtime.sendMessage({
                  type: 'player-get-duration',
                } as Message);
                const trimmedDuration = Math.floor(duration);

                switch (currentInputFocus) {
                  case 'start-time':
                    setStartTime(secondsToTimeString(trimmedDuration));
                    break;
                  case 'end-time':
                    setEndTime(secondsToTimeString(trimmedDuration));
                    break;
                  default:
                }
              }}
            >
              End
            </DefaultButton>
          </div>
        </div>
        <div>
          <div className="font-bold text-xs uppercase mb-1">Skip type</div>
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
                className="w-full h-full shadow-sm bg-primary bg-opacity-80 border border-gray-300"
                submit
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </DefaultButton>
            </div>
          </div>
        </div>
        <div className="text-xs uppercase font-bold text-red-500">
          {serverError}
        </div>
      </form>
    </div>
  );
};
