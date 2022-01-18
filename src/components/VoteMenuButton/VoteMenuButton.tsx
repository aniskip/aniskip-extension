import React from 'react';
import { FaListUl } from 'react-icons/fa';
import { VoteMenuButtonProps } from './VoteMenuButton.types';
import {
  submitMenuVisibilityUpdated,
  voteMenuVisibilityUpdated,
  selectIsVoteMenuVisible,
} from '../../data';
import { getDomainName, useDispatch, useSelector } from '../../utils';

export function VoteMenuButton({
  className = '',
  variant,
}: VoteMenuButtonProps): JSX.Element {
  const domainName = getDomainName(window.location.hostname);
  const active = useSelector(selectIsVoteMenuVisible);
  const dispatch = useDispatch();

  /**
   * Toggles the vote menu.
   */
  const onClick = (): void => {
    dispatch(voteMenuVisibilityUpdated(!active));
    dispatch(submitMenuVisibilityUpdated(false));
  };

  /**
   * Toggles the vote menu if the key pressed is Enter.
   *
   * @param event Event to be handled.
   */
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      dispatch(voteMenuVisibilityUpdated(!active));
      dispatch(submitMenuVisibilityUpdated(false));
    }
  };

  return (
    <div
      className={`font-sans w-8 h-8 cursor-pointer select-none outline-none flex items-center justify-center border-white border-b-2 border-opacity-0 transition-colors pt-[2px] ${
        active && 'border-opacity-100'
      } vote-menu-button--${variant} vote-menu-button--${domainName} ${className}`}
      role="button"
      title="Vote skip times"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <FaListUl className="text-white w-1/2 h-1/2" />
    </div>
  );
}
