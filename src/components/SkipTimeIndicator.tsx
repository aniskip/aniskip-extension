import React from 'react';
import { SkipTimeIndicatorProps } from '../types/components/skip_time_indicator_types';

const SkipTimeIndicator: React.FC<SkipTimeIndicatorProps> = ({
  startTime,
  endTime,
  episodeLength: episodeDuration,
  color,
}: SkipTimeIndicatorProps) => {
  const calculateTranslation = () => startTime / episodeDuration;
  const calculateWidth = () => (endTime - startTime) / episodeDuration;

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
