import { BasePage } from '../base-page';

export class FourAnime extends BasePage {
  getTitle(): string {
    const title = this.document.getElementById('titleleft')?.innerText;

    return title ?? '';
  }

  getIdentifier(): string {
    return this.pathname.replace('/', '').split('-episode')[0];
  }

  getRawEpisodeNumber(): number {
    const episodeString = this.pathname.split('episode-')[1];

    if (episodeString) {
      return parseFloat(episodeString);
    }

    return 1;
  }
}
