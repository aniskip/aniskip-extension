import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
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
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  const handleClick = (
    _event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.KeyboardEvent<HTMLDivElement>
  ) => {
    setClicked((previous) => !previous);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      buttonContainerRef.current &&
      !buttonContainerRef.current.contains(event.target as HTMLElement)
    ) {
      setClicked(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div
      ref={buttonContainerRef}
      className={classnames('submit-button-container', {
        'submit-button-container--clicked': clicked,
      })}
      style={{
        width,
        height,
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
