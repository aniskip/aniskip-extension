import React from 'react';

import { SkipTimeIndicatorProps } from '../../types/components/skip_time_indicator_types';
import { getDomainName } from '../../utils/string_utils';

const Indicator = ({
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

  const domainName = getDomainName(window.location.hostname);

  return (
    <div
      className={`absolute h-full z-10 pointer-events-none skip-indicators--${variant} skip-indicators--${domainName} ${className}`}
      style={{
        left: `${calculateTranslation() * 100}%`,
        width: `${calculateWidth() * 100}%`,
      }}
    />
  );
};

export default Indicator;
