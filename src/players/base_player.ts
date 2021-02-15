import React from 'react';
import ReactDOM from 'react-dom';
import { browser } from 'webextension-polyfill-ts';
import Player from '../types/players/player_type';
import SubmitContainer from '../components/SubmitContainer';
import { SubmitButtonContainerProps } from '../types/components/submit_types';
import { SkipTimeIndicatorContainerProps } from '../types/components/skip_time_indicator_types';
import SkipTimeIndicatorContainer from '../components/SkipTimeIndicatorContainer';
import { SkipTime } from '../types/api/skip_time_types';

abstract class BasePlayer implements Player {
  document: Document;

  submitButtonContainer: HTMLDivElement;

  skipTimeIndicatorContainer: HTMLDivElement;

  skipTimes: SkipTime[];

  constructor(document: Document) {
    this.document = document;
    this.submitButtonContainer = this.createContainer(
      'opening-skipper-player-submit-button',
      ['keydown', 'keyup', 'mousedown', 'mouseup']
    );
    this.skipTimeIndicatorContainer = this.createContainer(
      'opening-skipper-player-skip-time-indicator'
    );
    this.skipTimes = [];
  }

  abstract getVideoContainer(): HTMLElement | null;

  abstract getSeekBarContainer(): HTMLElement | null;

  abstract injectSubmitButton(): void;

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

  getContainerHelper(
    selectorString: string,
    index: number
  ): HTMLElement | null {
    const containers = this.document.getElementsByClassName(selectorString);
    return containers[index] as HTMLElement;
  }

  injectSubmitButtonHelper(
    referenceNode: HTMLElement,
    variant: string
  ): HTMLDivElement | null {
    const { id, shadowRoot } = this.submitButtonContainer;
    if (this.document.getElementById(id) || !referenceNode || !shadowRoot) {
      return null;
    }

    const reactRootId = `${id}-root`;
    if (!shadowRoot.getElementById(reactRootId)) {
      const root = this.document.createElement('div');
      root.setAttribute('id', reactRootId);
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
    shadowRootContainer: HTMLElement
  ): HTMLDivElement | null {
    const { id, shadowRoot } = this.skipTimeIndicatorContainer;
    if (
      this.document.getElementById(id) ||
      !shadowRootContainer ||
      !shadowRoot
    ) {
      return null;
    }

    const reactRootId = `${id}-root`;
    if (!shadowRoot.getElementById(reactRootId)) {
      const root = this.document.createElement('div');
      root.setAttribute('id', reactRootId);
      shadowRoot.appendChild(root);
    }

    shadowRootContainer.appendChild(this.skipTimeIndicatorContainer);

    return this.skipTimeIndicatorContainer;
  }

  injectSkipTimeIndicator() {
    const container = this.getSeekBarContainer();
    if (container) {
      this.injectSkipTimeIndicatornHelper(container);
    }
  }

  addSkipTime(skipTime: SkipTime) {
    this.skipTimes.push(skipTime);
    this.renderSkipTimeIndicator();
  }

  clearSkipIntervals() {
    this.skipTimes = [];
    this.renderSkipTimeIndicator();
  }

  renderSkipTimeIndicator() {
    const skipTimeIndicatorElement = React.createElement<SkipTimeIndicatorContainerProps>(
      SkipTimeIndicatorContainer,
      { skipTimes: this.skipTimes }
    );
    ReactDOM.render(
      skipTimeIndicatorElement,
      this.skipTimeIndicatorContainer.shadowRoot
    );
  }
}

export default BasePlayer;
