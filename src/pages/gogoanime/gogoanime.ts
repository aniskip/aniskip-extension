import { BasePage } from '../base-page';

export class Gogoanime extends BasePage {
  getIdentifier(): string {
    const identifierUnclean = this.pathname.split('-episode-')[0];
    return identifierUnclean.substring(1);
  }

  getRawEpisodeNumber(): number {
    return parseFloat(this.pathname.split('-episode-')[1]);
  }
}
