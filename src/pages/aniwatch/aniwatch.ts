import { BasePage } from '../base-page';
import { Metadata } from '../base-page.types';
import metadata from './metadata.json';

export class Aniwatch extends BasePage {
  static getMetadata(): Metadata {
    return metadata;
  }

  getIdentifier(): string {
    return this.pathname.split('/')[2];
  }

  getRawEpisodeNumber(): number {
    return parseFloat(this.pathname.split('/')[3]);
  }
}
