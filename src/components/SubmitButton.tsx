import React from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAccessibleIcon } from '@fortawesome/free-brands-svg-icons';
import { SubmitButtonProps } from '../types/components/submit_types';

const SubmitButton: React.FC<SubmitButtonProps> = ({
  handleClick,
  variant,
}: SubmitButtonProps) => (
  <div
    className={classnames(
      'cursor-pointer',
      'select-none',
      'outline-none',
      'flex',
      'justify-center',
      'items-center',
      `submit-button--${variant}`
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
