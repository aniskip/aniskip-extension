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
    const episodeStringElement = this.document.querySelector(
      'div.row.no-gutters.anime-info > div.info > div > div > h2'
    );

    const episodeString = (episodeStringElement?.textContent ?? '')
      .trim()
      .split('Episode ')[1];

    if (episodeString) {
      return parseFloat(episodeString);
    }

    return 0;
  }
}
