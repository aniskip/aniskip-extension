import React, { useState } from 'react';
import { FaPlayCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { PlayerButton } from '../PlayerButton';
import {
  submitMenuVisibilityUpdated,
  voteMenuVisibilityUpdated,
  selectIsSubmitMenuVisible,
} from '../../data';
import { getDomainName, useDispatch } from '../../utils';
import { SubmitMenuProps } from './SubmitMenuButton.types';

export function SubmitMenuButton({ variant }: SubmitMenuProps): JSX.Element {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const domainName = getDomainName(window.location.hostname);
  const isSubmitMenuVisible = useSelector(selectIsSubmitMenuVisible);
  const dispatch = useDispatch();

  const isActive = isHovered || isSubmitMenuVisible;

  /**
   * Toggles the submit menu.
   */
  const onClick = (): void => {
    dispatch(submitMenuVisibilityUpdated(!isSubmitMenuVisible));
    dispatch(voteMenuVisibilityUpdated(false));
  };

  /**
   * Handles on mouse hover event.
   *
   * @param value New hover value.
   */
  const onMouseEvent = (value: boolean) => () => setIsHovered(value);

  return (
    <PlayerButton
      className={`submit-menu-button--${variant} submit-menu-button--${domainName} ${
        isActive
          ? `submit-menu-button--active--${variant} submit-menu-button--active--${domainName}`
          : ''
      }`}
      title="Submit skip times"
      onClick={onClick}
      onMouseEnter={onMouseEvent(true)}
      onMouseLeave={onMouseEvent(false)}
    >
      <FaPlayCircle className="text-slate-100 w-1/2 h-full" />
    </PlayerButton>
  );
}
