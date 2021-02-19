import Aniwatch from '../pages/aniwatch/page';
import Crunchyroll from '../pages/crunchyroll/page';
import Gogoanime from '../pages/gogoanime/page';
import Nineanime from '../pages/nineanime/page';
import Twistmoe from '../pages/twistmoe/page';
import Page from '../types/pages/page_type';

/**
 * Obtains the page object from the domain
 * @param pathname Provider's url path
 * @param hostname Provider's host
 */
const getPage = (pathname: string, hostname: string) => {
  const domainName = hostname.replace(/(?:[^.\n]*\.)?([^.\n]*)(\..*)/, '$1');
  let page: Page;

  switch (domainName) {
    case 'aniwatch':
      page = new Aniwatch(hostname, pathname, document);
      break;
    case 'gogoanime':
      page = new Gogoanime(hostname, pathname, document);
      break;
    case '9anime':
      page = new Nineanime(hostname, pathname, document);
      break;
    case 'crunchyroll':
      page = new Crunchyroll(hostname, pathname, document);
      break;
    case 'twist':
      page = new Twistmoe(hostname, pathname, document);
      break;
    default:
      throw new Error(`Page ${hostname} not supported`);
  }
  return page;
};

export default getPage;
