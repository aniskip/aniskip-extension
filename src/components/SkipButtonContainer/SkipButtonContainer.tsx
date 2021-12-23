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
  const skipTimes = useSelector(selectSkipTimes);
  const player = usePlayerRef();

  /**
   * Retrieve the skip options.
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
  const getClosestSkipTime = (): SkipTime | null => {
    let closestSkipTime: SkipTime | null = null;
    let minimumDistance = Infinity;

    skipTimes.forEach((skipTime) => {
      if (skipTime.skipType === 'preview') {
        return;
      }

      const currentTime = player?.getCurrentTime() ?? 0;

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

  const closestSkipTime = getClosestSkipTime();

  if (!closestSkipTime) {
    return null;
  }

  const videoDuration = player?.getDuration() ?? 0;
  const currentTime = player?.getCurrentTime() ?? 0;

  const { startTime, endTime } = closestSkipTime.interval;
  const offset = videoDuration - closestSkipTime.episodeLength;

  const inInterval = isInInterval(startTime, endTime, currentTime, offset);

  return (
    <SkipButton
      skipType={closestSkipTime.skipType}
      variant={variant}
      hidden={!inInterval}
      onClick={onClick(endTime + offset)}
    />
  );
}
