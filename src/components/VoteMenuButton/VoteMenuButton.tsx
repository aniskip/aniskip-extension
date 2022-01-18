import React from 'react';
import { FaListAlt } from 'react-icons/fa';
import { VoteMenuButtonProps } from './VoteMenuButton.types';
import {
  submitMenuVisibilityUpdated,
  voteMenuVisibilityUpdated,
  selectIsVoteMenuVisible,
} from '../../data';
import { getDomainName, useDispatch, useSelector } from '../../utils';
import { PlayerButton } from '../PlayerButton';

export function VoteMenuButton({
  className = '',
  variant,
}: VoteMenuButtonProps): JSX.Element {
  const domainName = getDomainName(window.location.hostname);
  const isActive = useSelector(selectIsVoteMenuVisible);
  const dispatch = useDispatch();

  /**
   * Toggles the vote menu.
   */
  const onClick = (): void => {
    dispatch(voteMenuVisibilityUpdated(!isActive));
    dispatch(submitMenuVisibilityUpdated(false));
  };

  return (
    <PlayerButton
      className={`vote-menu-button--${variant} vote-menu-button--${domainName} ${
        isActive
          ? `vote-menu-button--active--${variant} vote-menu-button--active--${domainName}`
          : ''
      }  ${className}`}
      title="Vote skip times"
      onClick={onClick}
    >
      <FaListAlt className="text-slate-100 w-1/2 h-full" />
    </PlayerButton>
  );
}
