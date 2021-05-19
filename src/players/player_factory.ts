import { getDomainName } from '../utils/string_utils';
import Plyr from './plyr';
import Crunchyroll from './crunchyroll';
import Videojs from './videojs';
import Doodstream from './doodstream';
import Jw from './jw';
import Twistmoe from './twistmoe';

class PlayerFactory {
  /**
   * Obtains the player object from the domain
   * @param hostname Player's host
   */
  static getPlayer(hostname: string) {
    const domainName = getDomainName(hostname);
    switch (domainName) {
      case 'animixplay':
      case 'aniwatch':
      case 'streamtape':
      case 'github':
        return new Plyr(document);
      case 'crunchyroll':
        return new Crunchyroll(document);
      case 'cloud9':
      case 'fcdn':
      case 'gogo-play':
      case 'mcloud':
      case 'mcloud2':
      case 'streamsb':
      case 'vidstream':
      case 'streamhd':
      case 'sbembed':
      case 'kimanime':
        return new Jw(document);
      case 'dood':
        return new Doodstream(document);
      case 'mixdrop':
      case 'mp4upload':
      case 'mp4':
      case '4anime':
        return new Videojs(document);
      case 'twist':
        return new Twistmoe(document);
      default:
        throw new Error(`Player ${hostname} not supported`);
    }
  }
}

export default PlayerFactory;
