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

  isReady: boolean;

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
   * Initialises the player by injecting the extension buttons.
   */
  initialise(): void;

  /**
   * Plays the player.
   */
  play(): void;

  /**
   * Removes a skip time from the player.
   *
   * @param skipId Skip id of the skip time to remove.
   * @param isPreview Optional, if true, remove all the preview skip times.
   */
  removeSkipTime(skipId: string, isPreview?: boolean): void;

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
