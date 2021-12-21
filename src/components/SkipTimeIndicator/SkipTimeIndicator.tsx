import React from 'react';
import { SkipTimeIndicatorProps } from './SkipTimeIndicator.types';
import { getDomainName } from '../../utils';

export function SkipTimeIndicator({
  startTime,
  endTime,
  episodeLength,
  className,
  variant,
}: SkipTimeIndicatorProps): JSX.Element {
  /**
   * Calculates the percentage the skip time indicator has to be translated on the x axis.
   */
  const calculateTranslation = (): number => startTime / episodeLength;

  /**
   * Calculates the width of the skip time indicator.
   */
  const calculateWidth = (): number => (endTime - startTime) / episodeLength;

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
}
