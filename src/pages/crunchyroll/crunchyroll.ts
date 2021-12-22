import { BasePage } from '../base-page';

export class Crunchyroll extends BasePage {
  getIdentifier(): string {
    const title = this.getTitle();
    const encoded = encodeURIComponent(title.toLocaleLowerCase());
    const reEncoded = encodeURIComponent(encoded.replace(/\./g, '%2e'));
    return reEncoded;
  }

  getRawEpisodeNumber(): number {
    const episodeNumberElement = this.document.querySelector(
      '#showmedia_about_media > h4:not(#showmedia_about_episode_num)'
    );

    const episodeNumberString = (
      episodeNumberElement?.textContent ?? ''
    ).trim();

    return parseFloat(episodeNumberString.split('Episode ')[1]) || 1;
  }

  getTitle(): string {
    const metadata = JSON.parse(
      this.document.querySelector('[type="application/ld+json"]')?.innerHTML ??
        '{}'
    );

    return metadata.partOfSeason.name ?? '';
  }
}
