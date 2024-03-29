import { BasePage } from '../base-page';
import { Metadata } from '../base-page.types';
import metadata from './metadata.json';

export class Twistmoe extends BasePage {
  static getMetadata(): Metadata {
    return metadata;
  }

  getProviderName(): string {
    return `${super.getProviderName()}moe`;
  }

  getIdentifier(): string {
    return window.location.pathname.split('/')[2];
  }

  getRawEpisodeNumber(): number {
    return parseFloat(window.location.pathname.split('/')[3]);
  }
}
