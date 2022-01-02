import React, { useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { selectSkipTimes } from '../../data';
import {
  DEFAULT_SKIP_TIME_INDICATOR_COLOURS,
  SkipTimeIndicatorColours,
} from '../../scripts/background';
import { usePlayerRef, useSelector, useVariantRef } from '../../utils';
import { SkipTimeIndicator } from '../SkipTimeIndicator';

export function SkipTimeIndicatorContainer(): JSX.Element {
  const [skipTimeIndicatorColours, setSkipTimeIndicatorColours] =
    useState<SkipTimeIndicatorColours>(DEFAULT_SKIP_TIME_INDICATOR_COLOURS);
  const skipTimes = useSelector(selectSkipTimes);
  const variant = useVariantRef();
  const player = usePlayerRef();
  const videoDuration = player?.getDuration() ?? 0;

  /**
   * Get skip time indicator colours.
   */
  useEffect(() => {
    (async (): Promise<void> => {
      const syncedSkipTimeIndicatorColours = (
        await browser.storage.sync.get({
          skipTimeIndicatorColours: DEFAULT_SKIP_TIME_INDICATOR_COLOURS,
        })
      ).skipTimeIndicatorColours as SkipTimeIndicatorColours;

      setSkipTimeIndicatorColours(syncedSkipTimeIndicatorColours);
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
                skipTimeIndicatorColours[
                  skipTime.skipType as keyof SkipTimeIndicatorColours
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
