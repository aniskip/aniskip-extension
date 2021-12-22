import { BasePage } from '../base-page';

export class AniMixPlay extends BasePage {
  getTitle(): string {
    const titleSpan = this.document.getElementsByClassName('animetitle')[0];
    if (titleSpan) {
      return titleSpan.innerHTML;
    }
    return this.getIdentifier();
  }

  getIdentifier(): string {
    return this.pathname.split('/')[2];
  }

  getRawEpisodeNumber(): number {
    const episodeNumberElement = this.document.getElementById('eptitleplace');

    const episodeString = (episodeNumberElement?.textContent ?? '')
      .trim()
      .split('Episode ')[1];

    if (episodeString) {
      return parseFloat(episodeString);
    }

    return 1;
  }
}
