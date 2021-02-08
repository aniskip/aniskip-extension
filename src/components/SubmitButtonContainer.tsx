import React, { useState } from 'react';
import { SubmitButtonContainerProps } from '../types/components/submit_types';
import SubmitButton from './SubmitButton';
import SubmitMenu from './SubmitMenu';

const defaultStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
};

const SubmitButtonContainer: React.FC<SubmitButtonContainerProps> = ({
  width,
  height,
  iconWidth,
  iconHeight,
  iconColour,
}: SubmitButtonContainerProps) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const handleClick = (
    _event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.KeyboardEvent<HTMLDivElement>
  ) => {
    setShowMenu((previous) => !previous);
  };

  return (
    <div style={{ width, height, ...defaultStyle }}>
      <SubmitButton
        handleClick={handleClick}
        width={iconWidth}
        height={iconHeight}
        color={iconColour}
      />
      {showMenu && <SubmitMenu />}
    </div>
  );
};

export default SubmitButtonContainer;
