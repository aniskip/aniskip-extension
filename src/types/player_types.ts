import { SkipTimeType } from './api/aniskip_types';

export interface Metadata {
  variant: string;
  videoContainerSelectorString: string;
  videoControlsContainerSelectorString: string;
  injectMenusButtonsReferenceNodeSelectorString: string;
  seekBarContainerSelectorString: string;
  player_urls: string[];
}

export interface Player {
  document: Document;

  metadata: Metadata;

  isReady: boolean;

  /**
   * Adds a skip time which will run once for preview
   * @param skipTime Skip time to preview
   */
  addPreviewSkipTime(skipTime: SkipTimeType): void;

  /**
   * Adds a skip time into the player
   * @param skipTime Skip time to add
   * @param manual True if the user has to click skip opening / ending button, false if auto skip
   */
  addSkipTime(skipTime: SkipTimeType, manual: boolean): void;

  /**
   * Returns the video element duration
   */
  getDuration(): number;

  /**
   * Returns the video element current time
   */
  getCurrentTime(): number;

  /**
   * Returns the video controls container element
   */
  getVideoControlsContainer(): HTMLElement | null;

  /**
   * Initialises the player by injecting the extension buttons
   */
  initialise(): void;

  /**
   * Plays the player
   */
  play(): void;

  /**
   * Removes a skip time from the player
   * @param skipTime Skip time to remove
   */
  removeSkipTime(skipTime: SkipTimeType): void;

  /**
   * Resets player state
   */
  reset(): void;

  /**
   * Notify the content script that the player is ready for comminucation
   */
  onReady(): void;

  /**
   * Sets the video element current time to the input time
   * @param time Time in seconds to set the player time to
   */
  setCurrentTime(time: number): void;

  /**
   * Sets the video element
   * @param videoElement Video element of the player
   */
  setVideoElement(videoElement: HTMLVideoElement): void;
}
