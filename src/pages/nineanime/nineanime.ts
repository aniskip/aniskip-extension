import { BasePage } from '../base-page';
import { Metadata } from '../base-page.types';
import metadata from './metadata.json';

export class Nineanime extends BasePage {
  static getMetadata(): Metadata {
    return metadata;
  }

  getIdentifier(): string {
    const cleansedPath = window.location.pathname.replace(/.*\./, '');
    return cleansedPath.split(/\/ep-/)[0];
  }

  getRawEpisodeNumber(): number {
    const cleansedPath = window.location.pathname.replace(/.*\./, '');
    const episodeNumberString = cleansedPath.split(/\/ep-/)[1];

    if (episodeNumberString === 'full') {
      return 1;
    }

    return parseFloat(episodeNumberString);
  }
}
