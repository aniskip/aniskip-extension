import React, { useState } from 'react';
import { Tooltip } from '../Tooltip';
import { PlayerButtonProps } from './PlayerButton.types';

export function PlayerButton({
  className = '',
  children,
  title,
  onMouseEnter: onMouseEnterProps,
  onMouseLeave: onMouseLeaveProps,
  onClick: onClickProps,
  ...props
}: PlayerButtonProps): JSX.Element {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isActivatedOnce, setIsActivatedOnce] = useState<boolean>(false);

  /**
   * Handles on mouse enter event.
   *
   * @param event Mouse event object.
   */
  const onMouseEnter = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setIsHovered(true);

    if (!onMouseEnterProps) {
      return;
    }

    onMouseEnterProps(event);
  };

  /**
   * Handles on mouse leave event.
   *
   * @param event Mouse event object.
   */
  const onMouseLeave = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setIsActivatedOnce(false);
    setIsHovered(false);

    if (!onMouseLeaveProps) {
      return;
    }

    onMouseLeaveProps(event);
  };

  /**
   * Handles on mouse click event.
   *
   * @param event Mouse event object.
   */
  const onClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setIsActivatedOnce(true);

    if (!onClickProps) {
      return;
    }

    onClickProps(event);
  };

  return (
    <div className="flex flex-col relative items-center font-sans">
      {title && (
        <Tooltip isVisible={isHovered && !isActivatedOnce}>{title}</Tooltip>
      )}
      <button
        className={`w-8 h-8 cursor-pointer select-none outline-none flex items-center justify-center transition-colors ${className}`}
        type="button"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}
