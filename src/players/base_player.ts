import React from 'react';
import ReactDOM from 'react-dom';
import Player from '../types/players/player_type';
import SubmitContainer from '../components/SubmitContainer';
import { SubmitButtonContainerProps } from '../types/components/submit_types';

abstract class BasePlayer implements Player {
  document: Document;

  constructor(document: Document) {
    this.document = document;
  }

  abstract injectSubmitButton(): void;

  abstract getVideoContainer(): HTMLElement | null;

  injectSubmitButtonHelper(
    referenceNode: HTMLElement,
    variant: string
  ): HTMLDivElement | null {
    const id = 'opening-skipper-player-submit-button';

    if (this.document.getElementById(id) || !referenceNode) {
      return null;
    }

    const submitButtonContainerDiv = document.createElement('div');
    submitButtonContainerDiv.setAttribute('id', id);

    ReactDOM.render(
      React.createElement<SubmitButtonContainerProps>(SubmitContainer, {
        variant,
      }),
      submitButtonContainerDiv
    );

    referenceNode.insertAdjacentElement(
      'beforebegin',
      submitButtonContainerDiv
    );

    return submitButtonContainerDiv;
  }

  getVideoContainerHelper(
    selectorString: string,
    index: number
  ): HTMLElement | null {
    const videoContainer = this.document.getElementsByClassName(selectorString);
    return videoContainer[index] as HTMLElement;
  }
}

export default BasePlayer;
