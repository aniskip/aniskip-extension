import { SkipTime } from '../api';

export type SelectorStrings = {
  videoContainerSelectorString: string;
  videoControlsContainerSelectorString: string;
  injectMenusButtonsReferenceNodeSelectorString: string;
  seekBarContainerSelectorString: string;
  seekBarContainerSelectorStringMobile?: string;
};

export type Metadata = {
  variant: string;
  playerUrls: string[];
  selectorStrings: Partial<Record<string, SelectorStrings>>;
};

export type Player = {
  /**
   * Adds a skip time into the player.
   *
   * @param skipTime Skip time to add.
   * @param manual True if the user has to click skip opening / ending button, false if auto skip.
   */
  addSkipTime(skipTime: SkipTime, manual?: boolean): void;

  /**
   * Clears the stored skip times.
   */
  clearSkipTimes(): void;

  /**
   * Returns the video element duration.
   */
  getDuration(): number;

  /**
   * Returns the video element current time.
   */
  getCurrentTime(): number;

  /**
   * Returns the root video container element.
   */
  getVideoContainer(): HTMLElement | null;

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
   * Initialises the skip times.
   */
  initialiseSkipTimes(): Promise<void>;

  /**
   * Checks if the player controls are visible to the user.
   */
  isControlsVisible(): boolean;

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

/**
 * Frame rate constant. We are unable to retrieve the frame rate of the video
 * dynamically at the moment.
 */
export const FRAME_RATE = 1 / 24;
