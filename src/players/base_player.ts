import { browser } from 'webextension-polyfill-ts';

import {
  PlayerButtonsRenderer,
  MenusRenderer,
  SkipButtonsRenderer,
  SkipTimeIndicatorsRenderer,
} from '../renderers';
import { MenusState } from '../components/Menus/Menus.types';
import { Message, SkipOptions } from '../scripts/background';
import { Player, Metadata } from './base_player.types';
import { SkipTime } from '../api';
import { isInInterval } from '../utils';

export abstract class BasePlayer implements Player {
  document: Document;

  isReady: boolean;

  playerButtonsRenderer: PlayerButtonsRenderer;

  menusRenderer: MenusRenderer;

  menusState: MenusState;

  metadata: Metadata;

  scheduledSkipTime: ReturnType<typeof setTimeout> | null;

  skipButtonRenderer: SkipButtonsRenderer;

  skipOptions: SkipOptions;

  skipTimes: SkipTime[];

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

    (async (): Promise<void> => {
      const { skipOptions } = await browser.storage.sync.get('skipOptions');
      this.skipOptions = skipOptions;
    })();

    this.skipButtonRenderer = new SkipButtonsRenderer(
      'aniskip-player-skip-buttons',
      this.metadata.variant
    );

    const toggleSubmitMenu = (hidden: boolean) => (): void =>
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

    this.playerButtonsRenderer = new PlayerButtonsRenderer(
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

  addSkipTime(skipTime: SkipTime): void {
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

      return;
    }

    const startTime = skipTime.interval.start_time;
    const currentTime = this.getCurrentTime();

    // Skip time loaded late.
    if (isInInterval(startTime, endTime, currentTime, offset)) {
      this.setCurrentTime(endTime + offset);
      this.play();
    }
  }

  /**
   * Cancels the current scheduled skip time.
   */
  clearScheduledSkipTime(): void {
    if (this.scheduledSkipTime !== null) {
      clearInterval(this.scheduledSkipTime);

      this.scheduledSkipTime = null;
    }
  }

  /**
   * Returns the container element with the given query string.
   *
   * @param selectorString Selector string to retrieve the node.
   * @param index Index of the container from the query result.
   */
  getContainerHelper(
    selectorString: string,
    index: number = 0
  ): HTMLElement | null {
    const containers = this.document.getElementsByClassName(selectorString);
    return containers[index] as HTMLElement;
  }

  /**
   * Returns the next skip time to be scheduled.
   */
  getNextSkipTime(): SkipTime | null {
    let nextSkipTime: SkipTime | null = null;
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

      const {
        skip_type: skipType,
        interval,
        episode_length: episodeLength,
      } = skipTime;
      const { start_time: startTime } = interval;
      const offset = this.getDuration() - episodeLength;
      const isAutoSkip = this.skipOptions[skipType] === 'auto-skip';

      if (
        isAutoSkip &&
        currentTime < startTime + offset &&
        startTime + offset < earliestStartTime
      ) {
        earliestStartTime = startTime;
        nextSkipTime = skipTime;
      }
    });

    return nextSkipTime;
  }

  getDuration(): number {
    return this.videoElement?.duration || 0;
  }

  getCurrentTime(): number {
    return this.videoElement?.currentTime || 0;
  }

  /**
   * Returns the root video container element.
   */
  getVideoContainer(): HTMLElement | null {
    return this.document.getElementById(
      this.metadata.videoContainerSelectorString
    );
  }

  getVideoControlsContainer(): HTMLElement | null {
    return this.document.getElementById(
      this.metadata.videoControlsContainerSelectorString
    );
  }

  /**
   * Returns the seek bar container element.
   */
  getSeekBarContainer(): HTMLElement | null {
    return this.getContainerHelper(
      this.metadata.seekBarContainerSelectorString
    );
  }

  getSettingsButtonElement(): HTMLElement | null {
    return this.document.getElementById(
      this.metadata.injectMenusButtonsReferenceNodeSelectorString
    );
  }

  initialise(): void {
    this.reset();
    this.injectSubmitMenu();
    this.injectSubmitMenuButton();
    this.injectSkipTimeIndicator();
    this.injectSkipButtons();
  }

  /**
   * Injects the skip button into the player.
   */
  injectSkipButtons(): void {
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
   * Injects the skip time indicators into the player seek bar.
   */
  injectSkipTimeIndicator(): void {
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
   * Injects the submit menu button into the player controls.
   */
  injectSubmitMenu(): void {
    const videoContainer = this.getVideoContainer();
    if (
      videoContainer &&
      !this.document.getElementById(this.playerButtonsRenderer.id)
    ) {
      videoContainer.appendChild(this.menusRenderer.shadowRootContainer);
      this.menusRenderer.render();
    }
  }

  /**
   * Injects the submit menu button into the player.
   */
  injectSubmitMenuButton(): void {
    const settingsButtonElement = this.getSettingsButtonElement();
    if (
      settingsButtonElement &&
      !this.document.getElementById(this.playerButtonsRenderer.id)
    ) {
      settingsButtonElement.insertAdjacentElement(
        'beforebegin',
        this.playerButtonsRenderer.shadowRootContainer
      );
      this.playerButtonsRenderer.render();
    }
  }

  play(): void {
    this.videoElement?.play();
  }

  removeSkipTime(skipId: string, isPreview?: boolean): void {
    if (!this.videoElement) {
      return;
    }

    if (isPreview) {
      this.skipTimes = this.skipTimes.filter(
        ({ skip_type: skipType }) => skipType !== 'preview'
      );

      return;
    }

    this.skipTimeIndicatorsRenderer.removeSkipTimeIndicator(skipId);
    this.skipButtonRenderer.removeSkipButton(skipId);

    this.skipTimes = this.skipTimes.filter(
      ({ skip_id: currentSkipId }) => currentSkipId !== skipId
    );

    this.setMenusState({
      ...this.menusState,
      skipTimes: [...this.skipTimes],
    });
  }

  onReady(): void {
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

  reset(): void {
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
   * Schedule the next skip time for auto skipping.
   *
   * @param skipTime Optional skip time to schedule.
   * @param callback Optional callback on successful time change.
   */
  scheduleSkipTimes(): void {
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
    // Some players set playback speed to 0 when seeking.
    const playbackSpeed = this.videoElement.playbackRate || 1;

    const timeUntilSkipTime =
      (startTime + offset - currentTime) / playbackSpeed;

    this.scheduledSkipTime = setTimeout(() => {
      this.setCurrentTime(endTime + offset);

      if (skipType === 'preview') {
        this.removeSkipTime('', true);
      }
    }, timeUntilSkipTime * 1000);
  }

  /**
   * Sets the video element current time to the input time.
   *
   * @param time Time in seconds to set the player time to.
   */
  setCurrentTime(time: number): void {
    if (!this.videoElement) {
      return;
    }

    this.videoElement.currentTime = time;
  }

  /**
   * Set menus state.
   *
   * @param newState New state of menus.
   */
  setMenusState(newState: MenusState): void {
    this.menusState = newState;
    this.playerButtonsRenderer.setState({
      isSubmitButtonActive: !newState.isSubmitMenuHidden,
      isVoteButtonActive: !newState.isVoteMenuHidden,
    });
    this.menusRenderer.setMenusState(newState);
  }

  setVideoElement(videoElement: HTMLVideoElement): void {
    this.videoElement = videoElement;
    this.skipTimeIndicatorsRenderer.setVideoDuration(this.getDuration());
    this.skipButtonRenderer.setVideoDuration(this.getDuration());
  }
}
