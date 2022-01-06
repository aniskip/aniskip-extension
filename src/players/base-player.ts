import { browser } from 'webextension-polyfill-ts';
import {
  PlayerButtonsRenderer,
  MenusRenderer,
  SkipButtonsRenderer,
  SkipTimeIndicatorsRenderer,
} from '../renderers';
import {
  DEFAULT_KEYBINDS,
  DEFAULT_SKIP_OPTIONS,
  DEFAULT_SYNC_OPTIONS,
  Keybinds,
  Message,
  SkipOptions,
  SyncOptions,
} from '../scripts/background';
import { Player, Metadata, FRAME_RATE } from './base-player.types';
import { AniskipHttpClient, PreviewSkipTime, SkipTime, SkipType } from '../api';
import {
  isInInterval,
  roundToClosestMultiple,
  serialiseKeybind,
} from '../utils';
import {
  skipTimeAdded,
  skipTimesRemoved,
  stateReset,
  selectSkipTimes,
  Store,
  configureStore,
  selectPreviewSkipTime,
} from '../data';

export class BasePlayer implements Player {
  metadata: Metadata;

  scheduledSkipTime: ReturnType<typeof setTimeout> | undefined;

  videoElement: HTMLVideoElement | null;

  skipOptions: SkipOptions;

  store: Store;

  skipTimeLength: number;

  keybinds: Keybinds;

  keyboardEventHandler: (event: KeyboardEvent) => void;

  lastControlsOpacity: number;

  isReady: boolean;

  playerButtonsRenderer: PlayerButtonsRenderer;

  menusRenderer: MenusRenderer;

  skipButtonRenderer: SkipButtonsRenderer;

  skipTimeIndicatorsRenderer: SkipTimeIndicatorsRenderer;

  constructor(metadata: Metadata) {
    this.metadata = metadata;
    this.videoElement = null;
    this.scheduledSkipTime = undefined;
    this.store = configureStore('aniskip-player');
    this.keybinds = DEFAULT_KEYBINDS;
    this.lastControlsOpacity = 0;
    this.isReady = false;
    this.skipOptions = DEFAULT_SKIP_OPTIONS;
    this.skipTimeLength = DEFAULT_SYNC_OPTIONS.skipTimeLength;

    this.keyboardEventHandler = (event: KeyboardEvent): void => {
      switch (serialiseKeybind(event)) {
        case this.keybinds['seek-backward-one-frame']: {
          this.setCurrentTime(
            roundToClosestMultiple(
              this.getCurrentTime() - FRAME_RATE,
              FRAME_RATE
            )
          );
          break;
        }
        case this.keybinds['seek-forward-one-frame']: {
          this.setCurrentTime(
            roundToClosestMultiple(
              this.getCurrentTime() + FRAME_RATE,
              FRAME_RATE
            )
          );
          break;
        }
        case this.keybinds['skip-forward']: {
          this.setCurrentTime(this.getCurrentTime() + this.skipTimeLength);
          break;
        }
        case this.keybinds['skip-backward']: {
          this.setCurrentTime(this.getCurrentTime() - this.skipTimeLength);
          break;
        }
        default:
        // no default
      }
    };

    (async (): Promise<void> => {
      const { skipOptions, keybinds, skipTimeLength } =
        (await browser.storage.sync.get({
          skipOptions: DEFAULT_SKIP_OPTIONS,
          keybinds: DEFAULT_KEYBINDS,
          skipTimeLength: DEFAULT_SYNC_OPTIONS.skipTimeLength,
        })) as SyncOptions;

      this.skipOptions = skipOptions;
      this.keybinds = keybinds;
      this.skipTimeLength = skipTimeLength;
      this.injectPlayerControlKeybinds();
    })();

    this.skipButtonRenderer = new SkipButtonsRenderer(
      'aniskip-player-skip-buttons',
      this.metadata.variant,
      this.store,
      this
    );

    this.menusRenderer = new MenusRenderer(
      'aniskip-player-menus',
      this.metadata.variant,
      this.store,
      this
    );

    this.playerButtonsRenderer = new PlayerButtonsRenderer(
      'aniskip-player-player-buttons',
      this.metadata.variant,
      this.store
    );

    this.skipTimeIndicatorsRenderer = new SkipTimeIndicatorsRenderer(
      'aniskip-player-skip-time-indicator',
      this.metadata.variant,
      this.store,
      this
    );
  }

