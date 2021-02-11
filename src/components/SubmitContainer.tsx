import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { SubmitButtonContainerProps } from '../types/components/submit_types';
import SubmitButton from './SubmitButton';
import SubmitMenu from './SubmitMenu';

const SubmitButtonContainer: React.FC<SubmitButtonContainerProps> = ({
  variant,
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
    const target = event.target as HTMLElement;
    const settingsContainerClicked = target.shadowRoot?.contains(
      buttonContainerRef.current
    );

    if (!settingsContainerClicked) {
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
      className={classnames(
        'text-white',
        'bg-gray-800',
        'font-sans',
        'relative',
        'items-center',
        'justify-center',
        'flex',
        'z-10',
        'bg-opacity-0',
        'hover:bg-opacity-75',
        'submit-container',
        `submit-container--${variant}`,
        {
          'hover:bg-opacity-100 bg-opacity-100': clicked,
        }
      )}
    >
      <SubmitButton handleClick={handleClick} variant={variant} />
      <SubmitMenu variant={variant} hidden={!clicked} />
    </div>
  );
};

export default SubmitButtonContainer;
