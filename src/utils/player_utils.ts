import { Player } from '../types/players/player_types';
import Plyr from '../players/plyr/player';
import Crunchyroll from '../players/crunchyroll/player';
import Videojs from '../players/videojs/player';
import Doodstream from '../players/doodstream/player';
import Jw from '../players/jw/player';
import Twistmoe from '../players/twistmoe/player';

/**
 * Obtains the player object from the domain
 * @param hostname Player's host
 */
const getPlayer = (hostname: string) => {
  const domainName = hostname.replace(/(?:[^.\n]*\.)?([^.\n]*)(\..*)/, '$1');
  let player: Player;

  switch (domainName) {
    case 'animixplay':
    case 'aniwatch':
    case 'streamtape':
    case 'github':
      player = new Plyr(document);
      break;
    case 'crunchyroll':
      player = new Crunchyroll(document);
      break;
    case 'cloud9':
    case 'fcdn':
    case 'gogo-play':
    case 'mcloud':
    case 'mcloud2':
    case 'streamsb':
    case 'vidstream':
    case 'streamhd':
    case 'sbembed':
      player = new Jw(document);
      break;
    case 'dood':
      player = new Doodstream(document);
      break;
    case 'mixdrop':
    case 'mp4upload':
      player = new Videojs(document);
      break;
    case 'twist':
      player = new Twistmoe(document);
      break;
    default:
      throw new Error(`Player ${hostname} not supported`);
  }

  return player;
};

export default getPlayer;
