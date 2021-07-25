import { Videojs } from './videojs';

export class FourAnime extends Videojs {
  initialise(): void {
    // Hack to fix 4Anime floating buttons in smaller window size.
    if (
      window.innerWidth <= 900 &&
      (this.videoElement?.readyState || 0) === 0
    ) {
      return;
    }

    super.initialise();
  }
}
