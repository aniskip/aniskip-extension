import React from 'react';
import ReactDOM from 'react-dom';
import Player from '../types/players/player_type';
import SubmitContainer from '../components/SubmitContainer';
import { SubmitButtonContainerProps } from '../types/components/submit_types';
import { SkipTime } from '../types/api/skip_time_types';
import SkipTimeIndicator from '../components/SkipTimeIndicator';
import { SkipTimeIndicatorProps } from '../types/components/skip_time_indicator_types';

abstract class BasePlayer implements Player {
  document: Document;

  submitButtonContainer: HTMLDivElement;

  skipTimeIndicatorContainer: HTMLDivElement;

  constructor(document: Document) {
    this.document = document;
    this.submitButtonContainer = this.createContainer(
      'opening-skipper-player-submit-button'
    );
    this.skipTimeIndicatorContainer = this.createContainer(
      'opening-skipper-player-skip-time-indicator'
    );
  }

  abstract getVideoContainer(): HTMLElement | null;

  abstract getSeekBarContainer(): HTMLElement | null;

  abstract injectSubmitButton(): void;

  abstract injectSkipTimeIndicator(skipTime: SkipTime): void;

  createContainer(id: string) {
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

  injectSkipTimeIndicatornHelper(
    referenceNode: HTMLElement,
    skipTime: SkipTime
  ): HTMLDivElement | null {
    const { id, shadowRoot } = this.skipTimeIndicatorContainer;
    if (this.document.getElementById(id) || !referenceNode || !shadowRoot) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { start_time, end_time } = skipTime.interval;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { episode_length } = skipTime;
    const skipTimeIndicator = React.createElement<SkipTimeIndicatorProps>(
      SkipTimeIndicator,
      {
        startTime: start_time,
        endTime: end_time,
        episodeDuration: episode_length,
        color: 'red',
      }
    );
    ReactDOM.render(skipTimeIndicator, shadowRoot);
    referenceNode.appendChild(this.skipTimeIndicatorContainer);
    return this.skipTimeIndicatorContainer;
  }

  getContainerHelper(
    selectorString: string,
    index: number
  ): HTMLElement | null {
    const container = this.document.getElementsByClassName(selectorString);
    return container[index] as HTMLElement;
  }
}

export default BasePlayer;
