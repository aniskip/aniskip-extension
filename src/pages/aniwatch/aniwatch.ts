import { BasePage } from '../base_page';

export class Aniwatch extends BasePage {
  getIdentifier(): string {
    return this.pathname.split('/')[2];
  }

  getRawEpisodeNumber(): number {
    return parseInt(this.pathname.split('/')[3], 10);
  }
}
