import React, { useState } from 'react';
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
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const domainName = getDomainName(window.location.hostname);
  const isVoteMenuVisible = useSelector(selectIsVoteMenuVisible);
  const dispatch = useDispatch();

  const isActive = isHovered || isVoteMenuVisible;

  /**
   * Toggles the vote menu.
   */
  const onClick = (): void => {
    dispatch(voteMenuVisibilityUpdated(!isVoteMenuVisible));
    dispatch(submitMenuVisibilityUpdated(false));
  };

  /**
   * Handles on mouse hover event.
   *
   * @param value New hover value.
   */
  const onMouseEvent = (value: boolean) => () => setIsHovered(value);

  return (
    <PlayerButton
      className={`vote-menu-button--${variant} vote-menu-button--${domainName} ${
        isActive
          ? `vote-menu-button--active--${variant} vote-menu-button--active--${domainName}`
          : ''
      }  ${className}`}
      title="Vote skip times"
      onClick={onClick}
      onMouseEnter={onMouseEvent(true)}
      onMouseLeave={onMouseEvent(false)}
    >
      <FaListAlt className="text-slate-100 w-1/2 h-full" />
    </PlayerButton>
  );
}
