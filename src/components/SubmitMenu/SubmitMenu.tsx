import React, { useEffect, useRef, useState, useCallback } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { FaBackward, FaForward, FaPlay, FaTimes } from 'react-icons/fa';
import {
  AniskipHttpClientErrorCode,
  SkipTime,
  SkipType,
  SKIP_TYPE_NAMES,
  SKIP_TYPES,
  AniskipHttpClient,
  PreviewSkipTime,
} from '../../api';
import { DefaultButton } from '../DefaultButton';
import { Dropdown, DropdownOptionsProps } from '../Dropdown';
import { Input } from '../Input';
import {
  DEFAULT_SYNC_OPTIONS,
  Message,
  SyncOptions,
} from '../../scripts/background';
import {
  formatTimeString,
  secondsToTimeString,
  serialiseKeybind,
  timeStringToSeconds,
  useDispatch,
  usePlayerRef,
  useSelector,
  useWindowEvent,
} from '../../utils';
import {
  submitMenuVisibilityUpdated,
  selectChangeCurrentTimeLargeLength,
  selectChangeCurrentTimeLength,
  selectIsSubmitMenuVisible,
  selectKeybinds,
  selectSkipTimeLength,
  changeCurrentTimeLargeLengthUpdated,
  changeCurrentTimeLengthUpdated,
  keybindsUpdated,
  skipTimeLengthUpdated,
  previewSkipTimeAdded,
  previewSkipTimeRemoved,
  previewSkipTimeIntervalUpdated,
  selectPlayerControlsListenerType,
} from '../../data';

