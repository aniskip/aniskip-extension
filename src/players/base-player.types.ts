import { SkipTime } from '../api';

export type Metadata = {
  variant: string;
  videoContainerSelectorString: string;
  videoControlsContainerSelectorString: string;
  injectMenusButtonsReferenceNodeSelectorString: string;
  seekBarContainerSelectorString: string;
  seekBarContainerSelectorStringMobile?: string;
  player_urls: string[];
};

export type Player = {
  document: Document;

  metadata: Metadata;

  /**
   * Adds a skip time into the player.
   *
   * @param skipTime Skip time to add.
   * @param manual True if the user has to click skip opening / ending button, false if auto skip.
   */
  addSkipTime(skipTime: SkipTime, manual?: boolean): void;

  /**
   * Returns the video element duration.
   */
  getDuration(): number;

  /**
   * Returns the video element current time.
   */
  getCurrentTime(): number;

  /**
   * Returns the video controls container element.
   */
  getVideoControlsContainer(): HTMLElement | null;

  /**
   * Returns whether the player is ready for injection.
   */
  getIsReady(): boolean;

  /**
   * Initialises the player by injecting the extension buttons.
   */
  initialise(): void;

  /**
   * Plays the player.
   */
  play(): void;

  /**
   * Resets player state.
   */
  reset(): void;

  /**
   * Notify the content script that the player is ready for comminucation and
   * initialise event listeners.
   */
  onReady(): void;

  /**
   * Sets the video element current time to the input time.
   *
   * @param time Time in seconds to set the player time to.
   */
  setCurrentTime(time: number): void;

  /**
   * Sets the video element.
   *
   * @param videoElement Video element of the player.
   */
  setVideoElement(videoElement: HTMLVideoElement): void;
};