  addSkipTime(skipTime: SkipTime): void {
    if (!this.videoElement) {
      return;
    }

    this.store.dispatch(skipTimeAdded(skipTime));
    this.skipButtonRenderer.render();
    this.skipTimeIndicatorsRenderer.render();

    const isAutoSkip = this.skipOptions[skipTime.skipType] === 'auto-skip';

    if (!isAutoSkip) {
      return;
    }

    const { startTime, endTime } = skipTime.interval;
    const offset = this.getDuration() - skipTime.episodeLength;
    const currentTime = this.getCurrentTime();

    // Skip time loaded late.
    if (isInInterval(startTime, startTime + 0.25, currentTime)) {
      this.setCurrentTime(endTime + offset);
    }
  }

  /**
   * Cancels the current scheduled skip time.
   */
  clearScheduledSkipTime(): void {
    if (this.scheduledSkipTime) {
      clearInterval(this.scheduledSkipTime);

      this.scheduledSkipTime = undefined;
    }
  }

  clearSkipTimes(): void {
    this.clearScheduledSkipTime();
    this.store.dispatch(skipTimesRemoved());
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
    const containers = document.getElementsByClassName(selectorString);
    return containers[index] as HTMLElement;
  }

  /**
   * Returns the next skip time to be scheduled.
   */
  getNextSkipTime(): SkipTime | PreviewSkipTime | undefined {
    const previewSkipTime = selectPreviewSkipTime(this.store.getState());
    const currentTime = this.getCurrentTime();

    if (previewSkipTime && currentTime < previewSkipTime.interval.startTime) {
      return previewSkipTime;
    }

    let nextSkipTime: SkipTime | undefined;
    let earliestStartTime = Infinity;

    const skipTimes = selectSkipTimes(this.store.getState());

    skipTimes.forEach((skipTime) => {
      const { skipType, interval, episodeLength } = skipTime;
      const { startTime } = interval;
      const offset = this.getDuration() - episodeLength;
      const isAutoSkip = this.skipOptions[skipType] === 'auto-skip';

      if (
        isAutoSkip &&
        currentTime <= startTime + offset &&
        startTime + offset < earliestStartTime
      ) {
        earliestStartTime = startTime;
        nextSkipTime = skipTime;
      }
    });

    return nextSkipTime;
  }

  getDuration(): number {
    return this.videoElement?.duration ?? 0;
  }

  getIsReady(): boolean {
    return this.isReady;
  }

  static getMetadata(): Metadata {
    throw new Error('getMetadata() not yet implemented');
  }

  getCurrentTime(): number {
    return this.videoElement?.currentTime ?? 0;
  }

  getVideoContainer(): HTMLElement | null {
    return document.getElementById(this.metadata.videoContainerSelectorString);
  }

