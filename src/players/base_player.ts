import { browser } from 'webextension-polyfill-ts';

import MenusButtonsRenderer from '../renderers/menus_buttons_renderer';
import MenusRenderer from '../renderers/menus_renderer';
import SkipButtonsRenderer from '../renderers/skip_button_renderer';
import SkipTimeIndicatorsRenderer from '../renderers/skip_time_indicators_renderer';
import { MenusState } from '../types/components/menus_types';
import { Message } from '../types/message_type';
import { Player, Metadata } from '../types/player_types';
import { SkipOptionsType } from '../types/skip_option_type';
import { SkipTimeType } from '../types/api/aniskip_types';

abstract class BasePlayer implements Player {
  document: Document;

  isReady: boolean;

  menusButtonsRenderer: MenusButtonsRenderer;

  menusRenderer: MenusRenderer;

  menusState: MenusState;

  metadata: Metadata;

  scheduledSkipTime: ReturnType<typeof setTimeout> | null;

  skipButtonRenderer: SkipButtonsRenderer;

  skipOptions: SkipOptionsType;

  skipTimes: SkipTimeType[];

  skipTimeIndicatorsRenderer: SkipTimeIndicatorsRenderer;

  videoElement: HTMLVideoElement | null;

  constructor(document: Document, metadata: Metadata) {
    this.document = document;
    this.metadata = metadata;
    this.skipTimes = [];
    this.videoElement = null;
    this.isReady = false;
    this.scheduledSkipTime = null;

    this.menusState = {
      isSubmitMenuHidden: true,
      isVoteMenuHidden: true,
      skipTimes: this.skipTimes,
    };

    this.skipOptions = {
      op: 'manual-skip',
      ed: 'manual-skip',
    };

    (async () => {
      const { skipOptions } = await browser.storage.sync.get('skipOptions');
      this.skipOptions = skipOptions;
    })();

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

  async addSkipTime(skipTime: SkipTimeType) {
    if (!this.videoElement) {
      return;
    }

    this.skipTimes.push(skipTime);
    if (skipTime.skip_type === 'preview') {
      this.setCurrentTime(skipTime.interval.start_time - 2);
      this.play();
      return;
    }

    this.skipTimeIndicatorsRenderer.addSkipTimeIndicator(skipTime);
    this.setMenusState({
      ...this.menusState,
      skipTimes: [...this.skipTimes],
    });

    const skipType = skipTime.skip_type;
    const isManual = this.skipOptions[skipType] === 'manual-skip';
    const endTime = skipTime.interval.end_time;
    const offset = this.getDuration() - skipTime.episode_length;

    if (isManual) {
      this.skipButtonRenderer.addSkipButton(skipTime, () => {
        this.setCurrentTime(endTime + offset);
        this.play();
      });
    }
  }

  /**
   * Cancels the current scheduled skip time
   */
  clearScheduledSkipTime() {
    if (this.scheduledSkipTime !== null) {
      clearInterval(this.scheduledSkipTime);

      this.scheduledSkipTime = null;
    }
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

  /**
   * Returns the next skip time to be scheduled
   */
  getNextSkipTime(): SkipTimeType | null {
    let nextSkipTime: SkipTimeType | null = null;
    let earliestStartTime = Infinity;

    const currentTime = this.getCurrentTime();

    for (let i = 0; i < this.skipTimes.length; i += 1) {
      const skipTime = this.skipTimes[i];
      if (skipTime.skip_type === 'preview') {
        return skipTime;
      }
    }

    this.skipTimes.forEach((skipTime) => {
      if (skipTime.skip_type === 'preview') {
        return;
      }

      const { skip_type: skipType, interval } = skipTime;
      const { start_time: startTime } = interval;
      const isAutoSkip = this.skipOptions[skipType] === 'auto-skip';

      if (
        isAutoSkip &&
        currentTime <= startTime + 0.5 &&
        startTime <= earliestStartTime
      ) {
        earliestStartTime = startTime;
        nextSkipTime = skipTime;
      }
    });

    return nextSkipTime;
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
      this.metadata.seekBarContainerSelectorString
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

    this.skipTimes = this.skipTimes.filter(
      ({ skip_id: currentSkipId }) => currentSkipId !== skipTime.skip_id
    );

    this.setMenusState({
      ...this.menusState,
      skipTimes: [...this.skipTimes],
    });
  }

  onReady() {
    if (this.videoElement && this.getVideoControlsContainer()) {
      this.isReady = true;

      this.videoElement.addEventListener('timeupdate', (event) => {
        const { currentTime } = event.currentTarget as HTMLVideoElement;
        this.skipButtonRenderer.setCurrentTime(currentTime);
        this.scheduleSkipTimes();
      });

      browser.runtime.sendMessage({ type: 'player-ready' } as Message);
    }
  }

  reset() {
    this.skipTimeIndicatorsRenderer.clearSkipTimeIndicators();
    this.skipButtonRenderer.clearSkipButtons();
    this.menusRenderer.resetState();
    this.clearScheduledSkipTime();

    this.skipTimes = [];

    this.menusState = {
      isSubmitMenuHidden: true,
      isVoteMenuHidden: true,
      skipTimes: this.skipTimes,
    };
  }

  /**
   * Schedule the next skip time for auto skipping
   * @param skipTime Optional skip time to schedule
   * @param callback Optional callback on successful time change
   */
  scheduleSkipTimes() {
    if (!this.videoElement) {
      return;
    }

    this.clearScheduledSkipTime();

    const nextSkipTime = this.getNextSkipTime();
    if (nextSkipTime === null) {
      return;
    }

    const {
      interval,
      episode_length: episodeLength,
      skip_type: skipType,
    } = nextSkipTime;
    const { start_time: startTime, end_time: endTime } = interval;
    const offset = this.getDuration() - episodeLength;

    const currentTime = this.getCurrentTime();
    // Some players set playback speed to 0 when seeking
    const playbackSpeed = this.videoElement.playbackRate || 1;

    const timeUntilSkipTime =
      (startTime + offset - currentTime) / playbackSpeed;

    if (timeUntilSkipTime <= 0) {
      this.setCurrentTime(endTime + offset);
      return;
    }

    this.scheduledSkipTime = setTimeout(() => {
      this.setCurrentTime(endTime + offset);

      if (skipType === 'preview') {
        this.skipTimes = this.skipTimes.filter(
          ({ skip_type: currentSkipType }) => currentSkipType !== 'preview'
        );
      }
    }, timeUntilSkipTime * 1000);
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
}

export default BasePlayer;
