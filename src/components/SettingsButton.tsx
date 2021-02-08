import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkiing } from '@fortawesome/free-solid-svg-icons';
import SettingsButtonProps from '../types/components/settings_button_types';

const SettingsButton: React.FC<SettingsButtonProps> = ({
  width,
  height,
  color,
}: SettingsButtonProps) => {
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);

  const handleClick = () => {
    setButtonClicked((previous) => !previous);
    console.log(buttonClicked);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      style={{
        width,
        height,
        color,
        cursor: 'pointer',
        userSelect: 'none',
        touchAction: 'manipulation',
        outline: 'none',
      }}
      onClick={handleClick}
      onKeyDown={handleClick}
    >
      <FontAwesomeIcon icon={faSkiing} />
    </div>
  );
};

export default SettingsButton;
