import React, { useState } from 'react';
import classnames from 'classnames';
import { SubmitButtonContainerProps } from '../types/components/submit_types';
import SubmitButton from './SubmitButton';
import SubmitMenu from './SubmitMenu';

const SubmitButtonContainer: React.FC<SubmitButtonContainerProps> = ({
  variant,
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
      className={classnames(
        'font-sans',
        'text-white',
        'flex',
        'items-center',
        'justify-center',
        'relative',
        'z-10',
        'border-white',
        'border-b-2',
        'border-opacity-0',
        {
          'border-opacity-100': clicked,
        },
        `submit-container--${variant}`
      )}
    >
      <SubmitButton handleClick={handleClick} variant={variant} />
      <SubmitMenu
        variant={variant}
        hidden={!clicked}
        onSubmit={() => setClicked(false)}
        onClose={() => setClicked(false)}
      />
    </div>
  );
};

export default SubmitButtonContainer;
