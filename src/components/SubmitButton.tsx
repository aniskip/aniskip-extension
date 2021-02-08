import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAccessibleIcon } from '@fortawesome/free-brands-svg-icons';
import { SubmitButtonProps } from '../types/components/submit_types';
import '../players/player.scss';

const SubmitButton: React.FC<SubmitButtonProps> = ({
  handleClick,
  width,
  height,
  color,
}: SubmitButtonProps) => (
  <div
    className="submit-button"
    role="button"
    tabIndex={0}
    style={{
      width,
      height,
      color,
    }}
    onClick={handleClick}
    onKeyDown={handleClick}
  >
    <FontAwesomeIcon icon={faAccessibleIcon} />
  </div>
);
export default SubmitButton;
