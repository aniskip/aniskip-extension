import React, { useState } from 'react';
import { SubmitButtonContainerProps } from '../types/components/submit_types';
import SubmitButton from './SubmitButton';
import SubmitMenu from './SubmitMenu';

const defaultStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  fontFamily: 'Lato, "Helvetica Neue", Helvetica, Arial, sans-serif',
};

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
      style={{
        width,
        height,
        ...(clicked && { background: '#141519' }),
        ...defaultStyle,
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
