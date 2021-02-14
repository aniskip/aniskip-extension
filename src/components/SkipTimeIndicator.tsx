import React from 'react';
import { SkipTimeIndicatorProps } from '../types/components/skip_time_indicator_types';

const SkipTimeIndicator: React.FC<SkipTimeIndicatorProps> = ({
  startTime,
  endTime,
  episodeDuration,
  color,
}: SkipTimeIndicatorProps) => {
  const calculateTranslation = () => (startTime / episodeDuration) * 100;
  const calculateWidth = () => ((endTime - startTime) / episodeDuration) * 100;

  return (
    <div
      style={{
        left: 0,
        top: '39%',
        backgroundColor: color,
        height: '5px',
        position: 'absolute',
        width: `${calculateWidth()}%`,
        marginLeft: `${calculateTranslation()}%`,
        zIndex: 5,
      }}
    />
  );
};
export default SkipTimeIndicator;
