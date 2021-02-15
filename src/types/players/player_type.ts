import { SkipTime } from '../api/skip_time_types';

interface Player {
  document: Document;

  submitButtonContainer: HTMLDivElement;

  skipTimeIndicatorContainer: HTMLDivElement;

  skipTimes: SkipTime[];

  videoElement: HTMLVideoElement;

  timeUpdateEventListeners: Record<string, (event: Event) => void>;

  /**
   * Returns the root video container element
   */
  getVideoContainer(): HTMLElement | null;

  /**
   * Returns the seek bar container element
   */
  getSeekBarContainer(): HTMLElement | null;

  /**
   * Injects the submit menu button into the player controls
   */
  injectSubmitButton(): void;

  /**
   * Injects the skip time indicators into the player seek bar
   */
  injectSkipTimeIndicator(): void;

  /**
   * Adds a skip time into the player
   * @param skipTime Skip time to add
   */
  addSkipTime(skipTime: SkipTime): void;

  /**
   * Removes all the skip intervals from the player
   */
  clearSkipTimeIndicators(): void;

  /**
   * Returns the video element duration
   */
  getDuration(): number;

  /**
   * Returns the video element current time
   */
  getCurrentTime(): number;

  /**
   * Adds a skip time which will run once for preview
   * @param skipTime Skip time to preview
   */
  addPreviewSkipInterval(skipTime: SkipTime): void;

  /**
   * Resets player state
   */
  reset(): void;

  /**
   * Removes skip times event handlers from the video element
   * @param eventListeners Event listeners to remove
   */
  clearVideoElementEventListeners(eventListeners: EventListener[]): void;

  /**
   * Skips the time in the interval if it is within the interval range
   * @param skipTime Skip time object containing the intervals
   */
  skipIfInInterval(skipTime: SkipTime): void;
}

export default Player;
