import capitalizeFirstLetter from '../../utils/string';
import BasePage from '../base_page';

class Aniwatch extends BasePage {
  getProviderName(): string {
    return capitalizeFirstLetter(this.hostname.split('.')[0]);
  }

  getIdentifier(): string {
    return this.pathname.split('/')[2];
  }

  getEpisodeNumber(): number {
    return parseInt(this.pathname.split('/')[3], 10);
  }
}

export default Aniwatch;
