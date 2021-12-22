import { BasePage } from '../base-page';

export class Aniwatch extends BasePage {
  getIdentifier(): string {
    return this.pathname.split('/')[2];
  }

  getRawEpisodeNumber(): number {
    return parseFloat(this.pathname.split('/')[3]);
  }
}
