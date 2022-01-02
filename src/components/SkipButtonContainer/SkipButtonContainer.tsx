import React, { useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { SkipButton } from '../SkipButton';
import {
  isInInterval,
  usePlayerRef,
  useSelector,
  useVariantRef,
} from '../../utils';
import { selectSkipTimes } from '../../data';
import { DEFAULT_SKIP_OPTIONS, SkipOptions } from '../../scripts/background';
import { SkipTime } from '../../api';

export function SkipButtonContainer(): JSX.Element | null {
  const [skipOptions, setSkipOptions] =
    useState<SkipOptions>(DEFAULT_SKIP_OPTIONS);
  const skipTimes = useSelector(selectSkipTimes);
  const variant = useVariantRef();
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
  }, []);

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
  const getClosestSkipTime = (): SkipTime | undefined => {
    let closestSkipTime: SkipTime | undefined;
    let minimumDistance = Infinity;

    skipTimes.forEach((skipTime) => {
      const { skipType } = skipTime;
      const isManualSkip = skipOptions[skipType] === 'manual-skip';

      if (skipType === 'preview' || isManualSkip) {
        return;
      }

      const { interval } = skipTime;
      const offset = videoDuration - skipTime.episodeLength;
      const distance = Math.abs(interval.endTime - currentTime);

      if (
        distance < minimumDistance ||
        isInInterval(interval.startTime, interval.endTime, currentTime, offset)
      ) {
        closestSkipTime = skipTime;
        minimumDistance = distance;
      }
    });

    return closestSkipTime;
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

  const isPlayerControlsVisible = player?.isControlsVisible() ?? false;

  const isVisible =
    isInStartingInterval || (inInterval && isPlayerControlsVisible);

  return (
    <SkipButton
      skipType={closestSkipTime.skipType}
      variant={variant}
      hidden={!isVisible}
      onClick={onClick(endTime + offset)}
    />
  );
}
