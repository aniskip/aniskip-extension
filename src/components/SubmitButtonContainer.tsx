import React, { useState } from 'react';
import { SubmitButtonContainerProps } from '../types/components/submit_types';
import SubmitButton from './SubmitButton';
import SubmitMenu from './SubmitMenu';
import '../players/player.scss';

const SubmitButtonContainer: React.FC<SubmitButtonContainerProps> = ({
  width,
  height,
  iconWidth,
  iconHeight,
  iconColour,
}: SubmitButtonContainerProps) => {
  const [clicked, setClicked] = useState<boolean>(false);
  const handleClick = (
    _event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.KeyboardEvent<HTMLDivElement>
  ) => {
    setClicked((previous) => !previous);
  };

  return (
    <div
      className="submit-button-container"
      style={{
        width,
        height,
        ...(clicked && { background: '#141519' }),
      }}
    >
      <SubmitButton
        handleClick={handleClick}
        width={iconWidth}
        height={iconHeight}
        color={iconColour}
      />
      {clicked && <SubmitMenu submitButtonHeight={width} />}
    </div>
  );
};

export default SubmitButtonContainer;
