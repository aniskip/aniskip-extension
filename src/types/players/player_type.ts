import { SkipTime } from '../api/skip_time_types';

interface Player {
  document: Document;

  submitButtonContainer: HTMLDivElement;

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
   */
  addSkipTime(skipTime: SkipTime): void;

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
   * Injects the skip time indicators into the player seek bar
   */
  injectSkipTimeIndicator(): void;

  /**
   * Injects the submit menu button into the player controls
   */
  injectSubmitButton(): void;

  /**
   * Resets player state
   */
  reset(): void;
}

export default Player;
