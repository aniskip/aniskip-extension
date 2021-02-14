import React from 'react';
import ReactDOM from 'react-dom';
import Player from '../types/players/player_type';
import SubmitContainer from '../components/SubmitContainer';
import { SubmitButtonContainerProps } from '../types/components/submit_types';

abstract class BasePlayer implements Player {
  document: Document;

  submitButtonContainer: HTMLDivElement;

  constructor(document: Document) {
    this.document = document;
    this.submitButtonContainer = this.createSubmitButtonContainer();
  }

  abstract injectSubmitButton(): void;

  abstract getVideoContainer(): HTMLElement | null;

  createSubmitButtonContainer() {
    const id = 'opening-skipper-player-submit-button';

    const submitButtonContainer = this.document.createElement('div');
    submitButtonContainer.setAttribute('id', id);
    submitButtonContainer.attachShadow({ mode: 'open' });

    return submitButtonContainer;
  }

  injectSubmitButtonHelper(
    referenceNode: HTMLElement,
    variant: string
  ): HTMLDivElement | null {
    const { id, shadowRoot } = this.submitButtonContainer;
    if (this.document.getElementById(id) || !referenceNode || !shadowRoot) {
      return null;
    }

    const submitButton = React.createElement<SubmitButtonContainerProps>(
      SubmitContainer,
      { variant }
    );

    ReactDOM.render(submitButton, shadowRoot);

    referenceNode.insertAdjacentElement(
      'beforebegin',
      this.submitButtonContainer
    );

    const events = ['keydown', 'keyup', 'mousedown', 'mouseup'];

    events.forEach((eventName) => {
      this.submitButtonContainer.addEventListener(eventName, (event) => {
        event.stopPropagation();
      });
    });

    return this.submitButtonContainer;
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
