import React, { useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { selectSkipTimes } from '../../data';
import { useSelector } from '../../hooks';
import {
  DEFAULT_SKIP_INDICATOR_COLOURS,
  SkipIndicatorColours,
} from '../../scripts/background';
import { usePlayerRef } from '../../utils';
import { SkipTimeIndicator } from '../SkipTimeIndicator';
import { SkipTimeIndicatorContainerProps } from './SkipTimeIndicatorContainer.types';

export function SkipTimeIndicatorContainer({
  variant,
}: SkipTimeIndicatorContainerProps): JSX.Element {
  const [skipIndicatorColours, setSkipIndicatorColours] =
    useState<SkipIndicatorColours>(DEFAULT_SKIP_INDICATOR_COLOURS);
  const skipTimes = useSelector(selectSkipTimes);
  const player = usePlayerRef();
  const videoDuration = player?.getDuration() ?? 0;

  useEffect(() => {
    (async (): Promise<void> => {
      const syncedSkipIndicatorColours = (
        await browser.storage.sync.get({
          skipIndicatorColours: DEFAULT_SKIP_INDICATOR_COLOURS,
        })
      ).skipIndicatorColours as SkipIndicatorColours;

      setSkipIndicatorColours(syncedSkipIndicatorColours);
    })();
  }, []);

  return (
    <>
      {skipTimes.map((skipTime) => {
        const isPreview = skipTime.skipType === 'preview';
        if (isPreview) {
          return null;
        }

        const { startTime, endTime } = skipTime.interval;
        const { episodeLength } = skipTime;
        const offset = videoDuration - skipTime.episodeLength;

        return (
          <SkipTimeIndicator
            style={{
              backgroundColor:
                skipIndicatorColours[
                  skipTime.skipType as keyof SkipIndicatorColours
                ],
            }}
            startTime={startTime + offset}
            endTime={endTime + offset}
            episodeLength={episodeLength + offset}
            key={`skip-time-indicator-${skipTime.skipId}`}
            variant={variant}
          />
        );
      })}
    </>
  );
}
