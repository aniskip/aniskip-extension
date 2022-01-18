import React from 'react';
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
  const domainName = getDomainName(window.location.hostname);
  const isActive = useSelector(selectIsSubmitMenuVisible);
  const dispatch = useDispatch();

  /**
   * Toggles the submit menu.
   */
  const onClick = (): void => {
    dispatch(submitMenuVisibilityUpdated(!isActive));
    dispatch(voteMenuVisibilityUpdated(false));
  };

  return (
    <PlayerButton
      className={`submit-menu-button--${variant} submit-menu-button--${domainName} ${
        isActive
          ? `submit-menu-button--active--${variant} submit-menu-button--active--${domainName}`
          : ''
      }`}
      title="Submit skip times"
      onClick={onClick}
    >
      <FaPlayCircle className="text-slate-100 w-1/2 h-full" />
    </PlayerButton>
  );
}
