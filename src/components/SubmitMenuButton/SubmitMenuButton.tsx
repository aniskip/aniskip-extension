import React from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import {
  changeSubmitMenuVisibility,
  changeVoteMenuVisibility,
  selectIsSubmitMenuVisible,
} from '../../data';
import { useDispatch } from '../../hooks';
import { getDomainName } from '../../utils';
import { SubmitMenuButtonProps } from './SubmitMenuButton.types';

export const SubmitMenuButton = ({
  variant,
}: SubmitMenuButtonProps): JSX.Element => {
  const domainName = getDomainName(window.location.hostname);
  const active = useSelector(selectIsSubmitMenuVisible);
  const dispatch = useDispatch();

  /**
   * Toggles the submit menu.
   */
  const onClick = (): void => {
    dispatch(changeSubmitMenuVisibility(!active));
    dispatch(changeVoteMenuVisibility(false));
  };

  /**
   * Toggles the submit menu if the key pressed is Enter.
   */
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      dispatch(changeSubmitMenuVisibility(!active));
      dispatch(changeVoteMenuVisibility(false));
    }
  };

  return (
    <div
      className={`font-sans w-8 h-8 cursor-pointer select-none outline-none flex items-center justify-center border-white border-b-2 border-opacity-0 transition-colors ${
        active && 'border-opacity-100'
      } submit-menu-button--${variant} submit-menu-button--${domainName}`}
      role="button"
      title="Submit skip times"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <FaCloudUploadAlt className="text-white w-1/2 h-1/2" />
    </div>
  );
};
