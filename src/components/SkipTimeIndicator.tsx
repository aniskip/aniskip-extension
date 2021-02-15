import React from 'react';
import { SkipTimeIndicatorProps } from '../types/components/skip_time_indicator_types';

const SkipTimeIndicator: React.FC<SkipTimeIndicatorProps> = ({
  startTime,
  endTime,
  episodeLength,
  color,
}: SkipTimeIndicatorProps) => {
  const calculateTranslation = () => startTime / episodeLength;
  const calculateWidth = () => (endTime - startTime) / episodeLength;

  return (
    <div
      style={{
        left: `${calculateTranslation() * 100}%`,
        top: '38%',
        backgroundColor: color,
        height: '5px',
        position: 'absolute',
        width: `${calculateWidth() * 100}%`,
        zIndex: 5,
      }}
    />
  );
};
export default SkipTimeIndicator;
