import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkiing } from '@fortawesome/free-solid-svg-icons';
import { SubmitButtonProps } from '../types/components/submit_types';

const defaultStyle: React.CSSProperties = {
  cursor: 'pointer',
  userSelect: 'none',
  touchAction: 'manipulation',
  outline: 'none',
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
  handleClick,
  width,
  height,
  color,
}: SubmitButtonProps) => (
  <div
    role="button"
    tabIndex={0}
    style={{
      width,
      height,
      color,
      ...defaultStyle,
    }}
    onClick={handleClick}
    onKeyDown={handleClick}
  >
    <FontAwesomeIcon icon={faSkiing} />
  </div>
);
export default SubmitButton;
