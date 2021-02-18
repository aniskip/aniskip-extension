import React from 'react';
import classnames from 'classnames';
import { SkipTimeButtonProps } from '../types/components/skip_time_button_types';
import Button from './Button';

const SkipButton: React.FC<SkipTimeButtonProps> = ({
  variant,
  label,
  hidden,
  onClick,
}: SkipTimeButtonProps) => (
  <Button
    className={classnames(
      'transition-opacity',
      'font-sans',
      'text-white',
      'bg-yellow-600',
      'py-3',
      'absolute',
      'right-5',
      'bottom-16',
      'z-10',
      'block',
      { 'opacity-0': hidden, 'pointer-events-none': hidden },
      `skip-button--${variant}`
    )}
    label={label}
    onClick={onClick}
  />
);
export default SkipButton;
