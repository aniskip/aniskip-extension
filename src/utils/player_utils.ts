import Aniwatch from '../players/aniwatch/player';
// import Crunchyroll from '../players/crunchyroll/player';
import Player from '../types/players/player_type';

/**
 * Obtains the settings container of the player
 * @param hostname Player's host
 */
const getPlayer = (hostname: string) => {
  const domainName = hostname.replace(/(?:[^.\n]*\.)?([^.\n]*)(\..*)/, '$1');
  let player: Player;

  switch (domainName) {
    case 'aniwatch':
      player = new Aniwatch(document);
      break;
    // case 'crunchyroll':
    //   player = new Crunchyroll(document);
    //   break;
    default:
      throw new Error(`Player ${hostname} not supported`);
  }

  return player;
};

export default getPlayer;
