import React from 'react';
import classnames from 'classnames';
import { SkipTimeIndicatorProps } from '../types/components/skip_time_indicator_types';

const SkipTimeIndicator: React.FC<SkipTimeIndicatorProps> = ({
  startTime,
  endTime,
  episodeLength,
  className,
  variant,
}: SkipTimeIndicatorProps) => {
  /**
   * Calculates the percentage the skip time indicator has to be translated on the x axis
   */
  const calculateTranslation = () => startTime / episodeLength;

  /**
   * Calculates the width of the skip time indicator
   */
  const calculateWidth = () => (endTime - startTime) / episodeLength;

  return (
    <div
      className={classnames(
        'absolute',
        'z-10',
        'top-1/2',
        'pointer-events-none',
        className,
        'skip-indicator',
        `skip-indicator--${variant}`
      )}
      style={{
        left: `${calculateTranslation() * 100}%`,
        width: `${calculateWidth() * 100}%`,
      }}
    />
  );
};
export default SkipTimeIndicator;
