import React from 'react';
import ReactDOM from 'react-dom';
import { browser } from 'webextension-polyfill-ts';
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
      'opening-skipper-player-submit-button',
      ['keydown', 'keyup', 'mousedown', 'mouseup']
    );
    this.skipTimeIndicatorContainer = this.createContainer(
      'opening-skipper-player-skip-time-indicator'
    );
  }

  abstract getVideoContainer(): HTMLElement | null;

  abstract getSeekBarContainer(): HTMLElement | null;

  abstract injectSubmitButton(): void;

  abstract injectSkipTimeIndicator(skipTime: SkipTime): void;

  createContainer(id: string, stopPropagationEvents: string[] = []) {
    const container = this.document.createElement('div');
    container.setAttribute('id', id);
    container.attachShadow({ mode: 'open' });

    stopPropagationEvents.forEach((eventName) => {
      container.addEventListener(eventName, (event) => {
        event.stopPropagation();
      });
    });

    (async () => {
      const cssUrl = browser.runtime.getURL('player_script.css');
      const response = await fetch(cssUrl, { method: 'GET' });
      const cssString = await response.text();
      const style = document.createElement('style');
      style.innerHTML = cssString;
      container.shadowRoot?.appendChild(style);
    })();

    return container;
  }

  injectSubmitButtonHelper(
    referenceNode: HTMLElement,
    variant: string
  ): HTMLDivElement | null {
    const { id, shadowRoot } = this.submitButtonContainer;
    if (this.document.getElementById(id) || !referenceNode || !shadowRoot) {
      return null;
    }

    if (!shadowRoot.getElementById(`${id}-root`)) {
      const root = this.document.createElement('div');
      root.setAttribute('id', `${id}-root`);
      shadowRoot.appendChild(root);

      const submitButton = React.createElement<SubmitButtonContainerProps>(
        SubmitContainer,
        { variant }
      );

      ReactDOM.render(submitButton, root);
    }

    referenceNode.insertAdjacentElement(
      'beforebegin',
      this.submitButtonContainer
    );

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

    const { start_time: startTime, end_time: endTime } = skipTime.interval;
    const { episode_length: episodeLength } = skipTime;
    const skipTimeIndicator = React.createElement<SkipTimeIndicatorProps>(
      SkipTimeIndicator,
      {
        startTime,
        endTime,
        episodeLength,
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
    const containers = this.document.getElementsByClassName(selectorString);
    return containers[index] as HTMLElement;
  }
}

export default BasePlayer;
