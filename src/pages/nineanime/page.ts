import Page from '../../types/pages/page_type';
import capitalizeFirstLetter from '../../utils/string';

class Nineanime implements Page {
  hostname: string;

  pathname: string;

  constructor(hostname: string, pathname: string) {
    this.hostname = hostname;
    this.pathname = pathname;
  }

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
