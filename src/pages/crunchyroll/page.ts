import capitalizeFirstLetter from '../../utils/string';
import BasePage from '../base_page';

class Crunchyroll extends BasePage {
  getProviderName(): string {
    return capitalizeFirstLetter(this.hostname.split('.')[1]);
  }

  getIdentifier(): string {
    const title = Array.from(
      this.document.getElementsByTagName('title')
    ).filter(
      (titleElement: HTMLTitleElement) => titleElement.text !== undefined
    )[0].text;
    const seriesNameWithEpisode = title.split(', ')[0];
    const seriesName = seriesNameWithEpisode.replace(/\sEpisode\s[0-9]+/, '');
    const encoded = encodeURIComponent(seriesName.toLocaleLowerCase());
    const reEncoded = encodeURIComponent(encoded);
    return reEncoded;
  }

  getEpisodeNumber(): number {
    const matches = this.pathname.match(/episode-([0-9]+)/);
    if (matches) {
      return parseInt(matches[1], 10);
    }
    return -1;
  }
}

export default Crunchyroll;
