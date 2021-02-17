import Aniwatch from '../pages/aniwatch/page';
import Crunchyroll from '../pages/crunchyroll/page';
import Gogoanime from '../pages/gogoanime/page';
import Nineanime from '../pages/nineanime/page';
import Twistmoe from '../pages/twistmoe/page';
import Page from '../types/pages/page_type';

/**
 * Get provider name, provider anime id and anime episode number from current url
 * @param pathname Provider's url path
 * @param hostname Provider's host
 * @returns A tuple of (providerName, identifier and episodeNumber)
 */
const getProviderInformation = (pathname: string, hostname: string) => {
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
  const providerName = page.getProviderName();
  const identifier = page.getIdentifier();
  const episodeNumber = page.getEpisodeNumber();
  const result = {
    providerName,
    identifier,
    episodeNumber,
  };
  return result;
};

export default getProviderInformation;
