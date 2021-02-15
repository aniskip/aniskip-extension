import { SkipTime } from '../api/skip_time_types';

interface Player {
  document: Document;
  submitButtonContainer: HTMLDivElement;
  skipTimeIndicatorContainer: HTMLDivElement;
  skipTimes: SkipTime[];

  getVideoContainer(): HTMLElement | null;
  getSeekBarContainer(): HTMLElement | null;
  injectSubmitButton(): void;
  injectSkipTimeIndicator(): void;
  addSkipTime(skipTime: SkipTime): void;
  clearSkipIntervals(): void;
}

export default Player;
