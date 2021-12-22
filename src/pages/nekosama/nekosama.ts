import { BasePage } from '../base-page';

export class NekoSama extends BasePage {
  getTitle(): string {
    const title = this.document.querySelector(
      'div.row.no-gutters.anime-info > div.info > div > div > h1'
    )?.textContent;

    return title ?? '';
  }

  getIdentifier(): string {
    return this.pathname.split('/')[3];
  }

  getRawEpisodeNumber(): number {
    const episodeNumberStringElement = this.document.querySelector(
      'div.row.no-gutters.anime-info > div.info > div > div > h2'
    );

    const episodeNumberString = (episodeNumberStringElement?.textContent ?? '')
      .trim()
      .split('Episode ')[1];

    if (episodeNumberString) {
      return parseFloat(episodeNumberString);
    }

    return 0;
  }
}
