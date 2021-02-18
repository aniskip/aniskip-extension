import { SkipTime } from '../api/skip_time_types';

interface Player {
  document: Document;

  variant: string;

  submitButtonContainer: HTMLDivElement;

  skipButtonContainer: HTMLDivElement;

  skipTimeIndicatorContainer: HTMLDivElement;

  skipTimes: SkipTime[];

  videoElement: HTMLVideoElement;

  timeUpdateEventListeners: Record<string, (event: Event) => void>;

  /**
   * Adds a skip time which will run once for preview
   * @param skipTime Skip time to preview
   */
  addPreviewSkipTime(skipTime: SkipTime): void;

  /**
   * Adds a skip time into the player
   * @param skipTime Skip time to add
   * @param manual True if the user has to click skip opening / ending button, false if auto skip
   */
  addSkipTime(skipTime: SkipTime, manual: boolean): void;

  /**
   * Returns the video element duration
   */
  getDuration(): number;

  /**
   * Returns the video element current time
   */
  getCurrentTime(): number;

  /**
   * Returns the root video container element
   */
  getVideoContainer(): HTMLElement | null;

  /**
   * Injects the skip button into the player
   */
  injectSkipButton(): void;

  /**
   * Injects the skip time indicators into the player seek bar
   */
  injectSkipTimeIndicator(): void;

  /**
   * Injects the submit menu button into the player controls
   */
  injectSubmitButton(): void;

  /**
   * Plays the player
   */
  play(): void;

  /**
   * Resets player state
   */
  reset(): void;

  /**
   * Sets the video element current time to the input time
   * @param time Time in seconds to set the player time to
   */
  setCurrentTime(time: number): void;
}

export default Player;
