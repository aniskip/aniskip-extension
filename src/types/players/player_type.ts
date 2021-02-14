import { SkipTime } from '../api/skip_time_types';

interface Player {
  document: Document;
  submitButtonContainer: HTMLDivElement;

  getVideoContainer(): HTMLElement | null;
  getSeekBarContainer(): HTMLElement | null;
  injectSubmitButton(): void;
  injectSkipTimeIndicator(SkipTime: SkipTime): void;
}

export default Player;
