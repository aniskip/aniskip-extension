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
    const episodeNumberString = this.pathname.split('episode-')[1];

    if (episodeNumberString) {
      return parseFloat(episodeNumberString);
    }

    return 1;
  }
}
