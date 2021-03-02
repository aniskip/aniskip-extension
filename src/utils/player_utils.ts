import Player from '../types/players/player_type';
import Plyr from '../players/plyr/player';
import Crunchyroll from '../players/crunchyroll/player';
import Videojs from '../players/videojs/player';
import Doodstream from '../players/doodstream/player';
import Jw from '../players/jw/player';
import Twistmoe from '../players/twistmoe/player';

/**
 * Obtains the player object from the domain
 * @param hostname Player's host
 * @param videoElement Player's video element
 */
const getPlayer = (hostname: string, videoElement: HTMLVideoElement) => {
  const domainName = hostname.replace(/(?:[^.\n]*\.)?([^.\n]*)(\..*)/, '$1');
  let player: Player;

  switch (domainName) {
    case 'animixplay':
    case 'aniwatch':
    case 'streamtape':
      player = new Plyr(document, videoElement);
      break;
    case 'crunchyroll':
      player = new Crunchyroll(document, videoElement);
      break;
    case 'cloud9':
    case 'fcdn':
    case 'gogo-play':
    case 'mcloud2':
    case 'streamsb':
    case 'vidstream':
      player = new Jw(document, videoElement);
      break;
    case 'dood':
      player = new Doodstream(document, videoElement);
      break;
    case 'mp4upload':
      player = new Videojs(document, videoElement);
      break;
    case 'twist':
      player = new Twistmoe(document, videoElement);
      break;
    default:
      throw new Error(`Player ${hostname} not supported`);
  }

  return player;
};

export default getPlayer;
