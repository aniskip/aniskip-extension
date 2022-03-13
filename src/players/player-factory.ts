import globToRegExp from 'glob-to-regexp';
import { Videojs } from './videojs';
import { Jw } from './jw';
import { Plyr } from './plyr';
import { Twistmoe } from './twistmoe';
import { Crunchyroll } from './crunchyroll';
import { Flowplayer } from './flowplayer';
import { Player } from './base-player.types';

export class PlayerFactory {
  static players = [Crunchyroll, Jw, Plyr, Twistmoe, Videojs, Flowplayer];

  /**
   * Obtains the player object from the domain.
   *
   * @param url Player's url.
   */
  static getPlayer(url: string): Player {
    for (let i = 0; i < PlayerFactory.players.length; i += 1) {
      const CurrentPlayer = PlayerFactory.players[i];

      const metadata = CurrentPlayer.getMetadata();
      const { playerUrls } = metadata;

      for (let j = 0; j < playerUrls.length; j += 1) {
        const matcher = globToRegExp(playerUrls[j]);

        if (matcher.test(url)) {
          return new CurrentPlayer();
        }
      }
    }

    throw new Error(`Player ${url} not supported`);
  }
}
