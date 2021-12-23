import React, { useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { SkipButton } from '../SkipButton';
import { isInInterval, usePlayerRef } from '../../utils';
import { SkipButtonContainerProps } from './SkipButtonContainer.types';
import { useSelector } from '../../hooks';
import { selectSkipTimes } from '../../data';
import { DEFAULT_SKIP_OPTIONS, SkipOptions } from '../../scripts/background';
import { SkipTime } from '../../api';

export function SkipButtonContainer({
  variant,
}: SkipButtonContainerProps): JSX.Element | null {
  const [skipOptions, setSkipOptions] =
    useState<SkipOptions>(DEFAULT_SKIP_OPTIONS);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setInterval>>();
  const skipTimes = useSelector(selectSkipTimes);
  const player = usePlayerRef();

  const videoDuration = player?.getDuration() ?? 0;
  const currentTime = player?.getCurrentTime() ?? 0;

  /**
   * Retrieve the skip options and initialise countdown.
   */
  useEffect(() => {
    const initialiseSkipOptions = async (): Promise<void> => {
      const currentSkipOptions = (
        await browser.storage.sync.get({
          skipOptions: DEFAULT_SKIP_OPTIONS,
        })
      ).skipOptions;

      setSkipOptions(currentSkipOptions);
    };

    initialiseSkipOptions();

    // Setup countdown.
    if (!timeoutId) {
      setTimeoutId(
        setInterval((): void => {
          setTimeRemaining((currentTimeRemaining) =>
            currentTimeRemaining > 0 ? currentTimeRemaining - 1 : 0
          );
        }, 1000)
      );
    }

    return (): void => {
      if (timeoutId) {
        clearInterval(timeoutId);
      }
    };
  }, []);

  /**
   * Add on mouse move event listener.
   */
  useEffect(() => {
    const onMouseMove = (): void => {
      setTimeRemaining(3);
    };

    const videoElement = player?.getVideoContainer();

    videoElement?.addEventListener('mousemove', onMouseMove);

    return (): void =>
      videoElement?.removeEventListener('mousemove', onMouseMove);
  }, [player]);

  /**
   * Changes the player current time to the skip end time.
   *
   * @param skipToTime Time to skip to.
   */
  const onClick = (skipToTime: number) => (): void => {
    player?.setCurrentTime(skipToTime);
    player?.play();
  };

  /**
   * Returns the skip time closest to the current time.
   */
  const getClosestSkipTime = (): SkipTime | null => {
    let closestSkipTime: SkipTime | null = null;
    let minimumDistance = Infinity;

    skipTimes.forEach((skipTime) => {
      if (skipTime.skipType === 'preview') {
        return;
      }

      const { skipType, interval } = skipTime;
      const isManualSkip = skipOptions[skipType] === 'manual-skip';

      const distance = Math.abs(currentTime - interval.startTime);

      if (isManualSkip && distance < minimumDistance) {
        closestSkipTime = skipTime;
        minimumDistance = distance;
      }
    });

    return closestSkipTime;
  };

  /**
   * Calculates whether or not the player controls are visible.
   */
  const calculateIsPlayerControlsVisible = (): boolean => {
    const playerControlsElement = player?.getVideoControlsContainer();

    if (!playerControlsElement) {
      return false;
    }

    const opacity = window
      .getComputedStyle(playerControlsElement)
      .getPropertyValue('opacity');

    return parseFloat(opacity) > 0;
  };

  const closestSkipTime = getClosestSkipTime();

  if (!closestSkipTime) {
    return null;
  }

  const { startTime, endTime } = closestSkipTime.interval;
  const offset = videoDuration - closestSkipTime.episodeLength;

  const inInterval = isInInterval(startTime, endTime, currentTime, offset);
  const isInStartingInterval = isInInterval(
    startTime,
    startTime + 8,
    currentTime,
    offset
  );

  const isPlayerControlsVisible = calculateIsPlayerControlsVisible();

  const isVisible =
    isInStartingInterval ||
    (inInterval && timeRemaining !== 0 && isPlayerControlsVisible);

  return (
    <SkipButton
      skipType={closestSkipTime.skipType}
      variant={variant}
      hidden={!isVisible}
      onClick={onClick(endTime + offset)}
    />
  );
}