  getVideoControlsContainer(): HTMLElement | null {
    return document.getElementById(
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
    return document.getElementById(
      this.metadata.injectMenusButtonsReferenceNodeSelectorString
    );
  }

  initialise(): void {
    this.reset();
    this.injectPlayerControlKeybinds();
    this.injectSubmitMenu();
    this.injectSubmitMenuButton();
    this.injectSkipTimeIndicator();
    this.injectSkipButtons();
  }

  /**
   * Adds the opening and ending skip invervals.
   */
  async initialiseSkipTimes(): Promise<void> {
    const aniskipHttpClient = new AniskipHttpClient();
    const { malId, episodeNumber, error } = await browser.runtime.sendMessage({
      type: 'get-episode-information',
    } as Message);

    if (error) {
      return;
    }

    const skipTimeTypes: SkipType[] = [];
    Object.entries(this.skipOptions).forEach(([skipType, value]) => {
      if (value !== 'disabled') {
        skipTimeTypes.push(skipType as SkipType);
      }
    });

    const episodeLength = this.getDuration();

    if (skipTimeTypes.length === 0 || episodeLength === 0) {
      return;
    }

    const getSkipTimesResponse = await aniskipHttpClient.getSkipTimes(
      malId,
      episodeNumber,
      skipTimeTypes,
      episodeLength
    );

    if (getSkipTimesResponse.found) {
      getSkipTimesResponse.results.forEach((skipTime) =>
        this.addSkipTime(skipTime)
      );
    }
  }

  /**
   * Injects keybinds which control the player time.
   */
  injectPlayerControlKeybinds(): void {
    window.removeEventListener('keydown', this.keyboardEventHandler);
    window.addEventListener('keydown', this.keyboardEventHandler);
  }

  /**
   * Injects the skip button into the player.
   */
  injectSkipButtons(): void {
    const videoContainer = this.getVideoContainer();
    if (
      videoContainer &&
      !document.getElementById(this.skipButtonRenderer.id)
    ) {
      videoContainer.appendChild(this.skipButtonRenderer.shadowRootContainer);
    }
  }

  /**
   * Injects the skip time indicators into the player seek bar.
   */
  injectSkipTimeIndicator(): void {
    const seekBarContainer = this.getSeekBarContainer();
    if (
      seekBarContainer &&
      !document.getElementById(this.skipTimeIndicatorsRenderer.id)
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
      !document.getElementById(this.playerButtonsRenderer.id)
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
      !document.getElementById(this.playerButtonsRenderer.id)
    ) {
      settingsButtonElement.insertAdjacentElement(
        'beforebegin',
        this.playerButtonsRenderer.shadowRootContainer
      );
      this.playerButtonsRenderer.render();
    }
  }

  isControlsVisible(): boolean {
    const playerControlsElement = this.getVideoControlsContainer();

    if (!playerControlsElement) {
      return false;
    }

    const opacityString = window
      .getComputedStyle(playerControlsElement)
      .getPropertyValue('opacity');

    const opacity = parseFloat(opacityString);
    const isOpacityIncreasing = this.lastControlsOpacity < opacity;
    this.lastControlsOpacity = opacity;

    return isOpacityIncreasing || opacity === 1;
  }

  play(): void {
    this.videoElement?.play();
  }

  onReady(): void {
    if (this.videoElement && this.getVideoControlsContainer()) {
      this.isReady = true;

      const listener = (): void => {
        this.scheduleSkipTimes();
        this.skipButtonRenderer.render();
        this.skipTimeIndicatorsRenderer.render();
      };

      this.videoElement.addEventListener('timeupdate', listener);
      this.videoElement.addEventListener('playing', listener);

      this.initialiseSkipTimes();
    }
  }

  reset(): void {
    this.clearScheduledSkipTime();
    this.store.dispatch(stateReset());
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

    if (this.videoElement.paused) {
      return;
    }

    const nextSkipTime = this.getNextSkipTime();
    if (!nextSkipTime) {
      return;
    }

    const { interval, episodeLength } = nextSkipTime;
    const { startTime, endTime } = interval;
    const offset = this.getDuration() - episodeLength;

    const currentTime = this.getCurrentTime();
    // Some players set playback speed to 0 when seeking.
    const playbackSpeed = this.videoElement.playbackRate || 1;

    const timeUntilSkipTime =
      (startTime + offset - currentTime) / playbackSpeed;

    this.scheduledSkipTime = setTimeout(() => {
      this.setCurrentTime(endTime + offset);
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

    if (time < 0) {
      this.videoElement.currentTime = 0;

      return;
    }

    if (time > this.videoElement.duration) {
      this.videoElement.currentTime = Math.floor(this.videoElement.duration);

      return;
    }

    this.videoElement.currentTime = time;
  }

  setVideoElement(videoElement: HTMLVideoElement): void {
    this.videoElement = videoElement;
  }
}
