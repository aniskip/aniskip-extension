import Page from '../../types/pages/page_type';
import capitalizeFirstLetter from '../../utils/string';

class Aniwatch implements Page {
  hostname: string;

  pathname: string;

  constructor(hostname: string, pathname: string) {
    this.hostname = hostname;
    this.pathname = pathname;
  }

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
