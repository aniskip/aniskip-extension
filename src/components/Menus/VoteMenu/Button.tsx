import React from 'react';
import { FaListUl } from 'react-icons/fa';
import { VoteMenuButtonProps } from '../../../types/components/vote_menu_types';
import { getDomainName } from '../../../utils';

export const Button = ({
  variant,
  active,
  onClick,
}: VoteMenuButtonProps): JSX.Element => {
  const domainName = getDomainName(window.location.hostname);

  return (
    <div
      className={`font-sans w-8 h-8 cursor-pointer select-none outline-none flex items-center justify-center border-white border-b-2 border-opacity-0 transition-colors ${
        active && 'border-opacity-100'
      } vote-menu-button--${variant} vote-menu-button--${domainName}`}
      role="button"
      title="Vote skip times"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event): void => {
        if (event.key !== 'Tab') {
          onClick(event);
        }
      }}
    >
      <FaListUl className="text-white w-1/2 h-1/2" />
    </div>
  );
};
