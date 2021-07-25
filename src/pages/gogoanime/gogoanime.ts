import { BasePage } from '../base_page';

export class Gogoanime extends BasePage {
  getIdentifier(): string {
    const identifierUnclean = this.pathname.split('-episode-')[0];
    return identifierUnclean.substring(1);
  }

  getRawEpisodeNumber(): number {
    return parseInt(this.pathname.split('-episode-')[1], 10);
  }
}
