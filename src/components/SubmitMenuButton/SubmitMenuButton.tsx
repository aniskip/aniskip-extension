import React from 'react';
import { FaPlayCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import {
  submitMenuVisibilityUpdated,
  voteMenuVisibilityUpdated,
  selectIsSubmitMenuVisible,
} from '../../data';
import { getDomainName, useDispatch } from '../../utils';
import { SubmitMenuProps } from './SubmitMenuButton.types';

export function SubmitMenuButton({ variant }: SubmitMenuProps): JSX.Element {
  const domainName = getDomainName(window.location.hostname);
  const active = useSelector(selectIsSubmitMenuVisible);
  const dispatch = useDispatch();

  /**
   * Toggles the submit menu.
   */
  const onClick = (): void => {
    dispatch(submitMenuVisibilityUpdated(!active));
    dispatch(voteMenuVisibilityUpdated(false));
  };

  /**
   * Toggles the submit menu if the key pressed is Enter.
   */
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      dispatch(submitMenuVisibilityUpdated(!active));
      dispatch(voteMenuVisibilityUpdated(false));
    }
  };

  return (
    <div
      className={`font-sans w-8 h-8 cursor-pointer select-none outline-none flex items-center justify-center border-white border-b-2 border-opacity-0 transition-colors pt-[2px] ${
        active && 'border-opacity-100'
      } submit-menu-button--${variant} submit-menu-button--${domainName}`}
      role="button"
      title="Submit skip times"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <FaPlayCircle className="text-white w-1/2 h-full" />
    </div>
  );
}
