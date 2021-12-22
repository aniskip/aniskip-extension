import { BasePage } from '../base-page';

export class Nineanime extends BasePage {
  getIdentifier(): string {
    const cleansedPath = this.pathname.replace(/.*\./, '');
    return cleansedPath.split(/\/ep-/)[0];
  }

  getRawEpisodeNumber(): number {
    const cleansedPath = this.pathname.replace(/.*\./, '');
    const episodeNumberString = cleansedPath.split(/\/ep-/)[1];

    if (episodeNumberString === 'full') {
      return 1;
    }

    return parseFloat(episodeNumberString);
  }
}
