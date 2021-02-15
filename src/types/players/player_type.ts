import { SkipTime } from '../api/skip_time_types';

interface Player {
  document: Document;

  submitButtonContainer: HTMLDivElement;

  skipTimeIndicatorContainer: HTMLDivElement;

  skipTimes: SkipTime[];

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
  clearSkipIntervals(): void;
}

export default Player;
