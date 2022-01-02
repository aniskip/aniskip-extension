import { BasePage } from '../base-page';
import { Metadata } from '../base-page.types';
import metadata from './metadata.json';

export class Gogoanime extends BasePage {
  static getMetadata(): Metadata {
    return metadata;
  }

  getIdentifier(): string {
    const identifierUnclean = window.location.pathname.split('-episode-')[0];
    return identifierUnclean.substring(1);
  }

  getRawEpisodeNumber(): number {
    return parseFloat(window.location.pathname.split('-episode-')[1]);
  }
}
