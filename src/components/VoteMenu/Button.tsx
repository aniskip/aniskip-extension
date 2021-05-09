import React from 'react';
import { FaListUl } from 'react-icons/fa';
import { VoteMenuButtonProps } from '../../types/components/vote_menu_types';

const Button = ({ variant, active, handleClick }: VoteMenuButtonProps) => (
  <div
    className={`font-sans w-8 h-8 cursor-pointer select-none outline-none flex items-center justify-center border-white border-b-2 border-opacity-0 ${
      active && 'border-opacity-100'
    } vote-menu-button--${variant}`}
    role="button"
    title="Vote on skip times"
    tabIndex={0}
    onClick={handleClick}
    onKeyDown={handleClick}
  >
    <FaListUl className="text-white w-1/2 h-1/2" />
  </div>
);

export default Button;
