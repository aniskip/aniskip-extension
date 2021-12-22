import { BasePage } from '../base-page';

export class Twistmoe extends BasePage {
  getProviderName(): string {
    return `${super.getProviderName()}moe`;
  }

  getIdentifier(): string {
    return this.pathname.split('/')[2];
  }

  getRawEpisodeNumber(): number {
    return parseFloat(this.pathname.split('/')[3]);
  }
}
