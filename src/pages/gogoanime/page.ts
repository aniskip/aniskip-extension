import capitalizeFirstLetter from '../../utils/string';
import BasePage from '../base_page';

class Gogoanime extends BasePage {
  getProviderName(): string {
    return capitalizeFirstLetter(this.hostname.split('.')[0]);
  }

  getIdentifier(): string {
    const identifierUnclean = this.pathname.split('-episode-')[0];
    return identifierUnclean.substring(1);
  }

  getEpisodeNumber(): number {
    return parseInt(this.pathname.split('-episode-')[1], 10);
  }
}

export default Gogoanime;