export function SubmitMenu(): JSX.Element {
  const aniskipHttpClientRef = useRef<AniskipHttpClient>(
    new AniskipHttpClient()
  );
  const [skipType, setSkipType] = useState<SkipType>('op');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [currentInputFocus, setCurrentInputFocus] = useState<
    'start-time' | 'end-time'
  >('start-time');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [serverError, setServerError] = useState('');
  const inputPatternRegexStringRef = useRef(
    '([0-9]+:)?[0-9]{1,2}:[0-9]{1,2}(.[0-9]{1,3})?'
  );
  const inputPatternTestRegexRef = useRef(/^[0-9:.]*$/);
  const visible = useSelector(selectIsSubmitMenuVisible);
  const keybinds = useSelector(selectKeybinds);
  const skipTimeLength = useSelector(selectSkipTimeLength);
  const changeCurrentTimeLength = useSelector(selectChangeCurrentTimeLength);
  const changeCurrentTimeLargeLength = useSelector(
    selectChangeCurrentTimeLargeLength
  );
  const playerControlsEventListenerType = useSelector(
    selectPlayerControlsListenerType
  );
  const player = usePlayerRef();
  const dispatch = useDispatch();

  const skipTypeDropdownOptions = SKIP_TYPES.map((type) => ({
    id: type,
    label: SKIP_TYPE_NAMES[type],
  }));

  const skipTypeDropdownOptionsProps: DropdownOptionsProps = {
    className: 'max-h-[5.5em]',
  };

  /**
   * Correct user input errors such as negative time or time greater than video
   * duration.
   *
   * @param seconds Seconds to error correct.
   */
  const errorCorrectTime = (seconds: number): number => {
    let result = seconds;
    if (seconds < 0) {
      result = 0;
    }

    const duration = player?.getDuration() ?? 0;

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
  const onSkipTimeSubmit = async (
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
    const duration = player?.getDuration() ?? 0;

    const startTimeSeconds = timeStringToSeconds(startTime);
    const endTimeSeconds = timeStringToSeconds(endTime);

    try {
      const { skipId } = await aniskipHttpClientRef.current.createSkipTimes(
        malId,
        episodeNumber,
        skipType,
        providerName,
        startTimeSeconds,
        endTimeSeconds,
        duration,
        userId
      );

      const skipTime: SkipTime = {
        interval: {
          startTime: startTimeSeconds,
          endTime: endTimeSeconds,
        },
        skipType,
        skipId,
        episodeLength: duration,
      };

      player?.addSkipTime(skipTime);

      setServerError('');
      dispatch(submitMenuVisibilityUpdated(false));
    } catch (error: any) {
      switch (error.code as AniskipHttpClientErrorCode) {
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
  const onKeyDown =
    (setTime: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      const timeString = event.currentTarget.value;
      const timeSeconds = timeStringToSeconds(timeString);
      let modifier = changeCurrentTimeLength;
      let updatedTime = timeSeconds;

      switch (serialiseKeybind(event)) {
        case keybinds['decrease-current-time-large']: {
          modifier = changeCurrentTimeLargeLength;
        }
        /* falls through */
        case keybinds['decrease-current-time']: {
          updatedTime -= modifier;
          break;
        }
        case keybinds['increase-current-time-large']: {
          modifier = changeCurrentTimeLargeLength;
        }
        /* falls through */
        case keybinds['increase-current-time']: {
          updatedTime += modifier;
          break;
        }
        default:
        // no default
      }

      if (updatedTime === timeSeconds) {
        return;
      }

      updatedTime = errorCorrectTime(updatedTime);

      player?.setCurrentTime(updatedTime);

      const updatedTimeString = secondsToTimeString(updatedTime);
      setTime(updatedTimeString);
    };

  /**
   * Adds the seek offset to the currently highligted time input.
   *
   * @param seekOffset Number to add to current time.
   */
  const onClickSeekTime =
    (seekOffset: number) =>
    async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
      event.currentTarget.blur();

      let setTimeFunction: React.Dispatch<React.SetStateAction<string>>;
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

      const updatedTime = errorCorrectTime(
        timeStringToSeconds(currentTime) + seekOffset
      );

      setTimeFunction(secondsToTimeString(updatedTime));
      player?.setCurrentTime(updatedTime);
    };

  /**
   * Formats time input on blur.
   *
   * @param setTime Set time useState function.
   * @param currentTime Current start or end time.
   */
  const onBlur =
    (
      setTime: React.Dispatch<React.SetStateAction<string>>,
      currentTime: string
    ) =>
    (): void => {
      const formatted = formatTimeString(currentTime);
      const seconds = errorCorrectTime(timeStringToSeconds(formatted));
      setTime(secondsToTimeString(seconds));
    };

  /**
   * Closes the submit menu.
   */
  const onClickCloseButton = (): void => {
    dispatch(submitMenuVisibilityUpdated(false));
  };

  /**
   * Adds a preview skip time.
   */
  const onClickPreviewButton = async (
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    event.currentTarget.blur();

    if (currentInputFocus === 'start-time') {
      player?.setCurrentTime(timeStringToSeconds(startTime) - 2);
    } else {
      player?.setCurrentTime(timeStringToSeconds(endTime));
    }

    player?.play();
  };

  /**
   * Sets the focused input to the current player time.
   */
  const onClickNowButton = async (
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    event.currentTarget.blur();

    const currentTime = player?.getCurrentTime() ?? 0;

    switch (currentInputFocus) {
      case 'start-time':
        setStartTime(secondsToTimeString(currentTime));
        break;
      case 'end-time':
        setEndTime(secondsToTimeString(currentTime));
        break;
      default:
      // no default
    }
  };

  /**
   * Sets the focused input to the video duration.
   */
  const onClickEndButton = async (
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    event.currentTarget.blur();

    const duration = player?.getDuration() ?? 0;
    const trimmedDuration = Math.floor(duration);

    switch (currentInputFocus) {
      case 'start-time':
        setStartTime(secondsToTimeString(trimmedDuration));
        break;
      case 'end-time':
        setEndTime(secondsToTimeString(trimmedDuration));
        break;
      default:
      // no default
    }
  };

  /**
   * Handles on change event for the input time.
   *
   * @param setTime React time setter function.
   * @param event Event.
   */
  const onChangeTime =
    (setTime: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const timeString = event.currentTarget.value;
      const testRegex = inputPatternTestRegexRef.current;

      if (!testRegex.test(timeString)) {
        return;
      }

      setTime(timeString);
    };

  /**
   * Handles the mouse wheel scroll in input boxes.
   *
   * @param setTime Set time useState function.
   * @param currentTime Current start or end time.
   */
  const onWheel =
    (
      setTime: React.Dispatch<React.SetStateAction<string>>,
      currentTime: string
    ) =>
    (event: React.WheelEvent<HTMLInputElement>): void => {
      const timeSeconds = timeStringToSeconds(currentTime);
      const seekOffset = event.deltaY > 0 ? -0.01 : 0.01;
      const updatedTime = errorCorrectTime(timeSeconds + seekOffset);

      setTime(secondsToTimeString(updatedTime));

      player?.setCurrentTime(updatedTime);
    };

  /**
   * Prevents page scrolling.
   *
   * @param event Mouse wheel event.
   */
  const preventDefault = useCallback(
    (event: WheelEvent): void => event.preventDefault(),
    []
  );

  /**
   * Handles the disabling of page scroll when the mouse enters the input
   * element.
   */
  const onPointerEnter = (): void => {
    window.addEventListener('wheel', preventDefault, {
      passive: false,
    });
  };

  /**
   * Handles the enabling of page scroll when the mouse exists the input
   * element.
   */
  const onPointerLeave = (): void => {
    window.removeEventListener('wheel', preventDefault, false);
  };

  /**
   * Initialise the start time to the current time and the end time to the
   * current time + 90 (by default) seconds.
   */
  useEffect(() => {
    if (!visible) {
      dispatch(previewSkipTimeRemoved());

      return;
    }

    // Initialise the start and end time.
    const duration = player?.getDuration() ?? 0;

    const currentTime = player?.getCurrentTime() ?? 0;

    setStartTime(secondsToTimeString(currentTime));
    let newEndTime = currentTime + skipTimeLength;
    if (newEndTime > duration) {
      newEndTime = Math.floor(duration);
    }
    setEndTime(secondsToTimeString(newEndTime));
    setSkipType(currentTime < duration / 2 ? 'op' : 'ed');

    // Initialise preview skip time.
    const episodeLength = player?.getDuration() ?? 0;

    const previewSkipTime: PreviewSkipTime = {
      interval: {
        startTime: currentTime,
        endTime: newEndTime,
      },
      episodeLength,
    };

    dispatch(previewSkipTimeAdded(previewSkipTime));
  }, [visible]);

  /**
   * Initialise settings.
   */
  useEffect(() => {
    (async (): Promise<void> => {
      const syncOptions = (await browser.storage.sync.get(
        DEFAULT_SYNC_OPTIONS
      )) as SyncOptions;

      dispatch(keybindsUpdated(syncOptions.keybinds));
      dispatch(skipTimeLengthUpdated(syncOptions.skipTimeLength));
      dispatch(
        changeCurrentTimeLengthUpdated(syncOptions.changeCurrentTimeLength)
      );
      dispatch(
        changeCurrentTimeLargeLengthUpdated(
          syncOptions.changeCurrentTimeLargeLength
        )
      );
    })();
  }, []);

  /**
   * Sync start time with skip indicator.
   */
  useEffect(() => {
    const timeSeconds = timeStringToSeconds(startTime);

    dispatch(
      previewSkipTimeIntervalUpdated({
        intervalType: 'startTime',
        time: timeSeconds,
      })
    );
  }, [startTime]);

  /**
   * Sync end time with skip indicator.
   */
  useEffect(() => {
    const timeSeconds = timeStringToSeconds(endTime);

    dispatch(
      previewSkipTimeIntervalUpdated({
        intervalType: 'endTime',
        time: timeSeconds,
      })
    );
  }, [endTime]);

  useWindowEvent(playerControlsEventListenerType, (event: KeyboardEvent) => {
    const setTime =
      currentInputFocus === 'start-time' ? setStartTime : setEndTime;

    const currentTime = player?.getCurrentTime() ?? 0;
    const currentTimeString = secondsToTimeString(currentTime);

    switch (serialiseKeybind(event)) {
      case keybinds['seek-forward-one-frame']:
      case keybinds['seek-backward-one-frame']: {
        // No need to add or remove one frame as it is already updated due to
        // order of event listener registration.
        setTime(currentTimeString);
        break;
      }
      default:
      // no default
    }
  });

  return (
    <div
      className={`text-sm md:text-base font-sans w-[26em] px-5 pt-2 pb-4 bg-neutral-800 bg-opacity-80 border border-gray-300 select-none rounded-md transition-opacity text-white opacity-0 pointer-events-none backdrop-blur-md ${
        visible ? 'sm:opacity-100 sm:pointer-events-auto' : ''
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
          onClick={onClickCloseButton}
        >
          <FaTimes className="w-4 h-4 active:text-primary" />
        </button>
      </div>
      <form className="space-y-2" onSubmit={onSkipTimeSubmit}>
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
              onChange={onChangeTime(setStartTime)}
              onKeyDown={onKeyDown(setStartTime)}
              onFocus={(): void => setCurrentInputFocus('start-time')}
              onBlur={onBlur(setStartTime, startTime)}
              onWheel={onWheel(setStartTime, startTime)}
              onPointerEnter={onPointerEnter}
              onPointerLeave={onPointerLeave}
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
              onChange={onChangeTime(setEndTime)}
              onKeyDown={onKeyDown(setEndTime)}
              onFocus={(): void => setCurrentInputFocus('end-time')}
              onBlur={onBlur(setEndTime, endTime)}
              onWheel={onWheel(setEndTime, endTime)}
              onPointerEnter={onPointerEnter}
              onPointerLeave={onPointerLeave}
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
              className="shadow-sm flex-1 bg-primary bg-opacity-80 border border-gray-300 font-medium hover:bg-amber-600"
              onClick={onClickPreviewButton}
            >
              Preview
            </DefaultButton>
            <div className="flex justify-between bg-primary bg-opacity-80 border border-gray-300 rounded hover:bg-amber-600">
              <DefaultButton
                title={`Seek -${changeCurrentTimeLargeLength}s`}
                className="group px-3"
                onClick={onClickSeekTime(-changeCurrentTimeLargeLength)}
              >
                <FaBackward
                  className="transition-transform duration-150 transform group-hover:scale-125 group-active:scale-100"
                  size={16}
                />
              </DefaultButton>
              <DefaultButton
                className="px-3 font-medium"
                onClick={onClickNowButton}
              >
                Now
              </DefaultButton>
              <DefaultButton
                title={`Seek +${changeCurrentTimeLargeLength}s`}
                className="group px-3"
                onClick={onClickSeekTime(changeCurrentTimeLargeLength)}
              >
                <FaForward
                  className="transition-transform duration-150 transform group-hover:scale-125 group-active:scale-100"
                  size={16}
                />
              </DefaultButton>
            </div>
            <DefaultButton
              className="shadow-sm flex-1 bg-primary bg-opacity-80 border border-gray-300 font-medium hover:bg-amber-600"
              onClick={onClickEndButton}
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
              options={skipTypeDropdownOptions}
              dropdownOptionsProps={skipTypeDropdownOptionsProps}
            />
            <div className="flex-1 group">
              <DefaultButton
                className="w-full h-full shadow-sm border-2 boder-opacity-100 border-primary group-hover:border-amber-600"
                submit
                disabled={isSubmitting}
              >
                <span className="text-opacity-100 font-medium text-primary group-hover:text-amber-600">
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </span>
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
}
