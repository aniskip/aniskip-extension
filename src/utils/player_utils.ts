import Aniwatch from '../players/aniwatch/player';
import Crunchyroll from '../players/crunchyroll/player';
import Jw from '../players/jw/player';
import Player from '../types/players/player_type';

/**
 * Obtains the settings container of the player
 * @param hostname Player's host
 * @param videoElement Player's video element
 */
const getPlayer = (hostname: string, videoElement: HTMLVideoElement) => {
  const domainName = hostname.replace(/(?:[^.\n]*\.)?([^.\n]*)(\..*)/, '$1');
  let player: Player;

  switch (domainName) {
    case 'aniwatch':
      player = new Aniwatch(document, videoElement);
      break;
    case 'crunchyroll':
      player = new Crunchyroll(document, videoElement);
      break;
    case 'gogo-play':
    case 'cloud9':
    case 'fcdn':
    case 'streamsb':
      player = new Jw(document, videoElement);
      break;
    default:
      throw new Error(`Player ${hostname} not supported`);
  }

  return player;
};

export default getPlayer;
