import { BasePage } from '../base_page';

export class Twistmoe extends BasePage {
  getProviderName(): string {
    return `${super.getProviderName()}moe`;
  }

  getIdentifier(): string {
    return this.pathname.split('/')[2];
  }

  getRawEpisodeNumber(): number {
    return parseInt(this.pathname.split('/')[3], 10);
  }
}
