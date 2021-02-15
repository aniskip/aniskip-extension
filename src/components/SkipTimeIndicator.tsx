import React from 'react';
import classnames from 'classnames';
import { SkipTimeIndicatorProps } from '../types/components/skip_time_indicator_types';

const SkipTimeIndicator: React.FC<SkipTimeIndicatorProps> = ({
  startTime,
  endTime,
  episodeLength,
  className,
}: SkipTimeIndicatorProps) => {
  const calculateTranslation = () => startTime / episodeLength;
  const calculateWidth = () => (endTime - startTime) / episodeLength;

  return (
    <div
      className={classnames(
        'absolute',
        'z-10',
        'top-1/2',
        'pointer-events-none',
        className
      )}
      style={{
        left: `${calculateTranslation() * 100}%`,
        width: `${calculateWidth() * 100}%`,
        marginTop: '-2.5px',
        height: '5px',
      }}
    />
  );
};
export default SkipTimeIndicator;
