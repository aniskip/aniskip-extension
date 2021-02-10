import React from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAccessibleIcon } from '@fortawesome/free-brands-svg-icons';
import { SubmitButtonProps } from '../types/components/submit_types';

const SubmitButton: React.FC<SubmitButtonProps> = ({
  handleClick,
  variant: style,
}: SubmitButtonProps) => (
  <div
    className={classnames(
      'tw-cursor-pointer',
      'tw-select-none',
      'tw-outline-none',
      'tw-flex',
      'tw-justify-center',
      'tw-items-center',
      `submit-button--${style}`
    )}
    role="button"
    tabIndex={0}
    onClick={handleClick}
    onKeyDown={handleClick}
  >
    <FontAwesomeIcon icon={faAccessibleIcon} />
  </div>
);
export default SubmitButton;
