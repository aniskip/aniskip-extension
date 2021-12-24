import React from 'react';

export type SkipTimeIndicatorProps = {
  startTime: number;
  endTime: number;
  episodeLength: number;
  variant: string;
  className?: string;
  style?: React.CSSProperties;
};
