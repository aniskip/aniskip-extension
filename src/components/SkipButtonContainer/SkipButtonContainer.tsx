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
  const [isHovered, setIsHovered] = useState<boolean>(false);
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
   * Toggle hover state.
   */
  const onMouseEnter = (): void => setIsHovered(true);
  const onMouseLeave = (): void => setIsHovered(false);

  /**
   * Returns the skip time closest to the current time.
   */
  const getClosestSkipTime = (): SkipTime | undefined => {
    let closestSkipTime: SkipTime | undefined;
    let minimumDistance = Infinity;

    for (let i = 0; i < skipTimes.length; i += 1) {
      const skipTime = skipTimes[i];
      const { skipType } = skipTime;
      const isAutoSkip = skipOptions[skipType] === 'auto-skip';

      if (isAutoSkip) {
        continue;
      }

      const { interval } = skipTime;
      const offset = videoDuration - skipTime.episodeLength;
      const distance = Math.abs(interval.endTime - currentTime);

      if (
        isInInterval(interval.startTime, interval.endTime, currentTime, offset)
      ) {
        return skipTime;
      }

      if (distance < minimumDistance) {
        closestSkipTime = skipTime;
        minimumDistance = distance;
      }
    }

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
    isInStartingInterval ||
    (inInterval && (isPlayerControlsVisible || isHovered));

  return (
    <SkipButton
      skipType={closestSkipTime.skipType}
      variant={variant}
      hidden={!isVisible}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick(endTime + offset)}
    />
  );
}
