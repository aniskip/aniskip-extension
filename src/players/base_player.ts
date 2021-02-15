import React from 'react';
import ReactDOM from 'react-dom';
import { browser } from 'webextension-polyfill-ts';
import Player from '../types/players/player_type';
import SubmitContainer from '../components/SubmitContainer';
import { SubmitButtonContainerProps } from '../types/components/submit_types';
import { SkipTimeIndicatorContainerProps } from '../types/components/skip_time_indicator_types';
import SkipTimeIndicatorContainer from '../components/SkipTimeIndicatorContainer';
import { SkipTime } from '../types/api/skip_time_types';
import isInInterval from '../utils/time_utils';

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

  /**
   * Returns the seek bar container element
   */
  abstract getSeekBarContainer(): HTMLElement | null;

  abstract injectSubmitButton(): void;

  addPreviewSkipInterval(skipTime: SkipTime) {
    this.clearVideoElementEventListeners(
      Object.values(this.timeUpdateEventListeners)
    );

    const previewSkipHandler = (event: Event) => {
      const margin = 0;
      const video = event.currentTarget as HTMLVideoElement;
      const checkIntervalLength = 5;
      const { interval, episode_length: episodeLength } = skipTime;
      const { start_time: startTime, end_time: endTime } = interval;
      const offset = video.duration - episodeLength;
      const { currentTime } = video;
      const inInterval = isInInterval(
        startTime,
        currentTime,
        margin,
        checkIntervalLength
      );

      if (inInterval) {
        this.setCurrentTime(endTime + offset + margin);
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

  addSkipTime(skipTime: SkipTime) {
    this.skipTimes.push(skipTime);
    this.videoElement.addEventListener(
      'timeupdate',
      this.skipIfInInterval(skipTime)
    );
    this.renderSkipTimeIndicator();
  }

  /**
   * Removes all the skip intervals from the player
   */
  clearSkipTimeIndicators() {
    this.skipTimes = [];
    this.renderSkipTimeIndicator();
  }

  /**
   * Removes skip times event handlers from the video element
   * @param eventListeners Event listeners to remove
   */
  clearVideoElementEventListeners(eventListeners: EventListener[]) {
    eventListeners.forEach((listener) =>
      this.videoElement.removeEventListener('timeupdate', listener)
    );
  }

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

  getDuration() {
    return this.videoElement.duration;
  }

  getCurrentTime() {
    return this.videoElement.currentTime;
  }

  injectSkipTimeIndicator() {
    const container = this.getSeekBarContainer();
    if (container) {
      this.injectSkipTimeIndicatornHelper(container);
    }
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
   * Renders the skip time indicator react element
   */
  renderSkipTimeIndicator() {
    const { id, shadowRoot } = this.skipTimeIndicatorContainer;
    const reactRoot = shadowRoot?.getElementById(`${id}-root`);
    const offset = this.getDuration() - this.skipTimes[0]?.episode_length || 0;
    if (reactRoot) {
      const skipTimeIndicatorElement = React.createElement<SkipTimeIndicatorContainerProps>(
        SkipTimeIndicatorContainer,
        {
          skipTimes: this.skipTimes,
          offset,
          variant: this.constructor.name.toLocaleLowerCase(),
        }
      );
      ReactDOM.render(skipTimeIndicatorElement, reactRoot);
    }
  }

  reset() {
    this.clearSkipTimeIndicators();
    this.clearVideoElementEventListeners(
      Object.values(this.timeUpdateEventListeners)
    );
    this.timeUpdateEventListeners = {};
  }

  /**
   * Sets the video element current time to the input time
   * @param time Time in seconds to set the player time to
   */
  setCurrentTime(time: number) {
    this.videoElement.currentTime = time;
  }

  /**
   * Skips the time in the interval if it is within the interval range
   * @param skipTime Skip time object containing the intervals
   */
  skipIfInInterval(skipTime: SkipTime) {
    const skipTimeString = JSON.stringify(skipTime);
    // Ensures player event handlers can be removed
    const timeUpdateEventListener =
      this.timeUpdateEventListeners[skipTimeString] ||
      (this.timeUpdateEventListeners[skipTimeString] = (event: Event) => {
        const margin = 0;
        const video = event.currentTarget as HTMLVideoElement;
        const checkIntervalLength = 5;
        const { interval, episode_length: episodeLength } = skipTime;
        const { start_time: startTime, end_time: endTime } = interval;
        const offset = video.duration - episodeLength;
        const { currentTime } = video;
        const inInterval = isInInterval(
          startTime + offset,
          currentTime,
          margin,
          checkIntervalLength
        );

        if (inInterval) {
          this.setCurrentTime(endTime + offset + margin);
        }
      });

    return timeUpdateEventListener;
  }
}

export default BasePlayer;
