import React, { useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { SkipButton } from '../SkipButton';
import { isInInterval, usePlayerRef } from '../../utils';
import { SkipButtonContainerProps } from './SkipButtonContainer.types';
import { useSelector } from '../../hooks';
import { selectSkipTimes } from '../../data';
import { DEFAULT_SKIP_OPTIONS, SkipOptions } from '../../scripts/background';

export function SkipButtonContainer({
  variant,
}: SkipButtonContainerProps): JSX.Element {
  const [skipOptions, setSkipOptions] =
    useState<SkipOptions>(DEFAULT_SKIP_OPTIONS);
  const skipTimes = useSelector(selectSkipTimes);
  const player = usePlayerRef();

  /**
   * Retrieve the skip options.
   */
  useEffect(() => {
    const initialiseSkipOptions = async (): Promise<void> => {
      const { skipOptions: currentSkipOptions } =
        await browser.storage.sync.get('skipOptions');
      setSkipOptions(currentSkipOptions);
    };

    initialiseSkipOptions();
  }, []);

  const videoDuration = player?.getDuration() ?? 0;
  const currentTime = player?.getCurrentTime() ?? 0;

  /**
   * Changes the player current time to the skip end time.
   *
   * @param skipToTime Time to skip to.
   */
  const onClick = (skipToTime: number) => (): void => {
    player?.setCurrentTime(skipToTime);
    player?.play();
  };

  return (
    <>
      {skipTimes.map(({ interval, episodeLength, skipId, skipType }) => {
        const key = `skip-button-${skipId}`;

        const isManual = skipOptions[skipType] === 'manual-skip';
        const isPreview = skipType === 'preview';
        if (!isManual || isPreview) {
          return null;
        }

        const { startTime, endTime } = interval;
        const offset = videoDuration - episodeLength;

        const inInterval = isInInterval(
          startTime,
          endTime,
          currentTime,
          offset
        );

        return (
          <SkipButton
            key={key}
            skipType={skipType}
            variant={variant}
            hidden={!inInterval}
            onClick={onClick(endTime + offset)}
          />
        );
      })}
    </>
  );
}
