import capitalizeFirstLetter from '../../utils/string';
import BasePage from '../base_page';

class Nineanime extends BasePage {
  getProviderName(): string {
    return capitalizeFirstLetter(this.hostname.split('.')[1]);
  }

  getIdentifier(): string {
    const cleansedPath = this.pathname.replace(/.*\./, '');
    return cleansedPath.split(/\/ep-/)[0];
  }

  getEpisodeNumber(): number {
    const cleansedPath = this.pathname.replace(/.*\./, '');
    return parseInt(cleansedPath.split(/\/ep-/)[0], 10);
  }
}

export default Nineanime;
