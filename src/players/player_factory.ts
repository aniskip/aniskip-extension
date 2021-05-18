import Plyr from './plyr/player';
import Crunchyroll from './crunchyroll/player';
import Videojs from './videojs/player';
import Doodstream from './doodstream/player';
import Jw from './jw/player';
import Twistmoe from './twistmoe/player';

class PlayerFactory {
  /**
   * Obtains the player object from the domain
   * @param hostname Player's host
   */
  static getPlayer(hostname: string) {
    const domainName = hostname.replace(/(?:[^.\n]*\.)?([^.\n]*)(\..*)/, '$1');
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
        return new Videojs(document);
      case 'twist':
        return new Twistmoe(document);
      default:
        throw new Error(`Player ${hostname} not supported`);
    }
  }
}

export default PlayerFactory;
