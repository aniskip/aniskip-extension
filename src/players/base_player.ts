import { browser } from 'webextension-polyfill-ts';

import { Player, Metadata } from '../types/player_types';
import { SkipTimeType } from '../types/api/aniskip_types';
import isInInterval from '../utils/time_utils';
import SkipTimeIndicatorsRenderer from '../renderers/skip_time_indicators_renderer';
import MenusButtonsRenderer from '../renderers/menus_buttons_renderer';
import MenusRenderer from '../renderers/menus_renderer';
import SkipButtonsRenderer from '../renderers/skip_button_renderer';
import { MenusState } from '../types/components/menus_types';
import { Message } from '../types/message_type';
import { SkipOptionType } from '../types/skip_option_type';

abstract class BasePlayer implements Player {
  document: Document;

  metadata: Metadata;

  isReady: boolean;

  menusState: MenusState;

  menusRenderer: MenusRenderer;

  menusButtonsRenderer: MenusButtonsRenderer;

  skipButtonRenderer: SkipButtonsRenderer;

  skipTimeIndicatorsRenderer: SkipTimeIndicatorsRenderer;

  videoElement: HTMLVideoElement | null;

  timeUpdateEventListeners: Record<string, EventListener>;

  constructor(document: Document, metadata: Metadata) {
    this.document = document;
    this.metadata = metadata;
    this.timeUpdateEventListeners = {};
    this.menusState = {
      isSubmitMenuHidden: true,
      isVoteMenuHidden: true,
      skipTimes: [],
    };
    this.videoElement = null;
    this.isReady = false;

    this.skipButtonRenderer = new SkipButtonsRenderer(
      'aniskip-player-skip-buttons',
      this.metadata.variant
    );
    const toggleSubmitMenu = (hidden: boolean) => () =>
      this.setMenusState({
        ...this.menusState,
        isSubmitMenuHidden: hidden,
      });
    this.menusRenderer = new MenusRenderer(
      'aniskip-player-menus',
      this.metadata.variant,
      toggleSubmitMenu(true),
      toggleSubmitMenu(true),
      toggleSubmitMenu(false),
      () =>
        this.setMenusState({
          ...this.menusState,
          isVoteMenuHidden: true,
        })
    );
    this.menusButtonsRenderer = new MenusButtonsRenderer(
      'aniskip-player-menus-buttons',
      this.metadata.variant,
      () =>
        this.setMenusState({
          ...this.menusState,
          isSubmitMenuHidden: !this.menusState.isSubmitMenuHidden,
          isVoteMenuHidden: true,
        }),
      () =>
        this.setMenusState({
          ...this.menusState,
          isSubmitMenuHidden: true,
          isVoteMenuHidden: !this.menusState.isVoteMenuHidden,
        })
    );
    this.skipTimeIndicatorsRenderer = new SkipTimeIndicatorsRenderer(
      'aniskip-player-skip-time-indicator',
      this.metadata.variant
    );
  }

