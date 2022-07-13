import React, { useEffect, useRef, useState } from 'react';
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
  const [isMouseMoved, setIsMouseMoved] = useState<boolean>(false);
  const mouseMovedTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

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
   * Resets mouse moved timer.
   */
  const onMouseMove = (): void => {
    if (mouseMovedTimeoutRef.current) {
      clearTimeout(mouseMovedTimeoutRef.current);
    }

    setIsMouseMoved(true);

    mouseMovedTimeoutRef.current = setTimeout(
      () => setIsMouseMoved(false),
      500
    );
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

  /**
   * Remove mouse moved timeout on component unmount.
   */
  useEffect(
    () => () => {
      if (!mouseMovedTimeoutRef.current) {
        return;
      }

      clearTimeout(mouseMovedTimeoutRef.current);
    },
    []
  );

  return (
    <div className="relative flex flex-col items-center font-sans">
      {title && (
        <Tooltip isVisible={isHovered && !isActivatedOnce && !isMouseMoved}>
          {title}
        </Tooltip>
      )}
      <button
        className={`flex h-8 w-8 cursor-pointer select-none items-center justify-center outline-none transition-colors ${className}`}
        type="button"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}
