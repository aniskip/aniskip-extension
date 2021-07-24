import React from 'react';
import { SkipButton } from '../SkipButton';
import { isInInterval } from '../../utils';
import { SkipButtonContainerProps } from './SkipButtonContainer.types';

export const SkipButtonContainer = ({
  skipTimes,
  currentTime,
  videoDuration,
  variant,
  onClickHandlers,
}: SkipButtonContainerProps): JSX.Element => (
  <>
    {skipTimes.map(
      (
        {
          interval,
          episode_length: episodeLength,
          skip_id: skipId,
          skip_type: skipType,
        },
        index
      ) => {
        const { start_time: startTime, end_time: endTime } = interval;
        const offset = videoDuration - episodeLength;

        const inInterval = isInInterval(
          startTime,
          endTime,
          currentTime,
          offset
        );

        return (
          <SkipButton
            key={`skip-button-${skipId}`}
            skipType={skipType}
            variant={variant}
            hidden={!inInterval}
            onClick={onClickHandlers[index]}
          />
        );
      }
    )}
  </>
);
