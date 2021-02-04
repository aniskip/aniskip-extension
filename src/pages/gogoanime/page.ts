import Page from '../../types/pages/page_type';
import capitalizeFirstLetter from '../../utils/string';

class Gogoanime implements Page {
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
    const identifierUnclean = this.pathname.split('-episode-')[0];
    return identifierUnclean.substring(1);
  }

  getEpisodeNumber(): number {
    return parseInt(this.pathname.split('-episode-')[1], 10);
  }
}

export default Gogoanime;