  addPreviewSkipTime(skipTime: SkipTimeType) {
    if (!this.videoElement) {
      return;
    }

    this.clearVideoElementEventListeners(
      Object.values(this.timeUpdateEventListeners)
    );

    const previewSkipHandler = (event: Event) => {
      const video = event.currentTarget as HTMLVideoElement;
      const { interval, episode_length: episodeLength } = skipTime;
      const { start_time: startTime, end_time: endTime } = interval;
      const offset = video.duration - episodeLength;
      const { currentTime } = video;
      const inInterval = isInInterval(startTime, startTime + 1, currentTime);

      if (inInterval) {
        this.setCurrentTime(endTime + offset);
        video.removeEventListener('timeupdate', previewSkipHandler);
        Object.values(this.timeUpdateEventListeners).forEach(
          (functionReference) => {
            this.videoElement?.addEventListener(
              'timeupdate',
              functionReference
            );
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

  async addSkipTime(skipTime: SkipTimeType) {
    if (!this.videoElement) {
      return;
    }

    const skipType = skipTime.skip_type;
    const skipOption: SkipOptionType = (
      await browser.storage.sync.get('skipOptions')
    ).skipOptions[skipType];
    const manual = skipOption === 'manual-skip';

    this.skipTimeIndicatorsRenderer.addSkipTimeIndicator(skipTime);
    this.setMenusState({
      ...this.menusState,
      skipTimes: [...this.menusState.skipTimes, skipTime],
    });
    const endTime = skipTime.interval.end_time;
    const offset = this.getDuration() - skipTime.episode_length;
    if (manual) {
      this.skipButtonRenderer.addSkipButton(skipTime, () => {
        this.setCurrentTime(endTime + offset);
        this.play();
      });
    }
    this.videoElement.addEventListener(
      'timeupdate',
      this.skipIfInInterval(skipTime, manual)
    );
  }

  /**
   * Removes skip times event handlers from the video element
   * @param eventListeners Event listeners to remove
   */
  clearVideoElementEventListeners(eventListeners: EventListener[]) {
    eventListeners.forEach((listener) =>
      this.videoElement?.removeEventListener('timeupdate', listener)
    );
  }

  /**
   * Returns the container element with the given query string
   * @param selectorString Selector string to retrieve the node
   * @param index Index of the container from the query result
   */
  getContainerHelper(
    selectorString: string,
    index: number = 0
  ): HTMLElement | null {
    const containers = this.document.getElementsByClassName(selectorString);
    return containers[index] as HTMLElement;
  }

  getDuration() {
    return this.videoElement?.duration || 0;
  }

  getCurrentTime() {
    return this.videoElement?.currentTime || 0;
  }

  /**
   * Returns the root video container element
   */
  getVideoContainer() {
    return this.document.getElementById(
      this.metadata.videoContainerSelectorString
    );
  }

  getVideoControlsContainer() {
    return this.document.getElementById(
      this.metadata.videoControlsContainerSelectorString
    );
  }

  /**
   * Returns the seek bar container element
   */
  getSeekBarContainer() {
    return this.getContainerHelper(
      this.metadata.seekBarContainerSelectorString,
      0
    );
  }

  getSettingsButtonElement() {
    return this.document.getElementById(
      this.metadata.injectMenusButtonsReferenceNodeSelectorString
    );
  }

  initialise() {
    this.reset();
    this.injectSubmitMenu();
    this.injectSubmitMenuButton();
    this.injectSkipTimeIndicator();
    this.injectSkipButtons();
  }

  /**
   * Injects the skip button into the player
   */
  injectSkipButtons() {
    const settingsButtonElement = this.getSettingsButtonElement();
    if (
      settingsButtonElement &&
      !this.document.getElementById(this.skipButtonRenderer.id)
    ) {
      settingsButtonElement.parentElement?.appendChild(
        this.skipButtonRenderer.shadowRootContainer
      );
    }
  }

  /**
   * Injects the skip time indicators into the player seek bar
   */
  injectSkipTimeIndicator() {
    const seekBarContainer = this.getSeekBarContainer();
    if (
      seekBarContainer &&
      !this.document.getElementById(this.skipTimeIndicatorsRenderer.id)
    ) {
      seekBarContainer.appendChild(
        this.skipTimeIndicatorsRenderer.shadowRootContainer
      );
    }
  }

  /**
   * Injects the submit menu button into the player controls
   */
  injectSubmitMenu() {
    const videoContainer = this.getVideoContainer();
    if (
      videoContainer &&
      !this.document.getElementById(this.menusButtonsRenderer.id)
    ) {
      videoContainer.appendChild(this.menusRenderer.shadowRootContainer);
      this.menusRenderer.render();
    }
  }

  /**
   * Injects the submit menu button into the player
   */
  injectSubmitMenuButton() {
    const settingsButtonElement = this.getSettingsButtonElement();
    if (
      settingsButtonElement &&
      !this.document.getElementById(this.menusButtonsRenderer.id)
    ) {
      settingsButtonElement.insertAdjacentElement(
        'beforebegin',
        this.menusButtonsRenderer.shadowRootContainer
      );
      this.menusButtonsRenderer.render();
    }
  }

  play() {
    this.videoElement?.play();
  }

  removeSkipTime(skipTime: SkipTimeType) {
    if (!this.videoElement) {
      return;
    }

    this.skipTimeIndicatorsRenderer.removeSkipTimeIndicator(skipTime);
    this.skipButtonRenderer.removeSkipButton(skipTime);
    this.setMenusState({
      ...this.menusState,
      skipTimes: [
        ...this.menusState.skipTimes.filter(
          ({ skip_id: currentSkipId }) => currentSkipId !== skipTime.skip_id
        ),
      ],
    });
    this.videoElement.removeEventListener(
      'timeupdate',
      this.timeUpdateEventListeners[JSON.stringify(skipTime)]
    );
  }

  ready() {
    if (this.videoElement && this.getVideoControlsContainer()) {
      this.isReady = true;
      browser.runtime.sendMessage({ type: 'player-ready' } as Message);
    }
  }

  reset() {
    this.skipTimeIndicatorsRenderer.clearSkipTimeIndicators();
    this.skipButtonRenderer.clearSkipButtons();
    this.menusRenderer.resetState();
    this.clearVideoElementEventListeners(
      Object.values(this.timeUpdateEventListeners)
    );
    this.timeUpdateEventListeners = {};
    this.menusState = {
      isSubmitMenuHidden: true,
      isVoteMenuHidden: true,
      skipTimes: [],
    };
  }

  /**
   * Sets the video element current time to the input time
   * @param time Time in seconds to set the player time to
   */
  setCurrentTime(time: number) {
    if (!this.videoElement) {
      return;
    }

    this.videoElement.currentTime = time;
  }

  /**
   * Set menus state
   * @param newState New state of menus
   */
  setMenusState(newState: MenusState) {
    this.menusState = newState;
    this.menusButtonsRenderer.setState({
      isSubmitButtonActive: !newState.isSubmitMenuHidden,
      isVoteButtonActive: !newState.isVoteMenuHidden,
    });
    this.menusRenderer.setMenusState(newState);
  }

  setVideoElement(videoElement: HTMLVideoElement) {
    this.videoElement = videoElement;
    this.skipTimeIndicatorsRenderer.setVideoDuration(this.getDuration());
    this.skipButtonRenderer.setVideoDuration(this.getDuration());
  }

  /**
   * Skips the time in the interval if it is within the interval range
   * @param skipTime Skip time object containing the intervals
   */
  skipIfInInterval(skipTime: SkipTimeType, manual: boolean) {
    const skipTimeString = JSON.stringify(skipTime);
    // Ensures player event handlers can be removed
    const timeUpdateEventListener =
      this.timeUpdateEventListeners[skipTimeString] ||
      (this.timeUpdateEventListeners[skipTimeString] = (event: Event) => {
        const video = event.currentTarget as HTMLVideoElement;
        const { interval, episode_length: episodeLength } = skipTime;
        const { start_time: startTime, end_time: endTime } = interval;
        const offset = video.duration - episodeLength;
        const { currentTime } = video;
        const inInterval = isInInterval(
          startTime,
          startTime + 1,
          currentTime,
          offset
        );

        if (!manual && inInterval) {
          this.setCurrentTime(endTime + offset);
        }

        this.skipButtonRenderer.setCurrentTime(currentTime);
      });

    return timeUpdateEventListener;
  }
}

export default BasePlayer;
