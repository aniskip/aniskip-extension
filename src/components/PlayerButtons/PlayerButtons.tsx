import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { SubmitMenuButton } from '../SubmitMenuButton';
import { VoteMenuButton } from '../VoteMenuButton';
import {
  getDomainName,
  useCheckIsFullscreen,
  useSelector,
  useVariantRef,
} from '../../utils';
import { selectIsSubmitMenuVisible, selectIsVoteMenuVisible } from '../../data';

export function PlayerButtons(): JSX.Element {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { isFullscreen } = useCheckIsFullscreen();
  const variant = useVariantRef();
  const domainName = getDomainName(window.location.hostname);
  const isVoteMenuVisible = useSelector(selectIsVoteMenuVisible);
  const isSubmitMenuVisible = useSelector(selectIsSubmitMenuVisible);

  const isVoteMenuButtonVisible =
    isVoteMenuVisible || isSubmitMenuVisible || isHovered;

  /**
   * Handles on mouse hover event.
   *
   * @param value New hover value.
   */
  const onMouseEvent = (value: boolean) => () => setIsHovered(value);

  return (
    <div
      className={`hidden sm:flex items-center justify-center player-buttons--${variant} player-buttons--${domainName} ${
        isFullscreen ? 'flex' : ''
      }`}
      onMouseEnter={onMouseEvent(true)}
      onMouseLeave={onMouseEvent(false)}
    >
      <Transition
        show={isVoteMenuButtonVisible}
        enter="transition-all duration-200 ease-in-out pointer-events-none"
        enterFrom="opacity-0 w-0"
        enterTo={`opacity-100 w-8 vote-menu-button--${variant} vote-menu-button--${domainName}`}
        leave="transition-all duration-200 ease-in-out pointer-events-none"
        leaveFrom={`opacity-100 w-8 vote-menu-button--${variant} vote-menu-button--${domainName}`}
        leaveTo="opacity-0 w-0"
      >
        <VoteMenuButton
          className={!isVoteMenuButtonVisible ? 'pointer-events-none' : ''}
          variant={variant}
        />
      </Transition>
      <SubmitMenuButton variant={variant} />
    </div>
  );
}
