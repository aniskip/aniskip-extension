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
      className={classnames(
        'tw-font-sans',
        'tw-relative',
        'tw-items-center',
        'tw-justify-center',
        'tw-flex',
        'tw-z-10',
        'tw-text-white',
        'hover:tw-bg-opacity-75',
        'hover:tw-bg-gray-800',
        'submit-container',
        `submit-container--${variant}`,
        {
          'hover:tw-bg-opacity-100 tw-bg-opacity-100': clicked,
        }
      )}
    >
      <SubmitButton handleClick={handleClick} variant={variant} />
      <SubmitMenu variant={variant} hidden={!clicked} />
    </div>
  );
};

export default SubmitButtonContainer;
