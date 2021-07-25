import { Page } from './base_page.types';
import { getDomainName } from '../utils';
import { Animepahe } from './animepahe';
import { AniMixPlay } from './animixplay';
import { Aniwatch } from './aniwatch';
import { Crunchyroll } from './crunchyroll';
import { FourAnime } from './fouranime';
import { Gogoanime } from './gogoanime';
import { Nineanime } from './nineanime';
import { Twistmoe } from './twistmoe';

export class PageFactory {
  /**
   * Obtains the page object from the domain.
   *
   * @param pathname Provider's url path.
   * @param hostname Provider's host.
   */
  static getPage(pathname: string, hostname: string): Page {
    const domainName = getDomainName(hostname);

    switch (domainName) {
      case 'animixplay':
        return new AniMixPlay(hostname, pathname, document);
      case 'aniwatch':
        return new Aniwatch(hostname, pathname, document);
      case 'animepahe':
        return new Animepahe(hostname, pathname, document);
      case 'gogoanime':
        return new Gogoanime(hostname, pathname, document);
      case '9anime':
        return new Nineanime(hostname, pathname, document);
      case 'crunchyroll':
        return new Crunchyroll(hostname, pathname, document);
      case 'twist':
        return new Twistmoe(hostname, pathname, document);
      case '4anime':
        return new FourAnime(hostname, pathname, document);
      default:
        throw new Error(`Page ${hostname} not supported`);
    }
  }
}
