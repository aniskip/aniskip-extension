import AniMixPlay from './animixplay/page';
import Aniwatch from './aniwatch/page';
import Crunchyroll from './crunchyroll/page';
import FourAnime from './fouranime/page';
import Gogoanime from './gogoanime/page';
import Nineanime from './nineanime/page';
import Twistmoe from './twistmoe/page';

class PageFactory {
  /**
   * Obtains the page object from the domain
   * @param pathname Provider's url path
   * @param hostname Provider's host
   */
  static getPage(pathname: string, hostname: string) {
    const domainName = hostname.replace(/(?:[^.\n]*\.)?([^.\n]*)(\..*)/, '$1');

    switch (domainName) {
      case 'animixplay':
        return new AniMixPlay(hostname, pathname, document);
      case 'aniwatch':
        return new Aniwatch(hostname, pathname, document);
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

export default PageFactory;
