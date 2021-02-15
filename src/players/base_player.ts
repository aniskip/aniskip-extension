import React from 'react';
import ReactDOM from 'react-dom';
import { browser } from 'webextension-polyfill-ts';
import Player from '../types/players/player_type';
import SubmitContainer from '../components/SubmitContainer';
import { SubmitButtonContainerProps } from '../types/components/submit_types';
import { SkipTimeIndicatorContainerProps } from '../types/components/skip_time_indicator_types';
import SkipTimeIndicatorContainer from '../components/SkipTimeIndicatorContainer';
import { SkipTime } from '../types/api/skip_time_types';
import { skipInterval } from '../utils/page_utils';

abstract class BasePlayer implements Player {
  document: Document;

  submitButtonContainer: HTMLDivElement;

  skipTimeIndicatorContainer: HTMLDivElement;

  skipTimes: SkipTime[];

  videoElement: HTMLVideoElement;

  timeUpdateEventListeners: Record<string, (event: Event) => void>;

  constructor(document: Document, videoElement: HTMLVideoElement) {
    this.document = document;
    this.submitButtonContainer = this.createContainer(
      'opening-skipper-player-submit-button',
      ['keydown', 'keyup', 'mousedown', 'mouseup']
    );
    this.skipTimeIndicatorContainer = this.createContainer(
      'opening-skipper-player-skip-time-indicator'
    );
    this.skipTimes = [];
    this.videoElement = videoElement;
    this.timeUpdateEventListeners = {};
  }

  abstract getVideoContainer(): HTMLElement | null;

  abstract getSeekBarContainer(): HTMLElement | null;

  abstract injectSubmitButton(): void;

  /**
   * Returns a new div container with a shadow root initialised
   * @param id Id of the newly created container
   * @param stopPropagationEvents Events to stop propagation of
   */
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

  /**
   * Returns the container element with the given query string
   * @param selectorString Selector string to retrieve the node
   * @param index Index of the container from the query result
   */
  getContainerHelper(
    selectorString: string,
    index: number
  ): HTMLElement | null {
    const containers = this.document.getElementsByClassName(selectorString);
    return containers[index] as HTMLElement;
  }

  /**
   * Helper function to inject the submit button
   * @param referenceNode Reference node to put the submit button beside. Submit button will be placed on the left side of the reference node
   * @param variant Variant of submit button based on the provider name
   */
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

  /**
   * Helper function to inject the skip time indicators
   * @param shadowRootContainer Div element to put the shadow root into
   */
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

    this.renderSkipTimeIndicator();

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
    this.videoElement.addEventListener(
      'timeupdate',
      this.skipIfInInterval(skipTime)
    );
    this.renderSkipTimeIndicator();
  }

  clearSkipTimeIndicators() {
    this.skipTimes = [];
    this.renderSkipTimeIndicator();
  }

  /**
   * Renders the skip time indicator react element
   */
  renderSkipTimeIndicator() {
    const { id, shadowRoot } = this.skipTimeIndicatorContainer;
    const reactRoot = shadowRoot?.getElementById(`${id}-root`);
    if (reactRoot) {
      const skipTimeIndicatorElement = React.createElement<SkipTimeIndicatorContainerProps>(
        SkipTimeIndicatorContainer,
        {
          skipTimes: this.skipTimes,
          variant: this.constructor.name.toLocaleLowerCase(),
        }
      );
      ReactDOM.render(skipTimeIndicatorElement, reactRoot);
    }
  }

  skipIfInInterval(skipTime: SkipTime) {
    const skipTimeString = JSON.stringify(skipTime);
    // Ensures player event handlers can be removed
    const timeUpdateEventListener =
      this.timeUpdateEventListeners[skipTimeString] ||
      (this.timeUpdateEventListeners[skipTimeString] = (event: Event) => {
        const margin = 0;
        const video = event.currentTarget as HTMLVideoElement;
        const checkIntervalLength = 5;
        skipInterval(video, skipTime, margin, checkIntervalLength);
      });
    return timeUpdateEventListener;
  }

  clearVideoElementEventListeners(eventListeners: EventListener[]) {
    eventListeners.forEach((listener) =>
      this.videoElement.removeEventListener('timeupdate', listener)
    );
  }

  reset() {
    this.clearSkipTimeIndicators();
    this.clearVideoElementEventListeners(
      Object.values(this.timeUpdateEventListeners)
    );
    this.timeUpdateEventListeners = {};
  }

  addPreviewSkipInterval(skipTime: SkipTime) {
    this.clearVideoElementEventListeners(
      Object.values(this.timeUpdateEventListeners)
    );

    const previewSkipHandler = (event: Event) => {
      const margin = 0;
      const video = event.currentTarget as HTMLVideoElement;
      const checkIntervalLength = 10;
      const intervalSkipped = skipInterval(
        video,
        skipTime,
        margin,
        checkIntervalLength
      );

      if (intervalSkipped) {
        video.removeEventListener('timeupdate', previewSkipHandler);
        Object.values(this.timeUpdateEventListeners).forEach(
          (functionReference) => {
            this.videoElement.addEventListener('timeupdate', functionReference);
          }
        );
      }
    };
    this.videoElement.addEventListener('timeupdate', previewSkipHandler);

    const margin = 2;
    const newTime = skipTime.interval.start_time - margin;
    this.videoElement.currentTime = newTime > 0 ? newTime : 0;
    this.videoElement.play();
  }

  getDuration() {
    return this.videoElement.duration;
  }

  getCurrentTime() {
    return this.videoElement.currentTime;
  }
}

export default BasePlayer;
