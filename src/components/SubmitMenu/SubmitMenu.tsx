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
  roundToClosestMultiple,
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
  selectChangeCurrentTimeFramesLarge,
  selectChangeCurrentTimeFrames,
  selectIsSubmitMenuVisible,
  selectKeybinds,
  selectSkipTimeLength,
  changeCurrentTimeFramesLargeUpdated,
  changeCurrentTimeFramesUpdated,
  keybindsUpdated,
  skipTimeLengthUpdated,
  previewSkipTimeAdded,
  previewSkipTimeRemoved,
  previewSkipTimeIntervalUpdated,
  selectPlayerControlsListenerType,
  selectIsPreviewButtonEmulatingAutoSkip,
  isPreviewButtonEmulatingAutoSkipUpdated,
} from '../../data';
import { FRAME_RATE } from '../../players/base-player.types';

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
  const changeCurrentTimeFrames = useSelector(selectChangeCurrentTimeFrames);
  const changeCurrentTimeFramesLarge = useSelector(
    selectChangeCurrentTimeFramesLarge
  );
  const playerControlsEventListenerType = useSelector(
    selectPlayerControlsListenerType
  );
  const isPreviewButtonEmulatingAutoSkip = useSelector(
    selectIsPreviewButtonEmulatingAutoSkip
  );
  const player = usePlayerRef();
  const dispatch = useDispatch();

  const skipTypeDropdownOptions = SKIP_TYPES.map((type) => ({
    id: type,
    label: SKIP_TYPE_NAMES[type],
  }));

  const skipTypeDropdownOptionsProps: DropdownOptionsProps = {
    className: 'max-h-[5.5rem]',
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
      let modifier = changeCurrentTimeFrames;
      let updatedTime = timeSeconds;

      switch (serialiseKeybind(event)) {
        case keybinds['decrease-current-time-large']: {
          modifier = changeCurrentTimeFramesLarge;
        }
        /* falls through */
        case keybinds['decrease-current-time']: {
          updatedTime -= modifier * FRAME_RATE;
          break;
        }
        case keybinds['increase-current-time-large']: {
          modifier = changeCurrentTimeFramesLarge;
        }
        /* falls through */
        case keybinds['increase-current-time']: {
          updatedTime += modifier * FRAME_RATE;
          break;
        }
        default:
        // no default
      }

      if (updatedTime === timeSeconds) {
        return;
      }

      updatedTime = errorCorrectTime(
        roundToClosestMultiple(updatedTime, FRAME_RATE)
      );

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
        roundToClosestMultiple(
          timeStringToSeconds(currentTime) + seekOffset * FRAME_RATE,
          FRAME_RATE
        )
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

    if (isPreviewButtonEmulatingAutoSkip) {
      player?.setCurrentTime(timeStringToSeconds(startTime) - 2);
      player?.play();

      return;
    }

    if (currentInputFocus === 'start-time') {
      // Ensure that it does not auto skip.
      player?.setCurrentTime(timeStringToSeconds(startTime) + 0.001);
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
      const seekOffset = event.deltaY > 0 ? -FRAME_RATE : FRAME_RATE;
      const updatedTime = errorCorrectTime(
        roundToClosestMultiple(timeSeconds + seekOffset, FRAME_RATE)
      );

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
        changeCurrentTimeFramesUpdated(syncOptions.changeCurrentTimeFrames)
      );
      dispatch(
        changeCurrentTimeFramesLargeUpdated(
          syncOptions.changeCurrentTimeFramesLarge
        )
      );
      dispatch(
        isPreviewButtonEmulatingAutoSkipUpdated(
          syncOptions.isPreviewButtonEmulatingAutoSkip
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
      className={`pointer-events-none w-[26em] select-none rounded-md border border-gray-300 bg-neutral-800 bg-opacity-80 px-5 pb-4 pt-2 font-sans text-sm text-white opacity-0 backdrop-blur-md transition-opacity md:text-base ${
        visible ? 'sm:pointer-events-auto sm:opacity-100' : ''
      }`}
      role="menu"
    >
      <div className="mb-4 flex h-auto w-full items-center justify-between">
        <div className="flex items-center space-x-1 outline-none">
          <FaPlay className="text-primary" size={12} />
          <span className="text-sm font-bold uppercase">Submit skip times</span>
        </div>
        <button
          type="button"
          className="flex items-center justify-center focus:outline-none"
          onClick={onClickCloseButton}
        >
          <FaTimes className="h-4 w-4 active:text-primary" />
        </button>
      </div>
      <form className="space-y-2" onSubmit={onSkipTimeSubmit}>
        <div className="flex space-x-2">
          <div className="flex-1">
            <div className="mb-1 text-xs font-bold uppercase">Start time</div>
            <Input
              className={`w-full text-sm text-black shadow-sm focus:border-primary focus:ring-1 focus:ring-primary ${
                currentInputFocus === 'start-time'
                  ? 'border-primary ring-1 ring-primary'
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
            <div className="mb-1 text-xs font-bold uppercase">End time</div>
            <Input
              className={`w-full text-sm text-black shadow-sm focus:border-primary focus:ring-1 focus:ring-primary ${
                currentInputFocus === 'end-time'
                  ? 'border-primary ring-1 ring-primary'
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
        <div className="text-xs font-bold uppercase text-red-500">
          {formError}
        </div>
        <div>
          <div className="mb-1 text-xs font-bold uppercase">Time controls</div>
          <div className="flex space-x-2">
            <DefaultButton
              className="flex-1 border border-gray-300 bg-primary bg-opacity-80 font-medium shadow-sm hover:bg-amber-600"
              onClick={onClickPreviewButton}
            >
              Preview
            </DefaultButton>
            <div className="flex justify-between rounded border border-gray-300 bg-primary bg-opacity-80 hover:bg-amber-600">
              <DefaultButton
                title={`Seek -${changeCurrentTimeFramesLarge} frame(s)`}
                className="group px-3"
                onClick={onClickSeekTime(-changeCurrentTimeFramesLarge)}
              >
                <FaBackward
                  className="transform transition-transform duration-150 group-hover:scale-125 group-active:scale-100"
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
                title={`Seek +${changeCurrentTimeFramesLarge} frame(s)`}
                className="group px-3"
                onClick={onClickSeekTime(changeCurrentTimeFramesLarge)}
              >
                <FaForward
                  className="transform transition-transform duration-150 group-hover:scale-125 group-active:scale-100"
                  size={16}
                />
              </DefaultButton>
            </div>
            <DefaultButton
              className="flex-1 border border-gray-300 bg-primary bg-opacity-80 font-medium shadow-sm hover:bg-amber-600"
              onClick={onClickEndButton}
            >
              End
            </DefaultButton>
          </div>
        </div>
        <div>
          <div className="mb-1 text-xs font-bold uppercase">Skip type</div>
          <div className="flex space-x-2">
            <Dropdown
              className="flex-1 text-sm"
              value={skipType}
              onChange={setSkipType}
              options={skipTypeDropdownOptions}
              dropdownOptionsProps={skipTypeDropdownOptionsProps}
            />
            <div className="group flex-1">
              <DefaultButton
                className="h-full w-full border-2 border-primary border-opacity-100 shadow-sm group-hover:border-amber-600"
                submit
                disabled={isSubmitting}
              >
                <span className="font-medium text-primary text-opacity-100 group-hover:text-amber-600">
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </span>
              </DefaultButton>
            </div>
          </div>
        </div>
        <div className="text-xs font-bold uppercase text-red-500">
          {serverError}
        </div>
      </form>
    </div>
  );
}
