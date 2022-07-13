import React from 'react';
import { SkipTimeIndicatorProps } from './SkipTimeIndicator.types';
import { getDomainName } from '../../utils';

export function SkipTimeIndicator({
  startTime,
  endTime,
  episodeLength,
  variant,
  className = '',
  style,
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
      className={`pointer-events-none absolute z-10 h-full skip-indicators--${variant} skip-indicators--${domainName} ${className}`}
      style={{
        left: `${calculateTranslation() * 100}%`,
        width: `${calculateWidth() * 100}%`,
        ...style,
      }}
    />
  );
}
